import axios from 'axios';
// Function to get the JWT token from the backend and takes  uid as a parameter
const getJWT = async (uid) => {
  try {
    const response = await axios.post('https://prepgenius-backend.vercel.app/api/auth', { uid: uid }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data.access_token;
  } catch (error) {
    console.error(error);
  }
};

// Helper function to check if a JWT token is expired
export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return true;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    const { exp } = JSON.parse(jsonPayload);
    if (!exp) return true;
    // exp is in seconds, Date.now() in ms
    return Date.now() >= exp * 1000;
  } catch (e) {
    console.error('Failed to parse token', e);
    return true;
  }
};

export default getJWT;
