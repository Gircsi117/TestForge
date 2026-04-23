import React from "react";
import type { SortOptions, TaskOptions, TaskType } from "../../../types/task.type";
import Button from "../../../components/button/Button";
import InfoBox from "../../../components/info/InfoBox";
import { FaArrowDown, FaArrowUp, FaPlus, FaTrash } from "react-icons/fa";

type Props = {
  type: TaskType;
  options: TaskOptions;
  setOptions: React.Dispatch<React.SetStateAction<TaskOptions>>;
};

const SortTask: React.FC<Props> = ({ options, setOptions }) => {
  const items = ((options || []) as SortOptions).slice().sort((a, b) => a.index - b.index);

  const addItem = () => {
    setOptions((p) => {
      const prev = (p || []) as SortOptions;
      return [...prev, { text: "", index: prev.length + 1 }];
    });
  };

  const updateText = (index: number, text: string) => {
    setOptions((p) => {
      const prev = (p as SortOptions).slice().sort((a, b) => a.index - b.index);
      prev[index] = { ...prev[index], text };
      return prev;
    });
  };

  const moveUp = (i: number) => {
    if (i === 0) return;
    setOptions((p) => {
      const prev = (p as SortOptions).slice().sort((a, b) => a.index - b.index);
      const tmp = prev[i].index;
      prev[i] = { ...prev[i], index: prev[i - 1].index };
      prev[i - 1] = { ...prev[i - 1], index: tmp };
      return prev;
    });
  };

  const moveDown = (i: number) => {
    if (i === items.length - 1) return;
    setOptions((p) => {
      const prev = (p as SortOptions).slice().sort((a, b) => a.index - b.index);
      const tmp = prev[i].index;
      prev[i] = { ...prev[i], index: prev[i + 1].index };
      prev[i + 1] = { ...prev[i + 1], index: tmp };
      return prev;
    });
  };

  const removeItem = (i: number) => {
    setOptions((p) => {
      const prev = (p as SortOptions).slice().sort((a, b) => a.index - b.index);
      prev.splice(i, 1);
      return prev.map((item, idx) => ({ ...item, index: idx + 1 }));
    });
  };

  return (
    <div>
      <InfoBox>
        Add meg az elemeket a helyes sorrendben. A nyilakkal módosíthatod a sorrendet – a tanuló véletlenszerű sorrendben fogja látni őket, és a helyes sorrendbe kell rendeznie.
      </InfoBox>
      <Button icon={<FaPlus />} onClick={addItem}>
        Új elem
      </Button>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: "10px", marginTop: "10px", alignItems: "center" }}>
          <span style={{ minWidth: "24px", textAlign: "center", fontWeight: "bold", color: "#aaa" }}>
            {i + 1}.
          </span>
          <Button icon={<FaArrowUp />} onClick={() => moveUp(i)} disabled={i === 0} />
          <Button icon={<FaArrowDown />} onClick={() => moveDown(i)} disabled={i === items.length - 1} />
          <input
            type="text"
            value={item.text}
            placeholder="Elem szövege..."
            style={{ width: "100%" }}
            onChange={(e) => updateText(i, e.target.value)}
          />
          <Button icon={<FaTrash />} style={{ backgroundColor: "darkred" }} onClick={() => removeItem(i)} />
        </div>
      ))}
    </div>
  );
};

export default SortTask;
