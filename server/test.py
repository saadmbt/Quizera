from file_handling import file_handler
from functionsDB import insert_Lessons ,lastID
fileT='./files/test2.pdf'

def test(file):
    lesson_conten=file_handler(file)
    # Test the function with a sample data
    id=lastID('lessons')
    print('this is the lesson id ',id)

    data = { "id":id+1,
            "content":lesson_conten,
            "lesson-url":"www.saad.com",
            "language":"eng",
            "createdAt": "2024-01-05T09:00:00Z",
            "keyword":['api key master',"fhrgfhgsjdfh","fvudhsfvjdsh"]}
    
    print(insert_Lessons(data))

test(fileT)