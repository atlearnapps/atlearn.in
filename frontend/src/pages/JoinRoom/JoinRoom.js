import {
  Avatar,
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  InputLabel,
  Stack,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import MainButton from "src/components/Button/MainButton/MainButton";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import SecondaryButton from "src/components/Button/SecondaryButton/SecondaryButton";
import { useLocation, useNavigate } from "react-router-dom";
import JoinRoomLayout from "src/layouts/joinRoom/JoinRoomLayout";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "src/Redux/userSlice";
import apiClients from "src/apiClients/apiClients";
import { toast } from "react-toastify";
// import FarlanesLogo from "src/images/logo/Final Logo.svg";
import siteSetting from "src/utils/siteSetting";
import ProfilePopup from "src/components/JoinRoom/ProfilePopup";
import Logo from "src/components/Logo";
import { formatDateRange } from "src/utils/formateDateRange";
import { useAuth0 } from "@auth0/auth0-react";
function JoinRoom() {
  const { loginWithRedirect } = useAuth0();
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [room, setRoom] = useState();
  const [name, setName] = useState("");
  const [access_Code, setAccess_Code] = useState("");
  const [accessCode, setAccessCode] = useState(false);
  const [moderator_AccessCode, setModerator_AccessCode] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [accessCodeError, setAccessCodeError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(true);
  const [roomId, setRoomId] = useState("");
  const [sitesetting, setSiteSetting] = useState(null);
  const [profile, setProfile] = useState("");
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [openProfile, setOpenProfile] = useState(false);
  const [scheduleMeetingData, setScheduleMeetingData] = useState();
  const [verifyPayment, setVerifyPayment] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const Sheduled_id = queryParams.get("id");

  useEffect(() => {
    const url = window.location.href;
    const parts = url.split("/");
    const id = parts[parts.length - 2];
    if (id) {
      setRoomId(id);
      fetchRoom(id);
      getSheduledMeetingDetails(id, Sheduled_id);
    }
  }, []);

  useEffect(() => {
    if (user?.user?.id && room?.room?.user?.id) {
      if (user?.user?.id === room?.room?.user?.id) {
        navigate(`/room/${room?.room?.friendly_id}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room, user]);

  useEffect(() => {
    // Call fetchData function when the component mounts
    const getData = async () => {
      try {
        const result = await siteSetting();
        if (result) {
          setSiteSetting(result);
        }

        // Handle the data as needed
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiClients.sessionData();
        if (response?.success === true) {
          if (response?.data) {
            setName(response.data.user.name);
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

  useEffect(() => {
    if (
      room?.settings?.glRequireAuthentication === "true" ||
      scheduleMeetingData?.price > 0
    ) {
      if (!user?.user) {
        setShowJoinRoom(false);
        // navigate("/login");
      } else {
        setShowJoinRoom(true);
      }
    }
    if (user?.user && scheduleMeetingData?.price > 0) {
      checkPayment(user?.user?.id, scheduleMeetingData?.id);
    }
  }, [room, user, scheduleMeetingData]);

  const fetchRoom = async (id) => {
    try {
      const response = await apiClients.getroomUser(id);
      if (response.data) {
        setRoom(response.data);
        if (response.data?.room?.user?.avatar) {
          const newUrl = `${process.env.REACT_APP_OVERRIDE_HOST}/api/images/${response.data?.room?.user?.avatar}`;
          setProfile(newUrl);
        }
        setProfileName(response.data?.room?.user?.name);
        setProfileEmail(response.data?.room?.user?.email);
        if (response.data.settings.glRequireAuthentication === "true") {
        }

        if (response.data.settings) {
          if (response.data.settings.glViewerAccessCode !== "false") {
            setAccessCode(true);
          }
          if (response.data.settings.glModeratorAccessCode !== "false") {
            setModerator_AccessCode(true);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const checkFeild = () => {
    let error = false;
    if (!name) {
      error = true;
      setNameError(true);
    } else {
      setNameError(false);
    }
    if (
      (moderator_AccessCode &&
        room?.settings?.glAnyoneJoinAsModerator === "false" &&
        !accessCode) ||
      (!moderator_AccessCode && !accessCode)
    ) {
      setAccessCodeError(false);
    } else {
      if (!access_Code) {
        error = true;
        setAccessCodeError(true);
      } else {
        setAccessCodeError(false);
      }
    }
    if (room?.settings?.glModeratorAccessCode !== "false") {
      if (access_Code) {
        if (access_Code === room?.settings?.glModeratorAccessCode) {
          setAccessCodeError(false);
        } else if (access_Code === room?.settings?.glViewerAccessCode) {
          setAccessCodeError(false);
        } else {
          error = true;
          setAccessCodeError(true);
          return {
            error: error,
            message: "access code invalid",
          };
        }
      }
    }

    return error;
  };

  const handleJoinMeeting = async () => {
    try {
      let checkfield = checkFeild();

      if (checkfield === false) {
        setLoading(true);
        let data = {
          name,
          access_code: access_Code,
        };
        const friendly_id = room.room.friendly_id;
        const response = await apiClients.joinMeeting(friendly_id, data);
        if (response.success === true) {
          if (response.data) {
            setLoading(false);
            window.location.href = response.data.joinAttendeeUrl;
          }
        } else {
          toast.error(response.message);
          setLoading(false);
        }
      } else {
        toast.error(
          checkfield.message ? `${checkfield.message}` : "All fields required "
        );
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const getSheduledMeetingDetails = async (room_id, SheduledId) => {
    try {
      const data = {
        roomId: room_id,
        scheduleMeeting_Id: SheduledId || null,
      };
      const response = await apiClients.SheduledMeetingDetails(data);
      if (response?.currentMeeting || response?.nextMeeting) {
        setScheduleMeetingData(
          response?.currentMeeting || response?.nextMeeting
        );
        // if (user?.user) {
        //   setShowJoinRoom(true);
        //   // navigate("/login");
        // } else {
        //   setShowJoinRoom(false);
        // }
        // if (!user?.user) {
        //   setShowJoinRoom(false);
        // } else {
        //   setShowJoinRoom(true);
        // }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkPayment = async (userId, scheduleId) => {
    try {
      const data = {
        user_id: userId,
        schedule_id: scheduleId,
      };
      const response = await apiClients.checkMeetingPayment(data);
      if (response?.paymentStatus === true) {
        setVerifyPayment(true);
      } else {
        setVerifyPayment(false);
      }
    } catch (error) {
      console.log();
    }
  };

  const Payment = async () => {
    try {
      const data = {
        amount: scheduleMeetingData?.price,
      };
      const response = await apiClients.checkout(data);
      if (response) {
        initPayment(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const initPayment = (data) => {
    var options = {
      key: process.env.REACT_APP_RAZORPAY_ID,
      amount: data.amount,
      currency: data.currency,
      name: "Atlearn",
      description: "Test Transaction",
      image: "/assets/atlearnlogo.svg",
      order_id: data.id,
      handler: async function (response) {
        const body = {
          ...response,
          planName: "ScheduleMeetingPayment",
          userEmail: user?.user?.email,
          scheduleId: scheduleMeetingData?.id,
          roomId: scheduleMeetingData?.room_id,
          totalPrice: scheduleMeetingData?.price,
        };
        const validateRes = await fetch(
          `${process.env.REACT_APP_OVERRIDE_HOST}/api/checkout/roomPayment`,
          {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const jsonRes = await validateRes.json();
        if (jsonRes.success) {
          // handlenext();
          checkPayment(user?.user?.id, scheduleMeetingData?.id);
        }
      },
      prefill: {
        name: user?.user?.name,
        email: user?.user?.email,
        // contact: phone,
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };
    var rzp1 = new window.Razorpay(options);
    rzp1.on("payment.failed", async function (response) {
      const data = {
        razorpay_order_id: response.error.metadata.order_id,
        razorpay_payment_id: response.error.metadata.payment_id,
        planName: "addon",
        userEmail: user?.user?.email,
        totalPrice: scheduleMeetingData?.price,
      };
      // eslint-disable-next-line no-unused-vars
      const faildPayment = await apiClients.failedTransaction(data);
    });
    rzp1.open();
  };

  const handleLogin = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: `/callback?roomId=${roomId}`,
      },
      authorizationParams: {
        prompt: "login",
      },
    });
  };
  const handleSignUp = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: `/callback?roomId=${roomId}`,
      },
      authorizationParams: {
        prompt: "login",
        screen_hint: "signup",
      },
    });
  };

  return (
    <JoinRoomLayout>
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          Height: "100%",
          width: "100%",
          minHeight: "calc(100vh - 70px - 70px - 57px - 15px)",
        }}
      >
        {showJoinRoom ? (
          <Card
            sx={{
              marginTop: 18,
              minWidth: "70%",
              boxShadow: "2px 4px 6px rgba(0, 0, 0, 0.5)",
              transition: "transform 0.2s",
            }}
          >
            <Container maxWidth={"md"}>
              <Box
                p={2}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 1.5,
                    alignItems: {
                      xs: "center",
                      sm: "flex-start",
                    },
                  }}
                >
                  <Typography
                    sx={{ color: " rgb(99, 115, 129)", textAlign: "center" }}
                  >
                    You have been invited to join this meeting
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: {
                        xs: `calc(1rem + 1.5vw)`,
                        sm: `calc(1rem + 1.5vw)`,
                      },
                      textAlign: {
                        xs: "center",
                        sm: "inherit",
                      },
                      fontWeight: 500,
                    }}
                  >
                    {room?.room?.name}
                  </Typography>
                  {scheduleMeetingData && (
                    <p className="text-gray-500 text-sm mb-2 ">
                      {scheduleMeetingData
                        ? scheduleMeetingData?.description
                        : ""}
                    </p>
                  )}
                  {scheduleMeetingData?.price > 0 && (
                    <div className="flex items-center">
                      <div className="bg-primary text-white font-bold py-1 px-4 rounded-full text-lg shadow-sm">
                        ₹ {scheduleMeetingData?.price}
                      </div>
                      {verifyPayment && (
                        <div className="ml-2 bg-green-500 text-xs text-white px-2 py-1 rounded-full">
                          Paid
                        </div>
                      )}
                    </div>
                  )}

                  <SecondaryButton
                    onClick={() =>
                      navigate(
                        `/room/${room?.room?.friendly_id}/public_recordings`
                      )
                    }
                  >
                    <VideocamOutlinedIcon
                      fontSize="large"
                      sx={{ marginRight: "10px" }}
                    />
                    View Recordings
                  </SecondaryButton>
                </Box>
                {scheduleMeetingData && (
                  <div className=" w-[380px] max-w-sm mx-auto bg-white rounded-xl  overflow-hidden p-6 transition-shadow duration-300">
                    {/* Schedule Heading */}
                    <h1 className="text-xl font-bold text-gray-800 mb-4 text-center">
                      Schedule
                    </h1>

                    {/* Date and Time */}
                    <p className="text-gray-500 text-sm mb-2 text-center">
                      {
                        formatDateRange(
                          scheduleMeetingData?.startDate,
                          scheduleMeetingData?.endDate
                        ).formattedStartDate
                      }
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-800 text-center">
                      {
                        formatDateRange(
                          scheduleMeetingData?.startDate,
                          scheduleMeetingData?.endDate
                        ).formattedStartTime
                      }{" "}
                      -{" "}
                      {
                        formatDateRange(
                          scheduleMeetingData?.startDate,
                          scheduleMeetingData?.endDate
                        ).formattedEndTime
                      }
                    </h2>
                  </div>
                )}

                <Box
                  justifyContent={"center"}
                  alignItems={"center"}
                  display={"flex"}
                  flexDirection={"column"}
                >
                  <Avatar
                    src={profile}
                    alt="Profile Picture"
                    sx={{
                      width: 80,
                      height: 80,
                      margin: "0 auto",
                      border: "4px solid #fff",
                      cursor: "pointer",
                      backgroundColor: "#6D207B",
                    }}
                    onClick={() => setOpenProfile(true)}
                  />
                  <Typography className="contentTypography">
                    {room?.room?.user?.name}
                  </Typography>
                </Box>
              </Box>
            </Container>

            <Divider />
            <CardContent>
              <Container maxWidth={"md"}>
                {/* <InputLabel>Name</InputLabel> */}
                <TextField
                  placeholder="Enter your name"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={nameError}
                />
                {moderator_AccessCode || accessCode ? (
                  <>
                    {moderator_AccessCode &&
                    room?.settings?.glAnyoneJoinAsModerator === "false" &&
                    !accessCode ? (
                      <>
                        <Box mt={1}>
                          <InputLabel>
                            Moderator Access Code (optional)
                          </InputLabel>
                          <TextField
                            placeholder="Enter the access code"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            value={access_Code}
                            onChange={(e) => {
                              setAccess_Code(e.target.value);
                              setAccessCodeError(false);
                            }}
                            error={accessCodeError}
                          />
                        </Box>
                      </>
                    ) : (
                      <>
                        <Box mt={1}>
                          <InputLabel>
                            {moderator_AccessCode &&
                            room.settings.glAnyoneJoinAsModerator === "true" &&
                            !accessCode
                              ? "Moderator Access Code"
                              : "Access Code"}{" "}
                          </InputLabel>
                          <TextField
                            value={access_Code}
                            placeholder="Enter the access code"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            onChange={(e) => {
                              setAccess_Code(e.target.value);
                              setAccessCodeError(false);
                            }}
                            error={accessCodeError}
                            // onBlur={()=>}
                          />
                        </Box>
                      </>
                    )}
                  </>
                ) : null}

                <Box
                  mt={1}
                  mb={2}
                  justifyContent={"end"}
                  alignItems={"center"}
                  display={"flex"}
                >
                  {verifyPayment || !scheduleMeetingData?.price ? (
                    <MainButton
                      onClick={handleJoinMeeting}
                      style={{ width: "100%" }}
                    >
                      {loading && (
                        <CircularProgress
                          size={"2rem"}
                          sx={{ color: "white" }}
                        />
                      )}

                      <Box ml={loading ? 2 : 0}>Join Meeting</Box>
                      <Box></Box>
                    </MainButton>
                  ) : (
                    <MainButton onClick={Payment} style={{ width: "100%" }}>
                      {loading && (
                        <CircularProgress
                          size={"2rem"}
                          sx={{ color: "white" }}
                        />
                      )}

                      <Box ml={loading ? 2 : 0}>Pay For Meeting</Box>
                      <Box></Box>
                    </MainButton>
                  )}
                </Box>
                {!name && (
                  <Stack
                    mt={2}
                    mb={2}
                    direction="column"
                    alignItems="center"
                    spacing={2}
                  >
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography
                        sx={{
                          fontSize: {
                            xs: "0.8rem",
                            sm: "inherit",
                          },
                        }}
                      >
                        Already have an account?
                      </Typography>

                      <Typography
                        onClick={() => navigate("/login")}
                        sx={{
                          color: "blue",
                          fontSize: {
                            xs: "0.8rem",
                            sm: "inherit",
                          },
                          cursor: "pointer",
                        }}
                      >
                        Sign In
                      </Typography>
                    </Stack>
                  </Stack>
                )}
              </Container>
            </CardContent>
            {/* </Container> */}
          </Card>
        ) : (
          <>
            <Card
              sx={{
                marginTop: 18,
                minWidth: "70%",
                boxShadow: "2px 4px 6px rgba(0, 0, 0, 0.5)",
                transition: "transform 0.2s",
              }}
            >
              {/* <Box
                sx={{
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "column",
                  mt: 4,
                }}
                onClick={() => navigate("/home")}
              >
           
                <img src={FarlanesLogo} alt="farlanesLogo" />
              </Box> */}
              <Box
                p={8}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                <Box
                  sx={{
                    cursor: "pointer",
                  }}
                  onClick={() => navigate("/")}
                >
                  <Logo />
                  {/* <img src={FarlanesLogo} alt="farlanesLogo" /> */}
                </Box>
                <Typography
                  sx={{ color: " rgb(99, 115, 129)", textAlign: "center" }}
                >
                  You must be signed in to join this room.
                </Typography>
                <Box>
                  {sitesetting?.registration !== "invite" && (
                    <SecondaryButton
                      // onClick={() => navigate(`/signup?roomId=${roomId}`)}
                      onClick={handleSignUp}
                    >
                      Sign Up
                    </SecondaryButton>
                  )}

                  <MainButton
                    // onClick={() => navigate(`/login?roomId=${roomId}`)}
                    onClick={handleLogin}
                  >
                    Sign In
                  </MainButton>
                </Box>
              </Box>
            </Card>
          </>
        )}
      </Container>
      <ProfilePopup
        open={openProfile}
        handleClose={() => setOpenProfile(false)}
        name={profileName}
        email={profileEmail}
        profile={profile}
      />
    </JoinRoomLayout>
  );
}

export default JoinRoom;
