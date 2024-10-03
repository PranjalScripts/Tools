// src/ProtectedRoute.js
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../Auth/auth.js";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // Show loading while user is being fetched

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
