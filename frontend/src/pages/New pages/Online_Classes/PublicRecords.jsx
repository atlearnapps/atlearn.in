import { Box, Container, Divider, Skeleton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import apiClients from "src/apiClients/apiClients";
import { setUser } from "src/Redux/userSlice";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import PublicRecordTable from "src/pages/publicRecordes/PublicRecordTable";
import Publicrecordings from "src/components/Recordings/Publicrecordings";
import { Helmet } from "react-helmet";
import { BASE_URL } from "src/apiClients/config";
function PublicRecords() {
  const [records, setRecords] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const Room_id = queryParams.get("roomId");
  useEffect(() => {
    //   const url = window.location.href;
    //   const parts = url.split("/");
    //   const id = parts[parts.length - 2];
    if (Room_id) {
      fetchData(Room_id);
    }
  }, [Room_id]);
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
    <div>
      <Helmet>
        <title>Access Transparent Public Records Through Atlearn</title>
        <meta
          name="description"
          content="View transparent public records on Atlearn. Gain insights, verify information, and explore key data with ease and confidence."
        />
        <link rel="canonical" href={`${BASE_URL}/public-records`} />
      </Helmet>
      <section>
        {/* bannaer section */}
        <div className="container2-xl bg-darkdeep1 py-50px  rounded-2xl relative overflow-hidden shadow-brand">
          <div className="container">
            <div className="flex flex-col items-center text-center w-full lg:w-83% xl:w-3/4 mx-auto">
              {/* banner Left */}
              <div data-aos="fade-up" className="w-4/5">
                <h3 className="uppercase text-secondaryColor text-size-15 mb-5px md:mb-15px font-inter tracking-5px">
                  EDUCATION SOLUTION
                </h3>
                <h1 className="text-3xl text-whiteColor md:text-6xl lg:text-size-50 2xl:text-6xl leading-10 md:leading-18 lg:leading-62px 2xl:leading-18 md:tracking-half lg:tracking-normal 2xl:tracking-half font-bold ">
                  Recordings
                  <span className="text-secondaryColor">.</span>
                </h1>
                <p className="text-size-15 md:text-lg text-white  font-medium">
                  Easily review key discussions and decisions at your
                  convenience.
                </p>
              </div>
            </div>
          </div>
          <div>
            <img
              className="absolute left-1/2 bottom-[15%] animate-spin-slow"
              src="./assets/images/register/register__2.png"
              alt=""
            />
            <img
              className="absolute left-[42%] sm:left-[65%] md:left-[42%] lg:left-[5%] top-[4%] sm:top-[1%] md:top-[4%] lg:top-[10%] animate-move-hor"
              src="./assets/images/herobanner/herobanner__6.png"
              alt=""
            />
            <img
              className="absolute right-[5%] bottom-[15%]"
              src="./assets/images/herobanner/herobanner__7.png"
              alt=""
            />
            <img
              className="absolute top-[5%] left-[45%]"
              src="./assets/images/herobanner/herobanner__7.png"
              alt=""
            />
          </div>
        </div>
      </section>

      <Container maxWidth={"xl"}>
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
          <div>
            <Box
              sx={{
                marginBottom: "20px",
                marginTop: "20px",
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
              marginTop: "20px",
              marginBottom: "30px",
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
    </div>
  );
}

export default PublicRecords;
