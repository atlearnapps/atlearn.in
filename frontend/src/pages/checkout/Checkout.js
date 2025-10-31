import React, { useEffect, useState } from "react";
import apiClients from "src/apiClients/apiClients";
import {
  Box,
  Card,
  Container,
  Divider,
  Grid,
  IconButton,
  Radio,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import MainButton from "src/components/Button/MainButton/MainButton";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ErrorTwoToneIcon from "@mui/icons-material/ErrorTwoTone";
import siteSetting from "src/utils/siteSetting";
// import { loadStripe } from "@stripe/stripe-js";
import { UseAuth } from "src/utils/UseAuth/UseAuth";
import { setUser } from "src/Redux/userSlice";
// import VerificationCodeInput from "src/components/VerificationCode/VerificationCodeInput";
import SubscriptionPendingNotification from "src/components/Notification/Subscription_Pending";
import validatePhoneNumber from "src/utils/validateFields/validatePhoneNumber";
import SecondaryButton from "src/components/Button/SecondaryButton/SecondaryButton";
import Logo from "src/components/Logo";
import { useAuth0 } from "@auth0/auth0-react";
function Checout() {
  const { loginWithRedirect } = useAuth0();
  const auth = UseAuth(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const plansId = queryParams.get("id");
  const { user } = useSelector((state) => state.user);
  const [pricing, setPricing] = useState();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [phoneError, setPhoneError] = useState();
  const [selectedItem, setSelectedItem] = useState(null);
  const [total, setTotal] = useState();
  const [singUpOpne, setSingUpOpen] = useState(false);
  const [sitesetting, setSiteSetting] = useState(null);
  const [selectedPayMethod, setSelectedPayMethod] = useState(null);
  const [CheckSlecection, setCheckSelection] = useState(false);
  const [helperText, setHelperText] = useState("");
  const [subscriptionNotification, setSubsciptionNotification] =
    useState(false);
  const [canSubscribe, setCanSubscribe] = useState(true);

  useEffect(() => {
    if (auth.user) {
      dispatch(setUser(auth.user));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.user]);

  useEffect(() => {
    fetchPricing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user?.user) {
      if (user?.user?.subscription_pending === true) {
        setSubsciptionNotification(true);
        setCanSubscribe(false);
      } else {
        setSubsciptionNotification(false);
        setCanSubscribe(true);
      }
      // if (
      //   user?.user?.subscription_expiry_date &&
      //   user?.user?.trial === false &&
      //   user?.user?.role.name !== "Administrator" &&
      //   user?.user?.role.name !== "Super Admin"
      // ) {
      //   let expirationDate = new Date(user?.user?.subscription_expiry_date);
      //   let today = new Date(); // Current date

      //   // Calculate the date 3 days before the expiration date
      //   let threeDaysBeforeExpiration = new Date(expirationDate);
      //   threeDaysBeforeExpiration.setDate(expirationDate.getDate() - 13);

      //   // Check if today's date is within the 3-day range before the expiration date
      //   if (today >= threeDaysBeforeExpiration && today < expirationDate) {
      //     setCanSubscribe(true);
      //   } else if (today >= expirationDate) {
      //     setCanSubscribe(true);
      //   } else {
      //     setCanSubscribe(false);
      //     setSubsciptionNotification(true);
      //   }
      // }

      setSingUpOpen(false);
      setName(user.user.name);
      setEmail(user.user.email);
    }
  }, [user]);

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

  const textFieldStyle = {
    // width: "100%",
    height: "56px",
    borderRadius: "8px",
    // background: "#F5F7FB",
    background: "white",
  };

  const rootStyle = {
    borderRadius: "8px",
  };

  const handleRadioClickPayMethod = (item) => {
    setSelectedPayMethod(item.name);
  };

  const fetchPricing = async () => {
    try {
      const response = await apiClients.pricing();
      if (response.data) {
        const pricingData = response.data;
        const foundPricing = pricingData.find((item) => item.id === plansId);
        if (foundPricing) {
          setTotal(foundPricing.price);
          setSelectedItem(foundPricing.name);
        }
        setPricing(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleRadioClick = (item) => {
    setSelectedItem(item.name);
    setTotal(item.price);
  };

  const initPayment = (data) => {
    let garde;
    if (user.user.trial) {
      garde = "Upgrade";
    } else if (user.user.subscription?.price <= total) {
      garde = "Upgrade";
    } else {
      garde = "Downgrade";
    }
    var options = {
      key: process.env.REACT_APP_RAZORPAY_ID,
      amount: data.amount,
      currency: data.currency,
      name: "Atlearn", //your business name
      description: "Test Transaction",
      image: "/assets/atlearnlogo.svg",
      order_id: data.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      handler: async function (response) {
        const body = {
          ...response,
          planName: selectedItem,
          userEmail: email,
          subscriptionDate: new Date().toISOString().split("T")[0],
          planGrade: garde,
        };
        const token = localStorage.getItem("access_token") || "";
        const validateRes = await fetch(
          `${process.env.REACT_APP_OVERRIDE_HOST}/api/checkout/verifyPayment`,
          {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const jsonRes = await validateRes.json();
        if (jsonRes.success) {
          navigate("/settings/mytransaction");
        }
      },
      prefill: {
        //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
        name: name, //your customer's name
        email: email,
        contact: phone, //Provide the customer's phone number for better conversion rates
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
      let garde;
      if (user.user.trial) {
        garde = "Upgrade";
      } else if (user.user.subscription?.price <= total) {
        garde = "Upgrade";
      } else {
        garde = "Downgrade";
      }
      const data = {
        razorpay_order_id: response.error.metadata.order_id,
        razorpay_payment_id: response.error.metadata.payment_id,
        planName: selectedItem,
        userEmail: email,
        planGrade: garde,
      };
      rzp1.close();
      // console.log("failddddddddddddddddddddd");

      // eslint-disable-next-line no-unused-vars
      const faildPayment = await apiClients.failedTransaction(data);
    });

    rzp1.open();
  };

  const payment = async () => {
    try {
      if (user?.user) {
        setSingUpOpen(false);
        const data = {
          amount: total,
        };
        const response = await apiClients.checkout(data);
        if (response) {
          initPayment(response.data);
        }
      } else {
        // if (sitesetting?.registration === "invite") {
        //   navigate("/login");
        // }
        setSingUpOpen(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //strip

  // const makePayment = async () => {
  //   const stripe = await loadStripe(
  //     "pk_test_51OtOzdSG5zrLcDOoCPRsl4slV7otpqeZPERhDhRMERfCZvJZX0UkxJ9xTLgmQJ0clZGNqSQX3DLHxxvlFYlfAkAn00nCKdsBFp"
  //   );

  //   const body = {
  //     plan: selectedItem,
  //     total: total,
  //   };
  //   const headers = {
  //     "Content-Type": "application/json",
  //   };
  //   const response = await fetch(
  //     `${process.env.REACT_APP_OVERRIDE_HOST}/api/checkout/create-checkout-session`,
  //     {
  //       method: "POST",
  //       headers: headers,
  //       body: JSON.stringify(body),
  //     }
  //   );

  //   const session = await response.json();
  //   if (session) {
  //     const data = {
  //       plan: selectedItem,
  //       sessionId: session.id,
  //       user_Id: user?.user?.id,
  //     };
  //     localStorage.setItem("sessionId", session.id);

  //     // eslint-disable-next-line no-unused-vars
  //     const response = await apiClients.addTransaction(data);
  //   }

  //   const result = stripe.redirectToCheckout({
  //     sessionId: session.id,
  //   });

  //   if (result.error) {
  //     console.log(result.error);
  //   }
  // };

  const habdlePayment = () => {
    if (user?.user) {
      setSingUpOpen(false);
      // if (selectedPayMethod === "stripe") {
      //   if (phone && phoneError === false) {
      //     // makePayment();
      //   } else {
      //     setHelperText(!helperText ? "Mobile Number Required *" : helperText);
      //     setPhoneError(true);
      //   }
      // } else
      if (selectedPayMethod === "razorpay") {
        if (phone && phoneError === false) {
          payment();
        } else {
          setHelperText(!helperText ? "Mobile Number Required *" : helperText);
          setPhoneError(true);
        }
      } else {
        setCheckSelection(true);
      }
    } else {
      setSingUpOpen(true);
    }
  };

  // const validatePhoneNumber = (phone) => {
  //   const phoneRegex = /^[0-9]{10}$/; // This regex checks for exactly 10 digits
  //   return phoneRegex.test(phone);
  // };
  const handleBlur = () => {
    if (!validatePhoneNumber(phone)) {
      setPhoneError(true);
      setHelperText("Please enter a valid 10-digit phone number");
    } else {
      setPhoneError(false);
      setHelperText("");
    }
  };

  // const handleSubscriptionPopupON = () => {
  //   setSubsciptionNotification(true);
  // };
  const handleSubscriptionPopupclose = () => {
    setSubsciptionNotification(false);
    // navigate("/settings/mytransaction");
  };
  const handleLogin = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: `/callback?checkout=${plansId}`,
      },
      authorizationParams: {
        prompt: "login",
      },
    });
  };
  const handleSignUp = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: `/callback?checkout=${plansId}`,
      },
      authorizationParams: {
        prompt: "login",
        screen_hint: "signup",
      },
    });
  };

  return (
    <Box mb={20}>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Container maxWidth="xl">
          <Card
            sx={{
              minHeight: "200px",
              padding: { xs: 2, md: 10 },
              mt: 5,
              mb: 5,
            }}
          >
            <Grid container spacing={8} sx={{ height: "100%" }}>
              {singUpOpne ? (
                <Grid item xs={12} md={6}>
                  <Card
                    variant="outlined"
                    sx={{
                      minHeight: "200px",
                      padding: { xs: 2, md: 5 },
                      // mt: 16,
                    }}
                  >
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
                      </Box>
                      <Typography
                        sx={{
                          color: " rgb(99, 115, 129)",
                          textAlign: "center",
                        }}
                      >
                        Please sign up or log in to proceed to checkout.
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
                </Grid>
              ) : (
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
                  {pricing?.map(
                    (item, index) =>
                      // Check if the item name is not "Free" before rendering
                      item.name !== "Free" && (
                        <Box
                          sx={{
                            border:
                              selectedItem === item.name
                                ? "4px solid #6E8AF5"
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
                          onClick={() => handleRadioClick(item)}
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
                                checked={selectedItem === item.name}
                                onClick={() => handleRadioClick(item)}
                              />
                            </Box>
                            <Box>
                              <Typography className="pricesecondaryheading">
                                {item?.name}
                              </Typography>
                              <Typography className="pricecontendTypography">
                                {item?.name === "Basic"
                                  ? "Essential tools to kickstart your learning journey"
                                  : item?.name === "Pro"
                                  ? "Unlock advanced features for a more immersive learning experience."
                                  : item?.name === "Enterprise"
                                  ? "Customized solutions for large-scale education and training needs."
                                  : "Experience the best price for great"}
                              </Typography>
                            </Box>
                          </Stack>
                        </Box>
                      )
                  )}
                  <Stack>
                    <Typography className="pricecontendTypography">
                      Show a full price comparison.
                      <IconButton onClick={() => navigate("/pricing")}>
                        <ErrorTwoToneIcon />
                      </IconButton>
                    </Typography>
                  </Stack>
                </Grid>
              )}

              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    border: "1px solid #B4CDEB",
                    borderRadius: "16px",
                    backgroundColor: "#f8f9fa",
                    padding: "20px 32px ",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    mb: 3,
                  }}
                >
                  <Typography className="pricesecondaryheading">
                    TOTAL
                  </Typography>
                  <Divider></Divider>
                  <Typography
                    sx={{
                      fontSize: "32px",
                      fontWeight: 500,
                      lineHeight: "72px",
                      color: "#40444B",
                    }}
                  >
                    ₹ {`${total}`}
                  </Typography>
                </Box>
                {user?.user && (
                  <Stack spacing={1}>
                    <TextField
                      fullWidth
                      name="Name"
                      value={name ? name : ""}
                      placeholder="Name"
                      InputProps={{
                        style: textFieldStyle,
                      }}
                      style={rootStyle}
                    />

                    <TextField
                      fullWidth
                      name="email"
                      value={email ? email : ""}
                      InputProps={{
                        style: textFieldStyle,
                      }}
                      style={rootStyle}
                    />
                    <TextField
                      fullWidth
                      name="phone"
                      type="text"
                      value={phone ? phone : ""}
                      InputProps={{
                        style: textFieldStyle,
                      }}
                      onBlur={handleBlur}
                      // onChange={(e) => {
                      //   setHelperText("");
                      //   setPhoneError(false);
                      //   setPhone(e.target.value);
                      // }}
                      onChange={(e) => {
                        const newValue = e.target.value;

                        // Restrict the length to 10 characters
                        if (/^\d{0,10}$/.test(newValue)) {
                          setHelperText("");
                          setPhoneError(false);
                          setPhone(newValue);
                        }
                      }}
                      inputProps={{
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                      }}
                      style={rootStyle}
                      placeholder="Enter Your Mobile Number"
                      error={phoneError}
                      helperText={helperText}
                      // disabled
                    />
                  </Stack>
                )}

                <div style={{ marginTop: "20px" }}>
                  <Typography mb={2} className="pricesecondaryheading">
                    Select Payment Method *
                  </Typography>
                  {CheckSlecection && (
                    <span style={{ color: "red" }}>
                      Please select Payment Method
                    </span>
                  )}
                  {/* <Divider></Divider> */}
                  <Stack direction={"row"} alignItems={"center"} spacing={2}>
                    <Box>
                      <Radio
                        value="razorpay"
                        name="radio-buttons"
                        checked={selectedPayMethod === "razorpay"}
                        onChange={() => {
                          handleRadioClickPayMethod({ name: "razorpay" });
                          setCheckSelection(false);
                        }}
                      />
                    </Box>
                    <Box>
                      <Typography className="pricesecondaryheading">
                        Razorpay
                      </Typography>
                    </Box>
                  </Stack>
                  {/* <Stack direction={"row"} alignItems={"center"} spacing={2}>
                    <Box>
                      <Radio
                        value="stripe"
                        name="radio-buttons"
                        checked={selectedPayMethod === "stripe"}
                        onChange={() => {
                          handleRadioClickPayMethod({ name: "stripe" });
                          setCheckSelection(false);
                        }}
                      />
                    </Box>
                    <Box>
                      <Typography className="pricesecondaryheading">
                        Stripe
                      </Typography>
                    </Box>
                  </Stack> */}
                </div>

                <Stack direction={"row"} justifyContent={"end"} mt={2} mb={2}>
                  <MainButton
                    disabled={
                      user?.user?.subscription_pending || canSubscribe === false
                    }
                    // onClick={payment}
                    // onClick={makePayment}
                    onClick={habdlePayment}
                    style={{ width: "100%" }}
                  >
                    Pay Now
                  </MainButton>
                </Stack>
                <SecondaryButton
                  style={{ width: "100%" }}
                  onClick={() => navigate(-1)}
                >
                  Back to Options
                </SecondaryButton>
              </Grid>
            </Grid>
          </Card>
        </Container>
      </Box>
      <SubscriptionPendingNotification
        open={subscriptionNotification}
        handleClose={handleSubscriptionPopupclose}
      />
    </Box>
  );
}

export default Checout;
