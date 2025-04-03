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
  console.log('Creating group with data:', groupData); // Debug log

  try {
    console.log('Payload:', {
      group_name: groupData.name,
      prof_id: user.uid,
      description: groupData.description,
    });
    const response = await axios.post('https://prepgenius-backend.vercel.app/api/groups', {
      group_name: groupData.name,
      prof_id: user.uid,
      description: groupData.description,
    });

    console.log('Group created successfully:', response.data); // Debug log
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

// Generate and return an invitation link for a group
export const generateInviteLink = async (user, groupId) => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await axios.post(
      'https://prepgenius-backend.vercel.app/api/generate-invite-link',
      {
        prof_id: user.uid,
        group_id: groupId
      },
      {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc0MzAzMTkwNiwianRpIjoiNTRkNmY3M2MtNzZlMi00NGNjLWJhODctMDVkMWJhZjAwMDQyIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjdlRGJWbUZjdENUcDhpdE0zRUtxM3p3SG94MzIiLCJuYmYiOjE3NDMwMzE5MDYsImNzcmYiOiIxZGI3MGJmMC1jYmQ2LTQ5NzEtYWNhZC04NjY3ZWY1ZGZlOGQiLCJleHAiOjE3NDMwNDI3MDZ9.oaYROnSJiph00wmeC4EZW3IZYtDuoS1FYTTWsG93xEw`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.data || !response.data.invite_link) {
      throw new Error('Failed to generate invitation link');
    }

    return response.data.invite_link;
  } catch (error) {
    console.error('Error generating invitation link:', error);
    throw new FetchError(`Error generating invitation link: ${error.message}`);
  }
};

// Copy invitation link to clipboard
export const copyInviteLink = async (user, groupId) => {
  try {
    const inviteLink = await generateInviteLink(user, groupId);
    
    await navigator.clipboard.writeText(inviteLink);
    return true; // Successfully copied to clipboard
  } catch (error) {
    console.error('Error copying invitation link:', error);
    throw error;
  }
};

class FetchError extends Error {
  constructor(message) {
    super(message);
    this.name = 'FetchError';
  }
}
