import { Navigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { state } = useUser();

  // Check if user is logged in (has email)
  const isLoggedIn = state.meta.email && state.meta.email.trim() !== "";

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
