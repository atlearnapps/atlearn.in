import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import {
  Box,
  Container,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import MainButton from "src/components/Button/MainButton/MainButton";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} timeout={500} />;
});

export default function AddUser({ open, handleClose, getRole }) {
  const [role, setRole] = useState("");
  const [checkRole, setCheckRole] = useState(false);
  const handleClosebox = () => {
    setCheckRole(false);
    handleClose();
  };

  const handleCreate = () => {
    if (role) {
      getRole(role);
      setRole("");
      setCheckRole(false);
      handleClose();
    } else {
      setCheckRole(true);
    }
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
          {"Create a new role"}
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box sx={{ mt: 6 }}>
            <Container>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={12}>
                  <Typography gutterBottom>Role Name *</Typography>
                  <TextField
                    type="text"
                    placeholder="Enter a role name..."
                    name="name"
                    fullWidth
                    value={role}
                    onChange={(e) => {
                      setRole(e.target.value);
                      setCheckRole(false);
                    }}
                    error={checkRole}
                    helperText={checkRole ? "Role is required" : ""}
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
                  <Button
                    onClick={handleClosebox}
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
                  <MainButton
                    onClick={handleCreate}
                    sx={{
                      border: "1px solid #6D207B",
                      padding: "10px 20px",
                      color: "#ffff",
                      backgroundColor: "#6D207B",
                      "&:hover": {
                        backgroundColor: "#E8063C",
                      },
                    }}
                  >
                    Create Role
                  </MainButton>
                </Grid>
              </Grid>
            </Container>
          </Box>
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleClosebox}>Disagree</Button>
          <Button onClick={handleClosebox}>Agree</Button>
        </DialogActions> */}
      </Dialog>
    </div>
  );
}
