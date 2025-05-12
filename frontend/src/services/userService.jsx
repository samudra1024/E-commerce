import axios from "axios";

// Updating user profile with authenticated requests
export const updateUserProfile = async (userData, token) => {
  try {
    const response = await axios.put("/api/users/profile", userData, {
      headers: { Authorization: token },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Getting user profile with authenticated requests
export const getUserProfile = async () => {
  try {
    const response = await axios.get("/api/users/profile");
    return response.data;
  } catch (error) {
    throw error;
  }
};
