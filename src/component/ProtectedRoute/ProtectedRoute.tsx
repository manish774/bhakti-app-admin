import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../../context/UserContext";

const ProtectedRoute = () => {
  const { state } = useUser();

  if (state.isLoading) {
    return <div style={{ padding: 40 }}>Checking authentication...</div>;
  }

  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
