import { Box, Container } from "@mui/material";
import React from "react";
import RecordTable from "src/components/Recordings/RecordTable";


function Recordings({ friendly_id }) {

  return (
    <>
 
  <div>
  <Container maxWidth={"600px"}>
    <Box>
    <RecordTable friendly_id={friendly_id}/>
    </Box>
  </Container>
</div>
   

    
      

    
    </>
  );
}

export default Recordings;
