import {
  Box,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Tab,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import "./SingleRoom.css";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
// import HomeIcon from "@mui/icons-material/Home";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Recordings from "src/components/Recordings/Recordings";
import Presentation from "src/components/Presentation/Presentation";
import Access from "src/components/Acces/Access";
import Settings from "src/components/Settings/Settings";
import MainButton from "src/components/Button/MainButton/MainButton";
import SecondaryButton from "src/components/Button/SecondaryButton/SecondaryButton";
import apiClients from "src/apiClients/apiClients";
import { toast } from "react-toastify";
// import ShareIcon from "@mui/icons-material/Share";
// import SheduleRoom from "./ScheduleRoom";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import { useSelector } from "react-redux";
import RoomHistory from "src/components/RoomHistory/RoomHistory";
// import ArrowCircleLeftRoundedIcon from "@mui/icons-material/ArrowCircleLeftRounded";
import { checkDuration, checkStorage } from "src/utils/addonCheck/addonUtils";
import Notification from "src/components/Notification/expiredNotification";
import BackButton from "src/components/Button/BackButton/BackButton";
import RoomScheduledMeeting from "src/components/RoomScheduledMeeting/RoomScheduledMeeting";
import CancelButton from "src/components/Button/CancelButton/CancelButton";
import formatDurationFromMilliseconds from "src/utils/formatDurationFromMilliseconds";
import BBBLogo from "src/assets/images/home/new/bbb.webp";
import ZoomLogo from "src/assets/images/home/new/z.webp";

function SingleRoom() {
  const { user } = useSelector((state) => state.user);
  const [value, setValue] = React.useState("6");
  const friendly_id = useParams();
  const [room, setRoom] = useState();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  // const [sheduleOpen, setScheduleOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [shareRoom, setShareRoom] = useState(false);
  // const [presentation, setPresentation] = useState(false);
  const [addonDuration, setAddonDuration] = useState(false);
  const [addonStorage, setAddonStorage] = useState(false);
  const [expired, setExpired] = useState(false);
  const openmenu = Boolean(anchorEl);
  const url = `${window.location.origin}/Join-meeting?roomId=${friendly_id?.id}`;
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const settings = queryParams.get("settings");
  const [validEmails, setValidEmails] = useState([]);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [allEmails, setAllEmails] = useState("");

  useEffect(() => {
    if (settings === "true") {
      setValue("4");
    }
  }, [settings]);
  useEffect(() => {
    siteSetting();
    if (friendly_id) {
      fetchData(friendly_id.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [friendly_id]);

  useEffect(() => {
    if (user?.user) {
      const usedStorageKB = 10485750;
      const totalStorageGB = 10;
      const usedSeconds = user?.user?.duration_spent;
      const totalHours =
        user?.user?.subscription?.duration + user?.user?.addon_duration;

      // Use utility functions
      setAddonStorage(checkStorage(usedStorageKB, totalStorageGB));
      setAddonDuration(checkDuration(usedSeconds, totalHours));
    }
  }, [user]);

  // const handleScheduleOpen = () => {
  //   handleMenuClose();
  //   setScheduleOpen(true);
  // };
  // const handleScheduleClose = () => {
  //   setScheduleOpen(false);
  // };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleClickOpen = () => {
    handleMenuClose();
    setOpen(true);
  };

  const handleClose = () => {
    setEmail("");
    setOpen(false);
    setValidEmails([]);
    setAllEmails([]);
    setEmailError(false);
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const fetchData = async (id) => {
    try {
      const response = await apiClients.getOneRoom(id);
      if (response.data) {
        setRoom(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleStartMeeting = async (id) => {
    try {
      setLoading(true);
      const { data, success, message, duration } =
        await apiClients.startMeeting(id);

      if (data?.joinModeratorUrl) {
        window.location.href = data.joinModeratorUrl;
      } else if (!success && message) {
        toast.error(message);
      }
      if (duration) {
        setAddonDuration(true);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartZoomMeeting = async (id) => {
    try {
      const response = await apiClients.startZoomMeeting(id);
      if (response?.url) {
        window.location.href = response?.url;
        // window.open(response?.url, "_blank");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/Join-meeting?roomId=${friendly_id.id}`
    );
    toast.success(
      "The meeting URL has been copied. The link can be used to join the meeting."
    );
  };

  const handleShareRoom = async () => {
    try {
      if (!Boolean(emailError)) {
        const data = {
          email: allEmails,
          url: url,
          room: room?.name,
        };
        console.log(data, data);

        // eslint-disable-next-line no-unused-vars
        const response = apiClients.shareRoom(data);
        toast.success("The room has been successfully shared via email");
        setEmail("");
        setOpen(false);
      } else {
        setEmailError("Invalid email address");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEmailChange = (e) => {
    setEmailError(false);
    const value = e.target.value;

    if (value.includes(",")) {
      const emailList = value
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email); // Remove empty strings

      const valid = emailList.filter((email) => emailPattern.test(email));
      const invalid = emailList.filter((email) => !emailPattern.test(email));

      if (invalid.length > 0) {
        setEmailError(true);
      } else {
        setEmailError(false);
        setValidEmails((prev) => {
          const updatedEmails = [...new Set([...prev, ...valid])]; // Avoid duplicates
          setAllEmails(updatedEmails.join(", ")); // Store as comma-separated string
          return updatedEmails;
        });
      }

      setEmail(""); // Clear input field after processing
    } else {
      setEmail(value);
    }
  };
  const handleDelete = (emailToDelete) => {
    setValidEmails((prev) => {
      const updatedEmails = prev.filter((email) => email !== emailToDelete);
      setAllEmails(updatedEmails.join(", ")); // Update comma-separated string
      return updatedEmails;
    });

    if (email === emailToDelete) {
      setEmail(""); // Clear input if the deleted email was in it
    }
  };
  const handleEmailBlur = (val) => {
    // Validate emails using a regular expression
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // const emailList = email.split(",").map((email) => email.trim());
    // const invalidEmails = emailList.filter(
    //   (email) => !emailPattern.test(email)
    // );

    // if (invalidEmails.length > 0) {
    //   setEmailError(true);
    // } else {
    //   setEmailError(false);
    // }

    const mail = val.target.value;
    const ValidEmail = emailPattern.test(mail);
    if (ValidEmail) {
      setValidEmails((prev) => {
        const updatedEmails = [...prev, mail];

        // Store as a comma-separated string in another state
        setAllEmails(updatedEmails.join(", "));

        return updatedEmails;
      });
      setEmail(""); // Clear input field after processing
    } else {
      if (mail?.length > 0) {
        setEmailError(true);
      } else {
        setEmailError(false);
      }
    }
  };

  const siteSetting = async () => {
    const data = {
      name: ["ShareRooms", "PreuploadPresentation"],
    };
    try {
      const response = await apiClients.getSiteSettings(data);
      if (response.data) {
        response.data.forEach((item) => {
          switch (item.setting.name) {
            case "ShareRooms":
              // setShareRoom(item.value);
              setShareRoom(item.value === "true" ? true : false);
              // setShareId(item.id);
              break;
            // case "PreuploadPresentation":

            //   setPresentation(item.value === "true" ? true : false);

            //   break;
            default:
              break;
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
      <div>
        <Notification setNotfication={setExpired} type={"modal"} />
        <Container maxWidth={"xl"}>
          <div style={{ cursor: "pointer" }}>
            <Box sx={{ pt: 13, pb: 2 }}>
              {/* <IconButton>
                <ArrowCircleLeftRoundedIcon
                  fontSize="large"
                  sx={{ color: "#E8063C" }}
                />
              </IconButton> */}
              <BackButton />
            </Box>
          </div>

          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} lg={6}>
                <Box>
                  <div style={{ display: "flex" }}>
                    {room?.provider && (
                      <img
                        src={room?.provider === "zoom" ? ZoomLogo : BBBLogo}
                        alt="Zoom Icon"
                        style={{
                          width: "24px",
                          height: "24px",
                          marginRight: "10px",
                        }}
                      />
                    )}

                    <Typography
                      sx={{ fontSize: "2rem" }}
                      gutterBottom
                      // pt={5}
                      className="mainHead"
                    >
                      {room?.name}
                    </Typography>
                    <Box sx={{ display: { xs: "block", sm: "none" } }}>
                      <IconButton onClick={handleClick} aria-label="Example">
                        <MoreVertOutlinedIcon />
                      </IconButton>
                      {/* {sheduleOpen && (
                        <SheduleRoom
                          open={sheduleOpen}
                          handleClosebox={handleScheduleClose}
                          url={url}
                          room={room}
                        />
                      )} */}
                    </Box>
                  </div>
                  {room?.last_session ? (
                    <div>
                      <Typography variant="subtitle1">
                        Last Session: {room?.last_session}
                      </Typography>
                    </div>
                  ) : (
                    <div>
                      <Typography variant="subtitle1">
                        No previous session created
                      </Typography>
                    </div>
                  )}
                  {parseInt(room?.room_duration, 10) > 0 && (
                    <Box
                      sx={{
                        backgroundColor: "#f0f4f8",
                        padding: "10px",
                        borderRadius: "8px",
                        display: "inline-block",
                        marginTop: "10px",
                      }}
                    >
                      <Typography variant="body1" sx={{ color: "#3f51b5" }}>
                        Hours spent :
                        {formatDurationFromMilliseconds(
                          parseInt(room?.room_duration, 10)
                        )}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Grid>
              <Grid className="grid_main" item xs={12} lg={6}>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    gap: 2,
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: { xs: "flex-start", lg: "flex-end" },
                  }}
                >
                  <SecondaryButton
                    // onClick={() => navigate(`/join/${room?.friendly_id}`)}
                    onClick={handleCopy}
                  >
                    <ContentCopyIcon sx={{ marginRight: "10px" }} />
                    Copy Join Link
                  </SecondaryButton>
                  {user?.permission?.CreateRoom === "true" && (
                    <Tooltip
                      title={
                        addonDuration
                          ? "Duration limits exceeded.Upgrading to an add-on plan."
                          : ""
                      }
                    >
                      <Box sx={{ xs: { width: "100%" } }}>
                        <MainButton
                          style={{ width: "100%" }}
                          disabled={addonDuration || expired}
                          // onClick={() => handleStartMeeting(room.friendly_id)}
                          onClick={() => {
                            if (room?.provider === "zoom") {
                              handleStartZoomMeeting(room.friendly_id);
                            } else {
                              handleStartMeeting(room.friendly_id);
                            }
                          }}
                        >
                          {loading && (
                            <CircularProgress
                              size={"1.2rem"}
                              sx={{ color: "white" }}
                            />
                          )}
                          <Box ml={loading ? 2 : 0}>
                            {room?.online ? "Join Meeting" : "Start Meeting"}
                          </Box>
                        </MainButton>
                      </Box>
                    </Tooltip>
                  )}

                  {open && (
                    <Box>
                      <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>Share Meeting</DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            To invite others to join this meeting, please enter
                            their email addresses here.
                          </DialogContentText>

                          <TextField
                            autoFocus
                            margin="dense"
                            id="name"
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
                          <Box
                            sx={{
                              mt: 2,
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 1,
                            }}
                          >
                            {validEmails.map((email, index) => (
                              <Chip
                                key={index}
                                label={email}
                                onDelete={() => handleDelete(email)}
                                color="primary"
                              />
                            ))}
                          </Box>
                        </DialogContent>
                        <DialogActions>
                          <MainButton onClick={handleShareRoom}>
                            Share
                          </MainButton>
                          <CancelButton onClick={handleClose}>
                            Cancel
                          </CancelButton>
                        </DialogActions>
                      </Dialog>
                    </Box>
                  )}
                  {user?.permission?.CreateRoom === "true" && (
                    <Box sx={{ display: { xs: "none", sm: "block" } }}>
                      <IconButton onClick={handleClick} aria-label="Example">
                        {/* <ShareIcon /> */}

                        <MoreVertOutlinedIcon />
                      </IconButton>
                      {/* {sheduleOpen && (
                        <SheduleRoom
                          open={sheduleOpen}
                          handleClosebox={handleScheduleClose}
                          url={url}
                          room={room}
                        />
                      )} */}
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={openmenu}
            onClose={handleMenuClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={handleClickOpen}>Share Meeting</MenuItem>
            {/* <MenuItem onClick={handleScheduleOpen}>Schedule Meeting</MenuItem> */}
          </Menu>

          <Box sx={{ marginTop: "50px" }}>
            <Box sx={{ width: "100%", typography: "body1" }}>
              <TabContext value={value}>
                <Box>
                  <TabList
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons
                    allowScrollButtonsMobile
                    aria-label="scrollable force tabs example"
                  >
                    {user?.permission?.CreateRoom === "true" && (
                      <Tab
                        className="tabheading"
                        label="Schedule Meeting"
                        value="6"
                      />
                    )}

                    <Tab className="tabheading" label="Recordings" value="1" />
                    {/* {presentation && (
                        <Tab
                          className="tabheading"
                          label="Presentation"
                          value="2"
                        />
                      )} */}

                    {user?.user?.subscription?.sharedRoomAccess === "true" &&
                      shareRoom && (
                        <Tab className="tabheading" label="Access" value="3" />
                      )}
                    {user?.permission?.CreateRoom === "true" && (
                      <Tab className="tabheading" label="Settings" value="4" />
                    )}
                    {/* {user?.permission?.CreateRoom === "true" && (
                      <Tab
                        className="tabheading"
                        label="Room History"
                        value="5"
                      />
                    )} */}

                    <Tab
                      className="tabheading"
                      label="Meeting History"
                      value="5"
                    />
                  </TabList>
                </Box>
                <Box
                  sx={{
                    marginBottom: "20px",
                    background: "rgb(255, 255, 255)",
                    minHeight: "30vh",
                    borderRadius: "12px",
                    boxShadow: "2px 4px 6px rgba(0, 0, 0, 0.5)",
                    // boxShadow: " 2px 0px 5px rgba(0, 0, 0, 0.2)",
                    transition: "transform 0.2s",
                  }}
                >
                  <TabPanel value="1">
                    <Recordings friendly_id={room?.friendly_id} />
                  </TabPanel>
                  <TabPanel value="2">
                    <Presentation />
                  </TabPanel>
                  <TabPanel value="3">
                    <Access Roomid={room?.id} />
                  </TabPanel>
                  <TabPanel value="4">
                    <Settings
                      getdata={fetchData}
                      Roomid={room?.id}
                      Duration={addonDuration}
                      Storage={addonStorage}
                    />
                  </TabPanel>
                  <TabPanel value="5">
                    <RoomHistory meeting_id={room?.meeting_id} />
                  </TabPanel>
                  <TabPanel value="6">
                    <RoomScheduledMeeting Roomid={room?.id} room={room} />
                  </TabPanel>
                </Box>
              </TabContext>
            </Box>
          </Box>
        </Container>
      </div>
  )
}

export default SingleRoom;
