import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { Package, Truck, CheckCircle, AlertCircle, Clock, XCircle } from 'lucide-react';

const OrdersPage = () => {
  const { isAuthenticated, getToken } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      // If not authenticated, redirect to login page
      if (!isAuthenticated()) {
        setError('You must be logged in to view your orders.');
        setLoading(false);
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      try {
        const token = getToken ? getToken() : null;
        const response = await axios.get('/api/orders/myorders', {
          headers: token ? { Authorization: token } : {},
        });
        setOrders(response.data || []);
        setLoading(false);
      } catch (err) {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          setError('Session expired. Please login again.');
          setTimeout(() => navigate('/login'), 2000);
        } else if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError('Failed to load orders. Please try again later.');
        }
        setLoading(false);
      }
    };

    fetchOrders();
    // Only run on mount and when navigate changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const handleCancelOrder = async (orderId) => {
    if (!isAuthenticated()) {
      setError('You must be logged in to cancel orders.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    try {
      const token = getToken ? getToken() : null;
      await axios.put(`/api/orders/${orderId}/cancel`, {}, {
        headers: token ? { Authorization: token } : {},
      });
      // Update the order status in the UI
      setOrders(orders.map(order =>
        order._id === orderId
          ? { ...order, status: 'Cancelled' }
          : order
      ));
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        setError('Session expired. Please login again.');
        setTimeout(() => navigate('/login'), 2000);
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to cancel order. Please try again later.');
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Processing':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'Shipped':
        return <Truck className="h-5 w-5 text-orange-500" />;
      case 'Delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Shipped':
        return 'bg-orange-100 text-orange-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="mt-2 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="mt-1 text-sm text-gray-600">
            Track and manage your orders
          </p>
        </div>

        {(!orders || orders.length === 0) ? (
          <div className="p-6 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-sm text-gray-500">
              You haven't placed any orders yet.
            </p>
            <div className="mt-6">
              <Link
                to="/products"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {orders.map((order) => (
              <div key={order._id} className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">
                      Order #{order._id ? order._id.slice(-8) : 'N/A'}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className={`mt-2 sm:mt-0 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    <div className="flex items-center">
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{order.status}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {(order.orderItems && order.orderItems.length > 0) ? order.orderItems.map((item) => (
                    <div key={item._id || item.product || item.name} className="flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-20 w-20 object-cover rounded-lg"
                      />
                      <div className="ml-4 flex-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          <Link to={`/product/${item.product}`} className="hover:text-blue-600">
                            {item.name}
                          </Link>
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {(item.price * item.quantity)?.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}
                        </p>
                      </div>
                    </div>
                  )) : (
                    <div className="text-gray-500">No items in this order.</div>
                  )}
                </div>

                <div className="mt-6 border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      {order.itemsPrice?.toLocaleString(undefined, { style: 'currency', currency: 'USD' }) || '$0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {order.shippingPrice?.toLocaleString(undefined, { style: 'currency', currency: 'USD' }) || '$0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">
                      {order.taxPrice?.toLocaleString(undefined, { style: 'currency', currency: 'USD' }) || '$0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-medium mt-4 pt-4 border-t border-gray-200">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">
                      {order.totalPrice?.toLocaleString(undefined, { style: 'currency', currency: 'USD' }) || '$0.00'}
                    </span>
                  </div>
                </div>

                {order.status === 'Processing' && (
                  <div className="mt-6">
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <XCircle className="h-5 w-5 mr-2" />
                      Cancel Order
                    </button>
                  </div>
                )}

                {order.status === 'Shipped' && order.trackingNumber && (
                  <div className="mt-6 bg-blue-50 p-4 rounded-md">
                    <div className="flex">
                      <Truck className="h-5 w-5 text-blue-400" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">Tracking Information</h3>
                        <p className="mt-2 text-sm text-blue-700">
                          Tracking Number: {order.trackingNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
