import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import Dashboard from "../Dashboard/Dashboard";
import Sidebar from "../Sidebar/Sidebar";
import "./Home.css";

const Home = () => {
  const { state, dispatch } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "logout" });
    navigate("/login");
  };

  return (
    <div>
      {/* Header Navigation */}
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Admin Dashboard</h2>
          <p style={{ margin: "4px 0 0 0", opacity: 0.9, fontSize: "0.9rem" }}>
            Welcome, {state.meta.name || "User"}!
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button
            onClick={() => navigate("/add-temple")}
            style={{
              padding: "10px 20px",
              backgroundColor: "rgba(40, 167, 69, 0.9)",
              color: "white",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "500",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(40, 167, 69, 1)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(40, 167, 69, 0.9)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            + Add Temple
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: "10px 20px",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "500",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255, 255, 255, 0.3)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255, 255, 255, 0.2)";
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div className={"home-container"}>
        <Sidebar />
        <Dashboard />
      </div>
    </div>
  );
};

export default Home;
