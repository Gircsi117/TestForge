import { useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";
import { UserRoles } from "../../types/user.type";
import { getMonogram } from "../../modules/monogram.module";

const PAGE_TITLES: { pattern: RegExp; title: string }[] = [
  { pattern: /^\/categories\/new$/, title: "Új Kategória" },
  { pattern: /^\/categories\/edit\/[^/]+$/, title: "Kategória szerkesztése" },
  { pattern: /^\/categories$/, title: "Kategóriák" },
  { pattern: /^\/tests\/new$/, title: "Új Teszt" },
  { pattern: /^\/tests\/edit\/[^/]+$/, title: "Teszt szerkesztése" },
  { pattern: /^\/tests\/[^/]+$/, title: "Teszt kitöltése" },
  { pattern: /^\/tests$/, title: "Tesztek" },
  { pattern: /^\/tasks\/[^/]+\/[^/]+$/, title: "Feladat szerkesztése" },
  { pattern: /^\/tasks\/[^/]+$/, title: "Feladatok" },
  { pattern: /^\/profile$/, title: "Profil" },
  { pattern: /^\/$/, title: "Főoldal" },
];

const getPageTitle = (pathname: string): string => {
  for (const { pattern, title } of PAGE_TITLES) {
    if (pattern.test(pathname)) return title;
  }
  return "TestForge";
};

const Header = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <header>
      <span className="header-title">{pageTitle}</span>

      {user && (
        <div className="header-user">
          {user.role === UserRoles.ADMIN && (
            <span className="header-role-badge">Admin</span>
          )}
          <div className="header-user-info">
            <span className="header-user-name">{user.name}</span>
            <span className="header-user-email">{user.email}</span>
          </div>
          <div className="monogram header-avatar">{getMonogram(user.name)}</div>
        </div>
      )}
    </header>
  );
};

export default Header;
