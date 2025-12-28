import { Outlet } from "react-router-dom";
import { useState } from "react";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="dashboard-main">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
