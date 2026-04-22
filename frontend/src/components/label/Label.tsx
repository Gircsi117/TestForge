import React from "react";

type Props = {
  background: string;
  color: string;
  children: React.ReactNode;
};

const Label: React.FC<Props> = ({ background, color, children }) => {
  return (
    <span
      style={{
        fontSize: "11px",
        fontWeight: "600",
        padding: "2px 8px",
        borderRadius: "999px",
        backgroundColor: background,
        color: color,
        border: `1px solid ${color}40`,
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      {children}
    </span>
  );
};

export default Label;
