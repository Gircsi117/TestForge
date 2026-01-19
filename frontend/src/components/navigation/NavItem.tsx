import { Link } from "react-router-dom";

type NavItemProps = {
  title: string;
  link: string;
  icon?: React.ReactNode;
};

const NavItem: React.FC<NavItemProps> = ({ title, link, icon }) => {
  return (
    <Link to={link} className="nav-item">
      {icon}
      <span>{title}</span>
    </Link>
  );
};

export default NavItem;
