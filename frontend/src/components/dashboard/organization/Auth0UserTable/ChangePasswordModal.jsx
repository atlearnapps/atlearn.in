import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import { toast } from "react-toastify";
import apiClients from "src/apiClients/apiClients";

function ChangePasswordModal({ open, handleClose, userId }) {
  const [password, setPassword] = useState("");

  const handleSave = async () => {
    if (!password.trim()) {
      toast.error("Password cannot be empty");
      return;
    }

    try {
      const body = { password };
      const response = await apiClients.updateAuth0User(userId, body);
      if (response) {
        toast.success("Password updated successfully");
        setPassword("");
        handleClose();
      }
    } catch (error) {
      toast.error("Password change failed");
      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
        Change Password
      </DialogTitle>

      <DialogContent dividers>
        <TextField
          label="New Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          variant="outlined"
          sx={{ mt: 2 }}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={handleClose}
          sx={{ borderRadius: "8px", border: "1px solid #ddd", color: "#555" }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          sx={{
            borderRadius: "8px",
            fontWeight: "bold",
            backgroundColor: "primary.main",
            "&:hover": { backgroundColor: "primary.main", color: "white" },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ChangePasswordModal;
