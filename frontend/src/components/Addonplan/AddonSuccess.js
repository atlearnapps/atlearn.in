import { Box, Typography } from '@mui/material'
import React from 'react'
import success from "src/images/success-removebg-preview.png";
function AddonSuccess() {
    const successImageStyle = {
        width: "120px",
        height: "120px",
      };
  return (
    <Box
    sx={{
      // minHeight: "200px",
      padding: { xs: 2, md: 4 },
      height:"30vh",
      width:"100%",
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      flexDirection:"column"
    }}
  >
         <img src={success} alt="" style={successImageStyle} />
         <Typography variant="h4">Payment Successful</Typography>
  </Box>
  )
}

export default AddonSuccess
