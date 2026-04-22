import React from "react";
import {
  TaskType,
  type EssayOptions,
  type MatchOptions,
  type PickOptions,
  type SortOptions,
  type Task,
} from "../../types/task.type";
import { useNavigate } from "react-router-dom";
import Button from "../../components/button/Button";
import { FaPencilAlt } from "react-icons/fa";
import { TASK_TYPE_META } from "../../constants/taskTypeMeta";
import Label from "../../components/label/Label";

type Props = {
  categoryId: string;
  task: Task;
};

const TaskCard: React.FC<Props> = ({ categoryId, task }) => {
  const navigate = useNavigate();
  const meta = TASK_TYPE_META[task.type];

  const getOptions = () => {
    if (task.type === TaskType.ESSAY) {
      const options = task.options as EssayOptions | null;
      if (!options?.content) return null;
      return (
        <div
          style={{
            padding: "6px 10px",
            borderRadius: "var(--border-radius)",
            backgroundColor: "rgba(255,255,255,0.04)",
            fontSize: "14px",
            color: "#94a3b8",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {options.content}
        </div>
      );
    }

    if (
      task.type === TaskType.SINGLE_PICK ||
      task.type === TaskType.MULTI_PICK
    ) {
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
              <span
                style={{
                  fontSize: "14px",
                  color: option.isCorrect ? "#34d399" : "var(--font-color)",
                }}
              >
                {option.text}
              </span>
            </div>
          ))}
        </div>
      );
    }

    if (task.type === TaskType.SORTING) {
      const options = [...(task.options as SortOptions)].sort(
        (a, b) => a.index - b.index,
      );
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
          <div
            style={{
              display: "flex",
              gap: "6px",
              flexWrap: "wrap",
              marginBottom: "4px",
            }}
          >
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
              <span style={{ color: "#34d399", fontSize: "12px" }}>
                {item.group}
              </span>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="card">
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "8px",
          marginBottom: "10px",
        }}
      >
        <h3 style={{ fontSize: "16px", lineHeight: "1.4", flex: 1 }}>
          {task.description}
        </h3>
        <Label background={meta.bg} color={meta.color}>
          {meta.label}
        </Label>
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
