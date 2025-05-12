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
  const response = await axios.post("/api/orders", orderData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// Get order by ID
export const getOrderById = async (orderId) => {
  const response = await axios.get(`/api/orders/${orderId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// Get user's orders
export const getMyOrders = async () => {
  const response = await axios.get("/api/orders/myorders", {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// Cancel order
export const cancelOrder = async (orderId) => {
  const response = await axios.put(
    `/api/orders/${orderId}/cancel`,
    {},
    {
      headers: getAuthHeaders(),
    }
  );
  return response.data;
};

// Update order to paid
export const updateOrderToPaid = async (orderId, paymentResult) => {
  const response = await axios.put(
    `/api/orders/${orderId}/pay`,
    paymentResult,
    {
      headers: getAuthHeaders(),
    }
  );
  return response.data;
};

// Update order to delivered
export const updateOrderToDelivered = async (orderId) => {
  const response = await axios.put(
    `/api/orders/${orderId}/deliver`,
    {},
    {
      headers: getAuthHeaders(),
    }
  );
  return response.data;
};

// Update order status
export const updateOrderStatus = async (orderId, status, trackingNumber) => {
  const response = await axios.put(
    `/api/orders/${orderId}/status`,
    { status, trackingNumber },
    { headers: getAuthHeaders() }
  );
  return response.data;
};
