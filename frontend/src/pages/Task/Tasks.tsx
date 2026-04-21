import React, { useCallback, useEffect } from "react";
import type { Task } from "../../types/task.type";
import { getErrorMessage } from "../../modules/error.module";
import { toast } from "react-toastify/unstyled";
import ForgeAxios from "../../modules/axios.module";
import TaskCard from "./TaskCard";
import Button from "../../components/button/Button";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

type Props = {
  categoryId: string;
};

const Tasks: React.FC<Props> = ({ categoryId }) => {
  const navigate = useNavigate();
  const [tasks, setTasks] = React.useState<Task[]>([]);

  const getTasks = useCallback(async () => {
    try {
      const res = await ForgeAxios({
        method: "GET",
        url: `/task/${categoryId}`,
      });

      console.log(res.data);
      setTasks(res.data.tasks);
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error as Error));
    }
  }, [categoryId]);

  useEffect(() => {
    getTasks();
  }, [getTasks]);

  return (
    <div>
      <h2 style={{ marginBottom: "10px", marginTop: "50px" }}>Feladatok</h2>
      <Button
        icon={<FaPlus />}
        style={{ marginBottom: "10px" }}
        onClick={() => navigate(`/tasks/${categoryId}`)}
      >
        Új feladat
      </Button>
      <div className="card-grid">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} categoryId={categoryId} />
        ))}
      </div>
    </div>
  );
};

export default Tasks;
