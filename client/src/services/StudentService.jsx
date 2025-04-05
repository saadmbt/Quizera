import axios from "axios";
// uploade file or image or text to the server and create a lesson in the database , 
// return the lesson objectID
export const uploadLesson = async (data,title,type) => {
  const formData = new FormData();
  if (type === 'file') {
    formData.append('file', data);
    formData.append('title', title);
  }
  if (type === 'text') {
    formData.append('text', data);
    formData.append('title', title);
  }
  try {
    const response = await axios.post("https://prepgenius-backend.vercel.app/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}
// generate Quiz 
export const generateQuiz = async (LessonID,type,number,difficulty) => {
  try {
    const response = await axios.post("https://prepgenius-backend.vercel.app/api/create_quiz",
     {
      "lesson_id":LessonID,
      type,
      number,
      difficulty
      });
    return response.data;
    } catch (error) {
      console.error("Error generating quiz:", error);
      throw error;
    }
}
