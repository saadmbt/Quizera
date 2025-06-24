# Quizera

Quizera is a powerful, AI-driven educational platform designed to transform the way students learn and educators teach. By combining advanced artificial intelligence with a user-friendly interface, Quizera empowers learners to create and take personalized quizzes, generate full exams instantly, and access targeted study resources — all with just a few clicks.

Whether you're a student aiming to strengthen your understanding of a topic, a teacher preparing custom assessments, or a team collaborating on study material, Quizera adapts to your needs. The platform supports multiple content formats including PDFs, Word documents, images, and plain text, allowing users to effortlessly generate high-quality quizzes in any language or subject.

Quizera goes beyond traditional quiz platforms by offering adaptive learning that responds to performance, additional study resources like flashcards and YouTube video suggestions, and real-time collaboration tools. With secure user authentication, responsive design, and intelligent content generation, Quizera is built to save you time, boost comprehension, and make learning more engaging and effective. 

## Features

- **Personalized Quizzes**: Generate quizzes based on user input and preferences.
- **Adaptive Learning**: Adjust the difficulty level of quizzes based on user performance.
- **AI Integration**: Utilizes AI models for question generation, natural language processing.
- **User Authentication**: Secure user authentication using Firebase Auth.
- **Responsive Design**: Built with React and Tailwind CSS for a seamless user experience across devices.
- **Flexible Input Options**: Upload any document type including PDFs, Word files, text, and images to generate quizzes automatically.
- **Collaboration**: Invite friends, classmates, or colleagues to collaborate on quizzes and share knowledge.
- **Instant Exam Generation**: Quickly create professional multiple-choice, true or false, and short-answer exams in any subject and language.
- **Accurate Questions**: The platform crafts relevant, challenging questions that truly test understanding.
- **Time Saving**: Automates quiz creation, saving hours of manual work.
- **Extra Ressources**: Offers additional resources such as Flashcards, YouTube video tutorials to support learning base on the user's input content after the quiz is completed.


## Tech Stack

- **Frontend**: 
  - HTML/CSS/JavaScript
  - React.js 
  - Tailwind CSS
  - Vite
  - Framer Motion

- **Backend**: 
  - Python (Flask)
  - MongoDB (NoSQL)
  - Firebase Authentication
  - Azure Blob Storage

- **Models**: 
  - OCR (Tesseract)


- **APIs**: 
  - Groq API 
  - YouTube Data API

- **Storage**: 
  - Azure Blob Storage

- **Deployment**: 
  - Vercel

## Getting Started

### Prerequisites

- Node.js (for the frontend)
- Python 3.x (for the backend)
- MongoDB Atlas account
- Firebase project with service account credentials
- Azure Blob Storage account (optional, for file storage)

### Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/saadmbt/Quizera.git
    cd Quizera
    ```

2. **Set up the backend**:
    Navigate to the server directory and install dependencies:
    ```bash
    cd server
    pip install -r requirements.txt
    ```

3. **Configure backend environment variables**:
    Create a `.env` file in the `server` directory with the following variables:
    ```
    SERVICE_ACCOUNT_KEY=<your Firebase service account JSON as a single line string>
    JWT_TOKEN_SECRET=<your JWT secret key>
    DropBox_access_token=<your Dropbox access token (optional)>
    ```

4. **Run the backend server**:
    ```bash
    python main.py
    ```

5. **Set up the frontend**:
    Navigate to the client directory and install dependencies:
    ```bash
    cd ../client
    npm install
    ```

6. **Run the frontend development server**:
    ```bash
    npm start
    ```

## Project Structure

### Client (Frontend)

- Built with React (Create React App) and Tailwind CSS.
- Uses Vite for bundling and development.
- Contains components for authentication, dashboard, quizzes, groups, and landing pages.
- Supports multilingual UI and responsive design.

### Server (Backend)

- Python Flask API with JWT authentication integrated with Firebase Auth.
- Provides endpoints for user authentication, lesson upload (text, file, image), quiz creation and management, flashcards, YouTube suggestions, group management, quiz assignments, student quiz attempts, performance tracking, and notifications.
- Uses MongoDB Atlas for data storage.
- Supports file storage with Azure Blob Storage.
- CORS configured for frontend URLs.

