
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";

// Get token from AuthContext to include in API requests with authentication header

// Fetch all products
export const getProductById = async (productId) => {
  try {
    const response = await axios.get(`/api/products/${productId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update product details
export const updateProduct = async (productId, productData) => {
  try {
    const response = await axios.put(`/api/products/${productId}`, productData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete product
export const addProductReview = async (productId, reviewData) => {
  try {
    const response = await axios.post(
      `/api/products/${productId}/reviews`,
      reviewData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
