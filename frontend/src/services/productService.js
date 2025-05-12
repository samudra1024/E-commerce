import axios from "axios";

// Fetch product by ID (no authentication required)
export const getProductById = async (productId) => {
  const response = await axios.get(`/api/products/${productId}`);
  return response.data;
};

// Update product details (requires admin token)
export const updateProduct = async (productId, productData, token, isAdmin) => {
  if (!isAdmin) {
    throw new Error("Unauthorized, not admin");
  }
  const response = await axios.put(
    `/api/products/${productId}`,
    productData,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return response.data;
};

// Create product review (requires user token)
export const createProductReview = async (productId, reviewData, token) => {
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