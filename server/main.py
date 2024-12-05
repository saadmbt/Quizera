from flask import Flask, request, jsonify
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)
from bson.json_util import dumps
from bson.objectid import ObjectId
from datetime import datetime, timedelta

# Import MongoDB utilities
from dotenv import load_dotenv
from pymongo.errors import PyMongoError

from functionsDB import (
    insert_users, Fetch_user, insert_Lessons, Fetch_Lesson, 
    Fetch_All_Lessons, insert_Quizzes, Fetch_Quizzes,
    insertquizzResults, FetchquizzeResults, lastID
)

app = Flask(__name__)

# JWT Configuration
app.config["JWT_SECRET_KEY"] = "your-secret-key"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
jwt = JWTManager(app)

# User Management Endpoints

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    if not data or not all(k in data for k in ("username", "password")):
        return jsonify({"error": "Invalid input"}), 400

    result = insert_users(data)
    if "error" in str(result).lower():
        return jsonify({"error": result}), 400

    return jsonify({"message": "User created successfully", "user_id": str(result)}), 201


@app.route('/api/login', methods=['POST'])
def login():
    data = request.json()
    user = Fetch_user(data.get("username"))
    if "error" in str(user).lower() or user.get("password") != data.get("password"):
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_access_token(identity=user["username"])
    return jsonify({"message": "Login successful", "token": token}), 200


@app.route('/api/profile', methods=['GET'])
@jwt_required()
def profile():
    username = get_jwt_identity()
    user = Fetch_user(username)
    if "error" in str(user).lower():
        return jsonify({"error": user}), 404

    return jsonify(user), 200

# Lesson Management Endpoints

@app.route('/api/upload', methods=['POST'])
@jwt_required()
def upload_lesson():
    data = request.json
    data['createdAt'] = datetime.utcnow()
    data['id'] = lastID('lessons') + 1 if lastID('lessons') else 1

    result = insert_Lessons(data)
    if "error" in str(result).lower():
        return jsonify({"error": result}), 400

    return jsonify({"message": "Lesson uploaded successfully", "lesson_id": str(result)}), 201


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

    return dumps(quiz), 200

# Additional Endpoints can be added in a similar fashion

if __name__ == "__main__":
    app.run(debug=True)