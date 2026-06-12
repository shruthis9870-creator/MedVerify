import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  allowedRole,
  children,
}) {

  const { role } = useAuth();

  if (role !== allowedRole) {
    return <Navigate to="/role" />;
  }

  return children;
}