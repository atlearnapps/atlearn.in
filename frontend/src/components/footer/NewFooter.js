
import { Box, Container, Typography } from "@mui/material";
import React from "react";
import InsertCommentOutlinedIcon from "@mui/icons-material/InsertCommentOutlined";
import { useNavigate } from "react-router-dom";
function NewFooter() {
  const navigate = useNavigate();
  return (
    <Box
      className="footer bg-primary"
      sx={{  minHeight: "50px" }}
    >
      <Container maxWidth="xl">

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 2,
          }}
        >
          <Typography
            sx={{ fontWeight: 600, fontSize: "16px", color: "#000000" }}
          >
            {""}
          </Typography>
          <Typography
            sx={{ fontWeight: 600, fontSize: "16px", color: "white" }}
          >
            © 2025 atlearn
          </Typography>
          <Box
            onClick={() => navigate("/feedback")}
            sx={{ display: "flex", gap: 1, cursor: "pointer" }}
          >
            <InsertCommentOutlinedIcon sx={{ color: "white" }} />
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "16px",
                color: "white",
              }}
            >
              Feedback
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
    
  );
}
export default NewFooter;

