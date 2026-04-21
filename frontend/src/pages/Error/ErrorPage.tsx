import { Link } from "react-router-dom";
import type { FallbackProps } from "react-error-boundary";
import { FaExclamationTriangle, FaLock, FaArrowLeft, FaRedo } from "react-icons/fa";
import { AuthError } from "../../modules/error.module";

const ErrorPage = ({ error, resetErrorBoundary }: Partial<FallbackProps>) => {
  const isAuthError = error instanceof AuthError;

  return (
    <main
      className="page"
      style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <div style={{ textAlign: "center", maxWidth: "440px" }}>
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            background: isAuthError
              ? "rgba(251, 191, 36, 0.1)"
              : "rgba(248, 113, 113, 0.1)",
            border: `2px solid ${isAuthError ? "rgba(251, 191, 36, 0.25)" : "rgba(248, 113, 113, 0.25)"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          {isAuthError ? (
            <FaLock style={{ fontSize: "28px", color: "#fbbf24" }} />
          ) : (
            <FaExclamationTriangle style={{ fontSize: "28px", color: "#f87171" }} />
          )}
        </div>

        <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "10px" }}>
          {isAuthError ? "Hozzáférés megtagadva" : "Váratlan hiba történt"}
        </h1>

        <p style={{ fontSize: "15px", color: "#64748b", marginBottom: "32px", lineHeight: 1.6 }}>
          {isAuthError
            ? error?.message
            : "Valami hiba lépett fel az oldal betöltése közben. Próbálja újra, vagy lépjen vissza a főoldalra."}
        </p>

        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          {isAuthError ? (
            <Link to="/auth/login">
              <button className="btn icon-btn-with-text" style={{ width: "auto" }}>
                <span className="btn-icon"><FaLock /></span>
                <span className="btn-text">Bejelentkezés</span>
              </button>
            </Link>
          ) : (
            resetErrorBoundary && (
              <button
                className="btn icon-btn-with-text"
                style={{ width: "auto" }}
                onClick={resetErrorBoundary}
              >
                <span className="btn-icon"><FaRedo /></span>
                <span className="btn-text">Újrapróbálás</span>
              </button>
            )
          )}

          <Link to="/">
            <button className="btn secondary-btn icon-btn-with-text" style={{ width: "auto" }}>
              <span className="btn-icon"><FaArrowLeft /></span>
              <span className="btn-text">Főoldal</span>
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ErrorPage;
