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
groups_collection = db["groups"]
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
        result=collection.insert_one(quiz)
        return result.inserted_id
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
            quiz["lesson_id"]=str(quiz["lesson_id"])
            return quiz
    except PyMongoError as e :
        return f"Error : fetching quiz {str(e)}"
    
# get all the quizzes genereated by a user
def Fetch_quizzes_by_user(user_id):
    try:
        collection=db["quizzes"]
        quiz=collection.find_one({"generated_by": user_id})
        if quiz is None:
            return "error : Quiz not found"
        else :
            quiz["_id"]=str(quiz["_id"])
            quiz["lesson_id"]=str(quiz["lesson_id"])
            return quiz
    except PyMongoError as e :
        return f"Error : fetching quiz {str(e)}"
    
# insert quiz result
def Insert_Quiz_Results(Quiz_res):
    try:
        collection=db["quizzResult"]
        quizzResult=Quiz_res
        #Quiz_res formt should be like : {"userId":,"quizId":,"score":,"attemptDate":,"updatedAt":}
        result=collection.insert_one(quizzResult)
        return result.inserted_id
    except PyMongoError as e:
        return f"Error: inserting quiz result {str(e)}"
    
# update quiz result with flashcards and youtube videos array  
def Update_Quiz_Results(Quiz_res_id, data,type):
    try:
        collection=db["quizzResult"]
        # Update the quiz result with the flashcards array
        if type=="youtube":
            result = collection.update_one(
                {"_id": ObjectId(Quiz_res_id)},
                {"$set": {"youtube": data}}
            )
        else:
            result = collection.update_one(
                {"_id": ObjectId(Quiz_res_id)},
                {"$set": {"flashcards": data}}
            )
        if result.modified_count > 0:
            return ObjectId(Quiz_res_id)
        else:
            return None
    except PyMongoError as e:
        return f"Error updating quiz result: {str(e)}"
    
def Fetch_Quiz_Results(Quiz_res_id):
    try :
        collection=db["quizzResult"]
        quiz_res=collection.find_one({"_id": Quiz_res_id})
        if quiz_res is None:
            return f"error : Quiz result not found "
        else :
            quiz_res["_id"]=str(quiz_res["_id"])
            quiz_res["generated_by"]=str(quiz_res["generated_by"])
            quiz_res["quiz_id"]=str(quiz_res["quiz_id"])
            quiz_res["lesson_id"]=str(quiz_res["lesson_id"])
            
            return quiz_res
    except PyMongoError as e :
        return f"Error fetching quiz result :{str(e)}" 
    
# fetch all quiz results for a specific user
def Fetch_Quiz_Results_by_user(user_id):
    try :
        collection=db["quizzResult"]
        quiz_res=list(collection.find({"generated_by":user_id}))
        for quiz in quiz_res:
            quiz["_id"]=str(quiz["_id"])
            quiz["generated_by"]=str(quiz["generated_by"])
            quiz["quiz_id"]=str(quiz["quiz_id"])
            quiz["lesson_id"]=str(quiz["lesson_id"])

        return quiz_res
    except PyMongoError as e :
        return f"Error fetching quiz result :{str(e)}"
    
# get all the flashcards by a user
def Fetch_Flashcards_by_user(user_id):
    try:
        collection=db["quizzResult"]
        flashcards= list(collection.find({"generated_by":user_id ,"flashcards": {"$exists": True, "$ne": []}},{"flashcards":1,"title":1}))
        
        for flashcard in flashcards:
            flashcard["_id"]=str(flashcard["_id"])
        return flashcards
    except PyMongoError as e:
        return f"Error fetching flashcards: {str(e)}"
# get single flashcard by result id
def Fetch_Flashcard_by_id(Quiz_res_id):
    try:
        collection=db["quizzResult"]
        flashcard=collection.find_one({"_id": ObjectId(Quiz_res_id)},{"flashcards":1})
        if flashcard is None:
            return "error : flashcard not found"
        else :
            flashcard["_id"]=str(flashcard["_id"])
            return flashcard
    except PyMongoError as e:
        return f"Error fetching flashcard: {str(e)}"

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
        print(f"Adding student {student_uid} to group {group_id}")
        
        # Check if group exists
        group = groups_collection.find_one({"_id": ObjectId(group_id)})
        if not group:
            print("Group not found")
            return "Error: Group not found"

        # Check if student is already in group
        if any(student.get('uid') == student_uid for student in group.get('students', [])):
            print("Student already in group")
            return "Error: Student already in group"

        # Add student
        student_data = {
            "uid": student_uid,
            "joined_at": datetime.now(timezone.utc).isoformat()
        }
        
        result = groups_collection.update_one(
            {"_id": ObjectId(group_id)},
            {"$addToSet": {"students": student_data}}
        )
        
        print(f"Update result: {result.modified_count} documents modified")
        return result.modified_count > 0
        
    except Exception as e:
        print(f"Error adding student to group: {e}")
        return f"Error adding student to group: {str(e)}"

def get_group_by_code(group_id, professor_id):
    """Get group by group ID and professor ID"""
    try:
        group = groups_collection.find_one({
            "_id": ObjectId(group_id),
            "prof_id": professor_id
        })
        if group:
            group['_id'] = str(group['_id'])
        return group
    except Exception as e:
        return f"Error fetching group: {str(e)}"

def get_professor_groups(professor_uid):
    """Get all groups created by a professor"""
    try:
        groups = list(groups_collection.find({"prof_id": professor_uid}))
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
            return {"error": "Invalid group_id format"}
        try:
            obj_id = ObjectId(group_id)
        except Exception:
            return {"error": "Invalid ObjectId conversion"}
        group = groups_collection.find_one({"_id": obj_id})
        if group:
            group['_id'] = str(group['_id'])  # Convert ObjectId to string
            return group
        return {"error": "Group not found"}
    except Exception as e:
        return {"error": f"Error in get_group_by_id: {str(e)}"}
def get_professor_by_id(profid):
    try:
        prof = user.find_one({"_id": ObjectId(profid)})
        if prof:
            prof['_id'] = str(prof['_id'])
            # Use displayName/name/username based on your user collection schema
            prof_name = prof.get('displayName') or prof.get('name') or prof.get('username', 'Unknown Professor')
            return {
                "_id": prof['_id'],
                "name": prof_name,
                # Add other needed fields
            }
        return None
    except Exception as e:
        print(f"Error in get_professor_by_id: {str(e)}")
        return f"Error fetching professor: {str(e)}"

def update_group_info(group_id, update_data):
    try:
        if not ObjectId.is_valid(group_id):
            return {"success": False, "error": "Invalid group_id format"}
        obj_id = ObjectId(group_id)
        update_fields = {}
        if "group_name" in update_data:
            update_fields["group_name"] = update_data["group_name"]
        if "description" in update_data:
            update_fields["description"] = update_data["description"]
        if not update_fields:
            return {"success": False, "error": "No valid fields to update"}
        result = groups_collection.update_one(
            {"_id": obj_id},
            {"$set": update_fields}
        )
        if result.modified_count > 0:
            return {"success": True, "message": "Group updated successfully"}
        else:
            return {"success": False, "error": "No changes made or group not found"}
    except Exception as e:
        return {"success": False, "error": str(e)}
