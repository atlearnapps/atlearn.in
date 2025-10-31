import {
  Box,
  CircularProgress,
  Grid,
  InputLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

import MainButton from "src/components/Button/MainButton/MainButton";
import apiClients from "src/apiClients/apiClients";
import { toast } from "react-toastify";
import SingInGif from "src/images/signup/Signup with bg.gif";
import AccountGif from "src/images/profile/password.gif";
import Logo from "src/components/Logo";
import SecondaryButton from "src/components/Button/SecondaryButton/SecondaryButton";
import { useNavigate } from "react-router-dom";
function ForgetPassword() {
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState(false);
  const [email, setEmail] = useState("");
  const [errorEmailMessage, setErrorEmailMessage] = useState(
    "Please enter a valid email address"
  );
  const [loading, setLoading] = useState(false);
  const textFieldStyle = {
    width: "360px",
    height: "56px",
    borderRadius: "8px",
    // background: "#F5F7FB",
    background: "white",
  };

  const rootStyle = {
    borderRadius: "8px",
  };
  const handleEmail = (e) => {
    setEmailError(false);
    setEmail(e.target.value);
  };

  const CheckEmail = () => {
    setErrorEmailMessage("Please enter a valid email address");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError(true);
    } else if (email === "") {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
  };
  const verifyEmail = async () => {
    if (emailError === false) {
      const data = {
        email,
      };
      try {
        setLoading(true);
        const response = await apiClients.forgotPassword(data);
        if (response.success === true) {
          setLoading(false);
          toast.success(response.message);
        } else {
          setLoading(false);
          toast.error(response.message);
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    } else {
      console.log("errorrr", CheckEmail);
    }
  };
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
              <Box sx={{cursor:"pointer"}} onClick={()=>navigate("/")}>
              <Logo />
              </Box>
          
              <Box>
                <img src={AccountGif} alt="logo" />
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
                    Forgot Password
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
                    No worries! We will send you the password
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box>
              <Stack spacing={2}>
                <InputLabel> Email</InputLabel>
                <TextField
                  name="email"
                  // label="Email address"
                  placeholder="Enter your email"
                  onChange={handleEmail}
                  onBlur={CheckEmail}
                  error={emailError}
                  InputProps={{
                    style: textFieldStyle,
                  }}
                  style={rootStyle}
                />
                {emailError && (
                  <span style={{ color: "red" }}>{errorEmailMessage}</span>
                )}

                <MainButton onClick={verifyEmail}>
                  {loading && (
                    <CircularProgress
                      size={"1.2rem"}
                      sx={{ color: "white", mr: 1 }}
                    />
                  )}
                  Submit
                </MainButton>
                <SecondaryButton onClick={()=>navigate("/login")}>
                  Back to Login
                </SecondaryButton>
              </Stack>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

export default ForgetPassword;
