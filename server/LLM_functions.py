import googleapiclient.discovery 
from  groq import Groq
from dotenv import load_dotenv
import os
import json
import re
from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId
from functionsDB import (Fetch_Lesson,insert_Quizzes,lastID)
from prompts_config import base_prompt ,flashcards_prompt,keywords_prompt
# Load environment variables from .env file
load_dotenv()
mongodb_url=os.environ.get("MONGO_URL")  
mongodb_name=os.environ.get("MONGO_DB")

# Connect to MongoDB
client = MongoClient(mongodb_url)
db = client[mongodb_name]

# MongoDB collections for lessons and quizzes
lessons_collection = db["lessons"]
quizzes_collection = db["quizzes"]


groq_client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),  
)

# take text and transform it to array of keywords for youtube video suggesting
def generate_keywords(lesson_id):
    lesson = Fetch_Lesson(lesson_id)
    # check if the lesson has  error string "error"
    if isinstance(lesson, str) and "error" in lesson.lower():
        raise ValueError("Lesson content is empty :" + lesson)
    if not lesson  :
        raise ValueError("Lesson content is empty")
    
    text = lesson["content"]
    if not text:
        raise ValueError("Lesson content is empty")
    if len(text) > 20000:
        text = text[:9000]
    
    # Generate keywords using Groq API

    try:
        completion = groq_client.chat.completions.create(
                    model="llama3-8b-8192",
                    messages=[
                        {"role": "system", "content": keywords_prompt},
                        {"role": "user","content":text} 
                    ],
                    temperature=1,
                )
                
        # Extract the content from the response 
        keywords = completion.choices[0].message.content.strip()
        try:
            # Clean and validate response
            keywords = keywords.strip()
            
            # Find the JSON array in the response
            start_index = keywords.find('[')
            end_index = keywords.rfind(']') + 1
            
            if start_index == -1 or end_index <= 0:
                raise ValueError("No valid JSON array found in response")
            
            # Extract and parse JSON
            keywords_json = keywords[start_index:end_index]
            result = json.loads(keywords_json)
            
            # Validate result
            if not isinstance(result, list):
                raise ValueError("Response is not a list")
            if not all(isinstance(item, str) for item in result):
                raise ValueError("Not all items in response are strings")
            
            return result

        except json.JSONDecodeError as e:
            return f"JSON parsing error: {e}"
        except Exception as e:
            return f"Error processing keywords: {e}"

    except Exception as e:
        return f"API error: {e}"
    
def generate_youtube_suggestions(keywords):
    """
    Suggest YouTube videos based on the provided keywords.
    
    Args:
        keywords (list): A list of keywords to search for on YouTube.
        
    Returns:
        list: A list of YouTube video suggestions.
    """
    api_key = os.environ.get('YOUTUBE_API_KEY')
    if not api_key:
        raise ValueError("YOUTUBE_API_KEY environment variable is not set or is empty")
    # Build the YouTube API client
    youtube = googleapiclient.discovery.build('youtube', 'v3', developerKey=api_key)
    
    video_suggestions = []
    
    for keyword in keywords:
        request = youtube.search().list(
            q=keyword,
            part="snippet",
            maxResults=2,
            type="video"
        )
        response = request.execute()
        for item in response['items']:
            video_suggestions.append({
                "title": item['snippet']['title'],
                "video_id": item['id']['videoId'],
                "channel_title": item['snippet']['channelTitle'],
                "thumbnail": item['snippet']['thumbnails']['default']['url'],
                "timestamp": item['snippet']['publishedAt'],
                "url": f"https://www.youtube.com/watch?v={item['id']['videoId']}"
            })
    print(video_suggestions)    
    return video_suggestions

def clean_llm_response(response):
    # Remove common prefixes
    response = re.sub(r'^.*?(?=\[)', '', response, flags=re.DOTALL)
    
    # Remove common suffixes after ]
    response = re.sub(r'\].*?$', ']', response, flags=re.DOTALL)
    
    # Fix French quotes if needed
    response = response.replace('"', '"').replace('"', '"')
    
    return response.strip()

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
        title = lesson.get('title')
        author = lesson.get('author')
        username = lesson.get('username')
        if not title:
            raise ValueError("Le titre de la leçon est vide")

        if not content:
            raise ValueError("Le contenu de la leçon est vide")
        
        if len(content) > 20000:
            content= content[:19000]
        
        all_questions = []
        # If question_type is a list, generate questions for each type
        if isinstance(question_type, list):
            for q_type in question_type:
                prompt = base_prompt[q_type].format(
                    num=num_questions,
                    difficulty=difficulty,
                    content=content
                )
                completion = groq_client.chat.completions.create(
                    model="llama3-70b-8192",
                    messages=[
                        {"role": "system", "content": "Tu es un professeur expert. Génère des questions de qualité pour un quiz."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.3,
                    max_tokens=1500,
                )
                questions_text = completion.choices[0].message.content.strip()
                print(f"res for {q_type}", questions_text)
                if isinstance(questions_text, list):
                    questions = questions_text
                else:
                    try:
                        start_index = questions_text.find('[')
                        end_index = questions_text.rfind(']') + 1
                        if start_index == -1 or end_index == 0:
                            raise ValueError("Invalid response format - no list found")
                        questions_json = questions_text[start_index:end_index]
                        questions = json.loads(questions_json)
                        print(questions)
                    except Exception as e:
                        print(f"Error parsing the response for {q_type}: {e}")
                        return None
                all_questions.extend(questions)
        else:
            prompt = base_prompt[question_type].format(
                num=num_questions,
                difficulty=difficulty,
                content=content
            )
            completion = groq_client.chat.completions.create(
                model="llama3-70b-8192",
                messages=[
                    {"role": "system", "content": "Tu es un professeur expert. Génère des questions de qualité pour un quiz."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=1500,
            )
            questions_text = completion.choices[0].message.content.strip()
            print("res",questions_text)
            if isinstance(questions_text, list):
                all_questions = questions_text
            else:
                try:
                    start_index = questions_text.find('[')
                    end_index = questions_text.rfind(']') + 1
                    if start_index == -1 or end_index == 0:
                        raise ValueError("Invalid response format - no list found")
                    questions_json = questions_text[start_index:end_index]
                    all_questions = json.loads(questions_json)
                    print(all_questions)
                except Exception as e:
                    print(f"Error parsing the response: {e}")
                    return None
        
        question_id = lastID('quizzes')
        if not isinstance(question_id, int):
            raise ValueError(f"Invalid question ID returned by lastID: {question_id}")
        quiz = {
            "id": question_id ,
            "title": title,
            "lesson_id": lesson_id,
            "generated_by": author,
            "generated_by_name": username,
            "type": question_type,
            "questions": all_questions,
            "createdAt": datetime.now()
        }
        inserted_quiz_id = insert_Quizzes(quiz)
        if isinstance(inserted_quiz_id, ObjectId):
            print(f"Questions générées et insérées avec succès. ID du quiz : {str(inserted_quiz_id)}")
            quiz["_id"] = str(inserted_quiz_id)
            quiz["lesson_id"] = str(quiz["lesson_id"])
            return quiz
        else:
            raise ValueError("Erreur lors de l'insertion du quiz.")
    except Exception as e:
        print(f"Erreur lors de la génération des questions : {e}")
        return None

def generate_flashcards(lesson_id):
    """
    Fetches a lesson by lesson_id,
    sends it to the Groq API to generate flashcards based on the flashcards_prompt,
    parses the result as a list, and returns it.
    """
    try:
        lesson_id = ObjectId(lesson_id)
        lesson = Fetch_Lesson(lesson_id)
        if not lesson:
            raise ValueError("Lesson not found")
        content = lesson.get('content')
        if not content:
            raise ValueError("Lesson content is empty")
        # Extract first 10000 characters
        content_excerpt = content[:10000]
        # Format prompt with content excerpt
        prompt = flashcards_prompt.format(content=content_excerpt)
        # Call Groq API
        completion = groq_client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "system", "content": "You are an expert flashcard generator."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1500,
        )
        response_text = completion.choices[0].message.content.strip()
        # Print the full response for debugging
        # Check if the response is a type of array
        if isinstance(response_text, list):
            flashcards = response_text
        else:
            try:
                # Find the start and end of the JSON-like structure
                start_index = response_text.find('[')
                end_index = response_text.rfind(']') + 1

                if start_index == -1 or end_index == 0:
                    raise ValueError("Invalid response format - no list found")
                # Extract the JSON-like string
                json_str = response_text[start_index:end_index]
                flashcards = json.loads(json_str)
            except Exception as e:
                print(f"Error parsing the response: {e}")
                return None
        # Validate flashcards structure
        if not isinstance(flashcards, list):
            raise ValueError("Flashcards data is not a list")
        for card in flashcards:
            if not isinstance(card, dict):
                raise ValueError("Each flashcard must be a dictionary")
            if 'front' not in card or 'back' not in card:
                raise ValueError("Flashcard missing 'front' or 'back' keys")
        return flashcards
    except Exception as e:
        print(f"Error generating flashcards from lesson: {e}")
        return None
    