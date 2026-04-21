import { useCallback, useEffect } from "react";
import { usePracticeStore } from "../../../stores/practice.store";
import { TaskType, type PickOptions } from "../../../types/task.type";
import Button from "../../../components/button/Button";
import { randomSort } from "../../../modules/random.module";

const PickTask = () => {
  const { currentTask, answers, setAnswer, isDone } = usePracticeStore();

  useEffect(() => {
    const answer = answers.get(currentTask?.id || "") as PickOptions;
    if (!answer) {
      const options = structuredClone(
        currentTask?.options as unknown as PickOptions,
      );
      const initialAnswers = randomSort(
        options.map((option) => ({
          ...option,
          isCorrect: false,
        })),
      );

      setAnswer(currentTask?.id || "", initialAnswers);
      return;
    }
  }, []);

  const getOptions = useCallback(() => {
    const options = answers.get(currentTask?.id || "") as PickOptions;
    return options || [];
  }, [answers]);

  return (
    <div>
      <p style={{ marginBottom: "20px" }}>{currentTask?.description}</p>

      {getOptions().map((option, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "10px",
          }}
        >
          <Button
            disabled={isDone}
            style={{
              width: "var(--input-height)",
              backgroundColor: option.isCorrect ? "green" : "red",
              ...(currentTask?.type === TaskType.SINGLE_PICK
                ? { borderRadius: "100%" }
                : {}),
            }}
            onClick={() => {
              const x = getOptions();

              if (currentTask?.type === TaskType.SINGLE_PICK) {
                for (let i = 0; i < x.length; i++) {
                  x[i].isCorrect = false;
                }
              }

              x[index].isCorrect = !option.isCorrect;

              setAnswer(currentTask?.id || "", x);
            }}
          ></Button>

          <p>{option.text}</p>
        </div>
      ))}

      {isDone && (
        <div style={{ marginTop: "20px" }}>
          <p style={{ marginBottom: "10px", color: "#94a3b8", fontSize: "14px" }}>
            Helyes válasz(ok):
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {(currentTask?.options as PickOptions).map((option, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 10px",
                  borderRadius: "var(--border-radius)",
                  backgroundColor: option.isCorrect
                    ? "rgba(5,150,105,0.15)"
                    : "rgba(255,255,255,0.04)",
                  border: `1px solid ${option.isCorrect ? "rgba(52,211,153,0.3)" : "rgba(255,255,255,0.06)"}`,
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
        </div>
      )}
    </div>
  );
};

export default PickTask;
