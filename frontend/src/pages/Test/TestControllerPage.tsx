import React, { useEffect, useRef, useState } from "react";
import type { Category } from "../../types/category.type";
import type { Task } from "../../types/task.type";
import ForgeAxios from "../../modules/axios.module";
import InputHolder from "../../components/input/InputHolder";
import Button from "../../components/button/Button";
import { FaSave, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../modules/error.module";
import type { Test } from "../../types/test.type";
import { useNavigate, useParams } from "react-router-dom";
import { BiSolidCategory } from "react-icons/bi";
import { TASK_TYPE_META } from "../../constants/taskTypeMeta";

type Props = {
  type: "new" | "edit";
};

const TestControllerPage: React.FC<Props> = ({ type }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [test, setTest] = useState<Test | null>(null);
  const [availableTasks, setAvailableTasks] = useState<Task[]>([]);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  const nameRef = useRef<HTMLInputElement>(null);
  const questionCountRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLInputElement>(null);

  const getCategories = async () => {
    try {
      const res = await ForgeAxios({ method: "GET", url: "/category" });
      setCategories(res.data.categories || []);
    } catch (error) {
      console.log(error);
    }
  };

  const getTest = async () => {
    try {
      const res = await ForgeAxios({ method: "GET", url: `/test/${id}` });
      setTest(res.data.test || null);
    } catch (error) {
      console.log(error);
      toast.error(getErrorMessage(error as Error));
    }
  };

  const getTasks = async (categoryId: string) => {
    try {
      const res = await ForgeAxios({ method: "GET", url: `/task/${categoryId}` });
      setAvailableTasks(res.data.tasks || []);
    } catch (error) {
      console.log(error);
      toast.error(getErrorMessage(error as Error));
      setAvailableTasks([]);
    }
  };

  useEffect(() => {
    getCategories();
    if (type === "edit") getTest();
  }, []);

  useEffect(() => {
    if (test) {
      nameRef.current!.value = test.name;
      questionCountRef.current!.value = test.questionCount.toString();
      timeRef.current!.value = test.time.toString();
      setSelectedCategoryId(test.categoryId);
      getTasks(test.categoryId);
      setSelectedTaskIds((test.tasks || []).map((t) => t.id));
    }
  }, [test]);

  const toggleTask = (taskId: string) => {
    setSelectedTaskIds((prev) =>
      prev.includes(taskId) ? prev.filter((i) => i !== taskId) : [...prev, taskId],
    );
  };

  const selectCategory = (categoryId: string) => {
    if (selectedCategoryId === categoryId) return;
    setSelectedCategoryId(categoryId);
    setSelectedTaskIds([]);
    getTasks(categoryId);
  };

  const createTest = async () => {
    try {
      const name = nameRef.current?.value;
      const questionCount = questionCountRef.current?.valueAsNumber || 0;
      const time = timeRef.current?.valueAsNumber || 0;

      if (!name || !selectedCategoryId) {
        toast.error("Kérem töltse ki az összes mezőt!");
        return;
      }

      const res = await ForgeAxios({
        method: "POST",
        url: "/test",
        data: { name, questionCount, time, categoryId: selectedCategoryId, taskIds: selectedTaskIds },
      });

      toast.success(res.data.message || "Teszt sikeresen létrehozva!");
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error as Error));
    }
  };

  const updateTest = async () => {
    try {
      const name = nameRef.current?.value;
      const questionCount = questionCountRef.current?.valueAsNumber || 0;
      const time = timeRef.current?.valueAsNumber || 0;

      if (!name) {
        toast.error("Kérem töltse ki az összes mezőt!");
        return;
      }

      const res = await ForgeAxios({
        method: "PUT",
        url: `/test/${id}`,
        data: { name, questionCount, time, taskIds: selectedTaskIds },
      });

      toast.success(res.data.message || "Teszt sikeresen módosítva!");
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error as Error));
    }
  };

  const deleteTest = async () => {
    try {
      const res = await ForgeAxios({ method: "DELETE", url: `/test/${id}` });
      toast.success(res.data.message || "Teszt sikeresen törölve!");
      navigate(-1);
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error as Error));
    }
  };

  if (type === "edit" && !test) return <main>Loading...</main>;

  return (
    <div className="page">

      {/* Action bar */}
      <div style={{ display: "flex", gap: "var(--input-padding)", justifyContent: "flex-end", marginBottom: "var(--content-padding)" }}>
        {type === "new" && (
          <Button icon={<FaSave />} onClick={createTest} style={{ width: "auto" }}>
            Létrehozás
          </Button>
        )}
        {type === "edit" && (
          <>
            <Button icon={<FaSave />} onClick={updateTest} style={{ width: "auto" }}>
              Módosítás
            </Button>
            <Button icon={<FaTrash />} onClick={deleteTest} style={{ width: "auto", background: "linear-gradient(180deg,#b91c1c,#991b1b)", boxShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
              Törlés
            </Button>
          </>
        )}
      </div>

      {/* Form section */}
      <div className="section-card">
        <p className="section-title">
          Alapadatok
        </p>

        <InputHolder text="Teszt neve">
          <input type="text" ref={nameRef} placeholder="Add meg a teszt nevét..." />
        </InputHolder>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--content-padding)" }}>
          <InputHolder text="Kérdések száma">
            <input type="number" min={0} ref={questionCountRef} defaultValue={0} />
          </InputHolder>
          <InputHolder text="Kitöltési idő (perc)">
            <input type="number" min={0} ref={timeRef} defaultValue={0} />
          </InputHolder>
        </div>
      </div>

      {/* Category picker (only for new) */}
      {type === "new" && (
        <div className="section-card">
          <p className="section-title">
            Kategória kiválasztása
          </p>

          {categories.length === 0 ? (
            <p style={{ color: "#475569", fontSize: "14px" }}>Nincs elérhető kategória.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px" }}>
              {categories.map((cat) => {
                const selected = selectedCategoryId === cat.id;
                return (
                  <div
                    key={cat.id}
                    onClick={() => selectCategory(cat.id)}
                    style={{
                      padding: "12px 14px",
                      borderRadius: "var(--border-radius)",
                      border: `1px solid ${selected ? "rgba(52,211,153,0.5)" : "var(--border-color)"}`,
                      backgroundColor: selected ? "rgba(38,95,24,0.22)" : "var(--input-color)",
                      borderTop: `3px solid ${selected ? "#34d399" : "transparent"}`,
                      cursor: "pointer",
                      userSelect: "none",
                      transition: "border-color 0.15s ease, background-color 0.15s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      backgroundColor: selected ? "rgba(52,211,153,0.2)" : "rgba(255,255,255,0.06)",
                      border: `1px solid ${selected ? "rgba(52,211,153,0.3)" : "rgba(255,255,255,0.08)"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <BiSolidCategory style={{ fontSize: "14px", color: selected ? "#34d399" : "#475569" }} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: "14px", fontWeight: selected ? 600 : 400, color: selected ? "#f1f5f9" : "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {cat.name}
                      </p>
                      {cat.description && (
                        <p style={{ fontSize: "12px", color: "#475569", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {cat.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Task picker */}
      {availableTasks.length > 0 && (
        <div className="section-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--content-padding)" }}>
            <p className="section-title" style={{ marginBottom: 0 }}>
              Rögzített feladatok
            </p>
            <span style={{
              fontSize: "12px",
              padding: "2px 10px",
              borderRadius: "999px",
              backgroundColor: selectedTaskIds.length > 0 ? "rgba(38,95,24,0.25)" : "rgba(255,255,255,0.05)",
              color: selectedTaskIds.length > 0 ? "#34d399" : "#64748b",
              border: `1px solid ${selectedTaskIds.length > 0 ? "rgba(52,211,153,0.3)" : "rgba(255,255,255,0.08)"}`,
            }}>
              {selectedTaskIds.length} / {availableTasks.length} kiválasztva
            </span>
          </div>

          <div className="card-grid">
            {availableTasks.map((task) => {
              const selected = selectedTaskIds.includes(task.id);
              const meta = TASK_TYPE_META[task.type];
              return (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  style={{
                    padding: "12px 14px",
                    borderRadius: "var(--border-radius)",
                    border: `1px solid ${selected ? "rgba(52,211,153,0.4)" : "var(--border-color)"}`,
                    borderTop: `3px solid ${selected ? "#34d399" : "transparent"}`,
                    backgroundColor: selected ? "rgba(38,95,24,0.18)" : "var(--input-color)",
                    cursor: "pointer",
                    userSelect: "none",
                    transition: "border-color 0.15s ease, background-color 0.15s ease",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                    <span style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: "999px",
                      backgroundColor: meta.bg,
                      color: meta.color,
                      border: `1px solid ${meta.color}40`,
                      whiteSpace: "nowrap",
                    }}>
                      {meta.label}
                    </span>
                    <div style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      border: `2px solid ${selected ? "#34d399" : "#334155"}`,
                      backgroundColor: selected ? "#34d399" : "transparent",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.15s ease",
                    }}>
                      {selected && <span style={{ fontSize: "10px", color: "#000", fontWeight: 700 }}>✓</span>}
                    </div>
                  </div>
                  <p style={{ fontSize: "14px", color: selected ? "#f1f5f9" : "#94a3b8", lineHeight: "1.4" }}>
                    {task.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestControllerPage;
