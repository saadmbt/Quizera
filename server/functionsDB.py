from dotenv import load_dotenv
import os
from pymongo import MongoClient
from pymongo.errors import PyMongoError
from data import userDa
from flask import jsonify

# Load environment variables from .env file
load_dotenv()
mongodb_url=os.environ.get("MONGO_URL")  
mongodb_name=os.environ.get("MONGO_DB")
# Connect to MongoDB
client = MongoClient(mongodb_url)
db = client[mongodb_name]

def insert_users(user_data):
    try:
        collection = db["users"]
        user = user_data
        result = collection.insert_one(user)
        #  return User inserted  ID:
        return jsonify({"message": "User created successfully", "id": result.inserted_id}),
    except PyMongoError as e:
        return jsonify({"error": "Error inserting user" ,"details":str(e)}), 500

def Fetch_user(user_id):
    try:
        collection = db["users"]
        user = collection.find_one({"_id": user_id})
        if user is None:
            return jsonify({"error": "User not found"}), 404
        else :
            return jsonify({"user": user}), 200
    except PyMongoError as e:
        return jsonify({"error": "Error fetching user" ,"details":str(e)}), 500

def insert_Lessons(lesson_obj):
    try:
        collection=db["lessons"]
        lesson=lesson_obj
        # {"content":,"lesson-url":,"language":,"createdAt":}
        result=collection.insert_one(lesson)
        return jsonify({"message": "Lesson created successfully", "id": result.inserted_id}),
    except PyMongoError as e :
        return jsonify({"error": "Error inserting lesson" ,"details":str(e)}), 500
def Fetch_Lesson(lesson_id):
    try :
        collection=db["lessons"]
        lesson=collection.find_one({"_id": lesson_id})
        if lesson is None:
            return jsonify({"error": "Lesson not found"}), 404
        else :
            return jsonify({"lesson": lesson}), 200
    except PyMongoError as e :
        return jsonify({"error": "Error fetching lesson" ,"details":str(e)}), 500

def Fetch_All_Lessons():
    try :
        # return all the lessons in the db
        collection=db["lessons"]
        lessons=list(collection.find())
        return jsonify({"lessons": lessons}), 200
    except PyMongoError as e :
        return jsonify({"error": "Error fetching lessons" ,"details":str(e)}), 500

def insert_Quizzes(Quiz_data):
    try:
        collection=db["quizzes"]
        quiz=Quiz_data
        # Quiz_data formt :{"questinId":,"questions":,"type":,"createdAt":,"updatedAt":}
        result=collection.insert_one(quiz)
        return jsonify({"message": "Quiz created successfully", "id": result.inserted_id}),
    except PyMongoError as e :
        return jsonify({"error": "Error inserting quiz" ,"details":str(e)}), 500
    
def Fetch_Quizzes(Quiz_id):
    try :
        collection=db["quizzes"]
        quiz=collection.find_one({"_id": Quiz_id})
        if quiz is None:
            return jsonify({"error": "Quiz not found"}), 404
        else :
            return jsonify({"quiz": quiz}), 200
    except PyMongoError as e :
        return jsonify({"error": "Error fetching quiz" ,"details":str(e)}), 500

def insertquizzResults(Quiz_res):
    try:
        collection=db["quizzResult"]
        quizzResult=Quiz_res
        #Quiz_res formt should be like : {"userId":,"quizId":,"score":,"attemptDate":,"updatedAt":}
        result=collection.insert_one(quizzResult)
        return jsonify({"message": "Quiz result created successfully", "id": result.inserted_id})
    except PyMongoError as e:
        return jsonify({"error": "Error inserting quiz result" ,"details":str(e)}),500

def FetchquizzeResults(Quiz_res_id):
    try :
        collection=db["quizzResult"]
        quiz_res=collection.find_one({"_id": Quiz_res_id})
        if quiz_res is None:
            return jsonify({"error": "Quiz result not found"}), 404
        else :
            return jsonify({"quiz_result": quiz_res}), 200
    except PyMongoError as e :
        return jsonify({"error": "Error fetching quiz result" ,"details":str(e)}),
    

