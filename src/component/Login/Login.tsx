import React, { useMemo } from "react";
import "./Login.css";
import Services from "../../services/Services";
import { useUser } from "../../context/UserContext";
const Login = () => {
  const ctx = useUser();

  const [loginDetails, setLoginDetails] = React.useState({
    email: "manishranbir774@gmail.com",
    password: "Hello1*#",
  });

  const service = useMemo(() => Services.getInstance(), []);
  const handleLogin = async () => {
    try {
      const result = await service.login(loginDetails);
      const userData = (result.data as Record<string, unknown>)?._doc as Record<
        string,
        unknown
      >;
      ctx.dispatch({
        type: "loginDetails",
        payload: {
          meta: {
            name: (userData?.name as string) || "",
            email: (userData?.email as string) || "",
          },
          isLoading: false,
        },
      });
      console.log("login success userData:", userData);
      // Navigate to home after successful login.
      // Delay navigation by a microtask to ensure context state is updated
      // before ProtectedRoute checks it (avoids immediate redirect back).
      window.location.reload();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Admin Login</h2>
        <input
          className="login-input"
          type="text"
          placeholder="Email"
          onChange={(e) =>
            setLoginDetails({ ...loginDetails, email: e.target.value })
          }
          defaultValue={loginDetails.email}
        />
        <input
          className="login-input"
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setLoginDetails({ ...loginDetails, password: e.target.value })
          }
          defaultValue={loginDetails.password}
        />
        <button className="login-button" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
