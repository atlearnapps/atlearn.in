import React from "react";
import { Button } from "@mui/material";
import "./MainButton.css";
function MainButton({ children, onClick, style, disabled }) {
  return (
    <Button
      style={style && style}
      className="mainButton"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
}

export default MainButton;
