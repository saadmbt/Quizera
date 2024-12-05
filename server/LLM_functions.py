import googleapiclient
from groq import Groq
from dotenv import load_dotenv
import os
from pymongo import MongoClient
from pymongo.errors import PyMongoError
from datetime import datetime
from bson import ObjectId
from functionsDB import (
    insert_users, Fetch_user, insert_Lessons, Fetch_Lesson, 
    Fetch_All_Lessons, insert_Quizzes, Fetch_Quizzes,
    insertquizzResults, FetchquizzeResults, lastID
)


# Load environment variables from .env file
load_dotenv()
mongodb_url=os.environ.get("MONGO_URL")  
mongodb_name=os.environ.get("MONGO_DB")
# Connect to MongoDB
client = MongoClient(mongodb_url)
db = client[mongodb_name]

groq_client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),  
)

# take text and transform it to array of keywords for youtube video suggesting
def generate_keywords(text):
    try:
        completion = groq_client.chat.completions.create(
                    model="llama3-8b-8192",
                    messages=[
                        {"role": "system", "content": "Given the following text, extract the most 3 relevant sentences or title that can be used to generate YouTube suggested videos. The response should only include the extracted sentence or title without any additional context or explanation or list formatting."},
                        {"role": "user","content":text}
                    ],
                    temperature=1,
                )
                
        # Extract the content from the response 
        keywords = completion.choices[0].message.content.strip()
        # Convert the keywords string into a list 
        resulat=[keyword.strip() for keyword in keywords.split(',')] if keywords else []
        return (resulat)
    except Exception as e:
        return f"An error occurred while generating keywords: {e}"
    
def suggest_yt_videos(keywords):
    # Use the YouTube API to search for videos based on the generated keywords
    # For this example, we'll use the YouTube API's search.list method
    # You'll need to replace the API key with your own
    api_key = "YOUR_YOUTUBE_API_KEY"
    youtube = googleapiclient.discovery.build('youtube', 'v3', developerKey=api_key)


# Collection MongoDB
lessons_collection = db["lessons"]
quizzes_collection = db["quizzes"]

def generate_and_insert_questions(lesson_id):
    """Lit une leçon depuis MongoDB, génère des questions à l'aide de l'API Groq,
    et insère les questions générées dans la collection "quizzes"  """
    try:
        # Convertir l'ID de la leçon en ObjectId si nécessaire
        if not isinstance(lesson_id, ObjectId):
            lesson_id = ObjectId(lesson_id)
        
        # Récupérer la leçon de MongoDB
        lesson = Fetch_Lesson(lesson_id)
        if not lesson:
            raise ValueError("Leçon introuvable")
        
        # Récupérer le contenu de la leçon
        content = lesson.get('content')
        
        if not content:
            raise ValueError("Le contenu de la leçon est vide")
        
        # check the type of 

        # Appeler l'API Groq pour générer les questions
        completion = groq_client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[{"role": "system", "content": "Generate 20 questions with 4 options each (one correct and three distractors)."},
                      {"role": "user", "content": content}],
            temperature=0.7,
            max_tokens=8191,
        )

        # Afficher la réponse complète de l'API pour le débogage
        questions_text = completion.choices[0].message.content.strip()
        print("Réponse de l'API Groq:", questions_text)

        # Traiter les questions générées
        questions = []
        for question_block in questions_text.split('\n\n'):
            lines = question_block.strip().split('\n')
            if len(lines) >= 5:  # Une question et 4 options
                question = lines[0]
                options = lines[1:5]
                questions.append({
                    "text": question,
                    "options": options
                })

        # Vérifier si des questions ont été générées
        if not questions:
            raise ValueError("Aucune question valide n'a été générée.")
            # Insérer les questions dans MongoDB
        question_id=lastID('quizzes')
        quiz = {
            "id":question_id+1,
            "type": "multiple-choice",
            "questions": questions,
            "createdAt": datetime.now()
        }
        result =insert_Quizzes(quiz)
        print(f"Questions générées et insérées avec succès. ID du quiz : {result}")
    except Exception as e:
        print(f"Erreur lors de la génération des questions : {e}")



print(generate_and_insert_questions("675228e0d36c87bf6ee28500"))