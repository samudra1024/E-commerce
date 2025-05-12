import axiosInstance from '../config/axios';

// Updating user profile with authenticated requests
export const updateUserProfile = async (userData) => {
  const response = await axiosInstance.put("/api/users/profile", userData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// Getting user profile with authenticated requests
export const getUserProfile = async () => {
  const response = await axiosInstance.get("/api/users/profile");
  return response.data;
};
