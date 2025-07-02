import axios from 'axios';
import { SessionExpiredDialog } from '../components/PopUpsUI/SessionExpiredPopup';
// Function to get the JWT token from the backend and takes  uid as a parameter
const getJWT = async (uid) => {
  try {
    const response = await axios.post('https://prepgenius-backend.vercel.app/api/auth', { uid: uid }, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // include cookies in requests
    });
    const token = response.data.access_token;
    if (token) {
      localStorage.setItem('access_token', token); // store token in localStorage
    }
    return token;
  } catch (error) {
    console.error(error);
  }
};

// Helper function to check if a JWT token is expired
export const isTokenExpired = (tokenData) => {
  //  Get current time in seconds (Unix timestamp)
  const currentTime = Math.floor(Date.now() / 1000);
  console.log("Current Time:", currentTime);
  console.log("Token Data:", tokenData.exp);
  // Check if token exists and has an expiration time
  if (!tokenData || !tokenData.exp) {
    console.error("Invalid token data or missing 'exp' field");
    return true;
  }

  // Compare expiration time with current time
  if (currentTime >= tokenData.exp) {
    console.log("Token expired. Redirecting to login...");
    return true;
  }

  console.log("Token is still valid.");
  return false;
};

export default getJWT;
