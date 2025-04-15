from dotenv import load_dotenv
import os
from pymongo import MongoClient
from pymongo.errors import PyMongoError
from bson import ObjectId
from datetime import datetime, timezone

# Load environment variables from .env file
load_dotenv()
mongodb_url=os.environ.get("MONGO_URL")  
mongodb_name=os.environ.get("MONGO_DB")

# Connect to MongoDB
client = MongoClient(mongodb_url)
db = client[mongodb_name]
groups_collection = db['groups']
user = db["users"]

# get the last id in any collection 
def lastID(collection_name):
    try:
        collection = db[collection_name]
        last_document = collection.find_one(sort=[("id", -1)])
        id=last_document.get("id") if last_document else None

        return id+1
    except PyMongoError as e:
        return f"Error fetching last id: {str(e)}"
def insert_user(user_data):
    try:
        collection = db["users"]
        # Check if the user already exists
        existing_email = collection.find_one({'email': user_data["email"]})
        if existing_email:
            return "error : email already exists"
        existing_username = collection.find_one({'username': user_data["username"]})
        if existing_username:
            return "error : Username already exists"

        # If user does not exist, insert the new user
        result=collection.insert_one(user_data)
        return result.inserted_id
        
    except PyMongoError as e:
            return f"Error : fetching user :{str(e)}"

def get_user(uid):
    """Get user by Firebase UID"""
    try:
        collection = db["users"]
        user = collection.find_one({"uid": uid})
        if user:
            user['_id'] = str(user['_id'])
        return user
    except Exception as e:
        return f"Error fetching user: {str(e)}"

def insert_Lessons(lesson_obj):
    try:
        collection=db["lessons"]
        lesson=lesson_obj
        existing_Lesson = collection.find_one({'id': lesson["id"]})
        # {"content":,"lesson-url":,"language":,"createdAt":}
        if existing_Lesson:
            return "error : lesson already exist"
        
        result=collection.insert_one(lesson)
        return result.inserted_id

    except PyMongoError as e :
        return f"Error : inserting lesson {str(e)}"
    
def Fetch_Lesson(lesson_id):
    try :
        collection=db["lessons"]
        lesson=collection.find_one({"_id": lesson_id})
        if lesson is None:
            return "error :Lesson not found"
        else :
            lesson["_id"]=str(lesson["_id"])
            return lesson
    except PyMongoError as e :
        return  f"Error fetching lessondetails{str(e)}"

def fetch_all_lessons_by_user(user_id):
    try :
        # return list of the lessons in the db created by the author 
        collection=db["lessons"]
        lessons=list(collection.find({"author":user_id}))
        for lesson in lessons:
            lesson["_id"]=str(lesson["_id"])
            lesson["id"]=str(lesson["id"])
        return lessons
    
    except PyMongoError as e :
        return f"Error fetching lessons: {str(e)}"

def insert_Quizzes(Quiz_data):
    try:
        collection=db["quizzes"]
        quiz=Quiz_data
        existing_quiz = collection.find_one({'id': quiz["id"]})
        if existing_quiz:
            return "error : quiz already exist"
        # Quiz_data formt :{"questinId":,"questions":,"type":,"createdAt":,"updatedAt":}
        result=collection.insert_one(quiz)
        return str(result.inserted_id)
    except PyMongoError as e :
        return f"Error inserting quiz {str(e)}"
    
def Fetch_Quizzes(Quiz_id):
    try :
        collection=db["quizzes"]
        quiz=collection.find_one({"_id": Quiz_id})
        if quiz is None:
            return "error : Quiz not found"
        else :
            quiz["_id"]=str(quiz["_id"])
            return quiz
    except PyMongoError as e :
        return f"Error : fetching quiz {str(e)}"

def Insert_Quiz_Results(Quiz_res):
    try:
        collection=db["quizzResult"]
        quizzResult=Quiz_res
        existing_quiz = collection.find_one({'id': quizzResult["id"]})
        if existing_quiz:
            return "error : quizResult already exist"
        #Quiz_res formt should be like : {"userId":,"quizId":,"score":,"attemptDate":,"updatedAt":}
        result=collection.insert_one(quizzResult)
        return result.inserted_id
    except PyMongoError as e:
        return f"Error: inserting quiz result {str(e)}"

def Fetch_Quiz_Results(Quiz_res_id):
    try :
        collection=db["quizzResult"]
        quiz_res=collection.find_one({"_id": Quiz_res_id})
        if quiz_res is None:
            return f"error : Quiz result not found "
        else :
            return quiz_res
    except PyMongoError as e :
        return f"Error fetching quiz result :{str(e)}" 
def insert_group(group_data):
    """insert a new group"""
    try:
        # Format the group data
        formatted_group = {
            "group_name": group_data["group_name"],
            "description": group_data.get("description", ""),
            "prof_id": group_data["prof_id"],
            "created_at": datetime.now(timezone.utc).isoformat(),
            "students": []
        }
        
        result = groups_collection.insert_one(formatted_group)
        if result.inserted_id:
            return {
                "success": True,
                "group_id": str(result.inserted_id),
                "message": "Group created successfully"
            }
        return {
            "success": False,
            "error": "Failed to create group"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

def add_student_to_group(group_id, student_uid):
    """Add a student to a group"""
    try:
        student_data = {
            "uid": student_uid,
            "joined_at": datetime.now(timezone.utc).isoformat()
        }
        result = groups_collection.update_one(
            {"_id": ObjectId(group_id)},
            {"$addToSet": {"students": student_data}}
        )
        return result.modified_count > 0
    except Exception as e:
        return f"Error adding student to group: {str(e)}"

def get_group_by_code(group_id, professor_id):
    """Get group by group ID and professor ID"""
    try:
        group = groups_collection.find_one({
            "_id": ObjectId(group_id),
            "professor_uid": professor_id
        })
        if group:
            group['_id'] = str(group['_id'])
        return group
    except Exception as e:
        return f"Error fetching group: {str(e)}"

def get_professor_groups(professor_uid):
    """Get all groups created by a professor"""
    try:
        groups = list(groups_collection.find({"professor_uid": professor_uid}))
        for group in groups:
            group['_id'] = str(group['_id'])
        return groups
    except Exception as e:
        return f"Error fetching professor groups: {str(e)}"

def get_student_groups(student_uid):
    """Get all groups a student belongs to"""
    try:
        groups = list(groups_collection.find({"students.uid": student_uid}))
        for group in groups:
            group['_id'] = str(group['_id'])
        return groups
    except Exception as e:
        return f"Error fetching student groups: {str(e)}"
def Fetch_Groups(ProfId):
    try:
        groups = list(groups_collection.find({"prof_id": ProfId}))
        for group in groups:
            group['_id'] = str(group['_id'])  # Convert ObjectId to string
        return groups  # Return all groups after processing
    except Exception as e:
        return f"Error fetching groups: {str(e)}"
def get_group_by_id(group_id):
    try:
        # Ensure group_id is a valid ObjectId
        if not ObjectId.is_valid(group_id):
            return None
            
        group = groups_collection.find_one({"_id": ObjectId(group_id)})
        if group:
            group['_id'] = str(group['_id'])  # Convert ObjectId to string
            return group
        return None
    except Exception as e:
        print(f"Error in get_group_by_id: {str(e)}")
        return None
def get_professor_by_id(profid):
    try:
        prof = user.find_one({"_id":ObjectId(profid)})
        if prof:
            prof['_id'] = str(prof['_id'])
            return prof
    except Exception as e:
        return f"Error fetching group: {str(e)}"
