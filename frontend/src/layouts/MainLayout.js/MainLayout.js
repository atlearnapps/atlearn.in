import { Box } from '@mui/material';
import React from 'react'
import NewNavBar from 'src/components/navbar/NewNavBar';
import Footer from "src/components/footer/Footer";
import { Outlet } from 'react-router-dom';

function MainLayout() {
  return (
    <div className="main-container">
    <NewNavBar />
 <Box className="main-content">
 <Outlet />
 </Box>
 <Footer />
</div>
  )
}

export default MainLayout
