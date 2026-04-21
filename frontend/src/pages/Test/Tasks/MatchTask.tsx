import { useCallback, useEffect } from "react";
import { usePracticeStore } from "../../../stores/practice.store";
import type { MatchOptions } from "../../../types/task.type";
import { randomSort } from "../../../modules/random.module";

const MatchTask = () => {
  const { currentTask, answers, setAnswer, isDone } = usePracticeStore();

  useEffect(() => {
    const answer = answers.get(currentTask?.id || "") as MatchOptions;
    if (answer) return;

    const options = structuredClone(
      currentTask?.options as unknown as MatchOptions,
    );
    const initial = {
      groups: options.groups,
      items: randomSort(
        options.items.map((item) => ({
          text: item.text,
          group: "",
        })),
      ),
    };

    setAnswer(currentTask?.id || "", initial);
  }, []);

  const getOptions = useCallback(() => {
    const options = answers.get(currentTask?.id || "") as MatchOptions;
    return options;
  }, [answers]);

  return (
    <div>
      <p style={{ marginBottom: "20px" }}>{currentTask?.description}</p>
      {getOptions()?.items.map((item, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "10px",
          }}
        >
          <div style={{ minWidth: 200 }}>
            <select
              disabled={isDone}
              value={item.group}
              onChange={(e) => {
                const options = getOptions();
                options.items[index].group = e.target.value;
                setAnswer(currentTask?.id || "", options);
              }}
            >
              <option value="">Csoport kiválasztása</option>
              {getOptions()?.groups.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <p>{item.text}</p>
        </div>
      ))}

      {isDone && (
        <div style={{ marginTop: "20px" }}>
          <p style={{ marginBottom: "10px", color: "#94a3b8", fontSize: "14px" }}>
            Helyes csoportosítás:
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
            {(currentTask?.options as MatchOptions).groups.map((g) => (
              <span
                key={g}
                style={{
                  fontSize: "12px",
                  padding: "2px 10px",
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
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {(currentTask?.options as MatchOptions).items.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 10px",
                  borderRadius: "var(--border-radius)",
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  fontSize: "14px",
                }}
              >
                <span style={{ flex: 1 }}>{item.text}</span>
                <span style={{ color: "#94a3b8", fontSize: "12px" }}>→</span>
                <span style={{ color: "#34d399", fontSize: "12px" }}>{item.group}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchTask;
