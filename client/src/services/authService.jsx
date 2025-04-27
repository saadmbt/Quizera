import axios from 'axios';
// Function to get the JWT token from the backend and takes  uid as a parameter
   const getJWT = async (uid) => {
    try{
      const response = await axios.post('https://prepgenius-backend.vercel.app/api/auth',{uid:uid},{
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data.access_token ;
      } catch (error) {
        console.error(error);
      }
    }
export default getJWT;