from flask import request
from flask_jwt_extended import  create_access_token
import os
# function  to create JWT token 
def create_token(user_identity):
    access_token = create_access_token(identity=user_identity)
    return access_token
#function to check the request body [file/image/]:
def get_file_type(file_path):
    #Get the file extension
    _, ext = os.path.splitext(file_path)
    
    # Map extensions to file types
    ALLOWEDd_EXTENSIONS = {
        '.pdf': 'file',
        '.docx': 'file',
        '.txt': 'file',
        '.jpg': 'img',
        '.jpeg': 'img',
        '.png': 'img',
    }
    
    # Return the corresponding file type or None if not found
    return ALLOWEDd_EXTENSIONS.get(ext, None)

def check_request_body():
        if 'file' in request.form:
            file_type=get_file_type(request.form['file'])
            return file_type
        elif 'text' in request.form:
            return "text"
       
 