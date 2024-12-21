import React from "react";
import HeaderComponent from "../HeaderComponent/HeaderComponent";
const DefaultComponent = ({ children }) => {
  return (
    <div>
      <HeaderComponent />
      <div className="mt-20">{children}</div>
    </div>
  );
};

export default DefaultComponent;
