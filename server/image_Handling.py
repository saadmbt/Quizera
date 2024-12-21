from dotenv import load_dotenv
import os
import base64
import requests
# Load environment variables from .env file
load_dotenv()
api_key=os.environ.get("OCR_API")  

# Function to get the image type
def get_image_type(file_path):
    #Get the file extension
    _, ext = os.path.splitext(file_path)
    
    # Map extensions to image types
    ALLOWEDd_EXTENSIONS = {
        '.jpg': 'jpg',
        '.jpeg': 'jpeg',
        '.png': 'png',
        '.webp': 'WEBP'
    }
    
    # Return the corresponding image type or None if not found
    return ALLOWEDd_EXTENSIONS.get(ext, None)

# Function to encode the image
def encode_image(image_path):
  with open(image_path, "rb") as image_file:
    return base64.b64encode(image_file.read()).decode('utf-8')

# Function to send the image 64 base to the OCR API to extract the text from it
def extract_text_from_image64base(file,type):
    payload = {'isOverlayRequired': True,
                'apikey': api_key,
                'base64Image':f"data:image/{type};base64,{file}",
            }
    # Sending the request to the API
    response= requests.post('https://api.ocr.space/parse/image',
                            data=payload,
                            headers={
                               "api_key":api_key
                            }
                            )
    return response.json().get('ParsedResults')[0].get('ParsedText', '')
#the main function 
def image_handler(image):
    # Getting the base64 string of the image
    image_64b=encode_image(image)
    # Getting the type of the image
    image_type=get_image_type(image)
    # Extracting the text from the image
    text=extract_text_from_image64base(image_64b,image_type)
    return text

# image='./files/ex11.png'
# print(image_handler(image))