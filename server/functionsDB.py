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
def Insert_Quiz_Results(Quiz_res ,collection_name):
    try:
        collection=db[collection_name]
        quizzResult=Quiz_res
        #Quiz_res formt should be like : {"userId":,"quizId":,"score":,"attemptDate":,"updatedAt":}
        result=collection.insert_one(quizzResult)
        return result.inserted_id
    except PyMongoError as e:
        return f"Error: inserting quiz result {str(e)}"
    
# update quiz result with flashcards and youtube videos array  
def Update_Quiz_Results(Quiz_res_id, data,type,is_from_prof):
    try:
        collection = db["quizzes"] if is_from_prof == True else db["quizzResult"]
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
            "prof_name": group_data["prof_name"],
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

def add_student_to_group(group_id, student_uid,username):
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
            "joined_at": datetime.now(timezone.utc).isoformat(),
            "username": username
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
            group['_id'] = str(group['_id'])  
            return group
        return {"error": "Group not found"}
    except Exception as e:
        return {"error": f"Error in get_group_by_id: {str(e)}"}
    
def get_professor_by_id(profid):
    try:
        prof = user.find_one({"_id": ObjectId(profid)})
        if prof:
            prof['_id'] = str(prof['_id'])
            # Use displayName/name/username based
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

# New function to get students with average scores for a group
def get_students_with_average_scores_for_group(group_id):
    try:
        if not ObjectId.is_valid(group_id):
            return {"error": "Invalid group_id format"}
        obj_id = ObjectId(group_id)
        group = groups_collection.find_one({"_id": obj_id})
        if not group:
            return {"error": "Group not found"}

        students = group.get("students", [])
        if not students:
            return []

        # Get all student uids in the group
        student_uids = [student.get("uid") for student in students if student.get("uid")]

        # Fetch all quiz attempts for these students in one query
        quiz_attempts = list(db["QuizAttempts"].find({"studentId": {"$in": student_uids}}))

        # Calculate average score per student
        student_scores = {}
        for uid in student_uids:
            student_scores[uid] = {
                "totalScore": 0,
                "attemptCount": 0
            }

        for attempt in quiz_attempts:
            sid = attempt.get("studentId")
            score = attempt.get("totalScore", 0)
            if sid in student_scores:
                student_scores[sid]["totalScore"] += score
                student_scores[sid]["attemptCount"] += 1

        results = []
        for student in students:
            uid = student.get("uid")
            if not uid:
                continue
            scores = student_scores.get(uid, {"totalScore": 0, "attemptCount": 0})
            avg_score = 0
            if scores["attemptCount"] > 0:
                avg_score = scores["totalScore"] / scores["attemptCount"]

            name = student.get("username", "Unknown User")

            results.append({
                "uid": uid,
                "username": name,
                "totalAttempts": scores["attemptCount"],
                "averageScore": avg_score
            })

        return results
    except Exception as e:
        return {"error": f"Error fetching students with average scores: {str(e)}"}

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

def delete_group(group_id):
    try:
        if not ObjectId.is_valid(group_id):
            return {"success": False, "error": "Invalid group_id format"}
        obj_id = ObjectId(group_id)
        result = groups_collection.delete_one({"_id": obj_id})
        if result.deleted_count > 0:
            return {"success": True, "message": "Group deleted successfully"}
        else:
            return {"success": False, "error": "Group not found"}
    except Exception as e:
        return {"success": False, "error": str(e)}
# Insert a quiz assignment document
def insert_quiz_assignment(assignment_data):
    try:
        collection = db["quiz_assignments"]
        # Validate and convert ObjectId fields
        quiz_id = assignment_data.get("quizId")
        group_ids = assignment_data.get("groupIds", [])
        assigned_by = assignment_data.get("assignedBy")
        assigned_at = assignment_data.get("assignedAt")
        due_date = assignment_data.get("dueDate")
        start_time = assignment_data.get("startTime")  # Get startTime from assignment_data
        
        print(f"insert_quiz_assignment - quiz_id: {quiz_id}")
        print(f"insert_quiz_assignment - group_ids: {group_ids}")
        print(f"insert_quiz_assignment - assigned_by: {assigned_by}")
        print(f"insert_quiz_assignment - start_time: {start_time}")

        if not quiz_id or not group_ids or not assigned_by or not assigned_at or not start_time:
            return {"error": "Missing required fields"}

        # Convert to ObjectId if strings
        if isinstance(quiz_id, str):
            quiz_id = ObjectId(quiz_id)
        group_ids_obj = []
        for gid in group_ids:
            if isinstance(gid, str):
                group_ids_obj.append(ObjectId(gid))
            else:
                group_ids_obj.append(gid)
        if isinstance(assigned_by, str):
            if ObjectId.is_valid(assigned_by):
                assigned_by = ObjectId(assigned_by)
            else:
                # Keep as string if not valid ObjectId
                assigned_by = assigned_by

        # Parse dates if strings
        if isinstance(assigned_at, str):
            assigned_at = datetime.fromisoformat(assigned_at.replace('Z', '+00:00'))
        if due_date and isinstance(due_date, str):
            due_date = datetime.fromisoformat(due_date.replace('Z', '+00:00'))
        if isinstance(start_time, str):
            start_time = datetime.fromisoformat(start_time.replace('Z', '+00:00'))

        doc = {
            "quizId": quiz_id,
            "groupIds": group_ids_obj,
            "assignedBy": assigned_by,
            "assignedAt": assigned_at,
            "dueDate": due_date,
            "startTime": start_time  # Make sure to include startTime in the document
        }
        
        print(f"Inserting document: {doc}")  # Debug print
        result = collection.insert_one(doc)
        return str(result.inserted_id)
    except Exception as e:
        print(f"Error in insert_quiz_assignment: {e}")  # Debug print
        return {"error": f"Error inserting quiz assignment: {str(e)}"}

#  get group IDs with quiz assignments for a student
def get_quiz_assignment_group_ids_for_student(student_uid):
    """
    Fetch group IDs that have quiz assignments for a specific student.

    Args:
        student_uid (str): The unique identifier of the student.

    Returns:
        list: A list of group IDs (as strings) that have quiz assignments for the student.
        dict: An error message if an exception occurs.
    """
    try:
        # Find groups the student belongs to
        groups = list(groups_collection.find({"students.uid": student_uid}, {"_id": 1}))
        group_ids = [group["_id"] for group in groups]

        if not group_ids:
            return []

        # Find quiz assignments for these groups
        collection = db["quiz_assignments"]
        assignments = collection.find({"groupIds": {"$in": group_ids}}, {"groupIds": 1})

        # Collect unique group IDs that have quiz assignments
        assigned_group_ids = set()
        for assignment in assignments:
            for gid in assignment.get("groupIds", []):
                assigned_group_ids.add(gid)

        # Convert ObjectId to string for consistency
        assigned_group_ids_str = [str(gid) for gid in assigned_group_ids]

        return assigned_group_ids_str
    except Exception as e:
        return {"error": f"Error fetching quiz assignment group IDs: {str(e)}"}

# get quiz_id by groupId from QuizzAssignments collection
#  Get assignments for a group
def get_quizzs_Assignments_by_group_id(group_id):
    try:
        current_date = datetime.now(timezone.utc)
        collection = db["quiz_assignments"]
        # Define query conditions for better readability
        group_condition = {"groupIds": {"$in": [ObjectId(group_id)]}}
        start_time_condition = {"startTime": {"$lte": current_date}}
        due_date_condition = {"dueDate": {"$gte": current_date}}
        
        # Combine conditions into a single query
        query = {**group_condition,**start_time_condition,**due_date_condition}
        
        # Execute the query
        quizzes_ids = list(collection.find(query, {"_id": 0, "quizId": 1}))
        print("arrLen :",len(quizzes_ids))
        # Check if quizzes are found
        if not quizzes_ids:
            return "error: No quizzes found for the provided group ID"  
        return quizzes_ids
    except Exception as e:
        return f"error: Error fetching quiz ID by group ID: {str(e)}"
   
# get quiz base on list of quiz ids
def get_quizzes_by_ids(quiz_ids,student_id):
    """Fetch quizzes by their IDs and check if the student has completed them.
    Args:
        quiz_ids (list): List of quiz IDs to fetch.
        student_id (str): Student ID to check completion status.
    Returns:
        list: List of quizzes with their completion status. 
        [{"_id": "quiz_id", "title": "quiz_title","created_at": date,"isCompleted": True/False}]
        dict: Error message if any error occurs.
    """
    try:
        collection = db["quizzes"]
        quiz_object_ids = [ObjectId(qid.get("quizId")) for qid in quiz_ids if isinstance(qid, dict)]
        quizzes = list(collection.find({"_id":{"$in": quiz_object_ids}},{"_id": 1, "title": 1,"createdAt": 1}))
        # Check if quizzes are found
        if not quizzes:
            return "error: No quizzes found for the provided IDs"
        
        # Check if quiz attempts exist for each quiz
        for quiz in quizzes:
            quiz_attempt = db["QuizAttempts"].find_one({"quizId": quiz["_id"], "studentId": str(student_id)})
            if quiz_attempt:
                quiz["isCompleted"] = True
                quiz["answers"] = quiz_attempt["answers"]
                quiz["feedback"] = quiz_attempt["feedback"]
            else:
                quiz["isCompleted"] = False

        
        # Convert ObjectId to string for all quizzes
        for quiz in quizzes:
            quiz["_id"] = str(quiz["_id"])
        return quizzes
    except Exception as e:
        return {"error": f"Error fetching quizzes by IDs: {str(e)}"}

# get user preformance
def getStudentPerformance(studentId):
    try:
        # Fetch all quiz results
        quizzResult_collection = db["quizzResult"]
        QuizAttempts_collection = db["QuizAttempts"]

        # Get quiz attempts stats
        quiz_attempts = list(QuizAttempts_collection.aggregate([
            { "$match": { "studentId": studentId} },
            { "$group": {
                "_id": None,
                "totalAttempts": { "$sum": 1 },
                "averageScore": { "$avg": "$totalScore" }
            }}
        ]))

        # Get latest quiz attempt score
        latest_attempt_cursor = QuizAttempts_collection.find({"studentId": studentId}
                        ).sort([("createdAt", -1)]).limit(1)
        latest_attempt = next(latest_attempt_cursor, None)
        
        # Get quiz results stats
        quizz_Result = list(quizzResult_collection.aggregate([
            { "$match": { "generated_by": studentId} },
            { "$group": {
                "_id": None,
                "totalQuizzes": { "$sum": 1 },
                "averageScore": { "$avg": "$score" }
            }}
        ]))

        # Get latest quiz result score
        latest_result_cursor = quizzResult_collection.find(
            {"generated_by": studentId}
        ).sort("createdAt", -1).limit(1)
        latest_result = next(latest_result_cursor, None)

        # Default values if no data found
        if not quizz_Result:
            quizz_Result = [{"totalQuizzes": 0, "averageScore": 0}]
        if not quiz_attempts:
            quiz_attempts = [{"totalAttempts": 0, "averageScore": 0}]

        # Calculate averages
        quiz_result_avg = quizz_Result[0]["averageScore"] or 0
        quiz_attempts_avg = quiz_attempts[0]["averageScore"] or 0
        
        # Get last score from either source
        last_score = 0
        if latest_attempt and latest_result:
            last_score = latest_attempt.get("score", 0) if latest_attempt.get("createdAt", 0) > latest_result.get("createdAt", 0) else latest_result.get("score", 0)
        elif latest_attempt:
            last_score = latest_attempt.get("score", 0)
        elif latest_result:
            last_score = latest_result.get("score", 0)

        # Calculate average score 
        if quiz_result_avg == 0 and quiz_attempts_avg > 0:
            average_score = quiz_attempts_avg
        elif quiz_result_avg > 0 and quiz_attempts_avg == 0:
            average_score = quiz_result_avg
        elif quiz_result_avg > 0 and quiz_attempts_avg > 0:
            average_score = (quiz_result_avg + quiz_attempts_avg) / 2
        else:
            average_score = 0

        final_result = {
            "totalQuizzes": quizz_Result[0]["totalQuizzes"] + quiz_attempts[0]["totalAttempts"],
            "averageScore": average_score,
            "lastScore": last_score
        }

        return final_result
    except Exception as e:
        return f"Error fetching student performance: {str(e)}"

def get_professor_quizzes(professor_id):
    """
    Fetch all quizzes created by a specific professor.
    
    Args:
        professor_id (str): The ID of the professor
    
    Returns:
        list: List of quizzes created by the professor
    """
    try:
        collection = db["quizzes"]
        quizzes = list(collection.find({"generated_by": professor_id}))
        
        # Convert ObjectId to string for JSON serialization
        for quiz in quizzes:
            quiz["_id"] = str(quiz["_id"])
            if "lesson_id" in quiz:
                quiz["lesson_id"] = str(quiz["lesson_id"])
        
        return quizzes
    except Exception as e:
        return {"error": f"Error fetching quizzes: {str(e)}"}

def get_quiz_attempts_by_quiz_id(quiz_id):
    """
    Fetch quiz attempts filtered by quizId.
    
    Args:
        quiz_id (str or ObjectId): The quiz ID to filter attempts.
    
    Returns:
        list: List of quiz attempts for the given quizId.
    """
    try:
        collection = db["QuizAttempts"]
        if isinstance(quiz_id, str):
            from bson import ObjectId
            quiz_id = ObjectId(quiz_id)
        attempts = list(collection.find({"quizId": quiz_id}))
        
        # Convert ObjectId to string for JSON serialization
        for attempt in attempts:
            attempt["_id"] = str(attempt["_id"])
            attempt["quizId"] = str(attempt["quizId"])
        
        return attempts
    except Exception as e:
        return {"error": f"Error fetching quiz attempts by quizId: {str(e)}"}
def update_quiz_questions(quiz_id, questions):
    try:
        collection = db["quizzes"]
        if isinstance(quiz_id, str):
            quiz_id = ObjectId(quiz_id)
        result = collection.update_one(
            {"_id": quiz_id},
            {"$set": {"questions": questions}}
        )
        if result.modified_count > 0:
            return {"success": True, "message": "Quiz questions updated successfully"}
        else:
            return {"success": False, "message": "No changes made or quiz not found"}
    except PyMongoError as e:
        return {"success": False, "error": f"Error updating quiz questions: {str(e)}"}

def check_quiz_assignment_completion(student_uid):
    try:
        # Find groups the student belongs to
        groups = list(groups_collection.find({"students.uid": student_uid}, {"_id": 1}))
        
        if not groups:
            return {
                "status": "info",
                "message": "You are not enrolled in any groups",
                "data": []
            }

        notifications = []
        current_time = datetime.now(timezone.utc)
        group_ids = [group["_id"] for group in groups]

        for group_id in group_ids:
            # Find active assignments for the group
            assignments = list(db["quiz_assignments"].find({
                "groupIds": group_id,
                "startTime": {"$lte": current_time},
                "dueDate": {"$gte": current_time}
            }))

            for assignment in assignments:
                quiz_id = assignment.get("quizId")
                quiz = db["quizzes"].find_one({"_id": quiz_id})
                quiz_attempt = db["QuizAttempts"].find_one({
                    "quizId": quiz_id,
                    "studentId": student_uid
                })

                if not quiz_attempt:
                    group = groups_collection.find_one({"_id": group_id})
                    due_date = assignment.get("dueDate")
                    time_left = due_date - current_time if due_date else None

                    notifications.append({
                        "type": "warning",
                        "title": "Pending Quiz",
                        "message": f"You have an uncompleted quiz '{quiz.get('title')}' in group '{group.get('group_name')}'",
                        "time_left": str(time_left) if time_left else "No deadline",
                        "quiz_id": str(quiz_id),
                        "group_id": str(group_id),
                        "assignment_id": str(assignment["_id"])
                    })

        if notifications:
            return {
                "status": "warning",
                "message": f"You have {len(notifications)} pending quizzes",
                "data": notifications
            }
        else:
            return {
                "status": "success",
                "message": "All assigned quizzes are completed",
                "data": []
            }

    except Exception as e:
        return {
            "status": "error",
            "message": f"Error checking quiz assignments: {str(e)}",
            "data": []
        }
