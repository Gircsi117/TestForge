import React from "react";
import {
  TaskType,
  type MatchOptions,
  type PickOptions,
  type SortOptions,
  type Task,
} from "../../types/task.type";
import { useNavigate } from "react-router-dom";
import Button from "../../components/button/Button";
import { FaPencilAlt } from "react-icons/fa";

type Props = {
  categoryId: string;
  task: Task;
};

const TYPE_META: Record<TaskType, { label: string; color: string; bg: string }> = {
  [TaskType.SINGLE_PICK]: { label: "Egyválasztós", color: "#60a5fa", bg: "rgba(37,99,235,0.15)" },
  [TaskType.MULTI_PICK]:  { label: "Többválasztós", color: "#a78bfa", bg: "rgba(109,40,217,0.15)" },
  [TaskType.SORTING]:     { label: "Sorrend",       color: "#fb923c", bg: "rgba(234,88,12,0.15)"  },
  [TaskType.MATCHING]:    { label: "Párosítás",     color: "#34d399", bg: "rgba(5,150,105,0.15)"  },
  [TaskType.ESSAY]:       { label: "Esszé",         color: "#94a3b8", bg: "rgba(100,116,139,0.15)"},
};

const TaskCard: React.FC<Props> = ({ categoryId, task }) => {
  const navigate = useNavigate();
  const meta = TYPE_META[task.type];

  const getOptions = () => {
    if (task.type === TaskType.ESSAY) return null;

    if (task.type === TaskType.SINGLE_PICK || task.type === TaskType.MULTI_PICK) {
      const options = task.options as PickOptions;
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {options.map((option, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "4px 8px",
                borderRadius: "var(--border-radius)",
                backgroundColor: option.isCorrect
                  ? "rgba(5,150,105,0.15)"
                  : "rgba(255,255,255,0.04)",
              }}
            >
              <span style={{ fontSize: "14px", flexShrink: 0 }}>
                {option.isCorrect ? "✅" : "❌"}
              </span>
              <span style={{ fontSize: "14px", color: option.isCorrect ? "#34d399" : "var(--font-color)" }}>
                {option.text}
              </span>
            </div>
          ))}
        </div>
      );
    }

    if (task.type === TaskType.SORTING) {
      const options = [...(task.options as SortOptions)].sort((a, b) => a.index - b.index);
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {options.map((option, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "4px 8px",
                borderRadius: "var(--border-radius)",
                backgroundColor: "rgba(255,255,255,0.04)",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "#fb923c",
                  minWidth: "20px",
                }}
              >
                {index + 1}.
              </span>
              <span style={{ fontSize: "14px" }}>{option.text}</span>
            </div>
          ))}
        </div>
      );
    }

    if (task.type === TaskType.MATCHING) {
      const options = task.options as MatchOptions;
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "4px" }}>
            {options.groups.map((g, i) => (
              <span
                key={i}
                style={{
                  fontSize: "12px",
                  padding: "2px 8px",
                  borderRadius: "999px",
                  backgroundColor: "rgba(52,211,153,0.15)",
                  color: "#34d399",
                  border: "1px solid rgba(52,211,153,0.3)",
                }}
              >
                {g}
              </span>
            ))}
          </div>
          {options.items.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "4px 8px",
                borderRadius: "var(--border-radius)",
                backgroundColor: "rgba(255,255,255,0.04)",
                fontSize: "14px",
              }}
            >
              <span style={{ flex: 1 }}>{item.text}</span>
              <span style={{ color: "#94a3b8", fontSize: "12px" }}>→</span>
              <span style={{ color: "#34d399", fontSize: "12px" }}>{item.group}</span>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="card">
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px", marginBottom: "10px" }}>
        <h3 style={{ fontSize: "16px", lineHeight: "1.4", flex: 1 }}>{task.description}</h3>
        <span
          style={{
            fontSize: "11px",
            fontWeight: "600",
            padding: "2px 8px",
            borderRadius: "999px",
            backgroundColor: meta.bg,
            color: meta.color,
            border: `1px solid ${meta.color}40`,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {meta.label}
        </span>
      </div>

      <div style={{ flex: 1, marginBottom: "12px" }}>{getOptions()}</div>

      <Button
        icon={<FaPencilAlt />}
        onClick={() => navigate(`/tasks/${categoryId}/${task.id}`)}
        style={{ width: "100%", justifyContent: "center" }}
      >
        Szerkesztés
      </Button>
    </div>
  );
};

export default TaskCard;
