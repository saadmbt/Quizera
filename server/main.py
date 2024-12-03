from flask import Flask,request,jsonify
from dotenv import load_dotenv
import os
from flask_cors import CORS

# Load environment variables from .env file
load_dotenv()

# Initialize Flask application
app=Flask(__name__)
CORS(app)
@app.route('/')
def index():
    return "Hello, World!"
@app.route('/upload',method='POST')
def uplaod_file():
    # Get the uploaded file
    file = request.files['file']
    # save the file to the local folder
    file.save(os.path.join(os.getcwd(), 'uploads', file))
    # file  handller 
    
    # Save the file to the googel cloud 
    return 'hello'
if __name__ =="__main__":
    app.run(debug=True)