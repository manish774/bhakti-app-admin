import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import Login from "../Login/Login";
import Temple from "../main/temple/Temple";
import Packages from "../main/packages/Packages";
import Events from "../main/events/Events";
import CreateEvent from "../main/events/CreateEvent";
import CoreEvents from "../main/coreEvents/CoreEvents";
import CreateCoreEvent from "../main/coreEvents/CreateCoreEvent";
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
          { path: "createEvent", element: <CreateEvent /> },
          { path: "coreevents", element: <CoreEvents /> },
          { path: "coreevents/create", element: <CreateCoreEvent /> },
          { path: "bookings", element: <Booking /> },
          { path: "events/createEvent", element: <CreateEvent /> },
        ],
      },
    ],
  },

  //   { path: "*", element: <NotFound /> },
]);
