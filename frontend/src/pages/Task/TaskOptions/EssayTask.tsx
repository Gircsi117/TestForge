import React from "react";
import { type EssayOptions, type TaskOptions } from "../../../types/task.type";
import InputHolder from "../../../components/input/InputHolder";

type Props = {
  options: TaskOptions;
  setOptions: React.Dispatch<React.SetStateAction<TaskOptions>>;
};

const EssayTask: React.FC<Props> = ({ options, setOptions }) => {
  const essay = options as EssayOptions;

  return (
    <InputHolder text="Tartalom (opcionális útmutató / minta szöveg)">
      <textarea
        rows={6}
        value={essay?.content ?? ""}
        onChange={(e) =>
          setOptions({ content: e.target.value })
        }
      />
    </InputHolder>
  );
};

export default EssayTask;
