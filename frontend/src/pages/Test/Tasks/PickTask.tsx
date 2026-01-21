import { usePracticeStore } from '../../../stores/practice.store';

const PickTask = () => {
  const {currentTask} = usePracticeStore();

  return (
    <div>
      <p>{currentTask?.description}</p>
    </div>
  )
}

export default PickTask