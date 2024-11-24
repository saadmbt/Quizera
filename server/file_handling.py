import mimetypes

def file_handler(file):
    # Get the file path from the api
    # Get the type from file 
    file_type=mimetypes.guess_type(file)
    if file_type == 'pdf':
        return 'pdf'