import { useCallback, useEffect } from "react";
import { useAuthStore } from "../stores/auth.store";
import ForgeAxios from "../modules/axios.module";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Protection from "../components/Protection";
import HomePage from "./Home/HomePage";
import NotFoundPage from "./NotFound/NotFoundPage";
import LoginPage from "./Auth/LoginPage";
import RegisterPage from "./Auth/RegisterPage";
import Layout from "../components/layout/Layout";
import CategoriesPage from "./Categories/CategoriesPage";
import CategoryControllerPage from "./Categories/CategoryControllerPage";

function App() {
  const { isAuth, login, logout } = useAuthStore();

  const checkAuth = useCallback(async () => {
    try {
      const res = await ForgeAxios({
        method: "GET",
        url: "/auth/check",
      });

      if (!res.data.user) return logout();

      login(res.data.user);
    } catch (error) {
      console.error("Authentication check failed", error);
      logout();
    }
  }, [login, logout]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isAuth == null)
    return (
      <div className="page">
        <h1>Loading...</h1>
      </div>
    );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/*">
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route path="/*" element={<Layout />}>
          <Route
            path=""
            element={
              <Protection auth error>
                <HomePage />
              </Protection>
            }
          />

          <Route
            path="categories"
            element={
              <Protection auth error>
                <CategoriesPage />
              </Protection>
            }
          />

          <Route
            path="categories/new"
            element={
              <Protection auth error>
                <CategoryControllerPage type="new" />
              </Protection>
            }
          />

          <Route
            path="categories/edit/:id"
            element={
              <Protection auth error>
                <CategoryControllerPage type="edit" />
              </Protection>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
