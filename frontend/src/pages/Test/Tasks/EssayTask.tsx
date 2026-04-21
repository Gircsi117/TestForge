import { useEffect, useRef } from "react";
import { usePracticeStore } from "../../../stores/practice.store";
import type { EssayOptions } from "../../../types/task.type";

const EssayTask = () => {
  const { currentTask, answers, setAnswer, isDone } = usePracticeStore();

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

  const content = (currentTask?.options as EssayOptions | null)?.content;

  return (
    <div>
      <p style={{ marginBottom: "20px" }}>{currentTask?.description}</p>

      <textarea
        ref={textRef}
        style={{ width: "100%", height: "200px" }}
        onChange={(e) => setAnswer(currentTask?.id || "", e.target.value)}
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
                  marginBottom: "10px",
                }}
              >
                {content}
              </div>
            </>
          )}
          <p style={{ color: "#94a3b8", fontSize: "14px" }}>
            Az esszé feladatok értékelése manuálisan történik.
          </p>
        </div>
      )}
    </div>
  );
};

export default EssayTask;
