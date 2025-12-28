import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../Dashboard/Dashboard";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import Login from "../Login/Login";
import Temple from "../main/temple/Temple";
import Packages from "../main/packages/Packages";
import Events from "../main/events/Events";

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
          { path: "packages", element: <Packages /> },
          { path: "events", element: <Events /> },
        ],
      },
    ],
  },

  //   { path: "*", element: <NotFound /> },
]);
