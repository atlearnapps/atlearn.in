import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import "./SignUp.css";
import SingUpForm from "../../sections/auth/singup/SingUPForm";
// import Loginimage from "../../images/login/Rectangle 345.svg";
// import Logo from "../../images/logo/atlearn_logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import siteSetting from "src/utils/siteSetting";
import apiClients from "src/apiClients/apiClients";
import { toast } from "react-toastify";
import SingUpGif from "src/images/signup/Signup with bg.gif";
import Logo from "src/components/Logo";
function SignUp() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const Token = queryParams.get("token");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Call fetchData function when the component mounts
    const getData = async () => {
      try {
        const result = await siteSetting();
        if (result?.registration === "invite" && !Token) {
          navigate("/login");
        } else {
          if (Token) {
            verifyInviteuser();
          }
        }

        // Handle the data as needed
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verifyInviteuser = async () => {
    try {
      setLoading(true);
      const response = await apiClients.verifyInviteUser(Token);
      if (response?.success === true) {
        setLoading(false);
      } else {
        toast.success(response.message);
        navigate("/");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Grid container>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              backgroundColor: "white",
              width: "100%",
              // maxHeight: "100vh",
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
              <img
                src={SingUpGif}
                alt="Login"
                // style={{ width: "100%", height: "100%", objectFit: "cover" }}
                style={{ height: "90%" }}
              />
            </Box>
          </Grid>
          <Grid
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100vh",
              // maxHeight: "100vh",
              // marginTop:"1%"
              // padding:"20%"
            }}
            item
            md={6}
            xs={12}
          >
            <Container maxWidth="xs">
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "24px",
                  // width: "360px",
                  // maxHeight: "100vh",
                  maxWidth: "100%",
                  marginTop: "10%",
                  // backgroundColor:"red"
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
                  <Box    style={{ cursor: "pointer" }}
                      onClick={() => navigate("/")}>
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
                        WELCOME TO ATLEARN
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
                  <SingUpForm />
                </Box>
              </Box>
            </Container>
          </Grid>
        </Grid>
      )}
    </div>
  );
}

export default SignUp;
