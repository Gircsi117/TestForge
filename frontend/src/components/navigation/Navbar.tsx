import NavItem from "./NavItem";
import { FaBook, FaHome, FaUser } from "react-icons/fa";
import { MdOutlineLogin } from "react-icons/md";
import { BiSolidCategory } from "react-icons/bi";
import ForgeAxios from "../../modules/axios.module";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../modules/error.module";
import { useAuthStore } from "../../stores/auth.store";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  return (
    <nav>
      <div className="nav-items">
        <NavItem title="Főoldal" link="/" icon={<FaHome />} />
        <NavItem
          title="Kategóriák"
          link="/categories"
          icon={<BiSolidCategory />}
        />
        <NavItem title="Tesztek" link="/tests" icon={<FaBook />} />
      </div>
      <NavItem title="Profil" link="/profile" icon={<FaUser />} />
      <NavItem
        title="Kijelentkezés"
        icon={<MdOutlineLogin />}
        onClick={async () => {
          try {
            const res = await ForgeAxios({
              method: "GET",
              url: "/auth/logout",
            });

            console.log(res.data);

            logout();
            navigate("/auth/login");
          } catch (error) {
            toast.error(getErrorMessage(error as Error) || "Logout failed");
            console.error("Logout failed", error);
          }
        }}
      />
    </nav>
  );
};

export default Navbar;
