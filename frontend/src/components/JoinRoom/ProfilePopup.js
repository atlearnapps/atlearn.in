import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import {
  Typography,
  Slide,
  Divider,
  Box,
  Avatar,
  TextField,
  InputAdornment,
} from "@mui/material";

import Button from "@mui/material/Button";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} timeout={500} />;
});

function ProfilePopup({ open, handleClose, name, email, profile }) {
  const handleCloseBox = () => {
    handleClose();
  };

  return (
    <div>
      <Dialog
        maxWidth={"sm"}
        fullWidth
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <DialogTitle sx={{ textAlign: "center", backgroundColor: "#F5F7FB" }}>
          Profile Details
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              gap: 4,
              //   flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Box pt={3}>
              <Avatar
                src={profile}
                alt="Profile Picture"
                sx={{
                  width: 120,
                  height: 120,
                  margin: "0 auto",
                  border: "4px solid #fff",
                  cursor: "pointer",
                  backgroundColor: "#6D207B",
                }}
              />
            </Box>
            <Box sx={{ width: "100%" }}>
              <Box display={"flex"} flexDirection={"column"} gap={3}>
                <Box>
                  <Typography gutterBottom>Name </Typography>
                  <TextField
                    type="text"
                    placeholder="Name"
                    name="name"
                    fullWidth
                    value={name ? name : ""}
                  />
                </Box>
                <Box>
                  <Typography gutterBottom>Email </Typography>
                  <TextField
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={email ? email : ""}
                    fullWidth
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          {/* <Button
            onClick={handleCloseBox}
            sx={{
              border: "1px solid #444444",
              padding: "10px 20px",
              color: "#444444",
              "&:hover": {
                backgroundColor: "#F5F7FB",
              },
            }}
          >
            Cancel
          </Button> */}
          <Button
            onClick={handleCloseBox}
            sx={{
              //   border: "1px solid #0077c2",
              //   padding: "10px 20px",
              //   color: "#ffff",
              //   backgroundColor: "#1A73E8",
              //   "&:hover": {
              //     backgroundColor: "#0D5EBD",
              //   },

              border: "1px solid #B30000",
              padding: "10px 20px",
              color: "#ffff",
              backgroundColor: "#FF4D4D",
              "&:hover": {
                backgroundColor: "#CC0000",
              },
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ProfilePopup;
