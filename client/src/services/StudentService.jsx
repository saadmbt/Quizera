import axios from "axios";
// uploade file or image or text to the server and create a lesson in the database , 
// return the lesson objectID
export const uploadLesson = async (data, title, type) => {
  const formData = new FormData();
  // Add common fields
  formData.append('title', title);  
  // Add content based on type
  if (type === 'file') {
    formData.append('file', data, data.name); 
  } 
  else if (type === 'text') {
    formData.append('text', data); 
  }

  // Log form data for debugging
  for (let [key, value] of formData.entries()) {
    console.log('FormData:', key, value);
  }

  try {
    const response = await axios.post(
      'https://prepgenius-backend.vercel.app/api/upload', 
      formData, 
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          // "Authorization": `Bearer ${token}`
        },
      }
    );
    // Log the response for debugging
    console.log('Upload response:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    if (error.response) {
      // Server responded with error status
      throw new Error(error.response.data.message || 'Upload failed');
    } else if (error.request) {
      // No response received
      throw new Error('Network error - no response from server');
    } else {
      // Other errors
      throw new Error('Upload failed: ' + error.message);
    }
  }
}
// generate Quiz 
export const generateQuiz = async (quizsetup) => {
  try {
    const response = await axios.post("https://prepgenius-backend.vercel.app/api/create_quiz",
      quizsetup, {
        headers: {
          'Content-Type': 'application/json',
          // "Authorization": `Bearer ${token}`
        },
      });
    // Log the response for debugging
    console.log('Quiz generation response:', response.data);
    return response.data;
    } catch (error) {
      console.error("Error generating quiz:", error);
      throw error;
    }
}
// save the quiz result to the database 
export const saveQuizResult = async (result) => {
  try {
    const response = await axios.post("https://prepgenius-backend.vercel.app/api/quiz_results/insert",{result}, {
        headers: {
          'Content-Type': 'application/json',
          // "Authorization": `Bearer ${token}`
        },
      });
    // Log the response for debugging
    console.log('Quiz result saved:', response.data);
    return response.data;
  }
  catch (error) {
    console.error("Error saving quiz result:", error);
    throw error;
  }
}