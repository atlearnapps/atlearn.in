import {
  Box,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { toast } from "react-toastify";
import apiClients from "src/apiClients/apiClients";
import CancelButton from "src/components/Button/CancelButton/CancelButton";
import MainButton from "src/components/Button/MainButton/MainButton";

import {
  WhatsappShareButton,
  WhatsappIcon,
  TelegramShareButton,
  TelegramIcon,
  FacebookShareButton,
  FacebookIcon,
  LinkedinShareButton,
  LinkedinIcon,
} from "react-share";

function ShareMeeting({ url, roomName, open, handleClose }) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [validEmails, setValidEmails] = useState([]);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [allEmails, setAllEmails] = useState("");

  const handleEmailChange = (e) => {
    setEmailError(false);
    const value = e.target.value;

    if (value.includes(",")) {
      const emailList = value
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email);

      const valid = emailList.filter((email) => emailPattern.test(email));
      const invalid = emailList.filter((email) => !emailPattern.test(email));

      if (invalid.length > 0) {
        setEmailError(true);
      } else {
        setEmailError(false);
        setValidEmails((prev) => {
          const updatedEmails = [...new Set([...prev, ...valid])];
          setAllEmails(updatedEmails.join(", "));
          return updatedEmails;
        });
      }

      setEmail("");
    } else {
      setEmail(value);
    }
  };

  const handleEmailBlur = (val) => {
    const mail = val.target.value;
    const ValidEmail = emailPattern.test(mail);
    if (ValidEmail) {
      setValidEmails((prev) => {
        const updatedEmails = [...prev, mail];
        setAllEmails(updatedEmails.join(", "));
        return updatedEmails;
      });
      setEmail("");
    } else if (mail?.length > 0) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
  };

  const handleDelete = (emailToDelete) => {
    setValidEmails((prev) => {
      const updatedEmails = prev.filter((email) => email !== emailToDelete);
      setAllEmails(updatedEmails.join(", "));
      return updatedEmails;
    });
    if (email === emailToDelete) {
      setEmail("");
    }
  };

  const handleShareRoom = async () => {
    if (allEmails && allEmails.length > 0 && !emailError) {
      const data = {
        email: allEmails,
        url,
        room: roomName,
      };

      console.log("Sharing room with data:", data);

      try {
        // await apiClients.shareRoom(data);
        toast.success("The room has been successfully shared via email");
        setEmail("");
        handleShareMeetingClose();
      } catch (error) {
        console.error("Failed to share the room:", error);
        toast.error("Something went wrong while sharing the room");
      }
    } else {
      setEmailError("Please enter a valid email address before sharing.");
    }
  };

  const handleShareMeetingClose = () => {
    setEmail("");
    setValidEmails([]);
    setAllEmails("");
    handleClose();
  };

  return (
    <Box>
      <Dialog open={open} onClose={handleShareMeetingClose} maxWidth="sm" fullWidth>
        <DialogTitle>Share Meeting</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To invite others to join this meeting, please enter their email addresses here.
          </DialogContentText>

          {/* Email Input */}
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            value={email}
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            error={Boolean(emailError)}
            helperText={emailError}
          />

          {/* Display added emails as chips */}
          <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
            {validEmails.map((email, index) => (
              <Chip
                key={index}
                label={email}
                onDelete={() => handleDelete(email)}
                color="primary"
              />
            ))}
          </Box>

          {/* Social Media Share Section */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Or share via:
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <WhatsappShareButton url={url}>
                <WhatsappIcon size={40} round />
              </WhatsappShareButton>
              <TelegramShareButton url={url}>
                <TelegramIcon size={40} round />
              </TelegramShareButton>
              <FacebookShareButton url={url}>
                <FacebookIcon size={40} round />
              </FacebookShareButton>
              <LinkedinShareButton url={url}>
                <LinkedinIcon size={40} round />
              </LinkedinShareButton>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <MainButton onClick={handleShareRoom}>Share</MainButton>
          {/* <MainButton >Share</MainButton> */}

          <CancelButton onClick={handleShareMeetingClose}>Cancel</CancelButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ShareMeeting;
