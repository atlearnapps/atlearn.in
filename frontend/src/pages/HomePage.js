import React from "react";
import AuthNavBar from "src/sections/auth/authNavbar/AuthNavBar";
import { Typography, Link, Grid, Paper, Box } from "@mui/material";
import { BsPersonVideo3 } from "react-icons/bs";
import { BsFilm } from "react-icons/bs";
import { BsFillPencilFill } from "react-icons/bs";
import { FaUserCheck } from "react-icons/fa";
import Footer from "src/components/footer/Footer";

import { IconContext } from "react-icons";

function HomePage() {
  return (
    <>
      <div>
        <AuthNavBar />
      </div>
      <div style={{ backgroundColor: "rgb(209, 233, 252)" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            paddingTop: "6rem",
            paddingBottom: "4rem",
          }}
        >
          <Typography
            sx={{ pl: 3, pr: 2, fontWeight: "normal" }}
            variant="h1"
            gutterBottom
          >
            Welcome to BigBlueButton.
          </Typography>
          <Typography gutterBottom sx={{ pl: 3, pr: 2 }}>
            Greenlight is a simple front-end for your BigBlueButton open-source
            web conferencing server. You can create your own rooms to host
            sessions, or join others using a short and convenient link.
          </Typography>
          <Typography gutterBottom>
            <Link href="#" target="_blank" underline="none">
              Watch our tutorial on using Greenlight&nbsp;
            </Link>
            .
          </Typography>
        </div>
      </div>
      <div style={{ textAlign: "center", marginTop: "6rem" }}>
        <Typography
          sx={{ fontSize: "1.7rem", fontWeight: "600" }}
          variant="h3"
          gutterBottom
        >
          Greenlight Features
        </Typography>
      </div>
      <div style={{ marginTop: "50px" }}>
        <Box px={30}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={16} sx={{ width: "80%" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "20px",
                  }}
                >
                  <div
                    style={{
                      // backgroundColor: "#467fcf",
                      width: "82.5px",
                      height: "67px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "3px",
                    }}
                  >
                    <IconContext.Provider
                      value={{
                        color: "rgb(4, 41, 122)",
                        className: "global-class-name",
                        size: "2.5rem",
                      }}
                    >
                      <div>
                        <BsPersonVideo3 />
                      </div>
                    </IconContext.Provider>
                  </div>
                  <Typography variant="h6" align="center">
                    <p style={{ margin: 0 }}>Personalized Rooms</p>
                  </Typography>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={16} sx={{ width: "80%" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "20px",
                  }}
                >
                  <div
                    style={{
                      // backgroundColor: "#467fcf",
                      width: "82.5px",
                      height: "67px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "3px",
                    }}
                  >
                    <IconContext.Provider
                      value={{
                        color: "rgb(4, 41, 122)",
                        className: "global-class-name",
                        size: "2.5rem",
                      }}
                    >
                      <div>
                        <BsFilm />
                      </div>
                    </IconContext.Provider>
                  </div>
                  <Typography variant="h6" align="center">
                    <p style={{ margin: 0 }}>Recording Management</p>
                  </Typography>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={16} sx={{ width: "80%" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "20px",
                  }}
                >
                  <div
                    style={{
                      // backgroundColor: "#467fcf",
                      width: "82.5px",
                      height: "67px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "3px",
                    }}
                  >
                    <IconContext.Provider
                      value={{
                        color: "rgb(4, 41, 122)",
                        className: "global-class-name",
                        size: "2.5rem",
                      }}
                    >
                      <div>
                        <BsFillPencilFill />
                      </div>
                    </IconContext.Provider>
                  </div>
                  <Typography variant="h6" align="center">
                    <p style={{ margin: 0 }}>Custom Designs</p>
                  </Typography>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={16} sx={{ width: "80%" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "20px",
                  }}
                >
                  <div
                    style={{
                      // backgroundColor: "#467fcf",
                      width: "82.5px",
                      height: "67px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "3px",
                    }}
                  >
                    <IconContext.Provider
                      value={{
                        color: "rgb(4, 41, 122)",
                        className: "global-class-name",
                        size: "2.5rem",
                      }}
                    >
                      <div>
                        <FaUserCheck />
                      </div>
                    </IconContext.Provider>
                  </div>
                  <Typography variant="h6" align="center">
                    <p style={{ margin: 0 }}>User Authentication</p>
                  </Typography>
                </div>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </div>
      <Footer />
    </>
  );
}

export default HomePage;
