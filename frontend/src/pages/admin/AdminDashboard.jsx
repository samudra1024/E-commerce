import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../config/axios';
import { ShoppingBag, Users, CreditCard, Package, TrendingUp, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    totalProducts: 0,
    recentOrders: [],
    lowStockProducts: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsRes = await axiosInstance.get("/api/users/admin/stats");
        console.log('This is the value : ',statsRes.data)
        setStats(statsRes.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
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
    <div className="p-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <h3 className="text-xl font-bold text-gray-900">{stats.totalOrders ?? 0}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Users className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <h3 className="text-xl font-bold text-gray-900">{stats.totalUsers ?? 0}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 text-orange-600">
              <CreditCard className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <h3 className="text-xl font-bold text-gray-900">
                ${Number(stats.totalRevenue ?? 0).toFixed(2)}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <Package className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <h3 className="text-xl font-bold text-gray-900">{stats.totalProducts ?? 0}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <Link
                to="/admin/orders"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {(stats.recentOrders ?? []).length === 0 ? (
                  <li className="py-5 text-gray-500">No recent orders.</li>
                ) : (
                  (stats.recentOrders ?? []).map((order) => (
                    <li key={order?._id || Math.random()} className="py-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {order?.user?.name ?? "Unknown"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {order?.createdAt
                              ? new Date(order.createdAt).toLocaleDateString()
                              : ""}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">
                            ${Number(order?.totalPrice ?? 0).toFixed(2)}
                          </span>
                          <span
                            className={`ml-4 px-3 py-1 rounded-full text-xs font-medium ${
                              order?.status === 'Processing'
                                ? 'bg-blue-100 text-blue-800'
                                : order?.status === 'Shipped'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {order?.status ?? "Unknown"}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Low Stock Products */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Low Stock Products</h2>
              <Link
                to="/admin/products"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {(stats.lowStockProducts ?? []).length === 0 ? (
                  <li className="py-5 text-gray-500">No low stock products.</li>
                ) : (
                  (stats.lowStockProducts ?? []).map((product) => (
                    <li key={product?._id || Math.random()} className="py-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {product?.name ?? "Unknown"}
                          </p>
                          <p className="text-sm text-gray-500">
                            Stock: {product?.countInStock ?? 0} units
                          </p>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          ${Number(product?.price ?? 0).toFixed(2)}
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;