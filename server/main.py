from flask import Flask, request, jsonify
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity,get_jwt
)
from bson.json_util import dumps
from bson.objectid import ObjectId
from datetime import datetime, timedelta,timezone
from dotenv import load_dotenv
import os
import bcrypt
from functionsDB import (
    insert_user, Fetch_user, insert_Lessons, Fetch_Lesson, 
    Fetch_All_Lessons, insert_Quizzes, Fetch_Quizzes,
    insertquizzResults, FetchquizzeResults, lastID
)
from main_functions import (create_token,check_request_body)

from werkzeug.utils import secure_filename
import firebase_admin
from firebase_admin import credentials, auth
app = Flask(__name__)

# Load credentials from environment variables
load_dotenv()
# Initialize Firebase Admin
cred = credentials.Certificate('path/to/your/serviceAccountKey.json')  # Update with your service account key path
firebase_admin.initialize_app(cred)
# JWT Configuration
app.config["JWT_SECRET_KEY"] = os.environ.get('JWT_TOKEN_SECRET')
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
jwt = JWTManager(app)

      
# User Management Endpoints

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    last_id=lastID("users")
    if not data or not all(k in data for k in ("username","password","email")):
        response=jsonify({"error": "Invalid input"})
        return response, 400
     # Hash the password
    hashed_password = bcrypt.hashpw(data["password"].encode('utf-8'), bcrypt.gensalt())
    # Insert the user into the database
    user_data= {
    "username": data["username"],
    "id":last_id,
    "email": data["email"],
    "password": hashed_password,
    "createdAt": datetime.now(timezone.utc).isoformat(),
    }
    result = insert_user(user_data)
    if "error" in str(result).lower():
        response=jsonify({"error": result})
        return response, 401
    access_token=create_token(str(result))
    response=jsonify({"message": "User created successfully", "access_token": access_token})
    # Set the access token in a cookie
    response.set_cookie(
        'access_token', 
        access_token, 
        httponly=True,  # Prevent JavaScript access to the cookie
        secure=True,    # Use secure cookies (only sent over HTTPS)
        samesite='Lax'  # Helps prevent CSRF attacks
    )
    return response, 201


@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = Fetch_user(data["email"],"email")
    if "error" in str(user).lower() :
        response=jsonify({"error": str(user)})
        return response, 401
    # check if the provided password matches the hashed password
    is_valide= bcrypt.checkpw(data["password"].encode('utf-8'),user["password"])
    if not is_valide:
        response = jsonify({"error": "Invalid password"})
        return response, 401
    
    access_token = create_token(str(user["_id"]))
    response = jsonify({"message": "Login successful", "access_token": access_token})
    # Set the access token in a cookie
    response.set_cookie(
        'access_token', 
        access_token, 
        httponly=True,  # Prevent JavaScript access to the cookie
        secure=True,    # Use secure cookies (only sent over HTTPS)
        samesite='Lax'  # Helps prevent CSRF attacks
    )
    return response, 200


@app.route('/api/profile', methods=['GET'])
@jwt_required()
def profile():
    user_ObjectId = get_jwt_identity()
    user = Fetch_user(ObjectId(user_ObjectId),"objectid")
    # Check if there was an error fetching the user
    if isinstance(user, dict) and "error" in user:
        response=jsonify({"error": user["error"]})
        return response, 404
    # Convert ObjectId fields to string for JSON
    user["_id"] = str(user["_id"])
    user["password"] = "None"
    response = jsonify({"user": user})
    return response, 200
    
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
        lesson = insert_Lessons(lesson_obj)
        return jsonify({'message': 'Lesson uploaded successfully',"lesson_id":str(lesson)}), 201
    if request_type=="file":
        # Processing  the file 
        file=request.form['file']
        # Secure the filename
        filename = secure_filename(file.filename)

        # Get the data from the request body
        lesson_obj={
            "title":request.form["title"],
            "id":New_id,
            "author":get_jwt_identity(),
            "content" :request.form['text'],
            "uploadedAt": datetime.now(timezone.utc).isoformat(),
        }
        # Save the text to the database
        lesson = insert_Lessons(lesson_obj)
        return jsonify({'message': 'Lesson uploaded successfully',"lesson_id":str(lesson)}), 201 
     
    #case if the file is image
    if request_type=="img":
        # Get the data from the request body
        lesson_obj={
            "text" :request.form['text'],
            "lang":request.form['language'],
            "uploadedAt": datetime.now(timezone.utc).isoformat(),
        }
        # Save the text to the database
        lesson = insert_Lessons(lesson_obj)
        return jsonify({'message': 'Lesson uploaded successfully',"lesson_id":str(lesson)}), 201

    # Get the uploaded file
    file = request.files.get('file')
    # Check if the file was uploaded
    if not file:
        return jsonify({"error": "No file was uploaded"}), 400
    

    #  #Process the uploaded file.
    # data = request.json
    # # Check if the file is a valid lesson file
    # if not data["file"]:
    #     response = jsonify({"error": "No file provided"})
    #     return response, 400
    
    # data['createdAt'] = datetime.utcnow()
    # data['id'] = lastID('lessons') + 1 if lastID('lessons') else 1

    # result = insert_Lessons(data)
    # if "error" in str(result).lower():
    #     return jsonify({"error": result}), 400

    # return jsonify({"message": "Lesson uploaded successfully", "lesson_id": str(result)}), 201


@app.route('/api/lessons', methods=['GET'])
@jwt_required()
def fetch_lessons():
    lessons = Fetch_All_Lessons()
    if "error" in str(lessons).lower():
        return jsonify({"error": lessons}), 500

    return dumps(lessons), 200

@app.route('/api/lessons/<lesson_id>', methods=['GET'])
@jwt_required()
def fetch_lesson(lesson_id):
    lesson = Fetch_Lesson(ObjectId(lesson_id))
    if "error" in str(lesson).lower():
        return jsonify({"error": lesson}), 404

    return dumps(lesson), 200

# Quiz Management Endpoints

@app.route('/api/quizzes', methods=['POST'])
@jwt_required()
def create_quiz():
    data = request.json
    data['createdAt'] = datetime.utcnow()
    data['id'] = lastID('quizzes') + 1 if lastID('quizzes') else 1

    result = insert_Quizzes(data)
    if "error" in str(result).lower():
        return jsonify({"error": result}), 400

    return jsonify({"message": "Quiz created successfully", "quiz_id": str(result)}), 201


@app.route('/api/quizzes/<quiz_id>', methods=['GET'])
@jwt_required()
def fetch_quiz(quiz_id):
    quiz = Fetch_Quizzes(ObjectId(quiz_id))
    if "error" in str(quiz).lower():
        return jsonify({"error": quiz}), 404

    return jsonify(quiz), 200

@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=20))
        
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.json
            if isinstance(data, dict):  # Check if the response data is a dictionary
                data["access_token"] = access_token 
                response.data = jsonify(data)  # Update the response data
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

if __name__ == "__main__":
    app.run(debug=True)