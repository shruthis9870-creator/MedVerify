import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  allowedRole,
  children,
}) {

  const { isAuthReady, isAuthenticated, role } = useAuth();

  if (!isAuthReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-sm font-semibold text-cyan-100">
        Verifying session...
      </div>
    );
  }

  if (!isAuthenticated || role !== allowedRole) {
    return <Navigate to="/role" replace />;
  }

  return children;
}
