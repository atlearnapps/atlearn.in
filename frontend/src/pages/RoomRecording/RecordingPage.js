import React from "react";
// import RecordTable from "src/components/roomlistpage/record table/RecordTable";
import { Container, Box, Grid } from "@mui/material";
import MainButton from "src/components/Button/MainButton/MainButton";
import SecondaryButton from "src/components/Button/SecondaryButton/SecondaryButton";
import { useNavigate } from "react-router-dom";
import ModeratorRecords from "../room/Moderator/Recording.js/ModeratorRecords";

function RecordingPage() {
  const navigate = useNavigate();

  return (
    <div>
      <div>
        <Container maxWidth={"xl"} sx={{ marginTop: 20 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} lg={8}>
                <Box>
                  <div style={{ display: "flex", gap: 10 }}>
                    <SecondaryButton onClick={() => navigate("/room")}>
                      Meetings
                    </SecondaryButton>
                    <MainButton>Recordings</MainButton>
                  </div>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <div>
            <Container maxWidth={"xl"} sx={{ marginTop: "5%" }}>
              <Box>
                <ModeratorRecords />
              </Box>
            </Container>
          </div>
        </Container>
      </div>
    </div>
  );
}

export default RecordingPage;
