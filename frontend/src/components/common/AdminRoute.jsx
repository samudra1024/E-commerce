import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const AdminRoute = () => {
  const { isAuthenticated, isAdmin, loading } = useContext(AuthContext);

  // Show loading while checking authentication
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Check if user is authenticated and is an admin
  if (!isAuthenticated() || !isAdmin()) {
    return <Navigate to="/" />;
  }

  // If authenticated and admin, render the child routes
  return <Outlet />;
};

export default AdminRoute;