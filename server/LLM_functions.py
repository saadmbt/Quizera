import googleapiclient
from groq import Groq
from dotenv import load_dotenv
import os
from pymongo import MongoClient
from pymongo.errors import PyMongoError
from datetime import datetime
from bson import ObjectId
from functionsDB import (
    insert_user, Fetch_user, insert_Lessons, Fetch_Lesson, 
    fetch_all_lessons_by_user, insert_Quizzes, Fetch_Quizzes,
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


# MongoDB collections for lessons and quizzes
lessons_collection = db["lessons"]
quizzes_collection = db["quizzes"]

def generate_and_insert_questions(lesson_id, question_type, num_questions, difficulty):
    """Reads a lesson from MongoDB, generates questions using the Groq API,
    and inserts the generated questions into the "quizzes" collection."""
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
        
        # Construire la requête pour l'API Groq en fonction des paramètres
        prompt = (
            f"""Générer {num_questions} questions de type {question_type} et de difficulté {difficulty} sur le sujet suivant : {content}. 
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
        # Insérer les questions dans MongoDB
        question_id = lastID('quizzes')
        quiz = {
            "id": question_id + 1,
            "type": question_type,
            "questions": questions,
            "createdAt": datetime.now()
        }
        inserted_quiz_id = insert_Quizzes(quiz)
        if isinstance(inserted_quiz_id, ObjectId):
            print(f"Questions générées et insérées avec succès. ID du quiz : {inserted_quiz_id}")
            return inserted_quiz_id
        else:
            raise ValueError("Erreur lors de l'insertion du quiz.")
    except Exception as e:
        print(f"Erreur lors de la génération des questions : {e}")
        return None