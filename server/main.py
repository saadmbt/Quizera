from flask import Flask, request, jsonify
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity, decode_token, get_jwt
)
from bson.objectid import ObjectId
import datetime as dt
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os
from functionsDB import (
    insert_Lessons, Fetch_Lesson, 
    fetch_all_lessons_by_user, Fetch_Quizzes,
    Insert_Quiz_Results, Fetch_Quiz_Results, lastID,
    insert_group, add_student_to_group, get_group_by_code,
    get_professor_groups, get_student_groups, Fetch_Groups, get_group_by_id, get_professor_by_id,Update_Quiz_Results,
    Fetch_Flashcard_by_id,Fetch_Flashcards_by_user,Fetch_Quiz_Results_by_user,update_group_info,get_group_by_id,
    insert_quiz_assignment,get_quiz_assignment_group_ids_for_student,get_quizzs_Assignments_by_group_id,get_quizzes_by_ids,
    get_students_with_average_scores_for_group,getStudentPerformance, get_quiz_attempts_by_quiz_id, get_professor_quizzes
)
from main_functions import (save_to_azure_storage, create_token, check_request_body, get_file_type)
from file_handling import file_handler
from image_Handling import image_handler
from werkzeug.utils import secure_filename
import firebase_admin
from firebase_admin import credentials, auth
import tempfile
from LLM_functions import generate_and_insert_questions,generate_flashcards,generate_youtube_suggestions,generate_keywords
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app, origins=['http://localhost:5173'], methods=['GET', 'POST', 'PUT', 'DELETE'], headers=['Content-Type', 'Authorization'], supports_credentials=True)

# Load credentials from environment variables
load_dotenv()
# Load the service account key from the environment variable
service_account_key = json.loads(os.environ['SERVICE_ACCOUNT_KEY'])
# # Initialize Firebase Admin
cred = credentials.Certificate(service_account_key) 
firebase_admin.initialize_app(cred)

# JWT Configuration
app.config["JWT_SECRET_KEY"] = os.environ.get('JWT_TOKEN_SECRET')
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=12)
jwt = JWTManager(app)

# Replace with your Dropbox access token
DropBox_Access_Token = os.environ.get('DropBox_access_token')

# User Management Endpoints
@app.route('/api/auth', methods=['POST'])
def login():
    """
    Authenticate a user using the Firebase Auth uid.

    :return: A JSON response with an access token
    """
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    uid = str(data["uid"])

    try:
        user = auth.get_user(uid)
        if user is None:
            return jsonify({"error": "Invalid or unknown UID"}), 401

        access_token = create_token(uid)
        response = jsonify({"access_token": access_token})

        # Set the access token in a cookie
        response.set_cookie(
            'access_token', 
            access_token, 
            # httponly=True,  # Prevent JavaScript access to the cookie
            # secure=True,    # Use secure cookies (only sent over HTTPS)
            # samesite='Lax'  # Helps prevent CSRF attacks
        )
        return response, 201
    except ValueError as e:
        return jsonify({'error': f'Invalid token format: {str(e)}'}), 400
    except auth.InvalidIdTokenError:
        return jsonify({'error': 'Invalid or expired token'}), 401
    except Exception as e:
        return jsonify({'error': f'Authentication failed: {str(e)}'}), 500

@app.route('/api/profile', methods=['GET'])
@jwt_required()
def profile():
    uid = get_jwt_identity()
    try:
        user = auth.get_user(uid)
        # dictionary of user information
        user_info = {
            "uid": user.uid,
            "email": user.email,
            "display_name": user.display_name,
            "createdAt": user.user_metadata.creation_timestamp,
            "lastLoginAt": user.user_metadata.last_sign_in_timestamp,
        }
        response = jsonify({"user": user_info})
        return response, 200
    except auth.UserNotFoundError:
        return jsonify({'error': 'User not found'}), 404

# Validate invitation token
@app.route('/api/validate-invite-token', methods=['POST'])
def validate_invite_token():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        token = data.get('token')
        if not token:
            return jsonify({"error": "Missing token"}), 400

        try:
            decoded = decode_token(token)
            print("Decoded token:", decoded)  # Debug print

            sub = decoded.get('sub', {})
            group_id = sub.get('group_id') if isinstance(sub, dict) else sub

            if not group_id:
                return jsonify({"error": "Invalid token format"}), 400

            group = get_group_by_id(group_id)
            if not group or (isinstance(group, dict) and 'error' in group):
                return jsonify({"error": "Group not found"}), 404

            return jsonify({
                "group_name": group.get("group_name", "Unknown Group"),
                "professor_name": "Unknown Professor",
                "group_id": group_id
            }), 200

        except Exception as e:
            print(f"Token validation error: {str(e)}")
            return jsonify({"error": f"Invalid token: {str(e)}"}), 400

    except Exception as e:
        print(f"General error: {str(e)}")
        return jsonify({"error": "Server error"}), 500

# Join a group
@app.route('/api/groups/join', methods=['POST'])
def join_group():
    try:
        data = request.get_json()
        if not data or 'token' not in data or 'uid' not in data:
            return jsonify({"error": "Missing token or uid"}), 400

        student_uid = data['uid']
        token = data['token']

        try:
            decoded = decode_token(token)
            group_id = decoded.get('sub')
            if not group_id:
                return jsonify({"error": "Invalid invitation token"}), 400

            group = get_group_by_id(group_id)
            if not group:
                return jsonify({"error": "Group not found"}), 404

            result = add_student_to_group(group_id, student_uid)
            if isinstance(result, str) and "error" in result.lower():
                return jsonify({"error": result}), 500
            if not result:
                return jsonify({"error": "Failed to add student to group"}), 400

            return jsonify({"message": "Successfully joined group", "group": group}), 200

        except Exception as e:
            return jsonify({"error": f"Invalid token: {str(e)}"}), 400

    except Exception as e:
        return jsonify({"error": f"Failed to join group: {str(e)}"}), 500

# Insert a quiz assignment (POST /api/quiz-assignments)
@app.route('/api/quiz-assignments', methods=['POST'])
# @jwt_required()
def create_quiz_assignment():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    quiz_id = data.get("quizId")
    group_ids = data.get("groupIds")
    assigned_by = data.get("assignedBy")
    assigned_at = data.get("assignedAt")
    due_date = data.get("dueDate")
    start_time = data.get("startTime")  # Added startTime

    if not quiz_id or not group_ids or not assigned_by or not assigned_at:
        return jsonify({"error": "Missing required fields"}), 400

    # Add start_time to data if present
    if start_time:
        data["startTime"] = start_time

    result = insert_quiz_assignment(data)
    if isinstance(result, dict) and "error" in result:
        return jsonify({"error": result["error"]}), 500

    return jsonify({"message": "Quiz assignment created successfully", "assignment_id": result}), 201


# ## # group mangement  student side # ## #
# get group assignments by group id
@app.route('/api/group-assignments/<group_id>', methods=['GET'])
@jwt_required()
def get_group_assignments(group_id):
    """
    Fetch all quiz assignments for a specific group.
    
    Args:
        group_id (str): The ID of the group to fetch assignments for.
        
    Returns:
        Response: JSON response containing the quiz assignments or an error message.
    """
    try:
        group_obj_id = ObjectId(group_id)
    except Exception as e:
        return jsonify({"error": "Invalid group_id"}), 400

    try:
        student_id= get_jwt_identity()

        # Fetch all quiz assignments for the specified group
        list_quizzes_ids = get_quizzs_Assignments_by_group_id(group_obj_id)

        if isinstance(list_quizzes_ids, str) and "error" in list_quizzes_ids.lower():
            return jsonify({"error": list_quizzes_ids}), 500
        if not list_quizzes_ids:
            return jsonify({"error": "No quiz assignments found for this group"}), 404
        
        # Fetch quizzes by IDs
        quizzes = get_quizzes_by_ids(list_quizzes_ids,student_id)
        if isinstance(quizzes, str) and "error" in quizzes.lower():
            return jsonify({"error": quizzes}), 500
        if not quizzes:
            return jsonify({"error": "No quizzes found for the provided IDs"}), 404
        
        return jsonify(quizzes), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 404

# create a quiz attempt for student in group
@app.route('/api/student-quiz-attempt', methods=['POST'])
@jwt_required()
def create_group_quiz_attempt():
    """
    Create a quiz attempt for a student in a group.
    Returns:
        Response: JSON response containing the quiz attempt ID or an error message.
    """
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    student_id = get_jwt_identity()
    # check if student_id is valide (firestone uid)
    # Check if the student ID exists in Firestore
    try:
        auth.get_user(student_id)
    except auth.UserNotFoundError:
        return jsonify({"error": "Invalid or unknown UID"}), 401
    
    quiz_result=data['attempt']
    quiz_result["studentId"]=student_id
    quiz_result["quizId"]=ObjectId(quiz_result["quizId"])

    # Insert the quiz result into the database
    quiz_result_id = Insert_Quiz_Results(quiz_result,"QuizAttempts")
    if "error" in str(quiz_result_id).lower():
        return jsonify({"error": str(quiz_result_id)}), 500

    return jsonify({"quiz_attempt_id": str(quiz_result_id)}), 201

# Get student performance across all quizzes
@app.route('/api/student-performance', methods=['GET'])
@jwt_required()
def get_student_performance():
    """
    Fetch the performance of a student across all quizzes.
    
    Returns:
        Response: JSON response containing the student's performance data or an error message.
    """
    student_id = get_jwt_identity()
    # check if student_id is valide (firestone uid)
    # Check if the student ID exists in Firestore
    try:
        auth.get_user(student_id)
    except auth.UserNotFoundError:
        return jsonify({"error": "Invalid or unknown UID"}), 401
    
    performance_data = getStudentPerformance(str(student_id))
    if isinstance(performance_data, str) and "error" in performance_data.lower():
        return jsonify({"error": performance_data}), 500
    if not performance_data:
        return jsonify({"error": "No performance data found for this student"}), 404

    return jsonify(performance_data), 200

@app.route('/api/quiz-attempts', methods=['GET'])
@jwt_required()
def get_quiz_attempts_route():
    # check if the jwt is valid
    user_id = get_jwt_identity()
    try:
        auth.get_user(user_id)
    except auth.UserNotFoundError:
        return jsonify({"error": "Invalid or unknown UID"}), 401

    quiz_id = request.args.get('quiz_id', None)
    attempts = get_quiz_attempts_by_quiz_id(quiz_id)
   

    if isinstance(attempts, dict) and "error" in attempts:
        return jsonify(attempts), 500

    return jsonify(attempts), 200
@app.route('/api/quizzes/professor', methods=['GET'])
@jwt_required()
def fetch_Prof_quizzes ():
    # check if the jwt is valid
    professor_id = get_jwt_identity()
    try:
        auth.get_user(professor_id)
    except auth.UserNotFoundError:
        return jsonify({"error": "Invalid or unknown UID"}), 401
    
    quizzes = get_professor_quizzes(professor_id)
    if isinstance(quizzes, dict) and "error" in quizzes:
        return jsonify(quizzes), 500
        
    return jsonify(quizzes), 200

@app.route('/api/refresh_token', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user = "get_jwt_identity()"
    new_access_token = create_access_token(identity=current_user)
    return jsonify({"access_token":new_access_token}), 200


@app.after_request
def refresh_expiring_jwts(response):
    """Refresh the JWT token if it's close to expiring."""
    try:
        from flask_jwt_extended import verify_jwt_in_request
        try:
            verify_jwt_in_request(optional=True)
        except:
            return response

        # Refresh if expiring in 20 minutes or less
        REFRESH_THRESHOLD_MINUTES = 20  
        exp_timestamp = get_jwt()["exp"]
        now = dt.datetime.now(dt.timezone.utc)
        target_timestamp = (now + timedelta(minutes=REFRESH_THRESHOLD_MINUTES)).timestamp()

        if target_timestamp > exp_timestamp:
            # Create a new access token with the current user's identity
            new_access_token = create_access_token(identity=get_jwt_identity())

            # Update the response data with the new access token
            data = response.get_json()
            if isinstance(data, dict):
                data["access_token"] = new_access_token
                response.set_data(json.dumps(data))
                response.content_type = "application/json"

            # Set the access token in a cookie
            response.set_cookie(
                'access_token',
                new_access_token,
                # Set the cookie to expire when the token expires
                expires=dt.datetime.fromtimestamp(exp_timestamp, dt.timezone.utc)
            )
    except Exception as e:
        # Log any exceptions that occur during token refresh
        print(f"Error refreshing token: {e}")
    return response

@app.route('/api/')
def hello_world():
    print("hi")
    return "Hello, World!"

if __name__ == "__main__":
    app.run()
