from groq import Groq
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()
client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),  
)

# Create a chat completion request with an image 
def generate_one_paragraph(text):
    completion = client.chat.completions.create( 
        model="gemma-7b-it",
        messages=[ 
            {"role": "system","content":"Based on the following list of strings, generate a single cohesive paragraph that encapsulates the main idea. Ensure the paragraph is structured in a way that it can be used to create quiz questions." },
            {"role": "user","content":text}
            ],
            max_tokens=5000,
            temperature=0.8,
        ) 
    return print(completion.choices[0].message.content)
# join all the strings with /n toghter

liststring=['Nowadays, many films, TV shows, books and music are published and produced in English. By understanding English, you wont need to rely on translations and subtitles anymore. By accessing these media, you will also continuously improve your English listening and reading skills.',
            'English is currently the language of the internet. An estimated of 565 million people use the internet every day and about 52 precent of the worlds most visited websites are displayed in English. Therefore, learning this language gives access to over half the content of the internet, which might not be available otherwise. Whether it is for fun or for work',
            'if you understand English, you will be able to exchange information with more people online and use many more materials.']
generate_one_paragraph('English gives access to more entertainment and more access to the internet',liststring)
