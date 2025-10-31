import { Box, Card, Container, Typography } from '@mui/material'
import React from 'react'
import MainButton from '../Button/MainButton/MainButton'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';

function ExpiredCard() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  return (
    <div>
      <Container
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                Height: "100vh",
                width: "100%",
                // minHeight: "calc(100vh - 70px - 70px - 57px - 15px)",
              }}
            >
              <Card variant="outlined" sx={{ marginTop: 18, minWidth: "70%" }}>
                <Box
                  p={8}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  <Box
                    sx={{
                      cursor: "pointer",
                      textAlign: "center",
                    }}
                    onClick={() => navigate("/pricing")}
                  >
                    {/* <img src={FarlanesLogo} alt="farlanesLogo" /> */}
                    <Typography variant="h4" gutterBottom sx={{ color: "red" }}>
                    Your subscription has expired.
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: " rgb(99, 115, 129)", textAlign: "center" }}
                  >
               
                    {`The period for your ${
                      user?.user?.trial === true ||
                      user?.user?.subscription?.name === "Free"
                        ? user?.user?.subscription?.name + " trial "
                        : user?.user?.subscription?.name + " plan "
                    }   has ended.`}
                    {/* <br /> */}
                    <span>{` Please  ${
                      user?.user?.subscription?.name === "Free"
                        ? " upgrade your plan now."
                        : " renew your subscription now."
                    }`}</span>
                  </Typography>
                  <Box>
                    <MainButton onClick={() => navigate("/pricing")}>
                      {user?.user?.subscription?.name === "Free"
                        ? "Upgrade Now "
                        : "Renew Now"}
                    </MainButton>
                  </Box>
                </Box>
              </Card>
            </Container>
    </div>
  )
}

export default ExpiredCard

