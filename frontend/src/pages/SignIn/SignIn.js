import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import "./SignIn.css";
import { LoginForm } from "src/sections/auth/login";
// import Logingimage from "../../images/6368592_1-removebg-preview.png";
// import Loginimage from "../../images/login/Rectangle 345.svg";
// import Logo from "../../images/logo/atlearn_logo.png";
import { useNavigate } from "react-router-dom";
import SingInGif from "src/images/signup/Signup with bg.gif";
import Logo from "src/components/Logo";
function SignIn() {
  const navigate = useNavigate();
  return (
    <div>
      <Grid container>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            backgroundColor: "white",
            width: "100%",
            maxHeight: "100vh",
            display: { xs: "none", md: "block" },
          }}
        >
          <Box
            sx={{
              height: "100%",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            
            <img src={SingInGif} alt="Login" style={{ height: "90%" }} />
          </Box>
        </Grid>
        <Grid
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
          item
          md={6}
          xs={12}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              // justifyContent: "center",
              // alignItems: "center",
              gap: "24px",
              width: "360px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "24px",
              }}
            >
              <Box   onClick={() => navigate("/")} style={{ cursor: "pointer" }} >
            <Logo/>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: "30px",
                      lineHeight: "38px",
                      color: "#40444B",
                    }}
                  >
                    Login into your account
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 400,
                      fontSize: "17px",
                      lineHeight: "23.8px",
                      color: "#545962",
                    }}
                  >
                    Welcome back! Please enter your detail
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ width: "100%" }}>
              <LoginForm />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </div>
    //    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    //    <Grid item xs={6} sx={{ flex: 1, width: '100%', maxHeight: '100vh' }}>
    //    <Box sx={{ height: '100%', width: '100%' }}>
    //     <img
    //       src={Loginimage}
    //       alt="Login"
    //       style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    //     />
    //   </Box>
    //    </Grid>
    //  </div>
  );
}

export default SignIn;
