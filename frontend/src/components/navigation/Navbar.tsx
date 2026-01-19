import React from "react";
import NavItem from "./NavItem";
import { FaHome } from "react-icons/fa";

const Navbar = () => {
  return (
    <nav>
      <NavItem title="Főoldal" link="/" icon={<FaHome />} />
      <NavItem title="Kategóriák" link="/categories" icon={<FaHome />} />
      <NavItem title="Valami" link="/" icon={<FaHome />} />
    </nav>
  );
};

export default Navbar;
