import React from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: React.ReactNode;
  children?: React.ReactNode | React.ReactNode[] | string;
  btnType?: "primary" | "secondary" | "tertiary" | "contrast";
};

const Button: React.FC<ButtonProps> = ({
  icon,
  btnType = "primary",
  children,
  ...props
}) => {
  return (
    <button
      {...props}
      className={`btn ${btnType}-btn ${icon ? "icon-btn" : ""} ${
        children && icon ? "icon-btn-with-text" : ""
      }`.trim()}
    >
      {icon && typeof icon != "boolean" && (
        <span className="btn-icon">{icon}</span>
      )}
      {children && <span className="btn-text">{children}</span>}
    </button>
  );
};

export default Button;
