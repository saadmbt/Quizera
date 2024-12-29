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
from image_Handling import image_handler,extract_text_from_image64base
from werkzeug.utils import secure_filename
import dropbox
import base64

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

def test_image(image,type_imge):
    with open(image, "rb") as img:
        encoded = base64.b64encode(img.read()).decode('utf-8')
        print("l52",len(encoded))
        text=extract_text_from_image64base(encoded,type_imge)
        print(text)

#test_image(image,"png")
def read_image(filename):
    try:
        with open(filename, 'rb') as f:
            image_data = f.read()
            print(f"Image data read successfully. Length: {len(image_data)}")
            return image_data
    except Exception as e:
        print(f"Error reading image: {e}")
        return None

if __name__ == "__main__":
    image_path = "./files/ex11.png" 
    image_data = read_image(image_path) 

# print(save_to_dropbox(DropBox_Access_Token,fileT,"saad"))