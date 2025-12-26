import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../Dashboard/Dashboard";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import Login from "../Login/Login";
import Temple from "../main/temple/Temple";
// import Users from "../pages/Users/Users";
// import Settings from "../pages/Settings/Settings";
// import NotFound from "../pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        element: <ProtectedRoute />, // 👈 content guard
        children: [
          { index: true, element: <Dashboard /> },
          { path: "temple", element: <Temple /> },
        ],
      },
    ],
  },

  //   { path: "*", element: <NotFound /> },
]);
