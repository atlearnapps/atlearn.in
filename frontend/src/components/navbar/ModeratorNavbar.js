import { Box, Container, Stack } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import AccountPopover from "src/layouts/dashboard/header/AccountPopover";
import Logo from "../Logo";
function ModeratorNavbar() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        padding: "10px",
        position: "fixed",
        width: "100%",
        zIndex: 1000,
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ cursor: "pointer" }} onClick={() => navigate("/")}>
            <Logo/>
            {/* <img src={Atlearn_Logo} alt="Atlearn_Logo" /> */}
          </Box>
          <Stack
            direction="row"
            alignItems="center"
            spacing={{
              xs: 0.5,
              sm: 1,
            }}
          >
            <AccountPopover />
          </Stack>
        </Box>
      </Container>
    </div>
  );
}

export default ModeratorNavbar;
