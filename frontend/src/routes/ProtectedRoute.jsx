import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({
  children,
  allowedRoles = [],
}) {
  const {
    user,
    isAuthenticated,
    loading,
  } = useAuth();

  // =====================================================
  // WAIT FOR AUTH
  // =====================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-slate-500 font-medium">
          Loading...
        </div>
      </div>
    );
  }

  // =====================================================
  // NOT LOGGED IN
  // =====================================================

  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // =====================================================
  // NORMALIZE ROLE
  // =====================================================

  const role = user?.role
    ?.toLowerCase()
    ?.trim();

  console.log("ProtectedRoute:");
  console.log("User:", user);
  console.log("Role:", role);
  console.log("Allowed Roles:", allowedRoles);

  // =====================================================
  // ROLE CHECK
  // =====================================================

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(role)
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;