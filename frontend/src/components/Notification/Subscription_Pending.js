import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import { Typography, Slide, Divider, Box } from "@mui/material";

import Button from "@mui/material/Button";

// import FormControl from '@mui/material/FormControl';

import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import MainButton from "../Button/MainButton/MainButton";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} timeout={500} />;
});

function Subscription_Pending({ open, handleClose }) {
  const handleCloseBox = () => {
    handleClose();
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <DialogTitle sx={{ textAlign: "center", backgroundColor: "#F5F7FB" }}>
          Subscription Alreday Activate
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Box pt={0}>
              <ReportProblemIcon color="error" sx={{ fontSize: 80 }} />
            </Box>
            <Box sx={{ marginTop: "0px",textAlign:"center" }}>
              <Typography variant="h5">
              You already have an active subscription. Another plan is currently pending.
              </Typography>
              {/* <Typography variant="subtitle6" gutterBottom>
              You already have a existing subscription
              </Typography> */}
            </Box>
          </Box>
          <div></div>
          <div style={{ marginTop: "20px" }}></div>
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
          <MainButton
            onClick={handleCloseBox}
        
          >
            OK
          </MainButton>
    
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Subscription_Pending;