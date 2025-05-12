import axiosInstance from '../config/axios';

// Helper to get the latest token from sessionStorage
const getAuthToken = () => {
  const userStr = sessionStorage.getItem("user");
  if (userStr) {
    try {
      const token = JSON.parse(userStr)?.token ?? "";
      return token ? token : "";
    } catch {
      return "";
    }
  }
  return "";
};

// Helper to get auth headers
const getAuthHeaders = () => {
  const authToken = getAuthToken();
  return authToken ? { Authorization: authToken } : {};
};

// Create new order
export const createOrder = async (orderData) => {
  const response = await axiosInstance.post("/api/orders", orderData);
  return response.data;
};

// Get order by ID
export const getOrderById = async (orderId) => {
  const response = await axiosInstance.get(`/api/orders/${orderId}`);
  return response.data;
};

// Get user's orders
export const getMyOrders = async () => {
  const response = await axiosInstance.get("/api/orders/myorders");
  return response.data;
};

// Cancel order
export const cancelOrder = async (orderId) => {
  const response = await axiosInstance.put(`/api/orders/${orderId}/cancel`);
  return response.data;
};

// Update order to paid
export const payOrder = async (orderId) => {
  const response = await axiosInstance.put(`/api/orders/${orderId}/pay`);
  return response.data;
};

// Update order to delivered
export const deliverOrder = async (orderId) => {
  const response = await axiosInstance.put(`/api/orders/${orderId}/deliver`);
  return response.data;
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  const response = await axiosInstance.put(`/api/orders/${orderId}/status`, { status });
  return response.data;
};
