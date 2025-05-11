import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../services/orderService';
import { Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(id);
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load order details');
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Order #{order._id}</h1>
            <div className={`px-4 py-2 rounded-full flex items-center ${
              order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
              order.status === 'Shipped' ? 'bg-orange-100 text-orange-800' :
              order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'
            }`}>
              {getStatusIcon(order.status)}
              <span className="ml-2">{order.status}</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shipping Information */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>Name:</strong> {order.user.name}</p>
                <p><strong>Address:</strong> {order.shippingAddress.address}</p>
                <p><strong>City:</strong> {order.shippingAddress.city}</p>
                <p><strong>Postal Code:</strong> {order.shippingAddress.postalCode}</p>
                <p><strong>Country:</strong> {order.shippingAddress.country}</p>
              </div>
            </div>

            {/* Payment Information */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Payment Information</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>Method:</strong> {order.paymentMethod}</p>
                <p><strong>Status:</strong> {order.isPaid ? 'Paid' : 'Not Paid'}</p>
                {order.isPaid && (
                  <p><strong>Paid At:</strong> {new Date(order.paidAt).toLocaleString()}</p>
                )}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            <div className="border rounded-lg overflow-hidden">
              {order.orderItems.map((item) => (
                <div key={item._id} className="flex items-center p-4 border-b last:border-b-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="ml-4 flex-1">
                    <Link to={`/product/${item.product}`} className="text-blue-600 hover:text-blue-800">
                      {item.name}
                    </Link>
                    <p className="text-gray-600">
                      {item.quantity} x ${item.price} = ${(item.quantity * item.price).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between py-2">
                <span>Items:</span>
                <span>${order.itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Shipping:</span>
                <span>${order.shippingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Tax:</span>
                <span>${order.taxPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 font-bold">
                <span>Total:</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;