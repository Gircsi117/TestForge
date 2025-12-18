import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "../../pages/Error/ErrorPage";
import Header from "../header/Header";
import Navbar from "../navigation/Navbar";

const Layout = () => {
  return (
    <Suspense fallback="Loading...">
      <Navbar />
      <div className="content">
        <Header />
        <ErrorBoundary FallbackComponent={() => <ErrorPage />}>
          <Outlet />
        </ErrorBoundary>
      </div>
    </Suspense>
  );
};

export default Layout;
