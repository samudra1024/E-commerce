import axiosInstance from '../config/axios';
import AuthContext from "../context/AuthContext";
import { useContext } from "react";

// Get token from AuthContext to include in API requests with authentication header

// Fetch all products
export const getProductById = async (productId) => {
  const response = await axiosInstance.get(`/api/products/${productId}`);
  return response.data;
};

// Update product details
export const updateProduct = async (productId, productData) => {
  const response = await axiosInstance.put(`/api/products/${productId}`, productData);
  return response.data;
};

// Delete product
export const addProductReview = async (productId, reviewData) => {
  try {
    const response = await axiosInstance.post(
      `/api/products/${productId}/reviews`,
      reviewData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createProduct = async (productData) => {
  const response = await axiosInstance.post("/api/products", productData);
  return response.data;
};
