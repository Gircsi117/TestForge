import React from "react";
import { type EssayOptions, type TaskOptions } from "../../../types/task.type";
import InputHolder from "../../../components/input/InputHolder";
import InfoBox from "../../../components/info/InfoBox";

type Props = {
  options: TaskOptions;
  setOptions: React.Dispatch<React.SetStateAction<TaskOptions>>;
};

const EssayTask: React.FC<Props> = ({ options, setOptions }) => {
  const essay = options as EssayOptions;

  return (
    <div>
      <InfoBox>
        Esszé típusú feladatnál a tanuló szabad szöveges választ adhat.
        Opcionálisan megadhatsz opcionális jó választ.
      </InfoBox>
      <InputHolder text="Lehetséges jó válasz">
        <textarea
          rows={6}
          value={essay?.content ?? ""}
          onChange={(e) => setOptions({ content: e.target.value })}
        />
      </InputHolder>
    </div>
  );
};

export default EssayTask;
