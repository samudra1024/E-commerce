import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AdminRoute = ({ children, redirectTo = "/unauthorized" }) => {
  const { isAuthenticated, isAdmin } = useContext(AuthContext);

  if (!isAuthenticated()) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin()) {
    // Not an admin
    return <Navigate to={redirectTo} replace />;
  }

  // If children are provided, render them; otherwise, render nested routes (Outlet)
  return children ? children : <Outlet />;
};

export default AdminRoute;