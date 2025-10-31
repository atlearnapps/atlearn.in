import React, { useState, useEffect } from "react";
import "./Home.css";
import MainButton from "src/components/Button/MainButton/MainButton";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { FaSearch } from "react-icons/fa";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ShareIcon from '@mui/icons-material/Share';
import AddIcon from "@mui/icons-material/Add";
import NewRoom from "src/components/NewRoom/NewRoom";
import apiClients from "src/apiClients/apiClients";
import { toast } from "react-toastify";
import SecondaryButton from "src/components/Button/SecondaryButton/SecondaryButton";
import PersonalVideoIcon from "@mui/icons-material/PersonalVideo";
import { useDispatch, useSelector } from "react-redux";
import CircleIcon from "@mui/icons-material/Circle";
import GroupIcon from "@mui/icons-material/Group";
import LoaderHome from "./LoaderHome";
import { useLocation, useNavigate } from "react-router-dom";
// import classImage from "src/images/landingpages/Rectangle 347.svg";
import { setUser } from "src/Redux/userSlice";
// import ExpiredCard from "src/components/Notification/ExpiredCard";
// import RoomVideoicon from "src/images/landingpages/videocallIcon.svg";
import DeleteConfirmation from "src/components/confirmationPopup/confirmationPopup";
import AddonModal from "src/components/Addonplan/AddonModal";
import { checkDuration, checkStorage } from "src/utils/addonCheck/addonUtils";
import NotificationPopup from "src/components/Notification/NotificationPopup";
import LimitExceededModal from "src/components/Notification/LimitExceededModal";
import { convertToDate } from "src/utils/FormateDateUtils";
import coverImage from "src/assets/images/online-classes/New/Classroom_Content_Online_Courses_Cover.webp";
import { setPageLoading } from "src/Redux/loadingSlice";
import Notification from "src/components/Notification/expiredNotification";
import axios from "axios";
import {
  lmsOnlineMeetingsFilterToken,
  lmsOnlineMeetingsToken,
} from "src/apiClients/token";
import { useHandleNavigate } from "src/utils/Navigation/useHandleNavigate";
import ScheduleIcon from "@mui/icons-material/Schedule";
import BBBLogo from "src/assets/images/home/new/bbb.webp";
import ZoomLogo from "src/assets/images/home/new/z.webp";
import { Helmet } from "react-helmet";
import { BASE_URL } from "src/apiClients/config";
import ShareMeeting from "../SingleRoom/ShareMeeting";

function Home() {
  const dispatch = useDispatch();
  const handleNavigate = useHandleNavigate();
  const { user } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [rooms, setRooms] = useState();
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadigPage] = useState(false);
  const [loadingRoom, setLoadingRoom] = useState(null);
  const [cancelIcon, setCancelIcon] = useState(false);
  const [notification, setNotfication] = useState(false);
  const [expired, setExpired] = useState(false);
  const [daydiff, setDayDiff] = useState();
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [roomId, setRoomId] = useState();
  const [addonplanopen, setAddonPlanOpen] = useState(false);
  const [addonDuration, setAddonDuration] = useState(false);
  const [addonStorage, setAddonStorage] = useState(false);
  const [limitModalOpen, setLimitModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const roomOpen = queryParams.get("open");
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [courses, setCourses] = useState([]);
  const [courseDetails, setCourseDetails] = useState([]);
  const [shareOpen, setShareOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [roomUrl, setRoomUrl] = useState("");

  // const options = courses;
  useEffect(() => {
    if (roomOpen === "true") {
      setOpen(true);
    }
  }, [roomOpen]);

  useEffect(() => {
    dispatch(setPageLoading(true));
    fetchData();
    fetchTotalDuration();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user?.user) {
      if (user?.permission?.["CreateRoom"] !== "true") {
        navigate("/only-join");
      }

      if (
        user?.user?.subscription_start_date &&
        user?.user?.subscription_expiry_date &&
        user?.user?.role?.name !== "Super Admin" &&
        user?.user?.role?.name !== "Administrator"
      ) {
        const subscriptionStartDate = new Date(
          user?.user?.subscription_start_date
        );
        // const subscriptionStartDate = new Date(
        //   "2024-09-01"
        //  );
        const subscriptionEndDate = new Date(
          user?.user?.subscription_expiry_date
        );

        const timeDiff = subscriptionEndDate - subscriptionStartDate;
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        const currentDate = new Date();
        // const currentDate = new Date( "2024-10-24");
        const daysDifference = Math.floor(
          (currentDate - subscriptionStartDate) / (1000 * 60 * 60 * 24)
        );

        const expirationThreshold = daysDiff;
        setDayDiff(expirationThreshold - daysDifference);

        if (daysDifference >= expirationThreshold) {
          if (
            user?.user?.subscription?.name === "Enterprise" &&
            user?.user?.trial === true
          ) {
            PlanChange("free");
          } else {
            if (user?.user?.subscription_pending === true) {
              PlanChange("next");
            } else {
              handleRoomSettings();
              handleCreateNotification(true);
              setExpired(true);
            }
          }
        } else {
          setExpired(false);
          // setNotfication(expirationThreshold - daysDifference <= 14);
          if (expirationThreshold - daysDifference <= 14) {
            if (user?.user?.subscription_pending === true) {
              setNotfication(false);
            } else {
              handleCreateNotification();
              setNotfication(true);
            }
          } else {
            setNotfication(false);
          }
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (user?.user) {
      fetchCourses(user?.user?.email);
      const usedStorageKB = 10485750;
      const totalStorageGB = 10;
      const usedSeconds = user?.user?.duration_spent;
      const totalHours =
        user?.user?.subscription?.duration + user?.user?.addon_duration;
      // Use utility functions

      setAddonStorage(checkStorage(usedStorageKB, totalStorageGB));
      setAddonDuration(checkDuration(usedSeconds, totalHours));
      setLimitModalOpen(checkStorage(usedStorageKB, totalStorageGB));
      setLimitModalOpen(checkDuration(usedSeconds, totalHours));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

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
        // setFilteredRooms([...responseData, ...courses])
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

  const session = async () => {
    try {
      const responseData = await apiClients.sessionData();
      if (responseData?.success === true) {
        if (responseData?.data) {
          dispatch(setUser(responseData.data));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTotalDuration = async () => {
    try {
      const response = await apiClients.getTotalduration();
      if (response) {
        session();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleRoomSettings = async () => {
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await apiClients.expiredPlan();
    } catch (error) {
      console.log(error);
    }
  };
  const PlanChange = async (plan) => {
    try {
      const data = {
        plan: plan,
      };
      const response = await apiClients.changePlan(data);
      if (response.success === true) {
        session();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateRoom = async (value, price, image, type, provider) => {
    setSelected("");
    setCourseDetails([]);
    setIsOpen(false);
    const formData = new FormData();
    formData.append("name", value);
    formData.append("image", image);
    formData.append("room_type", type);
    formData.append("provider", provider);

    try {
      const response = await apiClients.createRooms(formData);
      if (response) {
        fetchData();
      }
      if (response.success === true) {
        toast.success(response.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleStartMeeting = async (id) => {
    setLoadingRoom(id);
    setLoading(true);

    try {
      const { data, success, message, duration } =
        await apiClients.startMeeting(id);

      if (data?.joinModeratorUrl) {
        window.location.href = data.joinModeratorUrl;
      } else if (!success && message) {
        toast.error(message);
      }

      if (duration) {
        setAddonDuration(true);
        setLimitModalOpen(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartZoomMeeting = async (id) => {
    try {
      const response = await apiClients.startZoomMeeting(id);
      if (response?.url) {
        window.location.href = response?.url;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const lmstStartCourse = async (url) => {
    window.location.href = url;
  };

  const handleSearchChange = (event) => {
    setCancelIcon(true);
    const { value } = event.target;
    setSearchTerm(value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClickClose = () => {
    setOpen(false);
  };
  const handleAddonOpen = () => {
    setAddonPlanOpen(true);
  };
  const handleCloseAddonPlan = () => {
    setAddonPlanOpen(false);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  // const hadleLimitModalOpen = () => {
  //   setLimitModalOpen(true);
  // };

  const handleLimitModalClose = () => {
    setLimitModalOpen(false);
    if (user?.user?.trial !== true) {
      handleAddonOpen();
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
  const lmsCopyMeetingLink = (url) => {
    navigator.clipboard.writeText(`${url}`);
    toast.success(
      "The meeting URL has been copied. The link can be used to join the meeting."
    );
  };

  const cancelSearch = () => {
    setSearchTerm("");
    const value = "";
    const filtered = rooms.filter((room) =>
      room.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredRooms(filtered);
    setCancelIcon(false);
  };

  const handleDeleteConirmationOpen = (id) => {
    setRoomId(id);
    setDeleteConfirm(true);
  };

  const handleDeleteConirmationClose = () => {
    setDeleteConfirm(false);
  };

  const handleDeleteRoom = async () => {
    try {
      const response = await apiClients.removeRoom(roomId);
      if (response.success === true) {
        toast.success(response.message);
        fetchData();
      } else if (response.success === false) {
        toast.error(response.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateNotification = async (expired) => {
    try {
      if (daydiff !== undefined && daydiff !== 0 && daydiff > 0) {
        const data = {
          title: expired ? "Your Plan Expired" : "Your Plan Expiring Soon",
          message: expired
            ? `Your ${
                user?.user?.trial === true ||
                user?.user?.subscription?.name === "Free"
                  ? user?.user?.subscription?.name + " trial "
                  : user?.user?.subscription?.name + " plan "
              } period has expired.`
            : `Your ${
                user?.user?.trial === true ||
                user?.user?.subscription?.name === "Free"
                  ? user?.user?.subscription?.name + " trial "
                  : user?.user?.subscription?.name + " plan "
              }  period has only ${daydiff}  days remaining.`,
          type: "Plan Expiry",
        };
        await apiClients.createNotification(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCourses = async (email) => {
    dispatch(setPageLoading(true));
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

  const fetchCoursesDetails = async (id) => {
    dispatch(setPageLoading(true));
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://lms.atlearn.in/webservice/rest/server.php?wstoken=${lmsOnlineMeetingsFilterToken}&wsfunction=get_courses_with_filter_bigbluebutton&moodlewsrestformat=json&courseid=${id}`,

      headers: {
        Cookie: "MoodleSession=0olf6pmhf7crek67hdfr2b5g9u",
      },
    };

    try {
      const response = await axios.request(config);
      const fetchedCourses = response.data || [];
      // Filter out courses with empty or null categories
      // const filteredCourses = fetchedCourses?.modules.filter(
      //   (course) => course.modname === "bigbluebuttonbn"
      // );;
      setCourseDetails(fetchedCourses);
    } catch (error) {
      console.log(error);
    }
  };

  const combinedData =
    courseDetails.length > 0 ? courseDetails : [...filteredRooms, ...courses];
    
  // Filter data based on search input
  const filteredData = combinedData?.filter((item) =>
    ("onlineclassname" in item ? item.onlineclassname : item.name)
      ?.toLowerCase()
      ?.includes(searchTerm.toLowerCase())
  );

  const handleShareRoomOpen=(name,friendlyId)=>{
    setShareOpen(true);
    setRoomName(name);
    setRoomUrl(`${window.location.origin}/Join-meeting?roomId=${friendlyId}`);
  }

  const handleShareRoomClose = () => {
    setShareOpen(false);
  }

  return (
    <>
      <Helmet>
        <title>Seamless Virtual Meeting Dashboard | Atlearn</title>
        <meta
          name="description"
          content=" Manage and access all your virtual meetings in one place with Atlearn's intuitive dashboard. Schedule, join, and track your sessions effortlessly for a smooth online collaboration experience."
        />
        <link rel="canonical" href={`${BASE_URL}/room`} />
      </Helmet>
      <div>
        <Notification setNotfication={setExpired} type={"modal"} />

      
          <Container maxWidth={"xl"} sx={{ marginTop: 12 }}>
            <Grid container spacing={2}>
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  flexDirection: "column",
                  alignItems: "end",
                  gap: 2,
                  width: "100%",
                }}
              >
                {notification && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      // justifyContent: "space-between",
                      justifyContent: "center",

                      backgroundColor: "#F5F6F7",
                      padding: "20px",
                      border: "1px solid #6D207B",
                      borderRadius: "20px",
                      flexDirection: { xs: "column", sm: "row" },
                      width: { xs: "100%", sm: "auto" },
                      gap: 2,
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        flex: 3,
                        textAlign: "center",
                        marginLeft: "20px",
                      }}
                    >
                      {`Your ${
                        user?.user?.trial === true ||
                        user?.user?.subscription?.name === "Free"
                          ? user?.user?.subscription?.name + " trial "
                          : user?.user?.subscription?.name + " plan "
                      }  period has only`}
                      {/* <br /> */}
                      <span
                        style={{ color: "red" }}
                      >{` ${daydiff}  days remaining.`}</span>
                    </div>
                    <div style={{ flex: 1, textAlign: "center" }}>
                      <SecondaryButton
                        onClick={() => navigate("/settings/mysubscription")}
                        style={{
                          fontSize: "0.8rem",
                          padding: "10px",
                          width: "120px",
                          marginLeft: "30px",
                        }}
                      >
                        {user?.user?.subscription?.name === "Free"
                          ? "Upgrade Now "
                          : "Renew Now"}
                      </SecondaryButton>
                    </div>
                  </Box>
                )}
                {(addonDuration || addonStorage) &&
                  user?.user?.trial === false && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        // justifyContent: "space-between",
                        justifyContent: "center",

                        backgroundColor: "#F5F6F7",
                        padding: "20px",
                        border: "1px solid #6D207B",
                        borderRadius: "20px",
                        flexDirection: { xs: "column", sm: "row" },
                        width: { xs: "100%", sm: "auto" },
                        gap: 2,
                        marginBottom: "10px",
                      }}
                    >
                      <div
                        style={{
                          flex: 3,
                          textAlign: "center",
                          marginLeft: "20px",
                        }}
                      >
                        {addonDuration && !addonStorage && (
                          <p>
                            Your duration limit is exceeded. <br />
                            Upgrading to an add-on plan for extended duration
                            limits.
                          </p>
                        )}
                        {addonStorage && !addonDuration && (
                          <p>
                            Your storage limit is exceeded. <br />
                            Upgrading to an add-on plan for increased storage.
                          </p>
                        )}
                        {addonDuration && addonStorage && (
                          <p>
                            Both duration and storage limits are exceeded.{" "}
                            <br />
                            Upgrading to an add-on plan for additional benefits.
                          </p>
                        )}
                      </div>
                      <div style={{ flex: 1, textAlign: "center" }}>
                        <SecondaryButton
                          onClick={() => handleAddonOpen()}
                          style={{
                            fontSize: "0.8rem",
                            padding: "10px",
                            width: "120px",
                            marginLeft: "30px",
                          }}
                        >
                          Add-on Plan
                        </SecondaryButton>
                      </div>
                    </Box>
                  )}
              </Grid>
            </Grid>
          </Container>
          <section>
            {/* bannaer section */}
            <div className="container2-xl bg-darkdeep1 py-10px  rounded-2xl relative overflow-hidden shadow-brand ">
              <div className="container">
                <div className="flex flex-col items-center text-center w-full ">
                  {/* banner Left */}
                  <div data-aos="fade-up" className="w-4/5">
                    <h3 className="uppercase text-secondaryColor text-size-15 mb-5px md:mb-15px font-inter tracking-5px">
                      EDUCATION SOLUTION
                    </h3>
                    <h1 className="text-3xl text-whiteColor md:text-4xl  leading-10 md:leading-15 md:tracking-half lg:tracking-normal 2xl:tracking-half font-bold mb-15px sm:mb-30px">
                      Welcome Aboard,
                      <br /> Collaborate, Connect, and Make Every Meeting Count
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

          <div className="container2-xl mt-10px mb-10px">
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} lg={6} md={6}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: {
                        xs: "center",
                        sm: "start",
                      },
                      alignItems: {
                        xs: "center",
                        sm: "start",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        justifyContent: {
                          xs: "center",
                          sm: "start",
                        },
                      }}
                    >
                      <MainButton>Meetings</MainButton>
                      <SecondaryButton
                        sx={{
                          color: "#6D207B",
                        }}
                        onClick={() => navigate("/recordings")}
                      >
                        Recordings
                      </SecondaryButton>
                    </Box>
                    {(rooms?.length > 0 || filteredData?.length > 0) && (
                      <TextField
                        sx={{ maxWidth: "250px", mt: 2 }}
                        className="homeSearch"
                        label="Search"
                        variant="outlined"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        size="small"
                        InputProps={{
                          endAdornment: cancelIcon ? (
                            <InputAdornment position="end">
                              <IconButton onClick={cancelSearch}>
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </InputAdornment>
                          ) : (
                            <InputAdornment position="end"></InputAdornment>
                          ),
                        }}
                      />
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: 2,
                      alignItems: "center",
                      justifyContent: {
                        xs: "center",
                        sm: "center",
                        md: "end",
                      },
                    }}
                  >
                    {courses?.length > 0 && (
                      <div>
                        <div className="relative inline-block w-64">
                          <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none flex justify-between items-center"
                          >
                            <span>{selected || "Select a course"}</span>
                            {selected ? (
                              <span
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent dropdown from opening
                                  setSelected("");
                                  setCourseDetails([]);
                                  setIsOpen(false);
                                }}
                                // className="ml-2 text-red-600 cursor-pointer"
                              >
                                ❌
                              </span>
                            ) : (
                              <span>▼</span>
                            )}
                          </button>
                          {isOpen && (
                            <ul className="absolute left-0 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
                              {Array.from(
                                new Map(
                                  courses?.map((option) => [
                                    option.courseid,
                                    option,
                                  ])
                                ).values()
                              ).map((option) => (
                                <li
                                  key={option.courseid} // Use courseid as a unique key
                                  onClick={() => {
                                    setSelected(option?.coursename);
                                    fetchCoursesDetails(option?.courseid);
                                    setIsOpen(false);
                                  }}
                                  className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                                >
                                  {option?.coursename}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    )}

                    <Box>
                      {filteredData?.length > 0 && (
                        <Tooltip
                          title={
                            user?.permission?.["RoomLimit"] <= rooms?.length
                              ? "Meeting limit reached. Cannot create more meetings."
                              : ""
                          }
                          arrow
                        >
                          <Box>
                            <MainButton
                              disabled={
                                user?.permission?.["RoomLimit"] <= rooms?.length
                                  ? true
                                  : false
                              }
                              onClick={handleClickOpen}
                            >
                              <AddIcon
                                fontSize="small"
                                sx={{ marginRight: "10px" }}
                              />
                              New Meeting
                            </MainButton>
                          </Box>
                        </Tooltip>
                      )}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            {loadingPage ? (
              <LoaderHome />
            ) : filteredData?.length ? (
              <>
                <Box sx={{ flexGrow: 1, mt: 2, mb: 12, height: "100%" }}>
                  <Grid
                    container
                    spacing={2}
                    sx={{ display: "flex", alignItems: "stretch" }}
                  >
                    {filteredData?.length > 0 &&
                      filteredData.map((item, index) => (
                        <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                          {"type" in item ? (
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
                                  src={
                                    item?.type === "zoom" ? ZoomLogo : BBBLogo
                                  }
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
                                          !item.meetingurl
                                            ? "disabled"
                                            : "primary"
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
                                        )}
                                      <Box ml={loading ? 2 : 0}>
                                        {item.online ? "Join" : "Start"}
                                      </Box> */}
                                      <Box>Join</Box>
                                    </MainButton>
                                  </span>
                                </Tooltip>
                              </CardActions>
                            </Card>
                          ) : (
                            <Card
                              onClick={() => {
                                if (item?.user?.expired) {
                                  setModalOpen(true);
                                } else {
                                  navigate(`/room/${item.friendly_id}`);
                                }
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
                                  src={
                                    item?.provider === "zoom"
                                      ? ZoomLogo
                                      : BBBLogo
                                  } // Update this with the correct path
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
                                      {Number(item?.participants) > 0 && (
                                        <Box
                                          sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                          }}
                                        >
                                          <GroupIcon
                                            sx={{ fontSize: "1rem" }}
                                          />
                                          <Typography variant="body2">
                                            {item?.participants}
                                          </Typography>
                                        </Box>
                                      )}

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
                                        <Typography
                                          variant="body2"
                                          color="green"
                                        >
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
                                        item?.existingMeetings?.length > 1
                                          ? "s"
                                          : ""
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

                              <CardActions
                                sx={{ justifyContent: "space-around", pb: 2 }}
                              >
                                <Tooltip
                                  title={
                                    item?.user
                                      ? "Permission Denied"
                                      : "Delete Room"
                                  }
                                >
                                  <Button
                                    disabled={!!item.user}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteConirmationOpen(item.id);
                                    }}
                                    sx={{ padding: "10px 20px" }}
                                  >
                                    <DeleteOutlineIcon
                                      color={item.user ? "disabled" : "error"}
                                    />
                                  </Button>
                                </Tooltip>
                                <Tooltip
                                  title={"share this room with others"
                                  }
                                >
                                  <Button
                                    // disabled={!!item.user}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // handleDeleteConirmationOpen(item.id);
                                     handleShareRoomOpen(item.name, item.friendly_id);
                                    }}
                                    sx={{ padding: "10px 20px" }}
                                  >
                                    <ShareIcon
                                     color="primary"
                                    />
                                  </Button>
                                </Tooltip>

                                <Tooltip title="Copy Room">
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCopy(item.friendly_id);
                                    }}
                                    sx={{ padding: "10px 20px" }}
                                  >
                                    <ContentCopyIcon color="primary" />
                                  </Button>
                                </Tooltip>

                                <Tooltip
                                  title={
                                    addonDuration
                                      ? "Duration Limit Exceeded"
                                      : item.user?.expired
                                      ? `${item?.user?.name}'s account has expired`
                                      : ""
                                  }
                                >
                                  <span>
                                    <MainButton
                                      disabled={
                                        addonDuration || item.user?.expired
                                      }
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (item?.provider === "zoom") {
                                          handleStartZoomMeeting(
                                            item.friendly_id
                                          );
                                        } else {
                                          handleStartMeeting(item.friendly_id);
                                        }
                                      }}
                                      sx={{ padding: "10px 50px" }}
                                    >
                                      {loading &&
                                        loadingRoom === item.friendly_id && (
                                          <CircularProgress
                                            size="1.2rem"
                                            sx={{ color: "white" }}
                                          />
                                        )}
                                      <Box ml={loading ? 2 : 0}>
                                        {item.online ? "Join" : "Start"}
                                      </Box>
                                    </MainButton>
                                  </span>
                                </Tooltip>
                              </CardActions>
                            </Card>
                          )}
                        </Grid>
                      ))}
                  </Grid>
                </Box>
              </>
            ) : combinedData?.length > 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-gray-50 rounded-2xl shadow-inner">
                <FaSearch className="w-12 h-12 text-gray-400 mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  No meetings found
                </h2>
                <p className="text-gray-500 text-sm max-w-md">
                  We couldn’t find any meetings matching your search. Try
                  adjusting your keywords or filters.
                </p>
              </div>
            ) : (
              <Box
                sx={{
                  marginTop: "20px",
                  background: "rgb(255, 255, 255)",
                  minHeight: "40vh",
                  borderRadius: "12px",
                  boxShadow:
                    "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px",
                  transition:
                    "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                }}
              >
                <div
                  style={{
                    height: "30vh",
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
                      gap: 1,
                    }}
                  >
                    <Avatar sx={{ width: 80, height: 80 }}>
                      <PersonalVideoIcon
                        sx={{ color: "primary.main", fontSize: 40 }}
                      />
                    </Avatar>

                    <h3 style={{ color: "primary.main", textAlign: "center" }}>
                      You don't have any meetings yet!
                    </h3>

                    <p style={{ textAlign: "center" }}>
                      Create your first meeting by clicking on the button below
                      and entering a meeting name.
                    </p>
                    <MainButton onClick={handleClickOpen}>
                      <AddIcon fontSize="small" sx={{ marginRight: "10px" }} />
                      Create your First Meeting
                    </MainButton>
                  </Box>
                </div>
              </Box>
            )}
          </div>
       

        <NewRoom
          open={open}
          handleClose={handleClickClose}
          handleCreateRoom={handleCreateRoom}
        />
        <DeleteConfirmation
          open={deleteConfirm}
          handleClose={handleDeleteConirmationClose}
          handleConfirm={handleDeleteRoom}
        />
        <AddonModal
          open={addonplanopen}
          handleClose={handleCloseAddonPlan}
          addonDurationactive={addonDuration}
          addonStorageActive={addonStorage}
          session={session}
        />
        <LimitExceededModal
          open={limitModalOpen}
          handleClose={handleLimitModalClose}
          Duration={addonDuration}
          Storage={addonStorage}
        />
        <NotificationPopup
          open={modalOpen}
          handleClose={handleModalClose}
          heading={"Meeting Unavailable"}
          message={
            "The Meeting is currently unavailable because the owner's plan has expired. Please contact the owner to renew their plan or upgrade to regain access."
          }
        />

        <ShareMeeting
          url={roomUrl}
          roomName= {roomName}
          open={shareOpen}
          handleClose={handleShareRoomClose}
        />

      </div>
    </>
  );
}

export default Home;
