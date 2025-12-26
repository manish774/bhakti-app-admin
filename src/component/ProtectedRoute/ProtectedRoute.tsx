import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../../context/UserContext";

const ProtectedRoute = () => {
  const { state } = useUser();

  // ⛔ VERY IMPORTANT: wait for auth resolution
  if (state.isLoading) {
    return null; // or a spinner
  }

  const isLoggedIn =
    Boolean(state?.meta?.email) && state.meta.email.trim() !== "";

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
