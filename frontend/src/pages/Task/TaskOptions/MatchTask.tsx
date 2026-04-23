import React from "react";
import type { MatchOptions, TaskOptions, TaskType } from "../../../types/task.type";
import Button from "../../../components/button/Button";
import InfoBox from "../../../components/info/InfoBox";
import { FaPlus, FaTrash } from "react-icons/fa";

type Props = {
  type: TaskType;
  options: TaskOptions;
  setOptions: React.Dispatch<React.SetStateAction<TaskOptions>>;
};

const MatchTask: React.FC<Props> = ({ options, setOptions }) => {
  const match = (options || { groups: [], items: [] }) as MatchOptions;

  const addGroup = () => {
    setOptions((p) => {
      const prev = (p || { groups: [], items: [] }) as MatchOptions;
      return { ...prev, groups: [...prev.groups, ""] };
    });
  };

  const updateGroup = (index: number, value: string) => {
    setOptions((p) => {
      const prev = (p as MatchOptions);
      const oldName = prev.groups[index];
      const groups = prev.groups.map((g, i) => (i === index ? value : g));
      const items = prev.items.map((item) =>
        item.group === oldName ? { ...item, group: value } : item
      );
      return { groups, items };
    });
  };

  const removeGroup = (index: number) => {
    setOptions((p) => {
      const prev = p as MatchOptions;
      const removed = prev.groups[index];
      return {
        groups: prev.groups.filter((_, i) => i !== index),
        items: prev.items.map((item) =>
          item.group === removed ? { ...item, group: "" } : item
        ),
      };
    });
  };

  const addItem = () => {
    setOptions((p) => {
      const prev = (p || { groups: [], items: [] }) as MatchOptions;
      return { ...prev, items: [...prev.items, { text: "", group: "" }] };
    });
  };

  const updateItemText = (index: number, text: string) => {
    setOptions((p) => {
      const prev = p as MatchOptions;
      const items = prev.items.map((item, i) => (i === index ? { ...item, text } : item));
      return { ...prev, items };
    });
  };

  const updateItemGroup = (index: number, group: string) => {
    setOptions((p) => {
      const prev = p as MatchOptions;
      const items = prev.items.map((item, i) => (i === index ? { ...item, group } : item));
      return { ...prev, items };
    });
  };

  const removeItem = (index: number) => {
    setOptions((p) => {
      const prev = p as MatchOptions;
      return { ...prev, items: prev.items.filter((_, i) => i !== index) };
    });
  };

  return (
    <div>
      <InfoBox>
        Először hozd létre a csoportokat (kategóriákat), majd add meg az elemeket és rendeld mindegyiket a megfelelő csoporthoz a legördülő menüből. A tanuló feladata az elemeket a helyes csoportba sorolni.
      </InfoBox>
      <div style={{ marginBottom: "20px" }}>
        <Button icon={<FaPlus />} onClick={addGroup}>
          Új csoport
        </Button>
        {match.groups.map((group, index) => (
          <div
            key={index}
            style={{ display: "flex", gap: "10px", marginTop: "10px", alignItems: "center" }}
          >
            <span
              style={{
                minWidth: "24px",
                textAlign: "center",
                fontWeight: "bold",
                color: "#aaa",
              }}
            >
              {index + 1}.
            </span>
            <input
              type="text"
              value={group}
              placeholder="Csoport neve..."
              style={{ width: "100%" }}
              onChange={(e) => updateGroup(index, e.target.value)}
            />
            <Button
              icon={<FaTrash />}
              style={{ backgroundColor: "darkred" }}
              onClick={() => removeGroup(index)}
            />
          </div>
        ))}
      </div>

      <hr style={{ borderColor: "#444", marginBottom: "16px" }} />

      <Button icon={<FaPlus />} onClick={addItem}>
        Új elem
      </Button>
      {match.items.map((item, index) => (
        <div
          key={index}
          style={{ display: "flex", gap: "10px", marginTop: "10px", alignItems: "center" }}
        >
          <input
            type="text"
            value={item.text}
            placeholder="Elem szövege..."
            style={{ width: "100%" }}
            onChange={(e) => updateItemText(index, e.target.value)}
          />
          <select
            value={item.group}
            style={{ minWidth: "160px", padding: "6px 8px" }}
            onChange={(e) => updateItemGroup(index, e.target.value)}
          >
            <option value="">— Válassz csoportot —</option>
            {match.groups.map((group, gi) => (
              <option key={gi} value={group}>
                {group || `(${gi + 1}. csoport)`}
              </option>
            ))}
          </select>
          <Button
            icon={<FaTrash />}
            style={{ backgroundColor: "darkred" }}
            onClick={() => removeItem(index)}
          />
        </div>
      ))}
    </div>
  );
};

export default MatchTask;
