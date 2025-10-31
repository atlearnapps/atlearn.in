import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CoPresentIcon from "@mui/icons-material/CoPresent";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import DeleteIcon from "@mui/icons-material/Delete";
import Checkbox from "@mui/material/Checkbox";
import {
  Typography,
  IconButton,
  InputAdornment,
  Divider,
  Slide,
} from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} timeout={500} />;
});

function Roomsetting({ open, handleClosebox }) {
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const handleClose = () => {
    handleClosebox();
  };
  
  return (
    <div>
      <Dialog open={open} onClose={handleClose}    TransitionComponent={Transition} >
        <DialogTitle sx={{ textAlign: "center", backgroundColor: "#F5F7FB" }}>
          Room Settings
        </DialogTitle>
        <Divider />
        <DialogContent>
          <FormControl
            sx={{
              minWidth: "400px",
              width: "100%",
              "@media (max-width:600px)": { minWidth: "100%" },
            }}
          >
            <OutlinedInput
              placeholder="Home Room"
              startAdornment={
                <InputAdornment position="start">
                  <IconButton>
                    <CoPresentIcon />
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
                <ConfirmationNumberIcon />
              </IconButton>
            </div>
            <div>
              <Typography variant="body2" gutterBottom>
                Generate an optional room access code
              </Typography>
            </div>
            <div>
              <IconButton>
                <DeleteIcon color="error" />
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
        
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
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
          </Button>
          <Button
            onClick={handleClose}
            sx={{
              border: "1px solid #0077c2",
              padding: "10px 20px",
              color: "#ffff",
              backgroundColor: "#1A73E8",
              "&:hover": {
                backgroundColor: "#0D5EBD",
              },
            }}
          >
            Update Room
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Roomsetting;
