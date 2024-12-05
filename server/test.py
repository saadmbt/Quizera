from googleapiclient.discovery import build
from file_handling import file_handler
from functionsDB import insert_Lessons ,lastID,insert_Quizzes
fileT='./files/test2.pdf'
image='./files/ex11.png'
from datetime import datetime,timezone
import os
from dotenv import load_dotenv

load_dotenv()
# Load credentials from environment variables
api_key = os.environ.get('YOUTUBE_API_KEY')

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

print(test_Quiz())
# def extract_keywords(text):
#     # Extract the firt 400 word from the given text.
#     # resultant_string = text[:400]

#     return keywords

# def suggest_youtube_videos(keywords):
#     """Suggest YouTube videos based on the extracted keywords."""
#     # This is a placeholder for the actual YouTube API call
#     # You would need to replace this with your own implementation
#     # For example, you could use the YouTube API to search for videos
#     # Create a YouTube API client 
#     youtube = build('youtube', 'v3', developerKey=api_key)
#     search_query = " ".join(keywords)
#     res=f"Suggested YouTube videos for: {search_query}"
#     # based on the keywords and return the video titles and URLs
                 
#     # In a real implementation, you would use the YouTube API to fetch video suggestions
#     # For example, you could use the `search.list` method to search for videos based on
#     # the keywords and return the video titles and URLs

# text="""Components of an API Endpoints: These are specific URLs where API requests are sent. Each endpoint corresponds to a specific function or resource.Methods: APIs typically support several methods (e.g., GET, POST, PUT, DELETE) that
# define the type of operation to be performed on the resource.
# • Request and Response: APIs exchange data in the form of requests and responses,
# • Endpoints: These are specific URLs where API requests are sent. Each endpoint
# corresponds to a specific function or resource.
# • Methods: APIs typically support several methods (e.g., GET, POST, PUT, DELETE) that
# define the type of operation to be performed on the resource.
# • Request and Response: APIs exchange data in the form of requests and responses,
# • Methods: APIs typically support several methods (e.g., GET, POST, PUT, DELETE) that
# define the type of operation to be performed on the resource.
# • Request and Response: APIs exchange data in the form of requests and responses,
# often using JSON or XML formats.
# • Authentication: Many APIs require authentication to ensure that only authorized users
# can access certain functionalities or data.
# Why is it interesting to have an API ?
# Authentication: Many APIs require authentication to ensure that only authorized users
# can access certain functionalities or data Why is it interesting to have an API ?"""
# keywords = extract_keywords(text)
# print(keywords)