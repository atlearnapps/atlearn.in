import { Box, Divider, Grid, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import SecondaryButton from "../Button/SecondaryButton/SecondaryButton";
import MainButton from "../Button/MainButton/MainButton";
import { useSelector } from "react-redux";
import apiClients from "src/apiClients/apiClients";
import CancelButton from "../Button/CancelButton/CancelButton";

const AddonPayment = ({ handlenext, handleback, handleCloseBox }) => {
  const addonDurationPlan = useSelector((state) => state.addonPlan.duration);
  const addonStoragePlan = useSelector((state) => state.addonPlan.storage);
  const addonUserDetails = useSelector((state) => state.addonPlan.userDetails);

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [durationPlan, setDurationPlan] = useState(0);
  const [storagePlan, setStoragePlan] = useState(0);
  const [durationPrice, setDurationPrice] = useState(0);
  const [storagePrice, setStoragePrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (addonUserDetails) {
      setName(addonUserDetails?.name);
      setEmail(addonUserDetails?.email);
      setPhone(addonUserDetails?.phone);
    }
  }, [addonUserDetails]);

  useEffect(() => {
    if (!addonDurationPlan && !addonStoragePlan) return;

    let durationPrice = 0;
    let storagePrice = 0;

    if (addonDurationPlan) {
      setDurationPlan(addonDurationPlan.range);
      durationPrice = addonDurationPlan.totalPrice;
      setDurationPrice(durationPrice);
    }

    if (addonStoragePlan) {
      setStoragePlan(addonStoragePlan.range);
      storagePrice = addonStoragePlan.totalPrice;
      setStoragePrice(storagePrice);
    }

    setTotalPrice(durationPrice + storagePrice);
  }, [addonDurationPlan, addonStoragePlan]);

  const Payment = async () => {
    try {
      const data = {
        amount: totalPrice,
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
          planName: "addon",
          userEmail: email,
          durationPlan: durationPlan,
          storagePlan: storagePlan,
          totalPrice: totalPrice,
        };
        const token = localStorage.getItem("access_token") || "";
        const validateRes = await fetch(
          `${process.env.REACT_APP_OVERRIDE_HOST}/api/checkout/addonPaymentVerification`,
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
          handlenext();
        }
      },
      prefill: {
        name: name,
        email: email,
        contact: phone,
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
        userEmail: email,
        totalPrice: totalPrice,
      };
      // eslint-disable-next-line no-unused-vars
      const faildPayment = await apiClients.failedTransaction(data);
    });
    rzp1.open();
  };

  return (
    <>
      <Box
        sx={{
          // minHeight: "200px",
          padding: { xs: 0, md: 4 },
        }}
      >
        <Typography variant="h4" textAlign={"center"} gutterBottom>
          Payment
        </Typography>
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
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h5"> Add-on Plans</Typography>
            </Grid>
            <Grid item xs={12}>
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
              >
                <Grid item xs={6} sm={6}>
                  <Stack direction="row" gap={1}>
                    <CheckCircleIcon sx={{ color: "green" }} />
                    <Typography variant="subtitle1">
                      {durationPlan} hrs Duration
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={6} container justifyContent="flex-end">
                  <Typography variant="subtitle1">
                    <CurrencyRupeeIcon sx={{ fontSize: "16px" }} />
                    {durationPrice || 0}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
              >
                <Grid item xs={6} sm={6}>
                  <Stack direction="row" gap={1}>
                    <CheckCircleIcon sx={{ color: "green" }} />
                    <Typography variant="subtitle1">
                      {storagePlan} GB Storage
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={6} container justifyContent="flex-end">
                  <Typography variant="subtitle1">
                    <CurrencyRupeeIcon sx={{ fontSize: "16px" }} />
                    {storagePrice || 0}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12}>
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
              >
                <Grid item xs={6} sm={6}>
                  <Stack direction="row" gap={1}>
                    <Typography variant="h5">Total</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={6} container justifyContent="flex-end">
                  <Typography variant="h4">
                    <CurrencyRupeeIcon sx={{ fontSize: "20px" }} />
                    {totalPrice}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          pt: 2,
          gap: 1,
        }}
      >
        <SecondaryButton
          color="inherit"
          // disabled={activeStep === 0}
          onClick={handleback}
        >
          Back
        </SecondaryButton>
        <Box sx={{ flex: "1 1 auto" }} />
        <MainButton onClick={Payment}>
          Pay Now
          {/* {activeStep === steps.length - 1 ? "Finish" : "Next"} */}
        </MainButton>
        <CancelButton
          onClick={handleCloseBox}
        >
          Cancel
        </CancelButton>
      </Box>
    </>
  );
};

export default AddonPayment;
