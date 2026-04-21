import React from "react";
import {
  TaskType,
  type PickOptions,
  type TaskOptions,
} from "../../../types/task.type";
import Button from "../../../components/button/Button";
import { FaPlus, FaTrash } from "react-icons/fa";

type Props = {
  type: TaskType;
  options: TaskOptions;
  setOptions: React.Dispatch<React.SetStateAction<TaskOptions>>;
};

const PickTask: React.FC<Props> = ({ type, options, setOptions }) => {
  const addOption = () => {
    setOptions((p) => {
      const prev = p as PickOptions;

      return [
        ...prev,
        {
          text: "",
          isCorrect: false,
        },
      ];
    });
  };

  return (
    <div>
      <Button icon={<FaPlus />} onClick={addOption}>
        Új opció
      </Button>
      {((options || []) as PickOptions).map((option, index) => (
        <div
          key={index}
          style={{ display: "flex", gap: "10px", marginTop: "10px" }}
        >
          <Button
            icon
            style={{
              backgroundColor: option.isCorrect ? "green" : "red",
              ...(type === TaskType.SINGLE_PICK && { borderRadius: "100%" }),
            }}
            onClick={() => {
              setOptions((p) => {
                const prev = p as PickOptions;
                if (type === TaskType.SINGLE_PICK) {
                  prev.forEach((o, i) => {
                    o.isCorrect = i === index;
                  });
                } else {
                  prev[index].isCorrect = !prev[index].isCorrect;
                }
                return [...prev];
              });
            }}
          ></Button>
          <input
            type="text"
            value={option.text}
            style={{ width: "100%" }}
            onChange={(e) => {
              setOptions((p) => {
                const prev = p as PickOptions;
                prev[index].text = e.target.value;
                return [...prev];
              });
            }}
          />
          <Button
            icon={<FaTrash />}
            style={{ backgroundColor: "darkred" }}
            onClick={() => {
              setOptions((p) => {
                const prev = p as PickOptions;
                prev.splice(index, 1);
                return [...prev];
              });
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default PickTask;
