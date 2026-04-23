import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ForgeAxios from "../../modules/axios.module";
import { getErrorMessage } from "../../modules/error.module";
import type { ShareInfo } from "../../types/category.type";
import Section from "../section/Section";
import Button from "../button/Button";
import { FaCopy, FaPlus, FaTrash } from "react-icons/fa";
import { FaKey } from "react-icons/fa6";

type Props = {
  type: "category" | "test";
  id: string;
};

const ShareSection: React.FC<Props> = ({ type, id }) => {
  const [info, setInfo] = useState<ShareInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchInfo = async () => {
    try {
      const res = await ForgeAxios({ method: "GET", url: `/share/${type}/${id}` });
      setInfo({ code: res.data.code ?? null, users: res.data.users ?? [] });
    } catch (error) {
      toast.error(getErrorMessage(error as Error));
    } finally {
      setLoading(false);
    }
  };

  const generateCode = async () => {
    try {
      const res = await ForgeAxios({ method: "POST", url: `/share/${type}/${id}/code` });
      setInfo((prev) => ({ ...prev!, code: res.data.code }));
      toast.success("Megosztási kód létrehozva!");
    } catch (error) {
      toast.error(getErrorMessage(error as Error));
    }
  };

  const removeCode = async () => {
    try {
      await ForgeAxios({ method: "DELETE", url: `/share/${type}/${id}/code` });
      setInfo((prev) => ({ ...prev!, code: null }));
      toast.success("Megosztási kód törölve!");
    } catch (error) {
      toast.error(getErrorMessage(error as Error));
    }
  };

  const copyCode = () => {
    if (info?.code) {
      navigator.clipboard.writeText(info.code);
      toast.success("Kód vágólapra másolva!");
    }
  };

  const toggleEdit = async (userId: string, currentCanEdit: boolean) => {
    try {
      await ForgeAxios({
        method: "PUT",
        url: `/share/${type}/${id}/user/${userId}`,
        data: { canEdit: !currentCanEdit },
      });
      setInfo((prev) =>
        prev
          ? {
              ...prev,
              users: prev.users.map((u) =>
                u.userId === userId ? { ...u, canEdit: !currentCanEdit } : u,
              ),
            }
          : prev,
      );
    } catch (error) {
      toast.error(getErrorMessage(error as Error));
    }
  };

  const removeUser = async (userId: string) => {
    try {
      await ForgeAxios({
        method: "DELETE",
        url: `/share/${type}/${id}/user/${userId}`,
      });
      setInfo((prev) =>
        prev
          ? { ...prev, users: prev.users.filter((u) => u.userId !== userId) }
          : prev,
      );
      toast.success("Hozzáférés eltávolítva!");
    } catch (error) {
      toast.error(getErrorMessage(error as Error));
    }
  };

  useEffect(() => {
    fetchInfo();
  }, [id]);

  if (loading) return null;

  return (
    <Section sectionTitle="Megosztás">
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Code section */}
        <div>
          <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "10px" }}>
            Megosztási kód
          </p>
          {info?.code ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: "14px",
                  padding: "8px 14px",
                  borderRadius: "var(--border-radius)",
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border: "1px solid var(--border-color)",
                  letterSpacing: "0.04em",
                  color: "#f1f5f9",
                  wordBreak: "break-all",
                }}
              >
                {info.code}
              </div>
              <Button icon={<FaCopy />} onClick={copyCode} style={{ width: "auto" }}>
                Másolás
              </Button>
              <Button
                icon={<FaTrash />}
                onClick={removeCode}
                style={{
                  width: "auto",
                  background: "linear-gradient(180deg,#b91c1c,#991b1b)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
                }}
              >
                Törlés
              </Button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "14px", color: "#475569" }}>Nincs megosztási kód</span>
              <Button icon={<FaKey />} onClick={generateCode} style={{ width: "auto" }}>
                Kód generálása
              </Button>
            </div>
          )}
        </div>

        {/* Users section */}
        {info && info.users.length > 0 && (
          <div>
            <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "10px" }}>
              Hozzáférők ({info.users.length})
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {info.users.map((u) => (
                <div
                  key={u.userId}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 14px",
                    borderRadius: "var(--border-radius)",
                    backgroundColor: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <span style={{ flex: 1, fontSize: "14px" }}>{u.name}</span>

                  {/* canEdit toggle */}
                  <div
                    onClick={() => toggleEdit(u.userId, u.canEdit)}
                    title={u.canEdit ? "Szerkesztési jog megvonása" : "Szerkesztési jog adása"}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      cursor: "pointer",
                      padding: "4px 10px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: 600,
                      border: "1px solid",
                      transition: "all 0.15s ease",
                      backgroundColor: u.canEdit ? "rgba(52,211,153,0.12)" : "rgba(255,255,255,0.05)",
                      borderColor: u.canEdit ? "rgba(52,211,153,0.35)" : "rgba(255,255,255,0.1)",
                      color: u.canEdit ? "#34d399" : "#64748b",
                      userSelect: "none",
                    }}
                  >
                    {u.canEdit ? "Szerkesztő" : "Csak olvasó"}
                  </div>

                  <button
                    onClick={() => removeUser(u.userId)}
                    title="Hozzáférés eltávolítása"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#64748b",
                      padding: "4px",
                      display: "flex",
                      alignItems: "center",
                      transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
                  >
                    <FaTrash style={{ fontSize: "13px" }} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {info && info.users.length === 0 && (
          <p style={{ fontSize: "13px", color: "#475569" }}>
            Még senki sem váltotta be ezt a kódot.
          </p>
        )}
      </div>
    </Section>
  );
};

export default ShareSection;
