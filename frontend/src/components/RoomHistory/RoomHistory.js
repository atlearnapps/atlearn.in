import { Box, Container } from "@mui/material";
import React from "react";
import RoomHistoryTable from "./RoomHistoryTable";


function RoomHistory({ meeting_id }) {

  return (
    <>
 
  <div>
  <Container maxWidth={"600px"}>
    <Box>
        <RoomHistoryTable meeting_id={meeting_id} />
    </Box>
  </Container>
</div>
   

    
      

    
    </>
  );
}

export default RoomHistory;
