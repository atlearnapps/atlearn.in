import { Box, Container, Divider, Skeleton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Publicrecordings from "src/components/Recordings/Publicrecordings";
import { useNavigate } from "react-router-dom";
import apiClients from "src/apiClients/apiClients";
import PublicRecordTable from "./PublicRecordTable";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import { setUser } from "src/Redux/userSlice";
import { useDispatch } from "react-redux";


function PublicRecordes() {
  const [records, setRecords] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const url = window.location.href;
    const parts = url.split("/");
    const id = parts[parts.length - 2];
    if (id) {
      fetchData(id);
    }
  }, []);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiClients.sessionData();
        if (response?.success === true) {
          if (response?.data) {
            dispatch(setUser(response.data));
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async (id) => {
    try {
      setLoading(true);
      const response = await apiClients.roomRecord(id);
      if (response.data) {
        setRecords(response.data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <Container maxWidth={"xl"} >
      {loading ? (
        <Box
          sx={{
            background: "rgb(255, 255, 255)",
            minHeight: "40vh",
            borderRadius: "12px",
            boxShadow:
              "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px",
            transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
          }}
        >
          <Box p={2}>
            <Skeleton
              variant="rectangular"
              sx={{ borderRadius: "12px" }}
              width={"100%"}
              height={400}
            />
          </Box>
        </Box>
      ) : records?.getFormat?.length > 0 ? (
        <div >
          <Box
            sx={{
              marginBottom: "20px",
              // marginTop: "20px",
              background: "rgb(255, 255, 255)",
              minHeight: "30vh",
              borderRadius: "12px",
              boxShadow:
                "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px",
              transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
            }}
          >
            <Container maxWidth={"600px"}>
              <Box>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ marginTop: "20px" }}>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        cursor: "pointer",
                        ":hover": { color: "blue" },
                      }}
                      onClick={() => navigate(-1)}
                    >
                      <ArrowCircleLeftOutlinedIcon />
                      <Typography variant="body1" gutterBottom>
                        back
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: "25px", mt: 2 }} gutterBottom>
                      Room Recordings
                    </Typography>
                  </div>
                </div>
                <Divider sx={{ my: 2 }} />

                <div>
                  <PublicRecordTable recordData={records} />
                </div>
              </Box>
            </Container>
          </Box>
        </div>
      ) : (
        <Box
          sx={{
            marginTop: "20vh",
            background: "rgb(255, 255, 255)",
            minHeight: "30vh",
            borderRadius: "12px",
            boxShadow: "2px 4px 6px rgba(0, 0, 0, 0.5)",
            transition: "transform 0.2s",
          }}
        >
          <Publicrecordings />
        </Box>
      )}
    </Container>
  );
}

export default PublicRecordes;
