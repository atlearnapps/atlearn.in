import React from 'react'
import {
    Box,
    Button,
    Container,
    Divider,
    Typography,
  } from "@mui/material";
function Delete() {
  return (
    <Box
    sx={{
      width: "100%",
      // minHeight: "60vh",
      bgcolor: "background.paper",
      borderRadius: 2,
    }}
  >
    <Box>
      <Typography sx={{ fontSize: "25px", ml: 2, pt:2 }} gutterBottom>
        Permanently Delete your Account
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ mt:6,pb:8 }}>
        <Container>
            
            <Typography  gutterBottom>
            If you choose to delete your account, it will NOT be recoverable. All information regarding your account, including settings, rooms, and recording will be removed.
      </Typography>
          
      <Box sx={{display:"flex",justifyContent:"center" ,mt:2}}>
        <Button color='error' sx={{backgroundColor:"#cd201f",color:"#fff",padding:"10px", "&:hover":{backgroundColor:"#cd201f",},}}>
            Yes,I would like to delete my account
            </Button>
      </Box>
        </Container>
      </Box>
      
    </Box>
  </Box>
  )
}

export default Delete
