import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import { Typography, Slide, Divider, Box } from "@mui/material";



// import FormControl from '@mui/material/FormControl';

import ReportProblemIcon from "@mui/icons-material/ReportProblem";
// import SecondaryButton from "../Button/SecondaryButton/SecondaryButton";
// import MainButton from "../Button/MainButton/MainButton";
import DeleteButton from "../Button/DeleteButton/DeleteButton";
import CancelButton from "../Button/CancelButton/CancelButton";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} timeout={500} />;
});

function confirmationPopup({
  open,
  handleClose,
  handleConfirm,
  heading,
  message,
}) {
  const handleCloseBox = () => {
    handleClose();
  };
  const handleAction = () => {
    handleConfirm();
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
          {heading ? heading : "Delete Confirmation"}
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 0,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Box >
              <ReportProblemIcon color="error" sx={{ fontSize: 80 }} />
            </Box>
            <Box sx={{ marginTop: {xs:"",sm:"20px"},textAlign:"center" }}>
              <Typography variant="h5">
                {message
                  ? message
                  : "Are you sure you want to delete this item?"}
              </Typography>
              <Typography variant="subtitle6" gutterBottom>
                This action cannot be undone.
              </Typography>
            </Box>
          </Box>
          <div></div>
          <div style={{ marginTop: "20px" }}></div>
        </DialogContent>
        <DialogActions>
          
          <DeleteButton onClick={handleAction}>
            {heading ? "Yes" : "Delete"}
          </DeleteButton>
          <CancelButton onClick={handleCloseBox}>Cancel</CancelButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default confirmationPopup;
