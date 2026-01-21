import { useCallback, useEffect } from "react";
import { usePracticeStore } from "../../../stores/practice.store";
import type { MatchOptions } from "../../../types/task.type";
import Select from "react-select";
import { selectStyles } from "../../../modules/select.module";

const MatchTask = () => {
  const { currentTask, answers, setAnswer } = usePracticeStore();

  useEffect(() => {
    const answer = answers.get(currentTask?.id || "") as MatchOptions;
    if (answer) return;

    const options = currentTask?.options as unknown as MatchOptions;
    const initial = {
      groups: options.groups,
      items: options.items.map((item) => ({
        text: item.text,
        group: "",
      })),
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
          <Select
            styles={selectStyles}
            options={getOptions()?.groups.map((g) => ({ value: g, label: g }))}
            onChange={(e) => {
              console.log(e);
              const group = e ? (e as { value: string }).value : "";

              const options = getOptions();
              options.items[index].group = group;
              
              setAnswer(currentTask?.id || "", options);
            }}
            value={{value: item.group, label: item.group}}
          />
          <p>{item.text}</p>
        </div>
      ))}
    </div>
  );
};

export default MatchTask;
