from googleapiclient.discovery import build
from file_handling import file_handler
from functionsDB import insert_Lessons ,lastID,insert_Quizzes
fileT='./files/APIPresentation.pdf'
image='./files/ex11.png'
from datetime import datetime,timezone
import os
from groq import Groq
from dotenv import load_dotenv
from flask import request, jsonify
from main_functions import (save_to_dropbox,create_token,get_file_type)
from file_handling import file_handler
from image_Handling import image_handler,extract_text_from_image64base
from werkzeug.utils import secure_filename
import dropbox
import base64

load_dotenv()

groq_client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),  
)
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
def generate_quiz():
    # Generate a  quiz with 5 questions using the Groq API
    # The quiz will be in the format of multiple-choice questions
    # The questions will be of medium difficulty
    lesson_id=1
    quiz_data = {
        "lesson_id": lesson_id,
        "question_type": "multiple-choice",
        "num_questions": 5,
        "difficulty": "medium"
    }
    # Construire la requête pour l'API Groq en fonction des paramètres
    prompt = (
            f"""Générer 5 questions de type multiple-choice et de difficulté medium sur le sujet suivant : An Application Programming Interface (API) is a set of rules and protocols that allows different software applications to communicate with each other. APIs define the methods and data formats that applications can use to request and exchange information. They are essential for enabling interoperability between diverse systems, facilitating the integration of various services and functionalities. For instance, a weather application can use an API to retrieve current weather data from a remote server. By leveraging APIs, developers can build modular and scalable applications, enhancing functionality without needing to reinvent the wheel. APIs can be RESTful,. 
            Toutes les questions doivent être basées uniquement sur le contenu fourni. 
            Chaque question doit être suivie de quatre options de réponse. 
            La réponse doit être structurée comme un dictionnaire Python au format suivant : 
            [{{"question": "", "listanswer": ["option1", "option2", "option3", "option4"], "correctanswer": "(une des options)"}}]
            """

        )

        # Appeler l'API Groq pour générer les questions
    completion = groq_client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "system", "content": "Tu es un professeur expert. Génère des questions de qualité pour un quiz."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1500,
        )

        # Afficher la réponse complète de l'API pour le débogage
    questions_text = completion.choices[0].message.content.strip()
   # Parse the response to extract the list of questions
    try:
        # Find the start and end of the JSON-like structure
        start_index = questions_text.find('[')
        end_index = questions_text.rfind(']') + 1

        # Extract the JSON-like string
        questions_json = questions_text[start_index:end_index]

        # Parse the JSON-like string into a Python list of dictionaries
        questions = eval(questions_json)
        print(questions)

    except Exception as e:
        print(f"Error parsing the response: {e}")
        return None

generate_quiz()

# print(save_to_dropbox(DropBox_Access_Token,fileT,"saad"))