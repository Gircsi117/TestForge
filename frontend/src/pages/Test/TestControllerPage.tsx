import React from "react";

type Props = {
  type: "new" | "edit";
};

const TestControllerPage: React.FC<Props> = ({ type }) => {
  return <div>{type}</div>;
};

export default TestControllerPage;
