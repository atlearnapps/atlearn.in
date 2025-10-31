// CustomTooltip.jsx
import React from "react";
import { Tooltip, tooltipClasses } from "@mui/material";
import { styled } from "@mui/system";

const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#333",
    color: "#fff",
    fontSize: 12,
    borderRadius: 4,
    padding: "8px 10px",
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "#333",
  },
}));

const CustomTooltip = ({ title, children, placement = "top" }) => {
  return (
    <StyledTooltip title={title} placement={placement}>
      {children}
    </StyledTooltip>
  );
};

export default CustomTooltip;
