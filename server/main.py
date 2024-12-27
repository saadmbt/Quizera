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
    insert_Lessons, Fetch_Lesson, 
    Fetch_All_Lessons_byuser, insert_Quizzes, Fetch_Quizzes,
    insertquizzResults, FetchquizzeResults, lastID
)
from main_functions import (save_to_azure_storage,create_token,check_request_body,get_file_type)
from file_handling import file_handler
from image_Handling import image_handler
from werkzeug.utils import secure_filename
import firebase_admin
from firebase_admin import credentials, auth
app = Flask(__name__)

# Load credentials from environment variables
load_dotenv()
# Initialize Firebase Admin
cred = credentials.Certificate('./serviceAccountKey.json') 
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
            url = save_to_azure_storage(file,filename)
            # Proccess the file 
            file_extracted_text=file_handler(file)
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
            return response, 201 
        except Exception as e:
            response=jsonify({"error file": str(e)})
            return response, 400
        
    # case if the file is image
    elif request_type=="img":
        # get the image from the requset
        image=request.files['file']
        # Secure the filename
        imagename = secure_filename(image.filename)
        # Save the file to the DropBox storage // function args :(access_token,file,filename)
        try:
            url = save_to_azure_storage(image,imagename)
            # Proccess the file
            image_content=image.read()
            image_extracted_text=image_handler(image_content)
            # Get the data from the request body
            lesson_obj={
                "title":request.form["title"],
                "id":New_id,
                "author":get_jwt_identity(),
                "content" :image_extracted_text,
                "lesson_save_link":str(url),
                "uploadedAt": datetime.now(timezone.utc).isoformat(),
            }
            # Save the dictionary Lesson to the database
            lesson_objid = insert_Lessons(lesson_obj)
            response =jsonify({'message': 'Lesson uploaded successfully',"lesson_id":str(lesson_objid)})
            return response, 201 
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"error": "Invalid request type"}), 400
    
"""yet"""
@app.route('/api/lessons', methods=['GET'])
@jwt_required()
def fetch_lessons():
    lessons = Fetch_All_Lessons_byuser()
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
@app.route("/api/test_upload",methods=["POST"])
def test_upload():
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
            "author":"saad",
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
            url = save_to_azure_storage(file,filename)
            print("l 311",url)
            # Proccess the file 
            file_content = file.read()
            file_extracted_text=file_handler(file_content)
            # Get the data from the request body
            lesson_obj={
                "title":request.form["title"],
                "id":New_id,
                "author":"saad",
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
        imagename = secure_filename(image.filename)
        # Save the file to the DropBox storage // function args :(access_token,file,filename)
        try:
            url = save_to_azure_storage(image,imagename)
            # Proccess the image
            image_content = image.read()
            # Extracting the text from the image
            image_extracted_text=image_handler(image_content,imagename)
            # Get the data from the request body
            lesson_obj={
                "title":request.form["title"],
                "id":New_id,
                "author":"saad",
                "content" :image_extracted_text,
                "lesson_save_link":str(url),
                "uploadedAt": datetime.now(timezone.utc).isoformat(),
            }
            # Save the dictionary Lesson to the database
            lesson_objid = insert_Lessons(lesson_obj)
            response =jsonify({'message': 'Lesson uploaded successfully',"lesson_id":str(lesson_objid)})
            return response, 201 
        except Exception as e:
            return jsonify({"error image": str(e)}), 400
    else:
        return jsonify({"error": "Invalid request type"}), 400

if __name__ == "__main__":
    app.run(debug=True)