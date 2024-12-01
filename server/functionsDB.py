from pymongo import MongoClient
from data import userDa

# Connect to MongoDB
client = MongoClient("mongodb+srv://achipo2005:Ad05@cluster0.gqk0t.mongodb.net/")
db = client["databaseP"]

def insert_users(userDa):
    try:
        collection = db["users"]
        user = userDa
        result = collection.insert_one(user)
        print("User inserted with ID:", result.inserted_id)
    except Exception as e:
        print("Error inserting user:", e)

def display_users():
    try:
        collection = db["users"]
        for user in collection.find():
            print(user)
    except Exception as e:
        print("Error displaying users:", e)

insert_users(userDa)
display_users()

"""def insertLessons:
    collection=db["lessons"]
    lesson={"content":,"lesson-url":,"language":,"createdAt":}
    result=collection.insert_one(lesson)
    print("lesson inserte",result.inserted_id)
def affiLessons:
    collection=db["lessons"]
    for lesson in collection.find():
        print (lesson)
def insertQuizzes:
    collection=db["quizzes"]
    quizz={"questinId":,"questions":,"type":,"createdAt":,"updatedAt":}
    result=collection.insert_one(quizz)
    print("quizz inserte",result.inserted_id)
def affiQuizzes:
    collection=db["quizzes"]
    for quizze in collection.find():
        print (quizze)
def insertquizzResults:
    collection=db["quizzResult"]
    quizzResult={"userId":,"quizId":,"score":,"attemptDate":,"updatedAt":}
    result=collection.insert_one(quizzResult)
    print("quizzResult inserte",result.inserted_id)
def affiquizzeResults:
    collection=db["quizzResult"]
    for quizzResult in collection.find():
        print (quizzResult)
def insertfeedback:
    collection=db["feedback"]
    feedback={"userId":,"lessonId":,"comment":,"rating":,"createdAt":}
    result=collection.insert_one(quizzResult)
    print("feedback inserted",result.inserted_id)
def affifeedback:
    collection=db["feedback"]
    for feedback in collection.find():
        print (feedback)"""
