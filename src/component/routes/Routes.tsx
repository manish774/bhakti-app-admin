import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import Login from "../Login/Login";
import Temple from "../main/temple/Temple";
import Packages from "../main/packages/Packages";
import Events from "../main/events/Events";
import CreateEvent from "../main/events/CreateEvent";
import Booking from "../main/Bookings/Booking";

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
          { index: true, element: <Events /> },
          { path: "temple", element: <Temple /> },
          { path: "packages", element: <Packages /> },
          { path: "events", element: <Events /> },
          { path: "events/createEvent", element: <CreateEvent /> },
          { path: "bookings", element: <Booking /> },
        ],
      },
    ],
  },

  //   { path: "*", element: <NotFound /> },
]);
