import type { StylesConfig } from "react-select";

export const selectStyles: StylesConfig = {
  control: (baseStyles) => ({
    ...baseStyles,
    backgroundColor: "var(--input-color)",
    color: "var(--font-color)",
    fontSize: "16px",
    border: "1px solid var(--border-color)",
    borderRadius: "4px",
    minHeight: "var(--input-height)",
    height: "var(--input-height)",
    boxShadow: "none",
    "&:hover": {
      borderColor: "var(--border-color)",
    },
  }),
  valueContainer: (baseStyles) => ({
    ...baseStyles,
    height: "var(--input-height)",
    padding: "0",
    paddingLeft: "var(--input-padding)",
    paddingRight: "var(--input-padding)",
    display: "flex",
    alignItems: "center",
  }),
  indicatorsContainer: (baseStyles) => ({
    ...baseStyles,
    height: "var(--input-height)",
  }),
  input: (baseStyles) => ({
    ...baseStyles,
    margin: "0px",
    padding: "0px",
    color: "var(--font-color)",
  }),
  
  singleValue: (baseStyles) => ({
    ...baseStyles,
    color: "var(--font-color)",
  }),
  
  menu: (baseStyles) => ({
    ...baseStyles,
    backgroundColor: "var(--input-color)",
    border: "1px solid var(--border-color)",
    borderRadius: "4px",
    zIndex: 9999,
  }),
  
  option: (baseStyles, state) => ({
    ...baseStyles,
    backgroundColor: state.isFocused 
      ? "var(--hover-color)" 
      : "var(--input-color)",
    color: "var(--font-color)",
    fontSize: "16px",
    padding: "var(--input-padding)",
    cursor: "pointer",
  }),
};
