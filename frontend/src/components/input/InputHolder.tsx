import React from "react";

type Props = {
  text: string;
  children?: React.ReactNode;
};

const InputHolder: React.FC<Props> = ({ text, children }) => {
  return (
    <div className="input-holder">
      <label className="input-label">{text}</label>
      {children}
    </div>
  );
};

export default InputHolder;
