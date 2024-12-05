from file_handling import file_handler
from functionsDB import insert_Lessons ,lastID
fileT='./files/test2.pdf'
from datetime import datetime,timezone

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
    
    print(insert_Lessons(data))

test(fileT)