import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";

import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import {
  Typography,
  Slide,
  Divider,
  TextField,
  Box,
  Container,
  Grid,
} from "@mui/material";


// import SecondaryButton from "src/components/Button/SecondaryButton/SecondaryButton";
import MainButton from "src/components/Button/MainButton/MainButton";
import CancelButton from "src/components/Button/CancelButton/CancelButton";

// import FormControl from '@mui/material/FormControl';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} timeout={500} />;
});

function CreateRoom({ open, handleClosebox, handleCreateRoom }) {
  const [roomName, setRoomName] = useState("");

  const handleClose = () => {
    handleClosebox();
  };
  const CreateRoom = () => {
    handleCreateRoom(roomName);
    handleClosebox();
  };
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <DialogTitle sx={{ textAlign: "center", backgroundColor: "#F5F7FB" }}>
          Create New Meeting
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box sx={{ mt: 6 }}>
            <Container>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={12}>
                  <Typography gutterBottom>Meeting Name</Typography>
                  <TextField
                    type="text"
                    placeholder="Enter a meeting name ...."
                    name="name"
                    // value={"test"}
                    onChange={(e) => setRoomName(e.target.value)}
                    fullWidth
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mb: 2,
                    gap: 1,
                  }}
                >

                  <MainButton
                    onClick={CreateRoom}
                  >
                    Create Meeting
                  </MainButton>
                  <CancelButton onClick={handleClosebox}>
                    Cancel
                  </CancelButton>
                </Grid>
              </Grid>
            </Container>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateRoom;
