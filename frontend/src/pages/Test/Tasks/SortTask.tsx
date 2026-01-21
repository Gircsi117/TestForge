import { usePracticeStore } from "../../../stores/practice.store";

const SortTask = () => {
  const { currentTask } = usePracticeStore();

  return (
    <div>
      <p>{currentTask?.description}</p>
    </div>
  );
};

export default SortTask;
