import { useEffect, useState } from "react";
import ForgeAxios from "../../modules/axios.module";
import { getErrorMessage } from "../../modules/error.module";
import { toast } from "react-toastify";
import type { History } from "../../types/history.type";
import { MdTimer } from "react-icons/md";
import { AiOutlineFileDone } from "react-icons/ai";
import { FaTrophy } from "react-icons/fa";
import { formatElapsedTime, formatDate } from "../../modules/time.module";

const HomePage = () => {
  const [history, setHistory] = useState<History[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await ForgeAxios({ method: "GET", url: "/history" });
        setHistory(res.data.history || []);
      } catch (error) {
        toast.error(getErrorMessage(error as Error));
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const totalCount = history.length;
  const avgPercent =
    totalCount === 0
      ? null
      : Math.round(
          (history.reduce(
            (sum, h) => sum + (h.maxScore > 0 ? h.score / h.maxScore : 0),
            0,
          ) /
            totalCount) *
            100,
        );
  const bestEntry =
    totalCount === 0
      ? null
      : history.reduce((best, h) =>
          h.maxScore > 0 && h.score / h.maxScore > (best.maxScore > 0 ? best.score / best.maxScore : 0)
            ? h
            : best,
        );

  const recent = history.slice(0, 10);

  if (loading) return <main className="page">Betöltés...</main>;

  return (
    <main className="page">
      <h1 style={{ marginBottom: "var(--content-padding)" }}>Áttekintés</h1>

      {totalCount === 0 ? (
        <div className="section-card" style={{ color: "#64748b", textAlign: "center", padding: "40px" }}>
          Még nincs kitöltött teszt. Menj a <strong>Tesztek</strong> menübe és próbálj ki egyet!
        </div>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "var(--content-padding)",
              marginBottom: "var(--content-padding)",
            }}
          >
            <div className="section-card" style={{ marginBottom: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#64748b" }}>
                <AiOutlineFileDone style={{ fontSize: "18px" }} />
                <span className="section-title" style={{ marginBottom: 0 }}>Kitöltések</span>
              </div>
              <span style={{ fontSize: "32px", fontWeight: 700 }}>{totalCount}</span>
            </div>

            <div className="section-card" style={{ marginBottom: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#64748b" }}>
                <FaTrophy style={{ fontSize: "18px" }} />
                <span className="section-title" style={{ marginBottom: 0 }}>Átlag eredmény</span>
              </div>
              <span style={{ fontSize: "32px", fontWeight: 700 }}>
                {avgPercent !== null ? `${avgPercent}%` : "—"}
              </span>
            </div>

            {bestEntry && bestEntry.maxScore > 0 && (
              <div className="section-card" style={{ marginBottom: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#64748b" }}>
                  <FaTrophy style={{ fontSize: "18px", color: "#fbbf24" }} />
                  <span className="section-title" style={{ marginBottom: 0 }}>Legjobb eredmény</span>
                </div>
                <span style={{ fontSize: "32px", fontWeight: 700 }}>
                  {Math.round((bestEntry.score / bestEntry.maxScore) * 100)}%
                </span>
                <span style={{ fontSize: "13px", color: "#64748b" }}>{bestEntry.testName}</span>
              </div>
            )}
          </div>

          <div className="section-card">
            <p className="section-title">Legutóbbi kitöltések</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {recent.map((h) => {
                const percent = h.maxScore > 0 ? Math.round((h.score / h.maxScore) * 100) : null;
                const color = percent === null ? "#64748b" : percent >= 80 ? "#34d399" : percent >= 50 ? "#fbbf24" : "#f87171";
                return (
                  <div
                    key={h.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                      padding: "10px 14px",
                      borderRadius: "var(--border-radius)",
                      backgroundColor: "rgba(255,255,255,0.04)",
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: "15px", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {h.testName}
                      </p>
                      <p style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                        {formatDate(h.createdAt)}
                      </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", flexShrink: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#64748b" }}>
                        <MdTimer style={{ fontSize: "14px" }} />
                        <span style={{ fontSize: "13px" }}>{formatElapsedTime(h.timeTaken)}</span>
                      </div>
                      <span style={{ fontSize: "15px", fontWeight: 700, color, minWidth: "52px", textAlign: "right" }}>
                        {h.score}/{h.maxScore}
                        {percent !== null && <span style={{ fontSize: "12px", fontWeight: 400, marginLeft: "4px" }}>({percent}%)</span>}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default HomePage;
