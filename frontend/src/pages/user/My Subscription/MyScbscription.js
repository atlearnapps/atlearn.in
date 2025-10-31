import React, { useEffect, useState } from "react";
import apiClients from "src/apiClients/apiClients";
// import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  IconButton,
  Radio,
  Stack,
  Typography,
} from "@mui/material";
import MainButton from "src/components/Button/MainButton/MainButton";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ErrorTwoToneIcon from "@mui/icons-material/ErrorTwoTone";
import Tickmarkicon from "src/images/price/Featured icon.svg";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddonModal from "src/components/Addonplan/AddonModal";
import { clearDuration, clearStorage } from "src/Redux/addonplanSlice";
// import { FaBedPulse } from "react-icons/fa6";
import { setUser } from "src/Redux/userSlice";
import Notification from "src/components/Notification/expiredNotification";
import { Helmet } from "react-helmet";
import { BASE_URL } from "src/apiClients/config";
function MyScbscription() {
  const navigate = useNavigate();
  const plansId = useParams();
  const { user } = useSelector((state) => state.user);
  const [pricing, setPricing] = useState();
  const [myplan, setMyplan] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [addonplanopen, setAddonPlanOpen] = useState(false);
  const [addonDuration, setAddonDuration] = useState(false);
  const [addonStorage, setAddonStorage] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [notification, setNotfication] = useState(false);
  const dispatch = useDispatch();
  // const theme = useTheme();
  useEffect(() => {
    fetchPricing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (user) {
      setSelectedItem(user?.user?.subscription);
      setMyplan(user?.user?.subscription);
    }
  }, [user]);
  const handleCloseAddonPlan = () => {
    dispatch(clearDuration());
    dispatch(clearStorage());
    setAddonPlanOpen(false);
  };
  const fetchPricing = async () => {
    try {
      const response = await apiClients.pricing();
      if (response.data) {
        const pricingData = response.data;
        const foundPricing = pricingData.find((item) => item.id === plansId.id);
        if (foundPricing) {
          setSelectedItem(foundPricing);
        }
        setPricing(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleAddonOpen = (plan) => {
    if (plan === "duration") {
      setAddonDuration(true);
      setAddonStorage(false);
      setAddonPlanOpen(true);
    } else if (plan === "storage") {
      setAddonDuration(false);
      setAddonStorage(true);
      setAddonPlanOpen(true);
    } else {
      setAddonDuration(true);
      setAddonStorage(true);
      setAddonPlanOpen(true);
    }
  };
  const handleRadioClick = (item) => {
    setSelectedItem(item);
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

  return (
    <div>
      <Helmet>
        <title>Manage Your Subscription Settings - Atlearn Platform</title>
        <meta
          name="description"
          content="Access and manage your subscription settings effortlessly with Atlearn. Update preferences, review plans, and enhance your learning experience seamlessly."
        />
        <link
          rel="canonical"
          href={`${BASE_URL}/settings/mysubscription`}
        />
      </Helmet>
      <Box sx={{ mb: 2, mt: 1 }}>
        <Notification setNotfication={setNotfication} />
      </Box>
      <Box mb={2}>
        <Container maxWidth="xl">
          <Card sx={{ minHeight: "200px", padding: { xs: 2, md: 4 }, mt: 5 }}>
            <Grid container spacing={8} sx={{ height: "100%" }}>
              <Grid item xs={12} md={6}>
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: "42px",
                    lineHeight: "49.35px",
                    // color: "#F5F6F7",
                    textAlign: "center",
                    mb: 1,
                  }}
                >
                  Plans
                </Typography>
                {pricing?.map((item, index) => (
                  // Check if the item name is not "Free" before rendering

                  <Box
                    onClick={() => handleRadioClick(item)}
                    key={index}
                    sx={{
                      border:
                        selectedItem?.name === item.name
                          ? "4px solid #6E8AF5"
                          : myplan?.name === item.name
                          ? "2.5px solid #6E8AF5"
                          : "1px solid #6E8AF5",
                      borderRadius: "16px",
                      backgroundColor: "#FFFFFF",
                      padding: "20px 32px ",
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                      mb: 2,
                      cursor: "pointer",
                      // width:"80%"
                    }}
                  >
                    <Stack
                      direction={"row"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                      spacing={2}
                    >
                      <Stack
                        direction={"row"}
                        alignItems={"center"}
                        spacing={2}
                      >
                        <Box>
                          <Radio
                            value={item.name}
                            name="radio-buttons"
                            inputProps={{ "aria-label": item.name }}
                            checked={selectedItem?.name === item.name}
                            onClick={() => handleRadioClick(item)}
                          />
                        </Box>
                        <Box>
                          <Typography className="pricesecondaryheading">
                            {item?.name}
                          </Typography>
                          <Typography className="pricecontendTypography">
                            {item?.name === "Basic"
                              ? "Essential tools to kickstart your learning journey."
                              : item?.name === "Pro"
                              ? "Unlock advanced features for a more immersive learning experience."
                              : item?.name === "Enterprise"
                              ? "Customized solutions for large-scale education and training needs."
                              : "Experience the best price for great."}
                          </Typography>
                        </Box>
                      </Stack>
                      {myplan?.name === item.name && (
                        <Stack>
                          <CheckCircleIcon
                            sx={{ color: "green", fontSize: "2rem" }}
                          />
                        </Stack>
                      )}
                    </Stack>
                  </Box>
                ))}
                <Stack>
                  <Typography className="pricecontendTypography">
                    Show a full price comparison.
                    <IconButton
                      onClick={() => navigate("/pricing?fromSubscription=true")}
                    >
                      <ErrorTwoToneIcon />
                    </IconButton>
                  </Typography>
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card
                  variant="outlined"
                  sx={{
                    minHeight: "200px",
                    paddingTop: 2,
                    // padding: { xs: 2, md: 5 },
                    // m: 16,
                  }}
                >
                  <Box>
                    <Box sx={{ borderBottom: "1px solid #DFE2E7" }}>
                      <Box
                        sx={{
                          //   padding: "32px 32px 24px 32px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "column",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            // gap: "4px",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "20px",
                              fontWeight: 500,
                              lineHeight: "28px",
                              color: "#545962",
                            }}
                          >
                            {selectedItem?.name}
                          </Typography>
                          <Typography
                            sx={{ padding: "10px" }}
                            className="pricecontendTypography"
                          >
                            {selectedItem?.name === "Basic"
                              ? "Essential tools to kickstart your learning journey"
                              : selectedItem?.name === "Pro"
                              ? "Unlock advanced features for a more immersive learning experience."
                              : selectedItem?.name === "Enterprise"
                              ? "Customized solutions for large-scale education and training needs."
                              : "Experience the best price for great"}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            // flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Box>
                            <Typography
                              sx={{
                                fontSize: "38px",
                                fontWeight: 500,
                                lineHeight: "72px",
                                color: "#40444B",
                              }}
                            >
                              ₹
                            </Typography>{" "}
                          </Box>
                          <Box>
                            <Typography
                              sx={{
                                fontSize: "48px",
                                fontWeight: 500,
                                lineHeight: "72px",
                                color: "#40444B",
                              }}
                            >
                              {selectedItem?.price}
                            </Typography>
                          </Box>
                        </Box>
                        {myplan?.name === selectedItem?.name &&
                          myplan?.name !== "Free" &&
                          myplan?.trial !== true &&
                          !notification && (
                            <MainButton
                              onClick={handleAddonOpen}
                              style={{ marginBottom: "10px" }}
                            >
                              Add-on Plans
                            </MainButton>
                          )}
                      </Box>
                    </Box>

                    <Box sx={{ borderBottom: "1px solid #DFE2E7" }}>
                      <Container>
                        <Box
                          sx={{
                            marginTop: "5%",
                            marginBottom: "5%",
                            display: "flex",
                            flexDirection: "column",
                            gap: "31px",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "8px",
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "14px",
                                fontWeight: 500,
                                lineHeight: "19.6px",
                                color: "#545962",
                              }}
                            >
                              FEATURES
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "14px",
                                fontWeight: 500,
                                lineHeight: "19.6px",
                                color: "#545962",
                              }}
                            >
                              Everything in our{" "}
                              <span
                                style={{
                                  fontSize: "14px",
                                  fontWeight: 700,
                                }}
                              >
                                {selectedItem?.name}
                              </span>{" "}
                              Plan plus..
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", justifyContent: "" }}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "100%",
                                flexWrap: "wrap",
                                alignItems: "center",
                                gap: 2,
                              }}
                            >
                              <Stack direction={"column"} spacing={2}>
                                <Stack direction={"row"} spacing={1}>
                                  <Box>
                                    <img
                                      src={Tickmarkicon}
                                      alt="Tickmarkicon"
                                    />
                                  </Box>
                                  <Typography className="pricecontendTypography">
                                    {selectedItem?.participants} participants
                                  </Typography>
                                </Stack>
                                <Stack
                                  direction={"col"}
                                  alignItems={"center"}
                                  spacing={1}
                                >
                                  <Box>
                                    <img
                                      src={Tickmarkicon}
                                      alt="Tickmarkicon"
                                    />
                                  </Box>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexWrap: "wrap",
                                      // flexDirection: user?.user?.addon_duration
                                      //   ? "column"
                                      //   : "row",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Typography className="pricecontendTypography">
                                      {user?.user?.addon_duration &&
                                      myplan?.name === selectedItem?.name ? (
                                        <>
                                          {selectedItem?.duration} hours +{" "}
                                          <span style={{ color: "green" }}>
                                            {user?.user?.addon_duration} hours
                                          </span>
                                        </>
                                      ) : (
                                        `${selectedItem?.duration} hours`
                                      )}
                                    </Typography>
                                    {myplan?.name === selectedItem?.name &&
                                      myplan?.name !== "Free" &&
                                      myplan?.trial !== true && !notification && (
                                        <Button
                                          onClick={() =>
                                            handleAddonOpen("duration")
                                          }
                                        >
                                          Add-on
                                        </Button>
                                      )}
                                  </Box>
                                </Stack>
                                <Stack direction={"row"} spacing={1}>
                                  <Box>
                                    <img
                                      src={Tickmarkicon}
                                      alt="Tickmarkicon"
                                    />
                                  </Box>
                                  <Typography className="pricecontendTypography">
                                    {selectedItem?.Validity}{" "}
                                    {selectedItem?.period === "day"
                                      ? "days"
                                      : "months"}
                                  </Typography>
                                </Stack>

                                <Stack
                                  direction={"row"}
                                  spacing={1}
                                  style={{
                                    opacity:
                                      selectedItem?.chat === "true" ? 1 : 0.5,
                                  }}
                                >
                                  <Box>
                                    <img
                                      src={Tickmarkicon}
                                      alt="Tickmarkicon"
                                    />
                                  </Box>
                                  <Typography className="pricecontendTypography">
                                    Public / Private Chat
                                  </Typography>
                                </Stack>

                                <Stack
                                  direction={"row"}
                                  spacing={1}
                                  style={{
                                    opacity:
                                      selectedItem?.sharedNotes === "true"
                                        ? 1
                                        : 0.5,
                                  }}
                                >
                                  <Box>
                                    <img
                                      src={Tickmarkicon}
                                      alt="Tickmarkicon"
                                    />
                                  </Box>
                                  <Typography className="pricecontendTypography">
                                    Shared Notes
                                  </Typography>
                                </Stack>

                                <Stack direction={"row"} spacing={1}>
                                  <Box>
                                    <img
                                      src={Tickmarkicon}
                                      alt="Tickmarkicon"
                                    />
                                  </Box>
                                  <Typography
                                    className="pricecontendTypography"
                                    style={{
                                      opacity:
                                        selectedItem?.screenshare === "true"
                                          ? 1
                                          : 0.5,
                                    }}
                                  >
                                    Screen Sharing
                                  </Typography>
                                </Stack>
                              </Stack>

                              <Stack direction={"column"} spacing={2}>
                                <Stack
                                  direction={"row"}
                                  spacing={1}
                                  style={{
                                    opacity:
                                      selectedItem?.sharedRoomAccess === "true"
                                        ? 1
                                        : 0.5,
                                  }}
                                >
                                  <Box>
                                    <img
                                      src={Tickmarkicon}
                                      alt="Tickmarkicon"
                                    />
                                  </Box>
                                  <Typography className="pricecontendTypography">
                                    Share Access
                                  </Typography>
                                </Stack>
                                <Stack
                                  direction={"row"}
                                  alignItems={"center"}
                                  spacing={1}
                                >
                                  <Box>
                                    <img
                                      src={Tickmarkicon}
                                      alt="Tickmarkicon"
                                    />
                                  </Box>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexWrap: "wrap",
                                      // flexDirection: user?.user?.addon_storage
                                      //   ? "column"
                                      //   : "row",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Typography className="pricecontendTypography">
                                      {user?.user?.addon_storage &&
                                      // myplan?.name === selectedItem?.name
                                      //   ? `${selectedItem?.storage} GB +
                                      //       ${user?.user?.addon_storage}GB add-on`
                                      //   : `${selectedItem?.storage} GB`
                                      myplan?.name === selectedItem?.name ? (
                                        <>
                                          {selectedItem?.storage} GB +{" "}
                                          <span style={{ color: "green" }}>
                                            {user?.user?.addon_storage} GB{" "}
                                          </span>
                                        </>
                                      ) : (
                                        `${selectedItem?.storage} GB`
                                      )}
                                    </Typography>
                                    {myplan?.name === selectedItem?.name &&
                                      myplan?.name !== "Free" &&
                                      myplan?.trial !== true && !notification && (
                                        <Button
                                          onClick={() =>
                                            handleAddonOpen("storage")
                                          }
                                          // sx={{ border: "1px solid black" }}
                                        >
                                          Add-on
                                        </Button>
                                      )}
                                  </Box>
                                </Stack>

                                <Stack
                                  direction={"row"}
                                  spacing={1}
                                  style={{
                                    opacity:
                                      selectedItem?.recording === "true"
                                        ? 1
                                        : 0.5,
                                  }}
                                >
                                  <Box>
                                    <img
                                      src={Tickmarkicon}
                                      alt="Tickmarkicon"
                                    />
                                  </Box>
                                  <Typography className="pricecontendTypography">
                                    {selectedItem?.recording === "true"
                                      ? "Recordings"
                                      : "No Recordings"}
                                  </Typography>
                                </Stack>
                                <Stack
                                  direction={"row"}
                                  spacing={1}
                                  style={{
                                    opacity:
                                      selectedItem?.breakout === "true"
                                        ? 1
                                        : 0.5,
                                  }}
                                >
                                  <Box>
                                    <img
                                      src={Tickmarkicon}
                                      alt="Tickmarkicon"
                                    />
                                  </Box>
                                  <Typography className="pricecontendTypography">
                                    Breakout Rooms
                                  </Typography>
                                </Stack>
                                <Stack
                                  direction={"row"}
                                  spacing={1}
                                  style={{
                                    opacity:
                                      selectedItem?.multiuserwhiteboard ===
                                      "true"
                                        ? 1
                                        : 0.5,
                                  }}
                                >
                                  <Box>
                                    <img
                                      src={Tickmarkicon}
                                      alt="Tickmarkicon"
                                    />
                                  </Box>
                                  <Typography className="pricecontendTypography">
                                    Multi User Whiteboard
                                  </Typography>
                                </Stack>
                              </Stack>
                            </Box>
                          </Box>
                        </Box>
                      </Container>
                    </Box>
                    <Box sx={{ width: "100%", padding: "32Px" }}>
                      <MainButton
                        // disabled={
                        //   selectedItem?.name === "Free" ||
                        //   (user?.user?.subscription_id === selectedItem?.id &&
                        //     subs_exp_date > currentDate)
                        // }
                        disabled={selectedItem?.name === "Free"}
                        onClick={() => {
                          navigate(`/checkout?id=${selectedItem.id}`);
                        }}
                        style={{ width: "100%" }}
                      >
                        {myplan?.price <= selectedItem?.price
                          ? "Upgrade"
                          : "Downgrade"}
                      </MainButton>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Card>
        </Container>
      </Box>
      <AddonModal
        open={addonplanopen}
        handleClose={handleCloseAddonPlan}
        addonDurationactive={addonDuration}
        addonStorageActive={addonStorage}
        session={session}
      />
    </div>
  );
}

export default MyScbscription;
