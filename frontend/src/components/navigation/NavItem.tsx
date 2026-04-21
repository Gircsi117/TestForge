import { NavLink } from "react-router-dom";

type NavItemProps = {
  title: string;
  link?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
};

const NavItem: React.FC<NavItemProps> = ({ title, link, icon, onClick }) => {
  return (
    <NavLink
      to={link || "#"}
      end={link === "/"}
      className={({ isActive }) =>
        `nav-item${isActive && link && link !== "#" ? " active" : ""}`
      }
      onClick={onClick}
    >
      <span className="nav-item-icon">{icon}</span>
      <span className="nav-item-label">{title}</span>
    </NavLink>
  );
};

export default NavItem;
