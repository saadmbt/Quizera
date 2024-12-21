from googleapiclient.discovery import build
from file_handling import file_handler
from functionsDB import insert_Lessons ,lastID,insert_Quizzes
fileT='./files/APIPresentation.pdf'
image='./files/ex11.png'
from datetime import datetime,timezone
import os
from dotenv import load_dotenv
from flask import request, jsonify
from main_functions import (save_to_dropbox,create_token,get_file_type)
from file_handling import file_handler
from image_Handling import image_handler
from werkzeug.utils import secure_filename
import dropbox


load_dotenv()
# Load credentials from environment variables
api_key = os.environ.get('YOUTUBE_API_KEY')
# Replace with your Dropbox access token
DropBox_Access_Token = os.environ.get('DropBox_access_token')
# Create a client instance

def test(file,lang):
    lesson_content=file_handler(file)
    # Test the function with a sample data
    lesson_id=lastID('lessons')
    print('this is the lesson id ',id)
    # use current date in ISO 8601 format (UTC) "2024-01-05T09:00:00Z"
    created_at = datetime.now(timezone.utc).isoformat()
    data = { "id":lesson_id+1,
            "content":lesson_content,
            "lesson-url":"www.saad.com",
            "language":lang,
            "createdAt": created_at,
            "keyword":['api key master',"fhrgfhgsjdfh","fvudhsfvjdsh"]}
    
    insert_Lessons(data)
def test_Quiz():
    data = { "id":1,
    "questinId": "quiz123",
    "questions": ["What is JavaScript?", "Explain closures in JavaScript."],
    "type": "multiple-choice",
    "createdAt": "2024-01-07T11:00:00Z",
    "updatedAt": "2024-01-08T12:00:00Z"}
    
    insert_Quizzes(data)


# print(save_to_dropbox(DropBox_Access_Token,fileT,"saad"))