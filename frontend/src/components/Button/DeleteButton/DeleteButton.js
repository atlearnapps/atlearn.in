import React from "react";
import { Button } from "@mui/material";
import "./DeleteButton.css";
function DeleteButton({ children, onClick, style, disabled }) {
  return (
    <Button
      style={style && style}
      className="removeButton"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
}

export default DeleteButton;
