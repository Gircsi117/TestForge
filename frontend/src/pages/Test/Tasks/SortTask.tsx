import { useCallback, useEffect } from "react";
import { usePracticeStore } from "../../../stores/practice.store";
import type { SortOptions } from "../../../types/task.type";
import Button from "../../../components/button/Button";
import { BiSolidDownvote, BiSolidUpvote } from "react-icons/bi";
import { randomSort } from "../../../modules/random.module";

const SortTask = () => {
  const { currentTask, answers, setAnswer, isDone } = usePracticeStore();

  useEffect(() => {
    const answer = answers.get(currentTask?.id || "") as SortOptions;
    if (answer) return;

    const options = structuredClone(
      currentTask?.options as unknown as SortOptions,
    );
    const initial = randomSort(options);
    setAnswer(currentTask?.id || "", initial);
  }, []);

  const getOptions = useCallback(() => {
    const options = answers.get(currentTask?.id || "") as SortOptions;
    return options || [];
  }, [answers]);

  return (
    <div>
      <p style={{ marginBottom: "20px" }}>{currentTask?.description}</p>

      {getOptions().map((option, index) => (
        <div
          key={option.index}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "10px",
          }}
        >
          <Button
            icon={<BiSolidUpvote />}
            disabled={index === 0 || isDone}
            onClick={() => {
              const options = getOptions();
              const temp = options[index - 1];
              options[index - 1] = options[index];
              options[index] = temp;
              setAnswer(currentTask?.id || "", options);
            }}
          />
          <Button
            icon={<BiSolidDownvote />}
            disabled={index === getOptions().length - 1 || isDone}
            onClick={() => {
              const options = getOptions();
              const temp = options[index + 1];
              options[index + 1] = options[index];
              options[index] = temp;
              setAnswer(currentTask?.id || "", options);
            }}
          />
          <p>{option.text}</p>
        </div>
      ))}

      {isDone && (
        <div style={{ marginTop: "20px" }}>
          <p style={{ marginBottom: "10px", color: "#94a3b8", fontSize: "14px" }}>
            Helyes sorrend:
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {[...(currentTask?.options as SortOptions)]
              .sort((a, b) => a.index - b.index)
              .map((option, index) => (
                <div
                  key={option.index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "6px 10px",
                    borderRadius: "var(--border-radius)",
                    backgroundColor: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: "#fb923c",
                      minWidth: "22px",
                    }}
                  >
                    {index + 1}.
                  </span>
                  <span style={{ fontSize: "14px" }}>{option.text}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortTask;
