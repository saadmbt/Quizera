from dotenv import load_dotenv
import os
import base64
import requests
# Load environment variables from .env file
load_dotenv()
api_key=os.environ.get("OCR_API")  

# Function to get the image type
def get_image_type(image_name):
    # Get the file extension
    _, ext = os.path.splitext(image_name)
    # Map extensions to image types
    ALLOWED_EXTENSIONS = {
        '.jpg': 'jpg',
        '.jpeg': 'jpeg',
        '.png': 'png',
        '.webp': 'webp'
    }
    
    # Return the corresponding image type or None if not found
    return ALLOWED_EXTENSIONS.get(ext.lower(), None)

# Function to encode the image
def encode_image(image_file):
    encoded = base64.b64encode(image_file).decode('utf-8')
    return encoded 

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
# # The main function to handle image processing
# def image_handler(image,image_name):
#     print("l45",len(image))
#     # Getting the base64 string of the image
#     image_64b = base64.b64encode(image).decode('utf-8')
#     print("imgl47 : ",len(image_64b))
#     if not image_64b:
#         raise ValueError("Base64 encoding of the image failed.")
#     # Getting the type of the image //ok
#     image_type = get_image_type(image_name)
#     print("imgl48 : ",image_type)
#     if image_type is None:
#         raise ValueError("Unsupported image type")
#     # Extracting the text from the  image64base
#     text = extract_text_from_image64base(image_64b, image_type)f
#     print("Extracted text: %s", text)
#     return text
def image_handler(image, image_name):
    if not image:
        raise ValueError(f"Image data is empty. Length: {len(image)}")

    try:
        image_64b = base64.b64encode(image).decode('utf-8')
    except Exception as e:
        raise ValueError(f"Base64 encoding failed: {e}")

    print("imgl47 : ", len(image_64b))

    if not image_64b:
        raise ValueError("Base64 encoding of the image failed.")

    image_type = get_image_type(image_name)
    print("imgl48 : ", image_type)

    if image_type is None:
        raise ValueError("Unsupported image type")

    text = extract_text_from_image64base(image_64b, image_type)
    print("Extracted text: %s", len(text))
    return text