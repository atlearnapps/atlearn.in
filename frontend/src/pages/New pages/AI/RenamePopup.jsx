import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import {
  Typography,
  Slide,
  Divider,
  Box,
  Container,
  Grid,
  TextField,
} from "@mui/material";

// import FormControl from '@mui/material/FormControl';

// import ReportProblemIcon from "@mui/icons-material/ReportProblem";
// import SecondaryButton from "../Button/SecondaryButton/SecondaryButton";
// import MainButton from "../Button/MainButton/MainButton";
// import DeleteButton from "src/components/Button/DeleteButton/DeleteButton";
import CancelButton from "src/components/Button/CancelButton/CancelButton";
import MainButton from "src/components/Button/MainButton/MainButton";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} timeout={500} />;
});

function RenamePopup({ open, handleClose, handleConfirm, heading, message }) {
  const [formData, setFormData] = useState({ name: "" });
  const [errors, setErrors] = useState({ name: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (value.trim()) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  const handleCloseBox = () => {
    setErrors({ name: "" });
    setFormData({ name: "" });
    handleClose();
    
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    let isValid = true;
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }
    handleConfirm(formData.name);
    setErrors({ name: "" });
    setFormData({ name: "" });
    handleClose();

  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        fullWidth
      >
        <DialogTitle sx={{ textAlign: "center", backgroundColor: "#F5F7FB" }}>
          {heading}
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box>
            <Container>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography gutterBottom>
                    Name
                    <span className="text-red-500 text-sm"> * </span>
                  </Typography>
                  <TextField
                    type="text"
                    name="name"
                    placeholder="Enter a chat name..."
                    value={formData.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
              </Grid>
            </Container>
          </Box>
        </DialogContent>
        <DialogActions>
          <MainButton onClick={handleSubmit}>Rename</MainButton>
          <CancelButton onClick={handleCloseBox}>Cancel</CancelButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default RenamePopup;
