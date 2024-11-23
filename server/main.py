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