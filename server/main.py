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
    get_students_with_average_scores_for_group,getStudentPerformance, get_quiz_attempts_by_quiz_id, get_professor_quizzes,delete_group,check_quiz_assignment_completion
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
CORS(app, origins=['http://localhost:5173', 'https://prepgenius.com'], methods=['GET', 'POST', 'PUT', 'DELETE'], headers=['Content-Type', 'Authorization'], supports_credentials=True)

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

# Lesson Management Endpoints
@app.route('/api/upload', methods=['POST'])
@jwt_required()
def handle_theuploaded():
    """
    Handle the uploaded lesson content.
    Returns:
        Response: JSON response containing the lesson ID or an error message.
    """
    # check if the jwt is valide 
    user_id = get_jwt_identity()
    # Check if the user ID exists in Firestore
    try:
        auth.get_user(user_id)
    except auth.UserNotFoundError:
        return jsonify({"error": "Invalid or unknown UID"}), 401
    
    # Check if the request body is text, file, or image
    request_type = check_request_body()
    
    if request_type is None:
        return jsonify({"error": "Request type could not be determined."}), 400

    # Limit file size to 10MB
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
    New_id = lastID("lessons")

    if request_type == "text":
        lesson_obj = {
            "title": request.form["title"],
            "id": New_id,
            "author": get_jwt_identity(),
            "username": request.form["username"],
            "content": request.form['text'],
            "uploadedAt": datetime.now(dt.timezone.utc).isoformat(),
        }
        lesson_objid = insert_Lessons(lesson_obj)
        response = jsonify({'message': 'Lesson uploaded successfully', "lesson_id": str(lesson_objid)})
        return response, 201
    
    elif request_type=="file":
        try:
            file = request.files['file']
            filename = secure_filename(file.filename)
            
            # Check file size
            if file.content_length > MAX_FILE_SIZE:
                return jsonify({"error": "File size exceeds the 10MB limit."}), 400

            # Process file content
            file_content = file.read()
            file_extracted_text = file_handler(file_content, filename)
            
            # Reset file pointer and upload
            file.seek(0)
            
            lesson_obj = {
                "title": request.form["title"],
                "id": New_id,
                "author": get_jwt_identity(),
                "username": request.form["username"],
                "content": file_extracted_text,
                "uploadedAt":  datetime.now(dt.timezone.utc).isoformat(),
            }
            
            lesson_objid = insert_Lessons(lesson_obj)
            return jsonify({
                "lesson_id": str(lesson_objid)
            }), 201
        except Exception as e:
            return jsonify({"error": f"File upload failed: {str(e)}"}), 400
        
    # case if the file is image
    elif request_type=="img":
        # Get the image from the request

        image=request.files['file']
        # Secure the filename
        try:
            filename = secure_filename(image.filename)
            with tempfile.NamedTemporaryFile(delete=False) as temp_file:
                image.save(temp_file.name)

                # Read image data from the temporary file **after saving**
                with open(temp_file.name, 'rb') as f:
                    image_data = f.read()
                    print(f"Image data read: {len(image_data)} bytes")  # For debugging

                # Process the image
                extracted_text = image_handler(image_data, filename)
            # Get the data from the request body
            lesson_obj={
                "title":request.form["title"],
                "id":New_id,
                "author":get_jwt_identity(),
                "username": request.form["username"],
                "content" :extracted_text,
                "uploadedAt":  datetime.now(dt.timezone.utc).isoformat(),
            }
            # Save the dictionary Lesson to the database
            lesson_objid = insert_Lessons(lesson_obj)
            response =jsonify({'message': 'Lesson uploaded successfully',"lesson_id":str(lesson_objid)})
            return response, 201 
        except Exception as e:
            return jsonify({"error image": str(e)}), 400
        # finally:
        # # Clean up the temporary file
        # if os.path.exists(temp_file_name):
        #     remove(temp)
    else:
        return jsonify({"error": "Invalid request type"}), 400
    
@app.route('/api/lessons', methods=['GET'])
@jwt_required()
def fetch_lessons():
    """
    Fetch all lessons for the authenticated user.
    Returns:
        Response: JSON response containing the lessons or an error message.
    """
    # check if the jwt is valide 
    user_id = get_jwt_identity()
    # Check if the user ID exists in Firestore
    try:
        auth.get_user(user_id)
    except auth.UserNotFoundError:
        return jsonify({"error": "Invalid or unknown UID"}), 401
    
    # Fetch all lessons for the authenticated user.
    lessons = fetch_all_lessons_by_user(user_id)
    print("lenght of the array",len(lessons))
    if lessons is None or len(lessons) == 0:
        return jsonify({"error": "No lessons found"}), 404
    if isinstance(lessons, str) and "error" in lessons.lower():
        return jsonify({"error": lessons}), 500

    return jsonify(lessons), 200

@app.route('/api/lessons/<lesson_id>', methods=['GET'])
@jwt_required()
def fetch_lesson(lesson_id):
    """
    Fetch a specific lesson by its ID.
    
    Args:
        lesson_id (str): The ID of the lesson to fetch.
        
    Returns:
        Response: JSON response containing the lesson or an error message.
    """
        # check if the jwt is valide 
    user_id = get_jwt_identity()
    # Check if the user ID exists in Firestore
    try:
        auth.get_user(user_id)
    except auth.UserNotFoundError:
        return jsonify({"error": "Invalid or unknown UID"}), 401
    
    try:
        lesson_obj_id = ObjectId(lesson_id)
    except Exception as e:
        return jsonify({"error": "Invalid lesson_id"}), 400

    try:
        lesson = Fetch_Lesson(lesson_obj_id)
        return jsonify(lesson), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 404

# Quiz Management Endpoints
@app.route('/api/create_quiz', methods=['POST'])
@jwt_required()
def create_quiz():
    #par: lessonid, type of question, number of question, dif of question
        # check if the jwt is valide 
    user_id = get_jwt_identity()
    # Check if the user ID exists in Firestore
    try:
        auth.get_user(user_id)
    except auth.UserNotFoundError:
        return jsonify({"error": "Invalid or unknown UID"}), 401
    
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    lesson_id = data["lesson_id"]
    question_type = data["type"]
    num_questions = data["number"]
    difficulty = data["difficulty"]
    if not lesson_id or not question_type or not num_questions or not difficulty:
        return jsonify({"error": "Missing required parameters"}), 400
    # function to create the quiz and insert it to the database and return the quiz id
    quiz_result=generate_and_insert_questions(lesson_id,question_type,num_questions,difficulty)
    if "error" in str(quiz_result).lower():
        return jsonify({"error": quiz_result}), 400

    return jsonify({"quiz": quiz_result}), 201
#just for show the quiz if needed 
@app.route('/api/quizzes/<quiz_id>', methods=['GET'])
@jwt_required()
def fetch_quiz(quiz_id):
    # check if the jwt is valide 
    user_id = get_jwt_identity()
    # Check if the user ID exists in Firestore
    try:
        auth.get_user(user_id)
    except auth.UserNotFoundError:
        return jsonify({"error": "Invalid or unknown UID"}), 401
    
    quiz = Fetch_Quizzes(ObjectId(quiz_id))
    if quiz is None:
        return jsonify({"error": "Quiz not found"}), 404
    if isinstance(quiz, str) and "error" in quiz.lower():
        return jsonify({"error": str(quiz)}), 404

    return jsonify(quiz), 200

# flashcards and youtube suggestions endpoints
@app.route('/api/flashcards/<lesson_id>/<quiz_ress_id>', methods=['GET'])
@jwt_required()
def generatee_flashcards(lesson_id, quiz_ress_id):
    # check if the jwt is valide 
    user_id = get_jwt_identity()
    # Check if the user ID exists in Firestore
    try:
        auth.get_user(user_id)
    except auth.UserNotFoundError:
        return jsonify({"error": "Invalid or unknown UID"}), 401
    try:
        
        lesson_obj_id = ObjectId(lesson_id)
        quiz_res_id = ObjectId(quiz_ress_id)
        print(lesson_obj_id,quiz_res_id)
        flashcards =generate_flashcards(lesson_obj_id)
        if flashcards is None:
            return jsonify({"error": "Error generating flashcards"}), 400
        # Insert the flashcard into the database
        inserted_flashcard_id = Update_Quiz_Results(quiz_res_id,flashcards,"flashcards")
        if isinstance(inserted_flashcard_id, ObjectId):
            return jsonify({"flashcards":flashcards})
        else:
            raise ValueError("Error inserting flashcards.")
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
# fetch  All geneareted Flashcards by user
@app.route('/api/flashcards/Fetch_All/<user_id>', methods=['GET'])
@jwt_required()
def fetch_all_flashcards(user_id):
    """ Fetch all flashcards for a given user ID."""
    # check if the jwt is valide 
    user = get_jwt_identity()
    # Check if the user ID exists in Firestore
    try:
        auth.get_user(user)
    except auth.UserNotFoundError:
        return jsonify({"error": "Invalid or unknown UID"}), 401
    try:
        user_id = str(user_id)
        flashcards = Fetch_Flashcards_by_user(user_id)
        
        if isinstance(flashcards, str) and "error" in flashcards.lower():
            return jsonify({"error": str(flashcards)}), 500
        
        if flashcards is None or len(flashcards) == 0:
            return jsonify({"error": "No flashcards found"}), 404
        return jsonify(flashcards), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
# get flashcards  by quiz Result id
@app.route('/api/flashcards/get/<quiz_result_id>', methods=['GET'])
@jwt_required()
def fetch_flashcard(quiz_result_id):
    """Fetches the flashcard for a given quiz result ID.
    This endpoint requires a valid JWT token to access.
    Args:
        quiz_result_id (objectId): The ID of the quiz result to fetch.
    Returns:
        Response: A JSON response containing the flashcard if found, 
                    or an error message if the flashcard is not found or an error occurs.
                    The response status code is 200 for success and 404 for errors.
    """
    # check if the jwt is valide 
    user_id = get_jwt_identity()
    # Check if the user ID exists in Firestore
    try:
        auth.get_user(user_id)
    except auth.UserNotFoundError:
        return jsonify({"error": "Invalid or unknown UID"}), 401
    
    try:
        quiz_result_id = ObjectId(quiz_result_id)
        flashcard = Fetch_Flashcard_by_id(quiz_result_id)
        if flashcard is None:
            return jsonify({"error": "Flashcard not found"}), 404
        if isinstance(flashcard, str) and "error" in flashcard.lower():
            return jsonify({"error": str(flashcard)}), 404

        return jsonify(flashcard), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
# Generate YouTube suggestions
@app.route('/api/youtube/<lesson_id>/<quiz_ress_id>', methods=['GET'])
@jwt_required()
def generate_yt_suggestions(lesson_id, quiz_ress_id):
    """ Generate YouTube suggestions for a given lesson ID and quiz result ID. """
    # check if the jwt is valide 
    user_id = get_jwt_identity()
    # Check if the user ID exists in Firestore
    try:
        auth.get_user(user_id)
    except auth.UserNotFoundError:
        return jsonify({"error": "Invalid or unknown UID"}), 401
    
    try:
        lesson_obj_id = ObjectId(lesson_id)
        quiz_res_id = ObjectId(quiz_ress_id)

        # Generate keywords using the lesson ID
        keywords = generate_keywords(lesson_obj_id)
        if keywords is None or isinstance(keywords, str):
            return jsonify({"error": f"Error generating keywords: {keywords}"}), 400
        
        # Generate YouTube suggestions
        youtube_suggestions = generate_youtube_suggestions(keywords)
        if youtube_suggestions is None or not isinstance(youtube_suggestions, (list, dict)):
            return jsonify({"error": f"Error generating YouTube suggestions: {youtube_suggestions}"}), 400
                
        # Insert the YouTube suggestions into the database 
        inserted_youtube_suggestions_id = Update_Quiz_Results(quiz_res_id,youtube_suggestions,"youtube")
        if isinstance(inserted_youtube_suggestions_id, ObjectId):
            return jsonify({"youtube_suggestions":youtube_suggestions})
        else:
            raise ValueError("Error inserting YouTube suggestions.")
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
# Quiz Results Management Endpoints
@app.route('/api/quiz_results/<user_id>', methods=['GET'])
@jwt_required()
def fetch_quiz_results(user_id):
    """Fetches the quiz results for a given quiz ID.
    This endpoint requires a valid JWT token to access.
    Args:
        user_id (objectId): The ID of the user for which generate the quizzes.
    Returns:
    Response: A JSON response containing the quiz results if found, 
                or an error message if the quiz results are not found or an error occurs.
                The response status code is 200 for success and 404 for errors.
    """
        # check if the jwt is valide 
    user = get_jwt_identity()
    # Check if the user ID exists in Firestore
    try:
        auth.get_user(user)
    except auth.UserNotFoundError:
        return jsonify({"error": "Invalid or unknown UID"}), 401
    try:
        # change this later to ObjectId 
        user_id = str(user_id)
        quiz_results = Fetch_Quiz_Results_by_user(user_id)
        if quiz_results is None:
            return jsonify({"error": "Quiz results not found"}), 404
        if isinstance(quiz_results, str) and "error" in quiz_results.lower():
            return jsonify({"error": str(quiz_results)}), 404

        
        if quiz_results is None or len(quiz_results) == 0:
            return jsonify({"error": "No quiz_results found"}), 404
        
        return jsonify(quiz_results), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
# get quiz results by quiz Result id
@app.route('/api/quiz_results/get/<quiz_result_id>', methods=['GET'])
@jwt_required()
def fetch_quiz_result(quiz_result_id):
    """Fetches the quiz result for a given quiz result ID.
    This endpoint requires a valid JWT token to access.
    Args:
        quiz_result_id (objectId): The ID of the quiz result to fetch.
    Returns:
        Response: A JSON response containing the quiz result if found, 
                    or an error message if the quiz result is not found or an error occurs.
                    The response status code is 200 for success and 404 for errors.
    """
    # check if the jwt is valide 
    user_id = get_jwt_identity()
    # Check if the user ID exists in Firestore
    try:
        auth.get_user(user_id)
    except auth.UserNotFoundError:
        return jsonify({"error": "Invalid or unknown UID"}), 401
    
    try:
        quiz_result_id = ObjectId(quiz_result_id)
        quiz_result = Fetch_Quiz_Results(quiz_result_id)
        if quiz_result is None:
            return jsonify({"error": "Quiz result not found"}), 404
        if isinstance(quiz_result, str) and "error" in quiz_result.lower():
            return jsonify({"error": str(quiz_result)}), 404

        return jsonify(quiz_result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
# Quiz Results Management Endpoints
@app.route('/api/quiz_results/insert', methods=['POST'])
@jwt_required()
def create_quiz_results():
    # check if the jwt is valide 
    user_id = get_jwt_identity()
    # Check if the user ID exists in Firestore
    try:
        auth.get_user(user_id)
    except auth.UserNotFoundError:
        return jsonify({"error": "Invalid or unknown UID"}), 401
    
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    quiz_result = data['result']
    quiz_result["generated_by"]=user_id
    # Insert the quiz result into the database
    quiz_result_id = Insert_Quiz_Results(quiz_result,"quizzResult")
    if "error" in str(quiz_result_id).lower():
        return jsonify({"error": str(quiz_result_id)}), 500
    
    return jsonify({"message": "Quiz result created successfully", "quiz_result_id": str(quiz_result_id)}), 201

#groups management
# Fetch Groups for a Professor (GET /api/groups/<ProfId>)
@app.route('/api/groups/<ProfId>', methods=['GET'])
# @jwt_required()
def get_groups(ProfId):
    groups = Fetch_Groups(ProfId)
    if isinstance(groups, str) and "error" in groups.lower():
        return jsonify({"error": str(groups)}), 500
    if not groups:
        return jsonify({"error": "Groups not found"}), 404
    return jsonify(groups), 200

# 2. Create a New Group (POST /api/groups)
@app.route('/api/groups', methods=['POST'])
def create_group():
    try:
        data = request.get_json()
        if not data or not all(key in data for key in ["group_name", "prof_id"]):
            return jsonify({
                "success": False,
                "error": "Missing required fields"
            }), 400

        result = insert_group(data)
        if result.get("success"):
            return jsonify(result), 201
        else:
            return jsonify(result), 400

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# 7. Update Group Info (PUT /api/groups/<group_id>)
@app.route('/api/groups/<group_id>', methods=['PUT'])
def update_group(group_id):
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400

        # Call function to update group info in DB
        result = update_group_info(group_id, data)

        if result.get("success"):
            return jsonify(result), 200
        else:
            return jsonify(result), 400

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
@app.route('/api/groups/<group_id>/students-scores', methods=['GET'])
# @jwt_required()
def get_students_scores(group_id):
    try:
        # Validate group_id
        if not ObjectId.is_valid(group_id):
            return jsonify({"error": "Invalid group_id format"}), 400

        students_scores = get_students_with_average_scores_for_group(group_id)
        if isinstance(students_scores, dict) and "error" in students_scores:
            return jsonify({"error": students_scores["error"]}), 500
        if not students_scores:
            return jsonify({"error": "No students found for this group"}), 404

        return jsonify(students_scores), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 4. Get a Group by Group ID and Professor ID (GET /api/groups/<group_id>/<prof_id>)
@app.route('/api/groups/<group_id>/<prof_id>', methods=['GET'])
# @jwt_required()
def get_group(group_id, prof_id):
    group = get_group_by_code(group_id, prof_id)
    if isinstance(group, str) and "error" in group.lower():
        return jsonify({"error": str(group)}), 500
    if not group:
        return jsonify({"error": "Group not found"}), 404
    return jsonify(group), 200

# 5. Get All Groups Created by a Professor (GET /api/professor-groups/<prof_id>)
@app.route('/api/professor-groups/<prof_id>', methods=['GET'])
# @jwt_required()
def get_professor_groups_route(prof_id):
    groups = get_professor_groups(prof_id)
    if isinstance(groups, str) and "error" in groups.lower():
        return jsonify({"error": str(groups)}), 500
    if not groups:
        return jsonify({"error": "No groups found for this professor"}), 404
    return jsonify(groups), 200

# 6. Get All Groups a Student Belongs To (GET /api/student-groups/<student_uid>)
@app.route('/api/student-groups/<student_uid>', methods=['GET'])
# @jwt_required()
def get_student_groups_route(student_uid):
    groups = get_student_groups(student_uid)
    if isinstance(groups, str) and "error" in groups.lower():
        return jsonify({"error": str(groups)}), 500
    if not groups:
        return jsonify({"error": "No groups found for this student"}), 404

    # Fetch groups with quiz assignments for the student
    assigned_group_ids = get_quiz_assignment_group_ids_for_student(student_uid)
    if isinstance(assigned_group_ids, dict) and "error" in assigned_group_ids:
        return jsonify({"error": assigned_group_ids["error"]}), 500

    # Sort groups: groups with quiz assignments first
    def group_sort_key(group):
        return 0 if group['_id'] in assigned_group_ids else 1

    sorted_groups = sorted(groups, key=group_sort_key)

    return jsonify(sorted_groups), 200

# 8. Get Group by Group UID (GET /api/groups/get/<group_uid>)
@app.route('/api/groups/get/<group_uid>', methods=['GET'])
# @jwt_required()
def get_group_uid(group_uid):
    group = get_group_by_id(group_uid)
    if isinstance(group, str) and "error" in group.lower():
        return jsonify({"error": str(group)}), 500
    if not group:
        return jsonify({"error": "Group not found"}), 404
    return jsonify(group), 200

# Generate invitation link
@app.route('/api/generate-invite-link', methods=['POST'])
def generate_invite_link():
    try:
        data = request.get_json()
        if not data or 'group_id' not in data:
            return jsonify({"error": "Missing group_id in request"}), 400

        group_id = data['group_id']
        
        # Verify group exists
        group = get_group_by_id(group_id)
        if not group:
            return jsonify({"error": "Group not found"}), 404

        # Create token with string subject
        token = create_access_token(
            identity=str(group_id),  # Changed: pass group_id directly as string
            expires_delta=timedelta(days=7)
        )
        
        print("Generated token for group:", group_id)
        
        return jsonify({
            "invite_link": f"http://localhost:5173/student/join-group/{token}",
            "token": token
        }), 200

    except Exception as e:
        print(f"Error generating invite link: {str(e)}")
        return jsonify({"error": "Failed to generate invitation link"}), 500

# Join a group
@app.route('/api/groups/join', methods=['POST'])
def join_group():
    try:
        data = request.get_json()
        if not data or 'token' not in data:
            return jsonify({"error": "Missing token"}), 400

        student_uid =data['uid']
        token = data['token']
        username = data['username']
        
        try:
            # Decode token and get group_id directly
            decoded = decode_token(token)
            group_id = decoded.get('sub')  # Get the subject directly
            
            if not group_id:
                return jsonify({"error": "Invalid invitation token"}), 400
            
            # Verify group exists
            group = get_group_by_id(group_id)
            if not group:
                return jsonify({"error": "Group not found"}), 404
            
            # Add student to group
            result = add_student_to_group(group_id, student_uid,username)
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

    # Validate required fields
    required_fields = ["quizId", "groupIds", "assignedBy", "assignedAt", "startTime"]
    missing_fields = [field for field in required_fields if not data.get(field)]
    if missing_fields:
        return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400

    # Validate startTime is not null and is a valid date string
    if not data.get("startTime"):
        return jsonify({"error": "startTime cannot be null"}), 400

    try:
        # Parse startTime to verify it's a valid date string
        start_time = datetime.fromisoformat(data["startTime"].replace('Z', '+00:00'))
        data["startTime"] = start_time.isoformat()
    except ValueError as e:
        return jsonify({"error": f"Invalid startTime format: {str(e)}"}), 400

    result = insert_quiz_assignment(data)
    if isinstance(result, dict) and "error" in result:
        return jsonify({"error": result["error"]}), 500

    return jsonify({"message": "Quiz assignment created successfully", "assignment_id": result}), 201

# Validate invitation token
@app.route('/api/validate-invite-token', methods=['POST'])
@jwt_required()
def validate_invite_token():
    # check if the jwt is valid 
    user_id = get_jwt_identity()
    # Check if the user ID exists in Firestore
    try:
        user = auth.get_user(user_id)
    except auth.UserNotFoundError:
        return jsonify({"error": "Invalid or unknown UID"}), 401
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        token = data.get('token')
        # Temporarily skip uid validation
        
        if not token:
            return jsonify({"error": "Missing token"}), 400

        try:
            # Decode token and handle nested structure
            decoded = decode_token(token)
            print("Decoded token:", decoded)  # Debug print
            
            # Handle nested sub structure
            sub = decoded.get('sub', {})
            group_id = sub.get('group_id') if isinstance(sub, dict) else sub
            
            if not group_id:
                return jsonify({"error": "Invalid token format"}), 400

            print(f"Extracted group_id: {group_id}")  # Debug print

            # Get group info
            group = get_group_by_id(group_id)
            if not group or (isinstance(group, dict) and 'error' in group):
                return jsonify({"error": "Group not found"}), 404

            # Fetch professor user from Firebase using prof_id from group
            prof_id = group.get("prof_id")
            professor_name = "Unknown Professor"
            if prof_id:
                try:
                    prof_user = auth.get_user(prof_id)
                    # Use display_name or email as professor name, or username if exists
                    if prof_user:
                        if hasattr(prof_user, 'username') and prof_user.username:
                            professor_name = prof_user.username
                        elif hasattr(prof_user, 'display_name') and prof_user.display_name:
                            professor_name = prof_user.display_name
                        elif hasattr(prof_user, 'email') and prof_user.email:
                            professor_name = prof_user.email
                except Exception as e:
                    print(f"Error fetching professor user from Firebase: {str(e)}")

            return jsonify({
                "group_name": group.get("group_name", "Unknown Group"),
                "professor_name": professor_name,
                "group_id": group_id
            }), 200

        except Exception as e:
            print(f"Token validation error: {str(e)}")
            return jsonify({"error": f"Invalid token: {str(e)}"}), 400

    except Exception as e:
        print(f"General error: {str(e)}")
        return jsonify({"error": "Server error"}), 500
    
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
        print(f"Invalid group_id: {group_id} - {str(e)}")
        return jsonify({"error": "Invalid group_id"}), 400

    try:
        student_id= get_jwt_identity()

        # Check if group exists
        group = get_group_by_id(group_id)
        if not group or (isinstance(group, dict) and "error" in group):
            print(f"Group not found for group_id: {group_id}")
            return jsonify({"error": "Group not found"}), 404

        # Fetch all quiz assignments for the specified group
        list_quizzes_ids = get_quizzs_Assignments_by_group_id(group_obj_id)

        if isinstance(list_quizzes_ids, str) and "error" in list_quizzes_ids.lower():
            print(f"Error fetching quiz assignments for group_id {group_id}: {list_quizzes_ids}")
            # Return 404 instead of 500 for no quizzes found
            if "no quizzes found" in list_quizzes_ids.lower():
                return jsonify({"error": list_quizzes_ids}), 404
            return jsonify({"error": list_quizzes_ids}), 500
        if not list_quizzes_ids:
            return jsonify({"error": "No quiz assignments found for this group"}), 404
        
        # Fetch quizzes by IDs
        quizzes = get_quizzes_by_ids(list_quizzes_ids,student_id)
        if isinstance(quizzes, dict) and "error" in quizzes.get("error", "").lower():
            print(f"Error fetching quizzes by IDs for group_id {group_id}: {quizzes}")
            # Return 404 instead of 500 for no quizzes found
            if "no quizzes found" in quizzes.get("error", "").lower():
                return jsonify({"error": quizzes["error"]}), 404
            return jsonify({"error": quizzes["error"]}), 500
        if not quizzes:
            return jsonify({"error": "No quizzes found for the provided IDs"}), 404
        
        return jsonify(quizzes), 200
    except Exception as e:
        print(f"Exception in get_group_assignments for group_id {group_id}: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

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

# get quiz info for join quiz by invitaion link 
@app.route('/api/quiz_info/<quiz_id>', methods=['GET'])
def fetch_quiz_info(quiz_id):
    quiz = Fetch_Quizzes(ObjectId(quiz_id))
    if quiz is None:
        return jsonify({"error": "Quiz not found"}), 404
    if isinstance(quiz, str) and "error" in quiz.lower():
        return jsonify({"error": str(quiz)}), 404
    return jsonify(quiz), 200


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

@app.route('/api/quizzes/<quiz_id>/questions', methods=['PUT'])
@jwt_required()
def update_quiz_questions_route(quiz_id):
    user_id = get_jwt_identity()
    try:
        auth.get_user(user_id)
    except auth.UserNotFoundError:
        return jsonify({"error": "Invalid or unknown UID"}), 401

    data = request.json
    if not data or "questions" not in data:
        return jsonify({"error": "No questions provided"}), 400

    questions = data["questions"]

    from functionsDB import update_quiz_questions
    result = update_quiz_questions(quiz_id, questions)

    if result.get("success"):
        return jsonify({"message": result.get("message")}), 200
    else:
        return jsonify({"error": result.get("error", "Failed to update questions")}), 400

# Delete group endpoint (DELETE /api/groups/<group_id>)
@app.route('/api/groups/<group_id>', methods=['DELETE'])
def delete_group_route(group_id):
    try:
        result = delete_group(group_id)
        if result.get("success"):
            return jsonify({"success": True, "message": "Group deleted successfully"}), 200
        else:
            return jsonify({"success": False, "error": result.get("error", "Failed to delete group")}), 400
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
# notification route
@app.route('/api/notification', methods=['GET'])
@jwt_required()
def fetch_notification():
    """
    Fetch notifications for the authenticated user.
    Returns:
        Response: JSON response containing the notifications or an error message.
    """
    student_id = get_jwt_identity()
    try:
        auth.get_user(student_id)
    except auth.UserNotFoundError:
        return jsonify({"error": "Invalid or unknown UID"}), 401
    
    notifications = check_quiz_assignment_completion(student_id)
    return jsonify(notifications), 200


if __name__ == "__main__":
    app.run()
