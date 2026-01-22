import { useCallback, useEffect } from "react";
import { usePracticeStore } from "../../../stores/practice.store";
import { TaskType, type PickOptions } from "../../../types/task.type";
import Button from "../../../components/button/Button";
import { randomSort } from "../../../modules/random.module";

const PickTask = () => {
  const { currentTask, answers, setAnswer } = usePracticeStore();

  useEffect(() => {
    const answer = answers.get(currentTask?.id || "") as PickOptions;
    if (!answer) {
      const options = currentTask?.options as unknown as PickOptions;
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
            style={{
              width: "var(--input-height)",
              backgroundColor: option.isCorrect ? "green" : "red",
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
    </div>
  );
};

export default PickTask;
