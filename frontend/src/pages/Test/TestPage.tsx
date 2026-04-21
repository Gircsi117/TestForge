import { toast } from "react-toastify";
import { getErrorMessage } from "../../modules/error.module";
import ForgeAxios from "../../modules/axios.module";
import { useEffect, useState } from "react";
import type { Test } from "../../types/test.type";
import { Link } from "react-router-dom";
import Button from "../../components/button/Button";
import { FaClock, FaListUl, FaPen, FaPlus } from "react-icons/fa";
import { FaGear, FaTag } from "react-icons/fa6";

const formatTime = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} perc`;
  if (m === 0) return `${h} ó`;
  return `${h} ó ${m} perc`;
};

const TestPage = () => {
  const [tests, setTests] = useState<Test[]>([]);

  const getTests = async () => {
    try {
      const res = await ForgeAxios({ method: "GET", url: "/test" });
      setTests(res.data.tests || []);
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error as Error));
    }
  };

  useEffect(() => {
    getTests();
  }, []);

  return (
    <div className="page">
      <Link to="/tests/new" style={{ display: "inline-block" }}>
        <Button
          icon={<FaPlus />}
          style={{ marginBottom: "var(--content-padding)" }}
        >
          Új Teszt
        </Button>
      </Link>
      <div className="card-grid">
        {tests.map((test) => (
          <div
            key={test.id}
            className="card"
            style={{ borderTop: "3px solid var(--button-background)", gap: 0 }}
          >
            <div className="card-content">
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  marginBottom: "12px",
                }}
              >
                {test.name}
              </h3>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <FaListUl
                    style={{
                      color: "#60a5fa",
                      fontSize: "13px",
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: "14px", color: "#94a3b8" }}>
                    Kérdések
                  </span>
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: "14px",
                      fontWeight: 600,
                      padding: "1px 10px",
                      borderRadius: "999px",
                      backgroundColor: "rgba(96,165,250,0.12)",
                      color: "#60a5fa",
                      border: "1px solid rgba(96,165,250,0.25)",
                    }}
                  >
                    {test.questionCount > 0
                      ? `${test.questionCount} db`
                      : "Összes"}
                  </span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <FaClock
                    style={{
                      color: "#fb923c",
                      fontSize: "13px",
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: "14px", color: "#94a3b8" }}>
                    Időlimit
                  </span>
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: "14px",
                      fontWeight: 600,
                      padding: "1px 10px",
                      borderRadius: "999px",
                      backgroundColor:
                        test.time > 0
                          ? "rgba(251,146,60,0.12)"
                          : "rgba(255,255,255,0.05)",
                      color: test.time > 0 ? "#fb923c" : "#64748b",
                      border: `1px solid ${test.time > 0 ? "rgba(251,146,60,0.25)" : "rgba(255,255,255,0.08)"}`,
                    }}
                  >
                    {test.time > 0 ? formatTime(test.time) : "nincs"}
                  </span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <FaTag
                    style={{
                      color: "#34d399",
                      fontSize: "13px",
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: "14px", color: "#94a3b8" }}>
                    Kategória
                  </span>
                  <Link
                    to={`/categories/edit/${test.category.id}`}
                    style={{
                      marginLeft: "auto",
                      fontSize: "14px",
                      fontWeight: 600,
                      padding: "1px 10px",
                      borderRadius: "999px",
                      backgroundColor: "rgba(52,211,153,0.12)",
                      color: "#34d399",
                      border: "1px solid rgba(52,211,153,0.25)",
                      textDecoration: "none",
                    }}
                  >
                    {test.category.name}
                  </Link>
                </div>
              </div>
            </div>

            <div
              style={{
                borderTop: "1px solid var(--border-color)",
                marginTop: "16px",
                paddingTop: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <Link to={`/tests/edit/${test.id}`}>
                <Button icon={<FaGear />} style={{ width: "100%" }}>
                  Teszt módosítása
                </Button>
              </Link>
              <Link to={`/tests/${test.id}`}>
                <Button icon={<FaPen />} style={{ width: "100%" }}>
                  Teszt kitöltése
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestPage;
