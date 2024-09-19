import axios from 'axios';

export const addUser = async (username: string, avatar: string) => {
  try {
    const response = await axios.post('http://localhost:4200/api/user/add', {
      username,
      avatar
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to add user');
    }
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};
