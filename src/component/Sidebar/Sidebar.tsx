import { NavLink } from "react-router-dom";
import { useUser } from "../../context/UserContext";
const Sidebar = () => {
  const { state } = useUser();
  return (
    <aside className="sidebar">
      <NavLink to="/" end>
        Dashboard
      </NavLink>
      {state.meta?.email ? (
        <>
          <NavLink to="/temple">Temples</NavLink>
          <NavLink to="/settings">Settings</NavLink>
        </>
      ) : (
        <></>
      )}
    </aside>
  );
};

export default Sidebar;
