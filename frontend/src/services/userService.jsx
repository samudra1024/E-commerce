
import axios from "axios";

// Updating user profile with authenticated requests
export const updateUserProfile = async (userData, token) => {
  const response = await axios.put(
    "/api/users/profile",
    userData,
    {
      headers: { Authorization: token },
    }
  );
  return response.data;
};

// Getting user profile with authenticated requests
export const getUserProfile = async (token) => {
  const response = await axios.get(
    "/api/users/profile",
    {
      headers: { Authorization: token },
    }
  );
  return response.data;
};
