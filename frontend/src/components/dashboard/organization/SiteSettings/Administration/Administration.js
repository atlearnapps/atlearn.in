import { Box, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import apiClients from "src/apiClients/apiClients";
import { toast } from "react-toastify";
import MainButton from "src/components/Button/MainButton/MainButton";
import DeleteButton from "src/components/Button/DeleteButton/DeleteButton";
import DeleteConfirmation from "src/components/confirmationPopup/confirmationPopup";
function Administration() {
  const [terms, setTerms] = useState();
  const [termsId, setTermId] = useState();
  const [privacyId, setPrivacyId] = useState();
  const [privacy, setPrivacy] = useState();
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteItem, SetDeleteItem] = useState("");
  const [isTermsValid, setIsTermsValid] = useState(true);
  const [isPrivacyValid, setIsPrivacyValid] = useState(true);
  useEffect(() => {
    fetchData();
  }, []);

  const validateUrl = (url) => {
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-zA-Z0-9$-_@.&+!*'(),]+\\.?)+)\\.[a-zA-Z]{2,})" + // domain name and extension
        "(\\/[a-zA-Z0-9$-_@.&+!*'(),;%=]*)*$", // path
      "i"
    );
    return urlPattern.test(url);
  };

  const fetchData = async () => {
    const data = {
      name: ["Terms", "PrivacyPolicy"],
    };
    try {
      const response = await apiClients.getSiteSettings(data);
      if (response.data) {
        response.data.forEach((item) => {
          switch (item.setting.name) {
            case "Terms":
              setTerms(item.value);
              setTermId(item.id);
              break;
            case "PrivacyPolicy":
              setPrivacy(item.value);
              setPrivacyId(item.id);
              break;
            default:
              break;
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleTermsChange = (e) => {
    const newValue = e.target.value;
    setTerms(newValue);
    setIsTermsValid(validateUrl(newValue));
  };

  const handlePrivacyChange = (e) => {
    const newValue = e.target.value;
    setPrivacy(newValue);
    setIsPrivacyValid(validateUrl(newValue));
  };

  const handleUpdateTerms = async () => {
    const data = {
      value: terms,
    };
    try {
      const response = await apiClients.updateSiteSettings(termsId, data);
      if (response.message) {
        toast.success(response.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const hnadleUpdatePrivacy = async () => {
    const data = {
      value: privacy,
    };
    try {
      const response = await apiClients.updateSiteSettings(privacyId, data);
      if (response.message) {
        toast.success(response.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteTerms = async () => {
    try {
      const response = await apiClients.deleteSiteSettings(termsId);
      if (response) {
        if (response.message) {
          toast.success(response.message);
        }
        setTerms("");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeletePrivacy = async () => {
    try {
      const response = await apiClients.deleteSiteSettings(privacyId);
      if (response) {
        if (response.message) {
          toast.success(response.message);
        }
        setPrivacy("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteConfirmationOpen = (item) => {
    SetDeleteItem(item);
    setDeleteConfirm(true);
  };

  const handleDeleteConirmationClose = () => {
    setDeleteConfirm(false);
  };

  const handleDeleteOption = () => {
    setDeleteConfirm(false);
    if (deleteItem === "Terms") {
      handleDeleteTerms();
    } else if (deleteItem === "PrivacyPolicy") {
      handleDeletePrivacy();
    }
  };

  return (
    <>
      <Box>
        <Typography variant="h5" gutterBottom>
          Terms & Conditions
        </Typography>
        <Typography variant="body1" gutterBottom>
          Change the terms links that appears at the bottom of the page
        </Typography>
        <Box sx={{ width: "100%" }}>
          <TextField
            sx={{ width: "100%" }}
            variant="outlined"
            placeholder="Enter link here..."
            value={terms ? terms : ""}
            onChange={handleTermsChange}
            error={!isTermsValid && terms !== ""}
            helperText={
              !isTermsValid && terms !== "" ? "Invalid Terms URL" : ""
            }
          />
        </Box>
        <Box display="flex" alignItems="center" justifyContent="end" gap={2}>
          {terms?.length > 0 && (
            <DeleteButton
              disabled={terms?.length ? false : true}
              onClick={() => handleDeleteConfirmationOpen("Terms")}
              style={{ marginTop: "10px" }}
            >
              Delete
            </DeleteButton>
          )}

          <MainButton onClick={handleUpdateTerms} style={{ marginTop: "10px" }}>
            Change URL
          </MainButton>
        </Box>
      </Box>
      <Box>
        <Typography variant="h5" gutterBottom>
          Privacy Policy
        </Typography>
        <Typography variant="body1" gutterBottom>
          Change the privacy link that appears at the bottom of the page
        </Typography>
        <Box sx={{ width: "100%" }}>
          <TextField
            sx={{ width: "100%" }}
            variant="outlined"
            placeholder="Enter link here..."
            value={privacy ? privacy : ""}
            onChange={handlePrivacyChange}
            error={!isPrivacyValid && privacy !== ""}
            helperText={
              !isPrivacyValid && privacy !== "" ? "Invalid Privacy URL" : ""
            }
          />
        </Box>
        <Box display="flex" alignItems="center" justifyContent="end" gap={2}>
          {privacy?.length > 0 && (
            <DeleteButton
              disabled={privacy?.length ? false : true}
              onClick={() => handleDeleteConfirmationOpen("PrivacyPolicy")}
              style={{ marginTop: "10px" }}
            >
              Delete
            </DeleteButton>
          )}

          <MainButton
            onClick={hnadleUpdatePrivacy}
            style={{ marginTop: "10px" }}
          >
            Change URL
          </MainButton>
        </Box>
      </Box>
      <DeleteConfirmation
        open={deleteConfirm}
        handleClose={handleDeleteConirmationClose}
        handleConfirm={handleDeleteOption}
      />
    </>
  );
}

export default Administration;
