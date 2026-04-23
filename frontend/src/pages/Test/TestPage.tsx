import { toast } from "react-toastify";
import { getErrorMessage } from "../../modules/error.module";
import ForgeAxios from "../../modules/axios.module";
import { useEffect, useState } from "react";
import type { Test } from "../../types/test.type";
import { Link } from "react-router-dom";
import Button from "../../components/button/Button";
import { FaClock, FaListUl, FaPen, FaPlus } from "react-icons/fa";
import { FaGear, FaTag, FaArrowLeft } from "react-icons/fa6";
import { formatTestDuration } from "../../modules/time.module";
import Label from "../../components/label/Label";
import AcceptShareModal from "../../components/share/AcceptShareModal";
import { FaLock } from "react-icons/fa";

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
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "var(--content-padding)",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <Link to="/tests/new" style={{ display: "inline-block" }}>
          <Button icon={<FaPlus />}>Új Teszt</Button>
        </Link>
        <AcceptShareModal onAccepted={getTests} />
      </div>

      <div className="card-grid">
        {tests.map((test) => (
          <div
            key={test.id}
            className="card"
            style={{
              borderTop: `3px solid ${test.isOwner ? "var(--button-background)" : "#a78bfa"}`,
              gap: 0,
            }}
          >
            <div className="card-content">
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                  gap: "8px",
                }}
              >
                <h3 style={{ fontSize: "18px", fontWeight: 700 }}>{test.name}</h3>
                {!test.isOwner && (
                  <Label background="rgba(167,139,250,0.12)" color="#a78bfa">
                    {test.canEdit ? "Szerkesztő" : <><FaLock style={{ fontSize: "10px" }} /> Csak olvasó</>}
                  </Label>
                )}
              </div>

              {!test.isOwner && (
                <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "10px" }}>
                  Létrehozta: {test.creator.name}
                </p>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <FaListUl style={{ color: "#60a5fa", fontSize: "13px", flexShrink: 0 }} />
                  <span style={{ fontSize: "14px", color: "#94a3b8" }}>Kérdések</span>
                  <span style={{ marginLeft: "auto" }}>
                    <Label background="rgba(96,165,250,0.12)" color="#60a5fa">
                      {test.questionCount > 0 ? `${test.questionCount} db` : "Összes"}
                    </Label>
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <FaClock style={{ color: "#fb923c", fontSize: "13px", flexShrink: 0 }} />
                  <span style={{ fontSize: "14px", color: "#94a3b8" }}>Időlimit</span>
                  <span style={{ marginLeft: "auto" }}>
                    <Label
                      background={test.time > 0 ? "rgba(251,146,60,0.12)" : "rgba(255,255,255,0.05)"}
                      color={test.time > 0 ? "#fb923c" : "#64748b"}
                    >
                      {test.time > 0 ? formatTestDuration(test.time) : "Nincs"}
                    </Label>
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <FaTag style={{ color: "#34d399", fontSize: "13px", flexShrink: 0 }} />
                  <span style={{ fontSize: "14px", color: "#94a3b8" }}>Kategória</span>
                  <span style={{ marginLeft: "auto" }}>
                    <Label background="rgba(52,211,153,0.12)" color="#34d399">
                      {test.category.name}
                    </Label>
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <FaArrowLeft
                    style={{ color: test.allowBack ? "#a78bfa" : "#64748b", fontSize: "13px", flexShrink: 0 }}
                  />
                  <span style={{ fontSize: "14px", color: "#94a3b8" }}>Visszalépés</span>
                  <span style={{ marginLeft: "auto" }}>
                    <Label
                      background={test.allowBack ? "rgba(167,139,250,0.12)" : "rgba(255,255,255,0.05)"}
                      color={test.allowBack ? "#a78bfa" : "#64748b"}
                    >
                      {test.allowBack ? "Engedélyezett" : "Tiltott"}
                    </Label>
                  </span>
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
              {test.canEdit && (
                <Link to={`/tests/edit/${test.id}`}>
                  <Button icon={<FaGear />} style={{ width: "100%" }}>
                    Teszt módosítása
                  </Button>
                </Link>
              )}
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
