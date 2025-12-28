import "./Header.css";
interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  return (
    <header className="header">
      <button className="menu-btn" onClick={onMenuClick}>
        ☰
      </button>

      <h3>Dashboard</h3>
    </header>
  );
};

export default Header;
