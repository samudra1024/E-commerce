import axios from "axios";


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
  try {
    const response = await axios.post("/api/orders", orderData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get order by ID
export const getOrderById = async (orderId) => {
  try {
    const response = await axios.get(`/api/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get user's orders
export const getMyOrders = async () => {
  try {
    const response = await axios.get("/api/orders/myorders");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Cancel order
export const cancelOrder = async (orderId) => {
  try {
    const response = await axios.put(`/api/orders/${orderId}/cancel`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update order to paid
export const payOrder = async (orderId) => {
  try {
    const response = await axios.put(`/api/orders/${orderId}/pay`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update order to delivered
export const deliverOrder = async (orderId) => {
  try {
    const response = await axios.put(`/api/orders/${orderId}/deliver`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axios.put(`/api/orders/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    throw error;
  }
};
