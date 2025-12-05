import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Services from "../../services/Services";
import { useUser } from "../../context/UserContext";
const Login = () => {
  const ctx = useUser();
  const navigate = useNavigate();
  const [loginDetails, setLoginDetails] = React.useState({
    email: "manishranbir774@gmail.com",
    password: "Querty&e@1",
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
      console.log(userData);
      // Navigate to home after successful login
      navigate("/home");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Email"
        onChange={(e) =>
          setLoginDetails({ ...loginDetails, email: e.target.value })
        }
        defaultValue={loginDetails.email}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setLoginDetails({ ...loginDetails, password: e.target.value })
        }
        defaultValue={loginDetails.password}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
