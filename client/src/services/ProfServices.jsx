import axios from "axios";

// Fetch groups for a professor
export const fetchProfessorGroups = async (user) => {
  try {
    console.log('Fetching groups for professor:', user.uid); // Debug log
    const response = await axios.get(
      `https://prepgenius-backend.vercel.app/api/groups/${user.uid}`
    );
    console.log('Groups fetched successfully:', response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error('Error fetching professor groups:', error);
    throw error;
  }
};

// Fetch groups for a student
export const fetchStudentGroups = async (studentUid) => {
  try {
    const response = await axios.get(
      `https://prepgenius-backend.vercel.app/api/student-groups/${studentUid}`
    );
    return response.data; // Returns the list of groups
  } catch (error) {
    console.error(
      "Error fetching student groups:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const createGroup = async (groupData, user) => {
  try {
    // const token = localStorage.getItem('authToken');
    // console.log('Auth Token:', token);
      console.log('Payload:', {
      group_name: groupData.name,
      prof_id: user.uid,
      description: groupData.description,
    });
    const response = await axios.post('https://prepgenius-backend.vercel.app/api/groups', {
      group_name: groupData.name,
      prof_id: user.uid,
      description: groupData.description,
    }
    // {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
   //}
     );

    return response.data;
  } catch (error) {
    console.error('Error creating group:', error);
    throw error;
  }
};

// Add a student to a group
export const addStudentToGroup = async (groupId, studentUid) => {
  try {
    const response = await axios.post(
      `https://prepgenius-backend.vercel.app/api/groups/${groupId}/add-student`,
      { student_uid: studentUid }
    );
    return response.data; // Returns success message
  } catch (error) {
    console.error(
      "Error adding student to group:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Get a specific group by group ID and professor ID
export const getGroupById = async (groupId, profId) => {
  try {
    const response = await axios.get(
      `https://prepgenius-backend.vercel.app/api/groups/${groupId}/${profId}`
    );
    return response.data; // Returns the group details
  } catch (error) {
    console.error(
      "Error fetching group:",
      error.response?.data || error.message
    );
    throw error;
  }
};

