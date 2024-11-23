# PrepGenius

PrepGenius is an AI-powered educational platform that provides personalized learning experiences through quizzes and lessons. The application is designed to adapt to the user's learning pace and offers multilingual support.

## Features

- **Personalized Quizzes**: Generate quizzes based on user performance and preferences.
- **Multilingual Support**: Lessons and quizzes available in English, Arabic, and French.
- **AI Integration**: Utilizes AI models for question generation, natural language processing, and text extraction from images.
- **User  Authentication**: Secure user authentication using Firebase Auth or Auth0.
- **Responsive Design**: Built with React and Tailwind CSS for a seamless user experience across devices.

## Tech Stack

- **Frontend**: 
  - HTML/CSS/JavaScript
  - React.js
  - Tailwind CSS

- **Backend**: 
  - Python (Flask)

- **Database**: 
  - MongoDB (NoSQL)
  - MongoDB Atlas

- **AI/ML Models**: 
  - Hugging Face Transformers (BERT, T5)
  - PaddleOCR
  - spaCy
  - TensorFlow.js

- **APIs**: 
  - Google Translate API 
  - YouTube Data API

- **Storage**: 
  - AWS S3 / Google Cloud Storage

- **Deployment**: 
  -Vercel

## Getting Started

### Prerequisites

- Node.js (for the frontend)
- Python 3.x (for the backend)
- MongoDB Atlas account

### Installation

1. **Clone the repository**:
    ```bash
   git clone https://github.com/saadmbt/PrepGenius.git
   cd PrepGenius
2-**Set up the backend**:
     Navigate to the server directory:
        ```bash
        
               cd server
 install dependencies :
       ```bash
       
           pip install -r requirements.txt
3-**Set up the frontend**:

Navigate to the client directory:
      ```bash
      
      cd ../client

Install dependencies:
    ```bash
    
    npm install
