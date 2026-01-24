import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Services from "../../services/Services";
import { useUser } from "../../context/UserContext";

const Login = () => {
  const ctx = useUser();
  const navigate = useNavigate();

  const [loginDetails, setLoginDetails] = React.useState({
    email: "manishranbir774@gmail.com",
    password: "Hello1*#",
  });

  useEffect(() => {
    if (ctx?.state.meta.email) {
      console.log(ctx);
      navigate("/");
    }
  }, [ctx?.state.meta, navigate, ctx]);

  const service = useMemo(() => Services.getInstance(), []);

  const handleLogin = async () => {
    try {
      const result = await service.login(loginDetails);
      const userData = (result.data as any)?._doc;

      ctx.dispatch({
        type: "loginDetails",
        payload: {
          //@ts-expect-error err
          meta: {
            name: userData?.name || "",
            email: userData?.email || "",
          },
          isLoading: false,
        },
      });

      // ✅ Redirect to dashboard
      navigate("/", { replace: true });
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
          value={loginDetails.email}
          onChange={(e) =>
            setLoginDetails({ ...loginDetails, email: e.target.value })
          }
        />

        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={loginDetails.password}
          onChange={(e) =>
            setLoginDetails({ ...loginDetails, password: e.target.value })
          }
        />

        <button className="login-button" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
