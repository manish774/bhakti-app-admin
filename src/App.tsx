// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import { UserContext, useUser } from "./context/UserContext";
// import Login from "./component/Login/Login";
// import Home from "./component/Home/Home";
// import TempleForm from "./component/TempleForm/TempleForm";
// import ProtectedRoute from "./component/ProtectedRoute/ProtectedRoute";

// const AppRoutes = () => {
//   const { state } = useUser();
//   const isLoggedIn = state.meta.email && state.meta.email.trim() !== "";

//   // Show loading screen while checking authentication
//   if (state.isLoading) {
//     return (
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//           fontSize: "18px",
//         }}
//       >
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <Routes>
//       <Route
//         path="/login"
//         element={isLoggedIn ? <Navigate to="/home" replace /> : <Login />}
//       />
//       <Route
//         path="/home"
//         element={
//           <ProtectedRoute>
//             <Home />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/add-temple"
//         element={
//           <ProtectedRoute>
//             <TempleForm />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/"
//         element={
//           isLoggedIn ? (
//             <Navigate to="/home" replace />
//           ) : (
//             <Navigate to="/login" replace />
//           )
//         }
//       />
//     </Routes>
//   );
// };

// const App = () => {
//   return (
//     <UserContext>
//       <Router>
//         <div>
//           <AppRoutes />
//         </div>
//       </Router>
//     </UserContext>
//   );
// };

// export default App;

import { RouterProvider } from "react-router-dom";
import { router } from "./component/routes/Routes";
import { UserContext } from "./context/UserContext";
import { NotificationProvider } from "./context/Notification";
import GeneralContext from "./context/general-context/GeneralContext";

const App = () => {
  return (
    <GeneralContext>
      <UserContext>
        <NotificationProvider>
          <RouterProvider router={router} />
        </NotificationProvider>
      </UserContext>
    </GeneralContext>
  );
};

export default App;
