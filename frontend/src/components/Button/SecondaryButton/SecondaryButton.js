import React from "react";
import { Button } from "@mui/material";
import "./SecondaryButton.css";
function SecondaryButton({ children, onClick, style, disabled }) {
  return (
    <Button
      className="secondaryButton"
      onClick={onClick}
      style={style && style}
      disabled={disabled}
    >
      {children}
    </Button>
  );
}

export default SecondaryButton;
