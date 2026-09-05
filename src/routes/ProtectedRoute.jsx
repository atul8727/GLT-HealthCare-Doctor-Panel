import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROLES } from "../constants/roles";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (user?.role && user.role.toLowerCase() !== ROLES.DOCTOR.toLowerCase()) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-6">
        <div>
          <p className="text-lg font-bold text-navy">Access Denied</p>
          <p className="text-sm text-muted mt-1">Your role does not have access to the Doctor Portal.</p>
        </div>
      </div>
    );
  }

  return children;
}
