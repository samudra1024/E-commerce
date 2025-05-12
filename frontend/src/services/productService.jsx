import axios from "axios";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";

// Get token from AuthContext to include in API requests with authentication header

// Fetch all products
export const getProductById = async (productId) => {
  const response = await axios.get(`/api/products/${productId}`);
  return response.data;
};

// Update product details
export const updateProduct = async (productId, productData , token , admin) => {

  // check token for admin access
  if (!admin) {
    throw new Error("Unauthorized, not admin");
  }
  console.log(productId);
  const response = await axios.put(`/api/products/${productId}`, productData, {
    headers: {
      Authorization: token,
    },
  });
  return response.data;
};

// Delete product
export const createProductReview = async (productId, reviewData) => {
  const { getToken, isAdmin } = useContext(AuthContext);
  const token = getToken();
  const response = await axios.post(
    `/api/products/${productId}/reviews`,
    reviewData,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return response.data;
};
