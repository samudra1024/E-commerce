
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";

// Get token from AuthContext to include in API requests with authentication header

// Fetch all products
export const getProductById = async (productId) => {
  try {
    const response = await axios.get(`base_url/api/products/${productId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update product details
export const updateProduct = async (productId, productData) => {
  try {
    const response = await axios.put(`base_url/api/products/${productId}`, productData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete product
export const addProductReview = async (productId, reviewData) => {
  try {
    const response = await axios.post(
      `base_url/api/products/${productId}/reviews`,
      reviewData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
