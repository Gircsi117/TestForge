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
        <div>
          <p>Helyes sorrend:</p>
          {(currentTask?.options as SortOptions).map((option, index) => (
            <p key={option.index}>
              {index + 1}. {option.text}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortTask;
