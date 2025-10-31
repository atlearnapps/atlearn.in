import * as React from "react";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import {
  Box,
  CircularProgress,
  Container,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import apiClients from "src/apiClients/apiClients";
import { toast } from "react-toastify";
import SecondaryButton from "src/components/Button/SecondaryButton/SecondaryButton";
import MainButton from "src/components/Button/MainButton/MainButton";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} timeout={500} />;
});

export default function InviteUser({ open, handleClose, fetchData }) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [loader, setLoader] = useState(false);
  const handleClosebox = () => {
    setEmail("");

    handleClose();
  };

  const handleCreateUser = async () => {
    try {
   
      const checkEmail = handleEmailVerify();
      if (checkEmail === false) {
        const data = {
          email,
        };
        setLoader(true);
        const response = await apiClients.inviteUser(data);
        if (response) {
          if (response.success === true) {
            toast.success(response.message);
          } else {
            toast.error(response.message);
          }
          setLoader(false);
          handleClose();
        }
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  const handleEmailVerify = () => {
    let error;
    if (email) {
      const isValid = isEmailValid(email);
      if (!isValid) {
        setEmailError(!isValid);
        setEmailErrorMessage("Invalid Email");
        error = true;
      } else {
        error = false;
        setEmailError(false);
        setEmailErrorMessage("");
      }
    } else {
      setEmailError(true);
      setEmailErrorMessage("Email Required");
      error = true;
    }
    return error;
  };

  const isEmailValid = (email) => {
    // const emailRegex = /^[a-z][a-z0-9._-]*@[a-z0-9.-]+\.[a-z]{2,}$/;
    const emailRegex = /^[a-z][a-z0-9._-]*@[a-z0-9-]+(\.[a-z]{2,}){1}$/;
    return emailRegex.test(email);
  };

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClosebox}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle sx={{ textAlign: "center", backgroundColor: "#F5F7FB" }}>
          Invite User
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box sx={{ mt: 6 }}>
            <Container>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={12}>
                  <Typography gutterBottom>Email *</Typography>
                  <TextField
                    type="email"
                    placeholder="Enter Email"
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError(false);
                      setEmailErrorMessage("");
                    }}
                    value={email}
                    fullWidth
                    error={emailError}
                    helperText={emailErrorMessage}
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    flexDirection: { xs: "column", sm: "row" },
                    mb: 2,
                    gap: 1,
                  }}
                >
                  <SecondaryButton onClick={handleClosebox}>
                    Cancel
                  </SecondaryButton>
                  <MainButton onClick={handleCreateUser}>
                    {loader && (
                      <CircularProgress
                        size={"1.2rem"}
                        sx={{ color: "white", ml: 2 }}
                      />
                    )}
                    <Box ml={loader ? 1 : 0}>send Invitation</Box>
                  </MainButton>
                </Grid>
              </Grid>
            </Container>
          </Box>
        </DialogContent>
      
      </Dialog>
    </div>
  );
}
