import { useEffect, useRef } from "react";
import { usePracticeStore } from "../../../stores/practice.store";

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

  return (
    <div>
      <p style={{ marginBottom: "20px" }}>{currentTask?.description}</p>

      <textarea
        ref={textRef}
        style={{ width: "100%", height: "200px" }}
        onChange={(e) => setAnswer(currentTask?.id || "", e.target.value)}
        disabled={isDone}
      ></textarea>
    </div>
  );
};

export default EssayTask;
