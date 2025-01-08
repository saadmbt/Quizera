from flask import request
from flask_jwt_extended import create_access_token, get_jwt_identity
import os
from dotenv import load_dotenv
from azure.storage.blob import BlobServiceClient
from datetime import datetime, timezone, timedelta
# Load credentials from environment variables
load_dotenv()
# function to save the file or image to the Dropbox storage and returns the shared link
# def save_to_dropbox(access_token, file, filename):
#     dropbox_path = '/' + filename 
#     print("L9", dropbox_path)
#     dbx = dropbox.Dropbox(access_token)
#     try:
#         # Check if the file already exists in Dropbox
#         try:
#             metadata = dbx.files_get_metadata(dropbox_path)
#             print(f"File {dropbox_path} already exists in Dropbox.")
            
#             # Get the shared link for the existing file
#             links = dbx.sharing_list_shared_links(path=dropbox_path).links
#             if links:
#                 shared_link_metadata = links[0]
#             else:
#                 shared_link_metadata = dbx.sharing_create_shared_link_with_settings(dropbox_path)
#             print("L20", shared_link_metadata.url)
#             return shared_link_metadata.url
#         except dropbox.exceptions.ApiError as e:
#             if e.error.is_path() and e.error.get_path().is_not_found():
#                 print(f"File {dropbox_path} does not exist in Dropbox. Proceeding with upload.")
#             else:
#                 raise
# # Read the content of the FileStorage object
#         file.seek(0)  # Reset file pointer to the beginning
#         file_content = file.read()
#         if not file_content:
#             raise ValueError("File content is empty")

#         # Upload the file to Dropbox
#         dbx.files_upload(file_content, dropbox_path)
        
#         # Create a shared link for the uploaded file
#         links = dbx.sharing_list_shared_links(path=dropbox_path).links
#         if links:
#             shared_link_metadata = links[0]
#         else:
#             shared_link_metadata = dbx.sharing_create_shared_link_with_settings(dropbox_path)
#         print("L23", shared_link_metadata.url)
#         shared_link = shared_link_metadata.url
#         return shared_link

#     except dropbox.exceptions.ApiError as e:
#         print(f"Error uploading file or creating shared link: {e}")
#         return {"error": str(e)}
#     except Exception as e:
#         print(f"An unexpected error occurred: {e}")
#         return {"error": str(e)}

# function to create JWT token 
def create_token(user_identity):
    access_token = create_access_token(identity=user_identity)
    return access_token

# function to check the request body [file/image/]:
def get_file_type(file_path):
    # Get the file extension
    _, ext = os.path.splitext(file_path.filename)
    
    # Map extensions to file types
    ALLOWED_EXTENSIONS = {
        '.pdf': 'file',
        '.docx': 'file',
        '.txt': 'file',
        '.pptx': 'file',
        '.jpg': 'img',
        '.jpeg': 'img',
        '.png': 'img',
    }
    
    # Return the corresponding file type or None if not found
    return ALLOWED_EXTENSIONS.get(ext.lower(), None)

def check_request_body():
    if 'file' in request.files:
        file_type = get_file_type(request.files.get('file'))
        return file_type
    elif 'text' in request.form:
        return "text"
    else:
        return request.files

def refresh_token():
    current_user = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user)
    return str(new_access_token)

# function to save the file or image to the Azure Blob storage and returns the shared link
def save_to_azure_storage(file, filename):
    # Load Azure Storage connection string from environment variables
    connection_string = os.environ.get('AZURE_STORAGE_CONNECTION_STRING')
    
    # Create a BlobServiceClient
    blob_service_client = BlobServiceClient.from_connection_string(connection_string)
    container_name = "mycontainer" 
    container_client = blob_service_client.get_container_client(container_name)
    # Create a BlobClient
    blob_client = container_client.get_blob_client(filename)
    # Generate the x-ms-date header for accurate timekeeping
    x_ms_date = get_utc_time_string()
    # Upload the file to Azure Blob Storage
    try:
        blob_client.upload_blob(file, overwrite=True,headers={"x-ms-date": x_ms_date})
        print(f"File {filename} uploaded to Azure Blob Storage.")
        
        # Generate the URL for the uploaded file
        blob_url = f"https://{blob_service_client.account_name}.blob.core.windows.net/{container_name}/{filename}"
        return blob_url
    except Exception as e:
        print(f"Error uploading file: {e}")
        return {"error": str(e)}

def get_utc_time_string():
    now = datetime.now(timezone.utc) 
    # Adjust for your GMT+1 timezone
    adjusted_time = now - timedelta(hours=1) 
    return adjusted_time.strftime("%a, %d %b %Y %H:%M:%S GMT")