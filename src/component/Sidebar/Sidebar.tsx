import { NavLink } from "react-router-dom";
import { useUser } from "../../context/UserContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { state } = useUser();

  return (
    <>
      {/* Overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? "show" : ""}`}
        onClick={onClose}
      />

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <NavLink to="/" end onClick={onClose}>
          Dashboard
        </NavLink>

        {state.meta?.email && (
          <>
            <NavLink to="/events" onClick={onClose}>
              Events
            </NavLink>
            <NavLink to="/coreevents" onClick={onClose}>
              Core Events
            </NavLink>
            <NavLink to="/temple" onClick={onClose}>
              Temples
            </NavLink>
            <NavLink to="/packages" onClick={onClose}>
              Packages
            </NavLink>
            <NavLink to="/bookings" onClick={onClose}>
              Bookings
            </NavLink>
            <NavLink to="/pandit" onClick={onClose}>
              Pandit
            </NavLink>
          </>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
