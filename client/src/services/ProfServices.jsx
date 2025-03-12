import axios from "axios";
// Fetch groups for a professor
export const fetchProfessorGroups = async (profId) => {
  try {
    const response = await axios.get(`https://prepgenius-backend.vercel.app/api/professor-groups/${profId}`);
    return response.data; // Returns the list of groups
  } catch (error) {
    console.error('Error fetching professor groups:', error.response?.data || error.message);
    throw error;
  }
};

// Fetch groups for a student
export const fetchStudentGroups = async (studentUid) => {
  try {
    const response = await axios.get(`https://prepgenius-backend.vercel.app/api/student-groups/${studentUid}`);
    return response.data; // Returns the list of groups
  } catch (error) {
    console.error('Error fetching student groups:', error.response?.data || error.message);
    throw error;
  }
};

// Create a new group
export const createGroup = async (groupData) => {
  try {
    const response = await axios.post('https://prepgenius-backend.vercel.app/api/groups', groupData);
    return response.data; // Returns the created group ID
  } catch (error) {
    console.error('Error creating group:', error.response?.data || error.message);
    throw error;
  }
};

// Add a student to a group
export const addStudentToGroup = async (groupId, studentUid) => {
  try {
    const response = await axios.post(`https://prepgenius-backend.vercel.app/api/groups/${groupId}/add-student`, { student_uid: studentUid });
    return response.data; // Returns success message
  } catch (error) {
    console.error('Error adding student to group:', error.response?.data || error.message);
    throw error;
  }
};

// Get a specific group by group ID and professor ID
export const getGroupById = async (groupId, profId) => {
  try {
    const response = await axios.get(`https://prepgenius-backend.vercel.app/api/groups/${groupId}/${profId}`);
    return response.data; // Returns the group details
  } catch (error) {
    console.error('Error fetching group:', error.response?.data || error.message);
    throw error;
  }
};