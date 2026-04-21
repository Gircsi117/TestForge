import React from "react";
import {
  TaskType,
  type MatchOptions,
  type PickOptions,
  type SortOptions,
  type Task,
} from "../../types/task.type";
import { useNavigate } from "react-router-dom";
import Button from "../../components/button/Button";
import { FaPencilAlt } from "react-icons/fa";

type Props = {
  categoryId: string;
  task: Task;
};

const TaskCard: React.FC<Props> = ({ categoryId, task }) => {
  const navigate = useNavigate();

  const getOptions = () => {
    if (task.type === TaskType.ESSAY) return null;

    if (
      task.type === TaskType.SINGLE_PICK ||
      task.type === TaskType.MULTI_PICK
    ) {
      const options = task.options as PickOptions;
      return (
        <>
          {options.map((option, index) => (
            <p key={index}>
              <span>{option.isCorrect ? "✅" : "❌"}</span> {option.text}
            </p>
          ))}
        </>
      );
    }

    if (task.type === TaskType.SORTING) {
      const options = task.options as SortOptions;
      return (
        <>
          {options
            .sort((option) => option.index)
            .map((option, index) => (
              <p key={index}>
                <span>{index + 1}.</span> {option.text}
              </p>
            ))}
        </>
      );
    }

    if (task.type === TaskType.MATCHING) {
      const options = task.options as MatchOptions;
      return (
        <>
          {options.groups.map((name, index) => (
            <p key={index}>{name}</p>
          ))}

          {options.items.map((item, index) => (
            <p key={index}>
              {item.text} - {item.group}
            </p>
          ))}
        </>
      );
    }

    return null;
  };

  return (
    <div key={task.id} className="card">
      <h3>{task.description}</h3>
      <p>Type: {task.type}</p>
      <div style={{ margin: "12px 0px", flex: 1 }}>{getOptions()}</div>

      <Button
        icon={<FaPencilAlt />}
        onClick={() => navigate(`/tasks/${categoryId}/${task.id}`)}
        style={{ width: "100%", justifyContent: "center" }}
      >
        Szerkesztés
      </Button>
    </div>
  );
};

export default TaskCard;
