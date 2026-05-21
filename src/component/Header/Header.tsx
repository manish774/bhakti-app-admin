import { useUser } from "../../context/UserContext";
import { Popover } from "../core/Popover";
import "./Header.css";
interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const user = useUser();
  const firstLetter = user?.state.meta?.name?.slice(0, 1);
  const logoutButton = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  };
  return (
    <header className="header">
      <button className="menu-btn" onClick={onMenuClick}>
        ☰
      </button>
      <h3>Everything begins and ends with Prabhu Shiv.</h3>
      {/* <button className="firstNameLetter">
        <p>{firstLetter}</p>
      </button> */}
      <Popover
        trigger={
          <button className="firstNameLetter">
            <p>{firstLetter}</p>
          </button>
        }
        content={
          <div>
            <div>{user.state.meta.name}</div>
            <div>{user.state.meta.email}</div>
            <div>
              <button onClick={logoutButton}>Logout</button>
            </div>
          </div>
        }
        position="bottom"
        trigger_type="click"
        closeOnClickOutside={true}
      />
    </header>
  );
};

export default Header;
