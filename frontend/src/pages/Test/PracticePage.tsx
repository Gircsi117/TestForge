import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../modules/error.module";
import { useCallback, useEffect } from "react";
import ForgeAxios from "../../modules/axios.module";
import Button from "../../components/button/Button";
import { usePracticeStore } from "../../stores/practice.store";
import { TaskType } from "../../types/task.type";
import EssayTask from "./Tasks/EssayTask";
import MatchTask from "./Tasks/MatchTask";
import PickTask from "./Tasks/PickTask";
import SortTask from "./Tasks/SortTask";
import { AiOutlineFileDone } from "react-icons/ai";
import { FaSave } from "react-icons/fa";

const PracticePage = () => {
  const { id } = useParams();

  const {
    tasks,
    setTasks,
    currentTask,
    setCurrentTask,
    answers,
    clearAnswers,
    isDone,
    setIsDone,
  } = usePracticeStore();

  const getTasks = async () => {
    try {
      console.log(id);

      const res = await ForgeAxios({
        method: "GET",
        url: `/test/${id}/practice`,
      });

      console.log(res.data);
      setTasks(res.data.tasks || []);
      setCurrentTask(res.data.tasks[0] || null);
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error as Error));
    }
  };

  useEffect(() => {
    getTasks();

    return () => {
      setTasks([]);
      setCurrentTask(null);
      clearAnswers();
      setIsDone(false);
    };
  }, []);

  const generateTask = useCallback(() => {
    switch (currentTask?.type) {
      case TaskType.ESSAY:
        return <EssayTask key={currentTask.id} />;
      case TaskType.MATCHING:
        return <MatchTask key={currentTask.id} />;
      case TaskType.SINGLE_PICK:
        return <PickTask key={currentTask.id} />;
      case TaskType.MULTI_PICK:
        return <PickTask key={currentTask.id} />;
      case TaskType.SORTING:
        return <SortTask key={currentTask.id} />;
      default:
        return null;
    }
  }, [currentTask]);

  if (!tasks.length) return <div className="page">Loading...</div>;

  return (
    <div className="page">
      <div
        style={{
          display: "flex",
          gap: "1rem",
          overflowX: "auto",
          width: "100%",
          marginBottom: "1rem",
        }}
      >
        {tasks.map((task, index) => (
          <Button
            key={task.id}
            style={{ minWidth: "40px", backgroundColor: currentTask?.id == task.id ? "#07b107" : "" }}
            onClick={() => setCurrentTask(task)}
            
          >
            {index + 1}.
          </Button>
        ))}
      </div>
      <div style={{ marginBottom: "2rem" }}>
        {answers.size == tasks.length && !isDone && (
          <Button
            onClick={() => {
              setIsDone(true);
              setCurrentTask(tasks[0])
            }}
            style={{ marginLeft: "auto" }}
            icon={<AiOutlineFileDone />}
          >
            Leadás
          </Button>
        )}
        {isDone && (
          <Button
            onClick={() => toast.warn("Coming soon!")}
            style={{ marginLeft: "auto" }}
            icon={<FaSave />}
          >
            Mentés
          </Button>
        )}
      </div>
      {generateTask()}
    </div>
  );
};

export default PracticePage;
