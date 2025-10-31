import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Divider,
  Grid,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MainButton from "src/components/Button/MainButton/MainButton";
import GroupIcon from "@mui/icons-material/Group";
import CircleIcon from "@mui/icons-material/Circle";
import RoomVideoicon from "src/images/landingpages/videocallIcon.svg";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { convertToDate } from "src/utils/FormateDateUtils";
import apiClients from "src/apiClients/apiClients";
import coverImage from "src/assets/images/online-classes/New/Classroom_Content_Online_Courses_Cover.webp";
import { Helmet } from "react-helmet";
import axios from "axios";
import { lmsOnlineMeetingsToken } from "src/apiClients/token";
import { useHandleNavigate } from "src/utils/Navigation/useHandleNavigate";
import BBBLogo from "src/assets/images/home/new/bbb.webp";
import ZoomLogo from "src/assets/images/home/new/z.webp";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { BASE_URL } from "src/apiClients/config";
function OnlyJoin() {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [rooms, setRooms] = useState();
  const [loadingPage, setLoadigPage] = useState(false);
  const [filteredRooms, setFilteredRooms] = useState([]);
  // const [isOpen, setIsOpen] = useState(false);
  // const [selected, setSelected] = useState("");
  const [courses, setCourses] = useState([]);
  const [courseDetails, setCourseDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const handleNavigate = useHandleNavigate();
  useEffect(() => {
    if (user) {
      fetchCourses(user?.user?.email);
      console.log(user);
      if (user?.permission?.["CreateRoom"] !== "false") {
        navigate("/room");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  useEffect(() => {
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    setLoadigPage(true);
    try {
      const response = await apiClients.getRooms();
      if (response.data) {
        let responseData = response.data;
        // Sort the data in descending order
        responseData.sort((a, b) => {
          const dateA = convertToDate(a.last_session);
          const dateB = convertToDate(b.last_session);
          // Handle null dates (invalid date strings)
          if (dateA === null) return 1;
          if (dateB === null) return -1;

          return dateB - dateA;
        });

        setRooms(responseData);
        setFilteredRooms(responseData);
        setLoadigPage(false);
      } else {
        setRooms([]);
        setFilteredRooms([]);
        setLoadigPage(false);
      }
    } catch (error) {
      setLoadigPage(false);
      console.log(error);
    }
  };

  const handleJoin = () => {
    if (!url) {
      return toast.error("Enter Meeting URL");
    }

    try {
      const parsedUrl = new URL(url);
      const baseUrl = `${parsedUrl.origin}/`;

      console.log("Base URL:", baseUrl);

      const params = new URLSearchParams(parsedUrl.search);
      const roomId = params.get("roomId");

      if (roomId) {
        navigate(`/Join-meeting?roomId=${roomId}`);
      } else {
        toast.error("Room ID not found in the URL");
      }
    } catch (error) {
      toast.error("Invalid Meeting URL");
      console.error("Error parsing URL:", error);
    }
  };
  const handleCopy = (id) => {
    navigator.clipboard.writeText(
      `${window.location.origin}/Join-meeting?roomId=${id}`
    );
    toast.success(
      "The meeting URL has been copied. The link can be used to join the meeting."
    );
  };

  const handleJoinMeeting = (id) => {
    navigate(`/Join-meeting?roomId=${id}`);
  };

  const fetchCourses = async (email) => {
    // dispatch(setPageLoading(true));
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://lms.atlearn.in/webservice/rest/server.php?wstoken=${lmsOnlineMeetingsToken}&wsfunction=get_courses_with_bigbluebutton&moodlewsrestformat=json&useremail=${email}`,

      headers: {
        Cookie: "MoodleSession=0olf6pmhf7crek67hdfr2b5g9u",
      },
    };

    try {
      const response = await axios.request(config);
      const fetchedCourses = Array.isArray(response.data) ? response.data : [];
      setCourses(fetchedCourses);
      // setFilteredRooms([...rooms, ...fetchedCourses])
    } catch (error) {
      console.log(error);
    }
  };

  const lmsCopyMeetingLink = (url) => {
    navigator.clipboard.writeText(`${url}`);
    toast.success(
      "The meeting URL has been copied. The link can be used to join the meeting."
    );
  };

  const lmstStartCourse = async (url) => {
    window.location.href = url;
  };

  const combinedData =
    courseDetails.length > 0 ? courseDetails : [...filteredRooms, ...courses];

  // Filter data based on search input
  const filteredData = combinedData?.filter((item) =>
    ("onlineclassname" in item ? item.onlineclassname : item.name)
      ?.toLowerCase()
      ?.includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Helmet>
        <title>Join Atlearn Platform | Sign Up Now</title>
        <meta
          name="description"
          content="Sign up to join Atlearn today! Access a variety of learning tools, virtual classrooms, and AI-driven resources for your educational journey."
        />
        <link rel="canonical" href={`${BASE_URL}/only-join`} />
      </Helmet>
      <section>
        {/* bannaer section */}
        <div className="container2-xl bg-darkdeep1 py-10px  rounded-2xl relative overflow-hidden shadow-brand mt-24 ">
          <div className="container">
            <div className="flex flex-col items-center text-center w-full ">
              {/* banner Left */}
              <div data-aos="fade-up" className="w-4/5">
                <h3 className="uppercase text-secondaryColor text-size-15 mb-5px md:mb-15px font-inter tracking-5px">
                  EDUCATION SOLUTION
                </h3>
                <h1 className="text-3xl text-whiteColor md:text-4xl  leading-10 md:leading-15 md:tracking-half lg:tracking-normal 2xl:tracking-half font-bold mb-15px sm:mb-30px">
                  Step Into Your Learning Space,
                  <br /> Your Virtual Journey Starts Now
                  <span className="text-secondaryColor">.</span>
                </h1>
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
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={9} lg={7}>
          <Box
            sx={{
              backgroundColor: "",
              width: "100%",
              // height: "70vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                marginTop: "20px",
                background: "rgb(255, 255, 255)",
                minHeight: "30vh",
                width: "100%",
                borderRadius: "12px",
                boxShadow:
                  "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px",
                transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
              }}
            >
              <Box sx={{ p: 4 }}>
                <Typography variant="h5">Enter Meeting URL</Typography>
                <Typography>
                  Please enter the URL of your atlearn meeting in the field
                  below
                </Typography>
              </Box>

              <Divider />
              <Box>
                <Container></Container>
                <Container maxWidth="md">
                  <Grid
                    container
                    spacing={4}
                    justifyContent="center"
                    alignItems={"center"}
                  >
                    <Grid item xs={8}>
                      <Box mt={1}>
                        <TextField
                          placeholder="Enter meeting URL"
                          fullWidth
                          margin="normal"
                          variant="outlined"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                        />
                      </Box>
                    </Grid>
                    <Grid mt={1} item xs={4}>
                      <MainButton onClick={handleJoin} style={{ width: "80%" }}>
                        Join
                      </MainButton>
                    </Grid>
                  </Grid>
                </Container>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Container maxWidth={"xl"}>
        {loadingPage ? null : filteredData?.length ? ( // <LoaderHome />
          <>
            <Box sx={{ flexGrow: 1, mt: 2, mb: 2, height: "100%" }}>
              <h1 className="text-2xl font-bold text-center inline-block px-4 py-2 rounded-lg mb-2 border-b-4 border-primary">
                Meetings
              </h1>

              <Grid
                container
                spacing={2}
                sx={{ display: "flex", alignItems: "stretch" }}
              >
                {filteredData.map((item, index) => (
                  <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                    {"courseid" in item ? (
                      <Card
                        onClick={() => {
                          if (!item?.settingsurl) return;
                          handleNavigate(item?.settingsurl);
                        }}
                        sx={{
                          height: "100%",
                          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                          transition: "transform 0.2s, box-shadow 0.2s",
                          "&:hover": {
                            transform: "scale(1.03)",
                            boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.2)",
                            border: "1px solid #6E8AF5",
                          },
                          display: "flex",
                          flexDirection: "column",
                          cursor: "pointer",
                          position: "relative",
                        }}
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            top: 8,
                            left: 8,
                            backgroundColor: "white",
                            borderRadius: "50%",
                            padding: "5px",
                            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "40px",
                            height: "40px",
                          }}
                        >
                          <img
                            src={item?.type === "zoom" ? ZoomLogo : BBBLogo}
                            alt="Zoom Icon"
                            style={{ width: "24px", height: "24px" }}
                          />
                        </Box>

                        <div
                          style={{
                            // marginTop:"10px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                            height: "150px",
                            overflow: "hidden",
                          }}
                        >
                          <img
                            src={coverImage}
                            alt={"alt"}
                            style={{
                              maxWidth: "100%",
                              maxHeight: "100%",
                              objectFit: "contain",
                            }}
                          />
                        </div>

                        <CardContent sx={{ flexGrow: 1 }}>
                          <Stack spacing={1}>
                            <Typography
                              gutterBottom
                              variant="h5"
                              component="div"
                              mt={2}
                            >
                              {item?.name}
                            </Typography>

                            {item?.meetingurl ? (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                mt={1}
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                }}
                              >
                                <ScheduleIcon />1 scheduled meeting
                              </Typography>
                            ) : (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                mt={1}
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                }}
                              >
                                <ScheduleIcon />
                                No meetings scheduled yet
                              </Typography>
                            )}
                          </Stack>
                        </CardContent>

                        <CardActions
                          sx={{ justifyContent: "space-around", pb: 2 }}
                        >
                          <Tooltip title="Permission Denied">
                            <Button
                              // disabled
                              onClick={(e) => {
                                e.stopPropagation();
                                // handleDeleteConirmationOpen(item.id);
                              }}
                              sx={{ padding: "10px 20px" }}
                            >
                              <DeleteOutlineIcon color={"disabled"} />
                            </Button>
                          </Tooltip>

                          <Tooltip
                            title={
                              !item?.meetingurl
                                ? "The meeting hasn't started yet"
                                : "Copy Room"
                            }
                            arrow
                          >
                            <div style={{ display: "inline-block" }}>
                              <Button
                                disabled={!item?.meetingurl}
                                onClick={(e) => {
                                  if (!item?.meetingurl) return;
                                  e.stopPropagation();
                                  lmsCopyMeetingLink(item.meetingurl);
                                }}
                                sx={{ padding: "10px 20px" }}
                              >
                                <ContentCopyIcon
                                  color={
                                    !item.meetingurl ? "disabled" : "primary"
                                  }
                                />
                              </Button>
                            </div>
                          </Tooltip>

                          <Tooltip
                            title={
                              !item?.meetingurl
                                ? "The meeting hasn't started yet"
                                : ""
                            }
                          >
                            <span>
                              <MainButton
                                disabled={!item?.meetingurl}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  lmstStartCourse(item?.meetingurl);
                                }}
                                sx={{ padding: "10px 50px" }}
                              >
                                {/* {loading &&
                                  loadingRoom === item.friendly_id && (
                                    <CircularProgress
                                      size="1.2rem"
                                      sx={{ color: "white" }}
                                    />
                                  )} */}
                                {/* <Box ml={loading ? 2 : 0}> */}
                                <Box>Join</Box>
                              </MainButton>
                            </span>
                          </Tooltip>
                        </CardActions>
                      </Card>
                    ) : (
                      <Card
                        onClick={() => {
                          navigate(`/room/${item.friendly_id}`);
                        }}
                        sx={{
                          height: "100%",
                          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                          transition: "transform 0.2s, box-shadow 0.2s",
                          "&:hover": {
                            transform: "scale(1.03)",
                            boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.2)",
                            border: "1px solid #6E8AF5",
                          },
                          display: "flex",
                          flexDirection: "column",
                          cursor: "pointer",
                          position: "relative",
                        }}
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            top: 8,
                            left: 8,
                            backgroundColor: "white",
                            borderRadius: "50%",
                            padding: "5px",
                            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "40px",
                            height: "40px",
                          }}
                        >
                          <img
                            src={item?.provider === "zoom" ? ZoomLogo : BBBLogo} // Update this with the correct path
                            alt="Zoom Icon"
                            // style={{ width: "28px", height: "28px" }}
                          />
                        </Box>
                        <div
                          style={{
                            // marginTop:"10px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                            height: "150px",
                            overflow: "hidden",
                          }}
                        >
                          <img
                            // src="http://localhost:7000/api/images/image-1731304195084.png"
                            src={
                              item?.cover_image_url
                                ? `${process.env.REACT_APP_OVERRIDE_HOST}/api/images/${item.cover_image_url}`
                                : coverImage
                            }
                            // src={item?.cover_image_url}
                            alt={"alt"}
                            style={{
                              maxWidth: "100%",
                              maxHeight: "100%",
                              objectFit: "contain",
                            }}
                          />
                        </div>

                        <CardContent sx={{ flexGrow: 1 }}>
                          <Stack spacing={1}>
                            {item?.online && (
                              <Box sx={{ display: "flex", gap: 2 }}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <GroupIcon sx={{ fontSize: "1rem" }} />
                                  <Typography variant="body2">
                                    {item.participants}
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <CircleIcon
                                    sx={{
                                      color: "green",
                                      fontSize: "0.8rem",
                                    }}
                                  />
                                  <Typography variant="body2" color="green">
                                    online
                                  </Typography>
                                </Box>
                              </Box>
                            )}

                            <Typography
                              gutterBottom
                              variant="h5"
                              component="div"
                              mt={2}
                            >
                              {item.name}
                            </Typography>

                            {item?.shared_owner && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                shared by {item.user?.name}
                              </Typography>
                            )}

                            {/* <Typography
                              variant="body2"
                              color="text.secondary"
                              mt={1}
                            >
                              {item.last_session ||
                                "No previous session created"}
                            </Typography> */}
                            {item?.existingMeetings?.length > 0 ? (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                mt={1}
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                }}
                              >
                                <ScheduleIcon />
                                {`${
                                  item?.existingMeetings?.length
                                } scheduled meeting${
                                  item?.existingMeetings?.length > 1 ? "s" : ""
                                }`}
                              </Typography>
                            ) : (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                mt={1}
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                }}
                              >
                                <ScheduleIcon />
                                No meetings scheduled yet
                              </Typography>
                            )}
                          </Stack>
                        </CardContent>

                        <CardActions>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-evenly",
                              alignItems: "center",

                              width: "100%",
                            }}
                          >
                            <Tooltip
                              title={
                                item?.user
                                  ? "You don't have permission to Delete"
                                  : "Delete Room"
                              }
                            >
                              <Button
                                disabled={item?.user ? true : false}
                                // onClick={(e) => {
                                //   e.stopPropagation();
                                //   handleDeleteConirmationOpen(item?.id);
                                // }}
                                sx={{
                                  padding: "10px 20px",
                                }}
                              >
                                <DeleteOutlineIcon
                                  sx={{
                                    color: item?.user ? "gray" : "red",
                                  }}
                                />
                              </Button>
                            </Tooltip>
                            <Tooltip title={"Copy Room"}>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopy(item.friendly_id);
                                }}
                                sx={{ padding: "10px 20px" }}
                              >
                                <ContentCopyIcon
                                  sx={{ color: "primary.main" }}
                                />
                              </Button>
                            </Tooltip>
                            <Tooltip
                              title={
                                !item?.online
                                  ? "The meeting hasn't started yet"
                                  : ""
                              }
                            >
                              <span>
                                <MainButton
                                  disabled={!item?.online}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleJoinMeeting(item.friendly_id);
                                  }}
                                >
                                  Join
                                </MainButton>
                              </span>
                            </Tooltip>
                          </Box>
                        </CardActions>
                      </Card>
                    )}
                  </Grid>
                ))}
              </Grid>
            </Box>
          </>
        ) : null}
      </Container>
    </div>
  );
}

export default OnlyJoin;
