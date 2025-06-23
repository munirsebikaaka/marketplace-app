import { useTheme } from "../../context/ThemeContext";

const SidebarHeader = () => {
  return (
    <div className="sidebar-header">
      <div className="user-profile">
        <div className="user-avatar">JD</div>
        <div className="user-name">John Doe</div>
      </div>
      <div className="sidebar-actions">
        <i className="fas fa-ellipsis-vertical"></i>
      </div>
    </div>
  );
};

export default SidebarHeader;
