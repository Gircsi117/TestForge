import { usePracticeStore } from "../../../stores/practice.store";

const MatchTask = () => {
  const { currentTask } = usePracticeStore();

  return (
    <div>
      <p>{currentTask?.description}</p>
    </div>
  );
};

export default MatchTask;
