import { Box } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import NewFooter from "src/components/footer/NewFooter";
import ModeratorNavbar from "src/components/navbar/ModeratorNavbar";

function JoinRoomLayout({ children }) {
  const { user } = useSelector((state) => state.user);
  return (
    <div className="main-container">
      {user?.user && (
   <ModeratorNavbar /> 
      )}
    
      <Box className="main-content">{children}</Box>
      <NewFooter />
    </div>
  );
}

export default JoinRoomLayout;
