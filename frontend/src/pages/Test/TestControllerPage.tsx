import React, { useEffect, useRef, useState } from "react";
import type { Category } from "../../types/category.type";
import type { Task } from "../../types/task.type";
import ForgeAxios from "../../modules/axios.module";
import InputHolder from "../../components/input/InputHolder";
import Select from "react-select";
import { selectStyles } from "../../modules/select.module";
import Button from "../../components/button/Button";
import { FaSave, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../modules/error.module";
import type { Test } from "../../types/test.type";
import { useNavigate, useParams } from "react-router-dom";

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
      getTasks(test.categoryId);
      setSelectedTaskIds((test.tasks || []).map((t) => t.id));
    }
  }, [test]);

  const toggleTask = (taskId: string) => {
    setSelectedTaskIds((prev) =>
      prev.includes(taskId) ? prev.filter((i) => i !== taskId) : [...prev, taskId],
    );
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
      <div
        style={{
          display: "flex",
          gap: "var(--input-padding)",
          justifyContent: "flex-end",
          position: "sticky",
          top: "0px",
        }}
      >
        {type === "new" && (
          <Button icon={<FaSave />} onClick={createTest}>
            Létrehozás
          </Button>
        )}
        {type === "edit" && (
          <>
            <Button icon={<FaSave />} onClick={updateTest}>
              Módosítás
            </Button>
            <Button
              icon={<FaTrash />}
              style={{ backgroundColor: "red" }}
              onClick={deleteTest}
            >
              Törlés
            </Button>
          </>
        )}
      </div>

      <InputHolder text="Név">
        <input type="text" ref={nameRef} />
      </InputHolder>

      <InputHolder text="Kérdés szám">
        <input type="number" min={0} ref={questionCountRef} defaultValue={0} />
      </InputHolder>

      <InputHolder text="Kitöltési idő (perc)">
        <input type="number" min={0} ref={timeRef} defaultValue={0} />
      </InputHolder>

      {type === "new" && (
        <InputHolder text="Kategória">
          <Select
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
            styles={selectStyles}
            placeholder="Válassz kategóriát"
            onChange={(selected) => {
              const val = (selected as { value: string } | null)?.value ?? null;
              setSelectedCategoryId(val);
              setSelectedTaskIds([]);
              if (val) getTasks(val);
              else setAvailableTasks([]);
            }}
          />
        </InputHolder>
      )}

      {availableTasks.length > 0 && (
        <div style={{ margin: "var(--content-padding) 0" }}>
          <p style={{ marginBottom: "var(--input-padding)", marginLeft: "var(--input-padding)" }}>
            Rögzített feladatok ({selectedTaskIds.length} kiválasztva)
          </p>
          <div className="card-grid">
            {availableTasks.map((task) => {
              const selected = selectedTaskIds.includes(task.id);
              return (
                <div
                  key={task.id}
                  className="card"
                  onClick={() => toggleTask(task.id)}
                  style={{
                    cursor: "pointer",
                    borderColor: selected ? "var(--button-background)" : undefined,
                    backgroundColor: selected ? "rgba(38, 95, 24, 0.2)" : undefined,
                    userSelect: "none",
                  }}
                >
                  <p
                    style={{
                      fontSize: "12px",
                      color: selected ? "var(--button-background-hover)" : "gray",
                      marginBottom: "var(--input-padding)",
                    }}
                  >
                    {task.type}
                  </p>
                  <p>{task.description}</p>
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
