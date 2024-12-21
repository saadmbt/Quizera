from flask import request
from flask_jwt_extended import  create_access_token,get_jwt_identity
import os
import dropbox
#function to save the file or image to the deopbox storage and returns the shared link
def save_to_dropbox(access_token,file,filename):
    dropbox_path = '/' +filename 
    dbx = dropbox.Dropbox(access_token)
    # Upload the file to Dropbox
    # Read the content of the FileStorage object
    try:
        file_content = file.read()     
        dbx.files_upload(file_content, dropbox_path)
        # List shared links for the specified file
        shared_links_metadata = dbx.sharing_get_shared_links(path=dropbox_path)
        print("dd",shared_links_metadata)
        iterator = iter(shared_links_metadata.links)
        print("gg",iterator)
        for item in iterator:
            shared_link = item.url
            print('fff',shared_link)
            return shared_link

    except dropbox.exceptions.ApiError as e:
        print(f"Error retrieving shared links: {e}")
        return {"error": str(e)}
    # # Create a shared link for the uploaded file
    # shared_link_metadata = dbx.sharing_create_shared_link_with_settings(dropbox_path)
    # shared_link = shared_link_metadata.url

 
# function  to create JWT token 
def create_token(user_identity):
    access_token = create_access_token(identity=user_identity)
    return access_token
#function to check the request body [file/image/]:
def get_file_type(file_path):
    #Get the file extension
    _,ext = os.path.splitext(file_path.filename)
    
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
    return ALLOWEDd_EXTENSIONS.get(ext.lower(), None)

def check_request_body():
        if 'file' in request.files:
            file_type=get_file_type(request.files.get('file'))
            return file_type
        elif 'text' in request.form:
            return "text"
        else:
            return request.files
       
def refresh_token():
    current_user = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user)
    return str(new_access_token)