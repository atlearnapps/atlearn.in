import { Box, Grid, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import SecondaryButton from "../Button/SecondaryButton/SecondaryButton";
import MainButton from "../Button/MainButton/MainButton";
import { useDispatch, useSelector } from "react-redux";
import validatePhoneNumber from "src/utils/validateFields/validatePhoneNumber";
import { setUserDetails } from "src/Redux/addonplanSlice";
import CancelButton from "../Button/CancelButton/CancelButton";
function AddonPersonDeatils({ handlenext, handleback,handleCloseBox }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const addonUserDetails = useSelector((state) => state.addonPlan.userDetails);

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [helperText, setHelperText] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  useEffect(() => {
    if (user?.user) {
      setName(user?.user?.name);
      setEmail(user?.user?.email);
    }
  }, [user]);
  useEffect(() => {
    if (addonUserDetails) {
      setPhone(addonUserDetails.phone);
    }
  }, [addonUserDetails]);

  const handleBlur = () => {
    if (!validatePhoneNumber(phone)) {
      setPhoneError(true);
      setHelperText("Please enter a valid 10-digit phone number");
    } else {
      setPhoneError(false);
      setHelperText("");
    }
  };

  const handleNextButton = () => {
    if (phone && phoneError === false) {
      dispatch(setUserDetails({ name, phone, email }));
      handlenext();
    } else {
      setHelperText(!helperText ? "Mobile Number Required *" : helperText);
      setPhoneError(true);
    }
  };
  return (
    <>
      <Box
        sx={{
          // minHeight: "200px",
          padding: { xs: 0, md: 4 },
        }}
      >
        <Typography variant="h4" textAlign={"center"} gutterBottom>
          Enter Your Details
        </Typography>
        <Grid
          container
          spacing={2}
          sx={{
            // width:{"90%"},
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Grid item xs={12} md={8}>
            <Typography gutterBottom>
              Name <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              value={name}
              type="text"
              placeholder="Enter Your Name"
              // onChange={handleoldPassword}
              // onBlur={checkCurrentPassword}
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography gutterBottom>
              Eamil <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              value={email}
              type="text"
              placeholder="Enter Your Email"
              // onChange={handleoldPassword}
              // onBlur={checkCurrentPassword}
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography gutterBottom>
              Phone <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              value={phone}
              type="number"
              placeholder="Enter Your Phone Number"
              onChange={(e) => {
                const newValue = e.target.value;

                // Restrict the length to 10 characters
                if (newValue.length <= 10) {
                  setHelperText("");
                  setPhoneError(false);
                  setPhone(newValue);
                }
              }}
              onBlur={handleBlur}
              fullWidth
              error={phoneError}
              helperText={helperText}
            />
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ display: "flex", flexDirection:{xs:"column" ,sm:"row"} , pt: 2, gap:1 }}>
        <SecondaryButton
          color="inherit"
          // disabled={activeStep === 0}
          onClick={handleback}
          sx={{ mr: 1 }}
        >
          Back
        </SecondaryButton>
        <Box sx={{ flex: "1 1 auto" }} />
        <MainButton onClick={handleNextButton}>Next</MainButton>
        <CancelButton
          onClick={handleCloseBox}
        >
          Cancel
        </CancelButton>
      </Box>
    </>
  );
}

export default AddonPersonDeatils;
