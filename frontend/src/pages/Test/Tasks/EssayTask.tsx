import { usePracticeStore } from '../../../stores/practice.store'

const EssayTask = () => {
  const {currentTask} = usePracticeStore()

  return (
    <div>
      <p>{currentTask?.description}</p>

      <textarea style={{width: "100%", height: "200px"}}></textarea>

    </div>
  )
}

export default EssayTask