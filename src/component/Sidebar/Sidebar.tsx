import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

type SideBarProps = {
  id: number | string;
  name: string;
  label: string;
  tooltip: string;
  description: string;
  navigate: () => void;
};
const Sidebar = () => {
  const navigate = useNavigate();
  const sideBarContent: SideBarProps[] = [
    {
      id: 1,
      name: "Home",
      label: "Home",
      tooltip: "Home nav",
      description: "Home description",
      navigate: () => {
        navigate("/home");
      },
    },
    {
      id: 2,
      name: "Temple",
      label: "Temple",
      tooltip: "Temple nav",
      description: "Temple",
      navigate: () => {
        navigate("/temple");
      },
    },
    {
      id: 3,
      name: "Event",
      label: "Event",
      tooltip: "Event nav",
      description: "Event description",
      navigate: () => {
        navigate("/home");
      },
    },
  ];
  const render = sideBarContent.map((item) => {
    return (
      <div className="sidebar-child" onClick={item.navigate}>
        <div className="container">
          <span>{item.name}</span>
        </div>
      </div>
    );
  });
  return <div>{render}</div>;
};

export default Sidebar;
