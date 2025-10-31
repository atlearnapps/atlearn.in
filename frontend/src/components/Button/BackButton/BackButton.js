import { Button } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
function BackButton() {
    const navigate = useNavigate();
  return (
    <Button onClick={()=>navigate(-1)} sx={{ border: "1px solid black" }}>
    <ArrowBackIcon sx={{ mr: 1 }} fontSize="small" />
    Back
  </Button>
  )
}

export default BackButton
