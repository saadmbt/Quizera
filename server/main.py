from flask import Flask, request, jsonify
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity,get_jwt
)
from bson.objectid import ObjectId
from datetime import datetime, timedelta,timezone
from dotenv import load_dotenv
import os
from functionsDB import (
    insert_Lessons, Fetch_Lesson, 
    fetch_all_lessons_by_user,Fetch_Quizzes,
    Insert_Quiz_Results, Fetch_Quiz_Results, lastID
)
from main_functions import (save_to_azure_storage,create_token,check_request_body,get_file_type)
from file_handling import file_handler
from image_Handling import image_handler
from werkzeug.utils import secure_filename
import firebase_admin
from firebase_admin import credentials, auth
import tempfile
from LLM_functions import generate_and_insert_questions 
from flask_cors import CORS
import json
app = Flask(__name__)
CORS(app)
# Load credentials from environment variables
load_dotenv()
# Load the service account key from the environment variable
service_account_key = json.loads(os.environ['SERVICE_ACCOUNT_KEY'])
# Initialize Firebase Admin
cred = credentials.Certificate(service_account_key) 
firebase_admin.initialize_app(cred)
# JWT Configuration
app.config["JWT_SECRET_KEY"] = os.environ.get('JWT_TOKEN_SECRET')
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=3)
jwt = JWTManager(app)

# Replace with your Dropbox access token
DropBox_Access_Token = os.environ.get('DropBox_access_token')

      
# User Management Endpoints

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    if not data or not all(k in data for k in ("username","password","email")):
        response=jsonify({"error": "Invalid input"})
        return response, 400
    # Create user in Firebase
    try:
        user = auth.create_user(
            email=data["email"],
            password=data["password"],
            display_name=data["username"]
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    access_token=create_token(user.uid)
    response=jsonify({"message": "User created successfully",'firebase_uid':user.uid, "access_token": access_token})
    # Set the access token in a cookie
    response.set_cookie(
        'access_token', 
        access_token, 
        # httponly=True,  # Prevent JavaScript access to the cookie
        # secure=True,    # Use secure cookies (only sent over HTTPS)
        # samesite='Lax'  # Helps prevent CSRF attacks
    )
    return response, 201


@app.route('/api/login', methods=['GET'])
def login():
    user_token=request.headers['Authorization']
    try:
        decoded_token = auth.verify_id_token(user_token)
        uid = decoded_token['uid']
        access_token = create_token(uid)
        response = jsonify({"message": "Login successful", "access_token": access_token})
        # Set the access token in a cookie
        response.set_cookie(
            'access_token', 
            access_token, 
            # httponly=True,  # Prevent JavaScript access to the cookie
            # secure=True,    # Use secure cookies (only sent over HTTPS)
            # samesite='Lax'  # Helps prevent CSRF attacks
        )
        return response, 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

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
            "createdAt":user.user_metadata.creation_timestamp,
            "lastLoginAt":user.user_metadata.last_sign_in_timestamp,
        }
        response = jsonify({"user": user_info})
        return response, 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
# User Management Endpoints is done and tested 100% 
# Next step is to implement the user management endpoints for the admin
# This will include endpoints for creating, reading, updating, and deleting users
# This will also include endpoints for managing user roles and permissions
# and user notifications and alerts and user settings and preferences
# and user analytics and insights and  user security and authentication
# and user identity and access control and user data encryption and decryption
# and user data backup and restore
# add update mehode for access token 

# Lesson Management Endpoints
 
@app.route('/api/upload', methods=['POST'])
@jwt_required()
def handle_theuploaded():
    # check if the request body  is text or file or image
    request_type=check_request_body()
    try:
        if request_type is None:
            response=jsonify({"st":'It is None',"value":request_type})
            return response,400
    except NameError:
        return jsonify ({"st":"This variable is not defined"})
    New_id=lastID("lessons")
    if request_type=="text":
        # Get the data from the request body
        lesson_obj={
            "title":request.form["title"],
            "id":New_id,
            "author":get_jwt_identity(),
            "content" :request.form['text'],
            "uploadedAt": datetime.now(timezone.utc).isoformat(),
        }
        # Save the text to the database
        lesson_objid = insert_Lessons(lesson_obj)
        response =jsonify({'message': 'Lesson uploaded successfully',"lesson_id":str(lesson_objid)})
        return response, 201
    
    elif request_type=="file":
        # get the file from the requset
        file=request.files['file']
        # Secure the filename
        filename = secure_filename(file.filename)
        # Save the file to the DropBox storage // function args :(access_token,file,filename)
        try:
            # Proccess the file 
            file_content = file.read()
            file_extracted_text=file_handler(file_content,filename)
            print("l317 :",len(file_extracted_text))
            url = save_to_azure_storage(file_content,filename)
            print("l 311",url)
            # Get the data from the request body
            lesson_obj={
                "title":request.form["title"],
                "id":New_id,
                "author":get_jwt_identity(),
                "content" :file_extracted_text,
                "lesson_save_link":str(url),
                "uploadedAt": datetime.now(timezone.utc).isoformat(),
            }
            # Save the dictionary Lesson to the database
            lesson_objid = insert_Lessons(lesson_obj)
            response =jsonify({'message': 'Lesson uploaded successfully',"lesson_id":str(lesson_objid)})
            return response, 200
        except Exception as e:
            response=jsonify({"error file": str(e)})
            return response, 400
        
    # case if the file is image
    elif request_type=="img":
        # get the image from the requset
        image=request.files['file']
        # Secure the filename
        try:
            filename = secure_filename(image.filename)
            with tempfile.NamedTemporaryFile(delete=False) as temp_file:
                image.save(temp_file.name)

                # Upload to Azure Blob Storage (if needed)
                url = save_to_azure_storage(temp_file.name, filename)  # Pass the temporary file path

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
                "content" :extracted_text,
                "lesson_save_link":str(url),
                "uploadedAt": datetime.now(timezone.utc).isoformat(),
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
        #     os.remove(temp)
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
    # Get the user's id from the JWT token 
    user_id = get_jwt_identity()
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

    return jsonify({"message": "Quiz created successfully", "quiz_id": str(quiz_result)}), 201
#just for show the quiz if needed 
@app.route('/api/quizzes/<quiz_id>', methods=['GET'])
@jwt_required()
def fetch_quiz(quiz_id):
    quiz = Fetch_Quizzes(ObjectId(quiz_id))
    if quiz is None:
        return jsonify({"error": "Quiz not found"}), 404
    if isinstance(quiz, str) and "error" in quiz.lower():
        return jsonify({"error": str(quiz)}), 404

    return jsonify(quiz), 200
"""yet"""
# Quiz Results Management Endpoints
@app.route('/api/quiz_results/<quiz_id>', methods=['GET'])
@jwt_required()
def fetch_quiz_results(quiz_id):
    """Fetches the quiz results for a given quiz ID.
    This endpoint requires a valid JWT token to access.
    Args:
        quiz_id (str): The ID of the quiz for which results are to be fetched.
    Returns:
        Response: A JSON response containing the quiz results if found, 
                or an error message if the quiz results are not found or an error occurs.
                The response status code is 200 for success and 404 for errors.
    """
    quiz_results = Fetch_Quiz_Results(ObjectId(quiz_id))
    if quiz_results is None:
        return jsonify({"error": "Quiz results not found"}), 404
    if isinstance(quiz_results, str) and "error" in quiz_results.lower():
        return jsonify({"error": str(quiz_results)}), 404
    
    return jsonify(quiz_results), 200

# Quiz Results Management Endpoints
@app.route('/api/quiz_results/insert', methods=['POST'])
@jwt_required()
def create_quiz_results():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    quiz_id = data["quiz_id"]
    user_id = data["user_id"]
    score = data["score"]
    attempt_date = data["attempt_date"]
    if not attempt_date:
        attempt_date = datetime.now(timezone.utc).isoformat()
    if not quiz_id or not user_id or not score:
        return jsonify({"error": "Missing required parameters"}), 400
    # function to create the quiz and insert it to the database and return the quiz id
    quiz_result = {
        "quiz_id": quiz_id,
        "user_id": user_id,
        "score": score,
        "attempt_date": attempt_date,
        "updatedAt": datetime.now(timezone.utc).isoformat()
    }
    # Insert the quiz result into the database
    quiz_result_id = Insert_Quiz_Results(quiz_result)
    if "error" in str(quiz_result_id).lower():
        return jsonify({"error": str(quiz_result_id)}), 500
    
    return jsonify({"message": "Quiz result created successfully", "quiz_result_id": str(quiz_result_id)}), 201

    
    

@app.route('/api/refresh_token', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user)
    return jsonify({"access_token":new_access_token}), 200

@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = (now + timedelta(minutes=20)).timestamp()
        
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if isinstance(data, dict):  # Check if the response data is a dictionary
                data["access_token"] = access_token 
                import json
                response.set_data(json.dumps(data))  # Update the response data
                response.content_type = "application/json"  # Ensure the content type is set to JSON
                # Set the access token in a cookie
                response.set_cookie(
                    'access_token', 
                    access_token, 
                    httponly=True,  # Prevent JavaScript access to the cookie
                    secure=True,    # Use secure cookies (only sent over HTTPS)
                    samesite='Lax'  # Helps prevent CSRF attacks
                )
        return response
    except (RuntimeError, KeyError):
        return response
@app.route('/api/')
def hello_world():
    print("hi")
    return "Hello, World!"

if __name__ == "__main__":
    app.run()