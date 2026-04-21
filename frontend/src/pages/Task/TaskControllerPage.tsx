import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../modules/error.module";
import ForgeAxios from "../../modules/axios.module";
import { TaskType, type Task, type TaskOptions } from "../../types/task.type";
import InputHolder from "../../components/input/InputHolder";
import PickTask from "./TaskOptions/PickTask";
import Button from "../../components/button/Button";
import { FaSave, FaTrash } from "react-icons/fa";
import SortTask from "./TaskOptions/SortTask";
import MatchTask from "./TaskOptions/MatchTask";
import EssayTask from "./TaskOptions/EssayTask";

const TaskControllerPage = () => {
  const { categoryId = "", taskId = "" } = useParams();
  const [task, setTask] = useState<Task | null>(null);
  const [type, setType] = useState<TaskType>(TaskType.SINGLE_PICK);
  const [options, setOptions] = useState<TaskOptions>([]);

  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

  const isEdit = useCallback(() => {
    return !!taskId;
  }, [taskId]);

  const getTask = useCallback(async () => {
    try {
      const res = await ForgeAxios({
        method: "GET",
        url: `/task/${categoryId}/${taskId}`,
      });

      console.log(res.data.task);

      setTask(res.data.task || null);
      resetoptions(res.data.task.type);
      setType(res.data.task.type);
      setOptions(res.data.task.options);
    } catch (error) {
      toast.error(getErrorMessage(error as Error));
      console.error(error);
    }
  }, [taskId, categoryId]);

  useEffect(() => {
    if (!isEdit()) return;
    getTask();
  }, [categoryId, isEdit, getTask]);

  useEffect(() => {
    if (!task) return;

    setType(task.type);
    descriptionRef.current!.value = task.description;
  }, [task]);

  const createTask = async () => {
    const description = descriptionRef.current?.value;

    try {
      const res = await ForgeAxios({
        method: "POST",
        url: `/task`,
        data: {
          categoryId,
          type,
          description,
          options,
        },
      });

      console.log(res.data);
      if (res.data.success) {
        toast.success("Feladat sikeresen létrehozva!");
      }
    } catch (error) {
      toast.error(getErrorMessage(error as Error));
      console.error(error);
    }
  };

  const updateTask = async () => {
    const description = descriptionRef.current?.value;

    try {
      const res = await ForgeAxios({
        method: "PUT",
        url: `/task/${taskId}`,
        data: {
          description,
          options,
        },
      });

      if (res.data.success) {
        toast.success("Feladat sikeresen módosítva!");
      }
    } catch (error) {
      toast.error(getErrorMessage(error as Error));
      console.error(error);
    }
  };

  const deleteTask = async () => {
    try {
      const res = await ForgeAxios({
        method: "DELETE",
        url: `/task/${taskId}`,
      });

      if (res.data.success) {
        toast.success("Feladat sikeresen törölve!");
      }
    } catch (error) {
      toast.error(getErrorMessage(error as Error));
      console.error(error);
    }
  };

  const resetoptions = (type: TaskType) => {
    switch (type) {
      case TaskType.SINGLE_PICK:
        setOptions([]);
        break;
      case TaskType.MULTI_PICK:
        setOptions([]);
        break;
      case TaskType.SORTING:
        setOptions([]);
        break;
      case TaskType.MATCHING:
        setOptions({ groups: [], items: [] });
        break;
      case TaskType.ESSAY:
        setOptions({ content: "" });
        break;

      default:
        break;
    }
  };

  if (taskId && !task) return <main>Loading...</main>;

  return (
    <main>
      {isEdit() ? (
        <h1>Feladat szerkesztése</h1>
      ) : (
        <h1>Új feladat létrehozása</h1>
      )}
      <div
        style={{
          margin: "12px 0",
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          gap: "10px",
        }}
      >
        {!isEdit() && (
          <Button icon={<FaSave />} onClick={createTask}>
            Létrehozás
          </Button>
        )}
        {isEdit() && (
          <>
            <Button icon={<FaSave />} onClick={updateTask}>
              Módosítás
            </Button>
            <Button
              style={{ backgroundColor: "red" }}
              icon={<FaTrash />}
              onClick={deleteTask}
            >
              Törlés
            </Button>
          </>
        )}
      </div>

      {!isEdit() && (
        <select
          value={type}
          onChange={(e) => {
            const value = e.target.value as TaskType;
            setType(value);
            resetoptions(value);
          }}
        >
          <option value={TaskType.SINGLE_PICK}>Egyválasztós</option>
          <option value={TaskType.MULTI_PICK}>Többválasztós</option>
          <option value={TaskType.SORTING}>Rendezés</option>
          <option value={TaskType.MATCHING}>Párosítás</option>
          <option value={TaskType.ESSAY}>Esszé</option>
        </select>
      )}

      <InputHolder text="Kategória leírása">
        <textarea rows={5} ref={descriptionRef}></textarea>
      </InputHolder>

      {type === TaskType.SINGLE_PICK && (
        <PickTask type={type} options={options} setOptions={setOptions} />
      )}
      {type === TaskType.MULTI_PICK && (
        <PickTask type={type} options={options} setOptions={setOptions} />
      )}
      {type === TaskType.SORTING && (
        <SortTask type={type} options={options} setOptions={setOptions} />
      )}
      {type === TaskType.MATCHING && (
        <MatchTask type={type} options={options} setOptions={setOptions} />
      )}
      {type === TaskType.ESSAY && (
        <EssayTask options={options} setOptions={setOptions} />
      )}
    </main>
  );
};

export default TaskControllerPage;
