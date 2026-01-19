import { Link } from "react-router-dom";

type NavItemProps = {
  title: string;
  link?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
};

const NavItem: React.FC<NavItemProps> = ({ title, link, icon, onClick }) => {
  return (
    <Link to={link || "#"} className="nav-item" onClick={onClick}>
      {icon}
      <span>{title}</span>
    </Link>
  );
};

export default NavItem;
