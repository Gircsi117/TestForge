import React, { useEffect } from "react";
import type { Category } from "../../types/category.type";
import ForgeAxios from "../../modules/axios.module";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../modules/error.module";
import type { Task } from "../../types/task.type";
import TaskCard from "./TaskCard";

type Props = {
  category: Category;
};

const TaskController: React.FC<Props> = ({ category }) => {
  const [tasks, setTasks] = React.useState<Task[]>([]);

  const getTasks = async () => {
    try {
      const res = await ForgeAxios({
        method: "GET",
        url: `/task/${category.id}`,
      });

      console.log(res.data);
      setTasks(res.data.tasks);
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error as Error));
    }
  };

  useEffect(() => {
    getTasks();
  }, [category]);

  return (
    <>
      <h2 style={{ marginBottom: "10px", marginTop: "50px" }}>Feladatok</h2>
      <div className="card-grid">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </>
  );
};

export default TaskController;
