import React from "react";
import {
  TaskType,
  type PickOptions,
  type TaskOptions,
} from "../../../types/task.type";
import Button from "../../../components/button/Button";
import InfoBox from "../../../components/info/InfoBox";
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
      <InfoBox>
        {type === TaskType.SINGLE_PICK
          ? "Adj meg legalább két lehetséges választ, majd a bal oldali kerek gombbal jelöld meg az egyetlen helyes választ."
          : "Adj meg legalább két lehetséges választ, majd a bal oldali négyzetgombokkal jelöld meg az összes helyes választ (több is lehet)."}
      </InfoBox>
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
              background: option.isCorrect ? "#265f18" : "var(--input-color)",
              border: `1px solid ${option.isCorrect ? "#34d399" : "var(--border-color)"}`,
              boxShadow: option.isCorrect ? "0 0 0 2px rgba(52,211,153,0.25)" : "none",
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
            style={{ background: "darkred" }}
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
