import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedLayout = ({ authentication = true, allowRoles, denyRoles }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userRole = useSelector((state) => state.auth.role);

  // Redirect to login if not authenticated
  if (authentication && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to home if already authenticated and accessing public routes (optional)
  if (!authentication && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Role-based checks
  if (allowRoles && !allowRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (denyRoles && denyRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Render child routes
  return <Outlet />;
};

export default ProtectedLayout;
