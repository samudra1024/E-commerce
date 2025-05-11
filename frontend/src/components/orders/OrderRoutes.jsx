import React from 'react';
import { Routes, Route } from 'react-router-dom';
import OrdersPage from '../../pages/OrdersPage';
import OrderDetailsPage from '../../pages/OrderDetailsPage.jsx';
import AdminOrders from '../../pages/admin/AdminOrders';
import PrivateRoute from '../common/PrivateRoute';
import AdminRoute from '../common/AdminRoute';

const OrderRoutes = () => {
  return (
    <Routes>
      <Route element={<PrivateRoute />}>
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetailsPage />} />
      </Route>
      
      <Route element={<AdminRoute />}>
        <Route path="/admin/orders" element={<AdminOrders />} />
      </Route>
    </Routes>
  );
};

export default OrderRoutes;