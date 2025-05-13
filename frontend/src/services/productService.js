import axiosInstance from "../config/axios";

// Fetch product by ID (no authentication required)
export const getProductById = async (productId) => {
  const response = await axiosInstance.get(`/api/products/${productId}`);
  return response.data;
};

// Update product details (requires admin token)
export const updateProduct = async (productId, productData, token, isAdmin) => {
  if (!isAdmin) {
    throw new Error("Unauthorized, not admin");
  }
  const response = await axiosInstance.put(
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
  const response = await axiosInstance.post(
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
