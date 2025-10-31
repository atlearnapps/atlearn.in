import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
} from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiClients from "src/apiClients/apiClients";
import { toast } from "react-toastify";
import MainButton from "src/components/Button/MainButton/MainButton";

function SendMessage({ users }) {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [errors, setErrors] = useState({});

  // Filter users
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  // Toggle single user
  const handleUserSelect = (email) => {
    const updated = selectedUsers.includes(email)
      ? selectedUsers.filter((e) => e !== email)
      : [...selectedUsers, email];
    setSelectedUsers(updated);

    if (updated.length > 0) {
      setErrors((prev) => ({ ...prev, users: "" }));
    }
  };

  // Select all
  const handleSelectAll = () => {
    let updated = [];
    if (selectedUsers.length !== filteredUsers.length) {
      updated = filteredUsers.map((u) => u.email);
    }
    setSelectedUsers(updated);

    if (updated.length > 0) {
      setErrors((prev) => ({ ...prev, users: "" }));
    }
  };

  // Send to backend
  const handleSend = async () => {
    let newErrors = {};
    if (!subject.trim()) newErrors.subject = "Subject is required";
    if (!message.trim() || message === "<p><br></p>")
      newErrors.message = "Message is required";
    if (selectedUsers.length === 0)
      newErrors.users = "Please select at least one user";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      const data = {
        emails: selectedUsers,
        subject,
        message,
      };

      // 🚀 Fire-and-forget
      toast.info("Sending message...");

      apiClients
        .sendMail(data)
        .then((response) => {
          if (response.success === true) {
            toast.success("Message sent successfully");
            setOpen(false);
            setSubject("");
            setMessage("");
             setSearch("")
            setSelectedUsers([]);
            setErrors({});
          } else {
            toast.error(response.message || "Failed to send message");
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to send message");
        });
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error occurred");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSearch("")
    setSubject("");
    setMessage("");
    setSelectedUsers([]);
    setErrors({});
  };

  return (
    <div>
      {/* Open Dialog Button */}
      <MainButton onClick={() => setOpen(true)}>Send Message</MainButton>

      {/* Dialog */}
      <Dialog
        open={open}
        onClose={() => handleClose()}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">📩 New Message</Typography>
          <Typography variant="body2" color="text.secondary">
            Write your subject, message and select users to send.
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          {/* Subject */}
          <TextField
            label="Subject"
            fullWidth
            margin="normal"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              if (e.target.value.trim()) {
                setErrors((prev) => ({ ...prev, subject: "" }));
              }
            }}
            error={!!errors.subject}
            helperText={errors.subject}
          />

          {/* Rich Text Editor */}
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ mb: 1, mt: 2 }}
          >
            Message
          </Typography>
          <ReactQuill
            theme="snow"
            value={message}
            onChange={(val) => {
              setMessage(val);
              if (val && val !== "<p><br></p>") {
                setErrors((prev) => ({ ...prev, message: "" }));
              }
            }}
            placeholder="Write your message..."
          />
          {errors.message && (
            <Typography color="error" variant="caption">
              {errors.message}
            </Typography>
          )}

          {/* Search */}
          <TextField
            label="Search Users"
            fullWidth
            margin="normal"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Select All */}
          <FormControlLabel
            control={
              <Checkbox
                checked={
                  selectedUsers.length > 0 &&
                  selectedUsers.length === filteredUsers.length
                }
                onChange={handleSelectAll}
              />
            }
            label="Select All"
          />

          {/* User List */}
          <List
            dense
            sx={{
              maxHeight: 200,
              overflow: "auto",
              border: 1,
              borderColor: errors.users ? "error.main" : "divider",
              borderRadius: 1,
            }}
          >
            {filteredUsers.map((u) => (
              <ListItem
                key={u.email}
                button
                onClick={() => handleUserSelect(u.email)}
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={selectedUsers.includes(u.email)}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText
                  primary={u.name}
                  secondary={u.email}
                  primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
                  secondaryTypographyProps={{
                    fontSize: 12,
                    color: "text.secondary",
                  }}
                />
              </ListItem>
            ))}
          </List>
          {errors.users && (
            <Typography color="error" variant="caption">
              {errors.users}
            </Typography>
          )}
        </DialogContent>

        {/* Actions */}
        <DialogActions>
          <Button
            onClick={() => handleClose()}
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              color: "#555",
              border: "1px solid #ddd",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              backgroundColor: "primary.main",

              "&:hover": { backgroundColor: "primary.main", color: "white" },
            }}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default SendMessage;
