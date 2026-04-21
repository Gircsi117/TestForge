import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const NotFoundPage = () => {
  return (
    <main
      className="page"
      style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <div style={{ textAlign: "center", maxWidth: "440px" }}>
        <div
          style={{
            fontSize: "120px",
            fontWeight: 800,
            lineHeight: 1,
            marginBottom: "8px",
            background: "linear-gradient(135deg, #265f18, #34d399)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          404
        </div>

        <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "10px" }}>
          Az oldal nem található
        </h1>

        <p style={{ fontSize: "15px", color: "#64748b", marginBottom: "32px", lineHeight: 1.6 }}>
          A keresett oldal nem létezik, törölték, vagy elírta a címet.
        </p>

        <Link to="/">
          <button className="btn icon-btn-with-text" style={{ width: "auto", margin: "0 auto" }}>
            <span className="btn-icon">
              <FaArrowLeft />
            </span>
            <span className="btn-text">Vissza a főoldalra</span>
          </button>
        </Link>
      </div>
    </main>
  );
};

export default NotFoundPage;
