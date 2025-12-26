import React from "react";

interface DashboardHeaderProps {
  totalTemples: number;
  totalPackages: number;
  totalValue: number;
  lastUpdated: Date;
  loading: boolean;
  onRefresh: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  lastUpdated,
  loading,
  onRefresh,
}) => {
  return (
    <div className="dashboard-header">
      <div className="header-content">
        <h5>Temple Dashboard (Bhakti App)</h5>
        <p>Manage and view all temple listings with ease</p>

        <div className="dashboard-actions">
          <button
            className="refresh-btn"
            onClick={onRefresh}
            disabled={loading}
          >
            {loading ? "🔄 Refreshing..." : "🔄 Refresh Data"}
          </button>

          <span className="last-updated">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
