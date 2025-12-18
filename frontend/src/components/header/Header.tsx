import { useAuthStore } from "../../stores/auth.store";

const Header = () => {
  const { user } = useAuthStore();

  return (
    <header>
      Header [{user?.name} - {user?.email}]
    </header>
  );
};

export default Header;
