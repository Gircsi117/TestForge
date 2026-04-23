import { useEffect, useRef } from "react";
import { usePracticeStore } from "../../../stores/practice.store";
import type { EssayOptions } from "../../../types/task.type";

const EssayTask = () => {
  const { currentTask, answers, setAnswer, isDone, essayGrades, setEssayGrade } =
    usePracticeStore();

  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const answer = answers.get(currentTask?.id || "") as string;
    if (!answer) {
      setAnswer(currentTask?.id || "", "");
      return;
    }

    if (textRef.current) {
      textRef.current.value = answer;
    }
  }, []);

  const taskId = currentTask?.id || "";
  const content = (currentTask?.options as EssayOptions | null)?.content;
  const grade = essayGrades.get(taskId);

  return (
    <div>
      <p style={{ marginBottom: "20px" }}>{currentTask?.description}</p>

      <textarea
        ref={textRef}
        style={{ width: "100%", height: "200px" }}
        onChange={(e) => setAnswer(taskId, e.target.value)}
        disabled={isDone}
      ></textarea>

      {isDone && (
        <div style={{ marginTop: "20px" }}>
          {content && (
            <>
              <p style={{ marginBottom: "10px", color: "#94a3b8", fontSize: "14px" }}>
                Helyes válasz:
              </p>
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "var(--border-radius)",
                  backgroundColor: "rgba(52,211,153,0.08)",
                  border: "1px solid rgba(52,211,153,0.25)",
                  fontSize: "14px",
                  color: "#34d399",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  marginBottom: "16px",
                }}
              >
                {content}
              </div>
            </>
          )}

          <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "12px" }}>
            Értékeld a választ:
          </p>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => setEssayGrade(taskId, true)}
              style={{
                padding: "8px 20px",
                borderRadius: "var(--border-radius)",
                border: "1px solid",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 600,
                transition: "all 0.15s ease",
                backgroundColor: grade === true ? "rgba(52,211,153,0.18)" : "transparent",
                borderColor: grade === true ? "#34d399" : "rgba(52,211,153,0.3)",
                color: grade === true ? "#34d399" : "#94a3b8",
              }}
            >
              Helyes
            </button>
            <button
              onClick={() => setEssayGrade(taskId, false)}
              style={{
                padding: "8px 20px",
                borderRadius: "var(--border-radius)",
                border: "1px solid",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 600,
                transition: "all 0.15s ease",
                backgroundColor: grade === false ? "rgba(239,68,68,0.18)" : "transparent",
                borderColor: grade === false ? "#ef4444" : "rgba(239,68,68,0.3)",
                color: grade === false ? "#ef4444" : "#94a3b8",
              }}
            >
              Helytelen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EssayTask;
