import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CoPresentIcon from "@mui/icons-material/CoPresent";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import DeleteIcon from "@mui/icons-material/Delete";
import Checkbox from "@mui/material/Checkbox";
import { Typography, IconButton, InputAdornment } from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";

import MainButton from "src/components/Button/MainButton/MainButton";
import SecondaryButton from "src/components/Button/SecondaryButton/SecondaryButton";
function CreateRoomDialogBox({ open, handleClosebox }) {
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const handleClose = () => {
    handleClosebox();
  };
 
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ textAlign: "center" }}>Create New Room</DialogTitle>
        <DialogContent>
          <FormControl
            sx={{
              minWidth: "400px",
              width: "100%",
              "@media (max-width:600px)": { minWidth: "100%" },
            }}
          >
            <OutlinedInput
              placeholder="Enter a room name..."
              startAdornment={
                <InputAdornment position="start">
                  <IconButton>
                    <CoPresentIcon color="disabled" />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <div
            style={{
              width: "100%",
              height: "56px",
              marginTop: "7px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: "1px solid rgba(0,40,100,0.12)",
            }}
          >
            <div>
              <IconButton>
                <ConfirmationNumberIcon color="disabled" />
              </IconButton>
            </div>
            <div>
              <Typography variant="body2" gutterBottom>
                Generate an optional room access code
              </Typography>
            </div>
            <div>
              <IconButton>
                <DeleteIcon color="disabled" />
              </IconButton>
            </div>
          </div>
          <div
            style={{
              width: "100%",
              height: "56px",
              marginTop: "7px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              //   border: "1px solid rgba(0,40,100,0.12)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                height: "56px",
              }}
            >
              <div>
                <Typography variant="body2" gutterBottom>
                  Mute users when the join
                </Typography>
              </div>
              <div style={{ paddingBottom: "12px" }}>
                <Checkbox {...label} />
              </div>
            </div>
          </div>
          <div
            style={{
              width: "100%",
              height: "56px",
              //   marginTop: "7px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                height: "56px",
              }}
            >
              <div>
                <Typography variant="body2" gutterBottom>
                  Require moderator approval before joining
                </Typography>
              </div>
              <div style={{ paddingBottom: "12px" }}>
                <Checkbox {...label} />
              </div>
            </div>
          </div>
          <div
            style={{
              width: "100%",
              height: "56px",
              //   marginTop: "7px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                height: "56px",
              }}
            >
              <div>
                <Typography variant="body2" gutterBottom>
                  Allow any user to start this meeting
                </Typography>
              </div>
              <div style={{ paddingBottom: "12px" }}>
                <Checkbox {...label} />
              </div>
            </div>
          </div>
          <div
            style={{
              width: "100%",
              height: "56px",
              //   marginTop: "7px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                height: "56px",
              }}
            >
              <div>
                <Typography variant="body2" gutterBottom>
                  All users join as moderators
                </Typography>
              </div>
              <div style={{ paddingBottom: "12px" }}>
                <Checkbox {...label} />
              </div>
            </div>
          </div>
          <div
            style={{
              width: "100%",
              height: "56px",
              //   marginTop: "7px"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                height: "56px",
              }}
            >
              <div>
                <Typography variant="body2" gutterBottom>
                  Automatically join me into the room
                </Typography>
              </div>
              <div style={{ paddingBottom: "12px" }}>
                <Checkbox {...label} />
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <MainButton
            onClick={handleClose}
            sx={{
              border: "1px solid #0077c2",
              padding: "10px 20px",
              color: "#0077c2",
            }}
          >
            Create Room
          </MainButton>
          <SecondaryButton
            onClick={handleClose}
            sx={{
              border: "1px solid #0077c2",
              padding: "10px 20px",
              color: "#0077c2",
            }}
          >
            Cancel
          </SecondaryButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CreateRoomDialogBox;
