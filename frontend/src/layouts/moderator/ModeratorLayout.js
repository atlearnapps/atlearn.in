import { Box } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import NewFooter from "src/components/footer/NewFooter";
import ModeratorNavbar from "src/components/navbar/ModeratorNavbar";

function ModeratorLayout() {
  return (
    <div className="main-container">
    <ModeratorNavbar />
    <Box className="main-content">
    <Outlet />
    </Box>
    <NewFooter />
  </div>
  );
}

export default ModeratorLayout;
