import { Box } from "@mui/material";
import React from "react";
import RecordIcon from "src/images/record/Vector (5).svg";
import MainButton from "../Button/MainButton/MainButton";
import PersonalVideoIcon from "@mui/icons-material/PersonalVideo";
import { useNavigate } from "react-router-dom";
function Publicrecordings() {
  const navigate = useNavigate();
  return (
    <div
      style={{
        minHeight: "40vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <img src={RecordIcon} alt="recordicon" />
        <h2
          style={{
            color: "main.primary",
            textAlign: "center",
            fontSize: "calc(1rem + 0.9vw)",
            fontWeight: 500,
          }}
        >
          There are no public recordings yet!
        </h2>

        <p style={{ textAlign: "center" }}>
          Recordings will appear here when available.
        </p>
        <Box mt={1}>
          <MainButton onClick={() => navigate(-1)}>
            <PersonalVideoIcon sx={{ mr: 2 }} /> Go Back
          </MainButton>
        </Box>
      </Box>
    </div>
  );
}

export default Publicrecordings;
