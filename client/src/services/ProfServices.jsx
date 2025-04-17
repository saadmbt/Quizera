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
    const response = await axios.post('https://prepgenius-backend.vercel.app/api/groups', {
      group_name: groupData.name,
      description: groupData.description,
      prof_id: user.uid
    });

    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to create group');
    }

    return {
      group_id: response.data.group_id,
      success: true,
      message: response.data.message
    };
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
    console.log('Generating invite link for group:', groupId); 
    if (!groupId) {
      throw new Error('Group ID is required');
    }
    const response = await axios.post(
      'https://prepgenius-backend.vercel.app/api/generate-invite-link',
      {
        group_id: groupId,
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.status !== 200 || !response.data.invite_link) {
      throw new Error(response.data.error || 'Failed to generate invitation link');
    }

    return response.data.invite_link;
  } catch (error) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Failed to generate invitation link');
  }
};

// Copy invitation link to clipboard
export const copyInviteLink = async (user, groupId) => {
  if (!groupId) {
    throw new Error('Group ID is required');
  }

  try {
    const inviteLink = await generateInviteLink(user, groupId);
    if (!inviteLink) {
      throw new Error('Failed to generate invitation link');
    }
    
    await navigator.clipboard.writeText(inviteLink);
    return true;
  } catch (error) {
    console.error('Error copying invitation link:', error);
    throw new Error(error.message || 'Failed to copy invitation link');
  }
};

class FetchError extends Error {
  constructor(message) {
    super(message);
    this.name = 'FetchError';
  }
}
// share Quiz
export const shareQuiz = async (quizId) => {
  try {
    const response = await axios.post("https://prepgenius-backend.vercel.app/api/share_quiz", {
      quiz_id: quizId
    });
    return response.data;
  } catch (error) {
    console.error("Error sharing quiz:", error);
    throw error;
  }
};

// Preview quiz details before sharing
export const previewQuiz = async (quizId) => {
  try {
    const response = await axios.get(
      `https://prepgenius-backend.vercel.app/api/quiz-preview/${quizId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching quiz preview:', error);
    throw error;
  }
};