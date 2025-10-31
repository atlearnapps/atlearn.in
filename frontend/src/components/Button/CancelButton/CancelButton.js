import React from "react";
import { Button } from "@mui/material";
import "./CancelButton.css";
function CancelButton({ children, onClick, style, disabled }) {
  return (
    <Button
      className="cancelButton"
      onClick={onClick}
      style={style && style}
      disabled={disabled}
    >
      {children}
    </Button>
  );
}

export default CancelButton;
