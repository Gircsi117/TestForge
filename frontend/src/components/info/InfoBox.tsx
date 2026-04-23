import React from "react";
import { FaInfoCircle } from "react-icons/fa";

type Props = {
  children: React.ReactNode;
};

const InfoBox: React.FC<Props> = ({ children }) => (
  <div className="info-box">
    <FaInfoCircle className="info-box-icon" />
    <span>{children}</span>
  </div>
);

export default InfoBox;
