import { Navigate } from "react-router-dom";

import { useApp } from "../context/AppContext";

export default function ProtectedRoute({ children, roles = [] }) {
  const { currentUser } = useApp();

  if (!currentUser) return <Navigate to="/login" replace />;
  if (roles.length && !roles.includes(currentUser.role)) {
    return <Navigate to={`/${currentUser.role}/dashboard`} replace />;
  }

  return children;
}
