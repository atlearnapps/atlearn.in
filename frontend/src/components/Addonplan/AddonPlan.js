import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import SingleSlider from "src/components/slider/SingleSlider";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { useDispatch, useSelector } from "react-redux";
import { clearDuration, clearStorage, setDurationplan, setStoragePlan } from "src/Redux/addonplanSlice";
import MainButton from "../Button/MainButton/MainButton";
import SecondaryButton from "../Button/SecondaryButton/SecondaryButton";
import apiClients from "src/apiClients/apiClients";
import CancelButton from "../Button/CancelButton/CancelButton";
function AddonPlan({
  handlenext,
  handleback,
  duration,
  storage,
  handleCloseBox,
}) {
  const dispatch = useDispatch();

  const addonDurationPlan = useSelector((state) => state.addonPlan.duration);
  const addonStoragePlan = useSelector((state) => state.addonPlan.storage);

  const [durationRange, setDurationRange] = useState(1);
  const [durationPrice, setDurationPrice] = useState(0);
  const [durationDetails, setDurationDetails] = useState(null);
  const [totalDurationPrice, setTotalDurationPrice] = useState(null);
  const [sorageRange, setStorageRange] = useState(1);
  const [storagePrice, setStoragePrice] = useState(0);
  const [storageDetails, setStorageDetails] = useState(null);
  const [totalStoragePrice, setTotalStragePrice] = useState(null);

  useEffect(() => {
    if (addonDurationPlan) {
      setDurationRange(addonDurationPlan.range);
      setTotalDurationPrice(addonDurationPlan.totalPrice);
    } else {
      setTotalDurationPrice(durationRange * durationPrice);
    }
  }, [addonDurationPlan, durationRange, durationPrice]);

  useEffect(() => {
    if (addonStoragePlan) {
      setStorageRange(addonStoragePlan.range);
      setTotalStragePrice(addonStoragePlan.totalPrice);
    } else {
      setTotalStragePrice(sorageRange * storagePrice);
    }
  }, [addonStoragePlan, sorageRange, storagePrice]);

  useEffect(() => {
    handleFetchAddonPlan();
  }, []);
  useEffect(() => {
    
    if (duration && durationDetails) {
      const { min_range: range, price: totalPrice } = durationDetails;
      dispatch(setDurationplan({ range, totalPrice }));
    }else{
      dispatch(clearDuration());
   
    }
    if (storage && storageDetails) {
      const { min_range: range, price: totalPrice } = storageDetails;
      dispatch(setStoragePlan({ range, totalPrice }));
    }else{
      dispatch(clearStorage());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, durationDetails, storage,storageDetails]);

  const handleDurationRange = (values) => {
    setDurationRange(values);
    const totalPrice = values * durationPrice;
    setTotalDurationPrice(totalPrice);
    dispatch(setDurationplan({ range: values, totalPrice }));
  };

  const handleStorageRange = (values) => {
    setStorageRange(values);
    const totalPrice = values * durationPrice;
    setTotalStragePrice(totalPrice);
    dispatch(setStoragePlan({ range: values, totalPrice }));
  };

  const handleFetchAddonPlan = async () => {
    try {
      const response = await apiClients.getAddonPlan();
      if (response.data) {
        response.data.forEach((plan) => {
          if (plan.add_on_plan_name === "duration") {
            setDurationDetails(plan);
            setDurationPrice(plan.price);
          } else if (plan.add_on_plan_name === "storage") {
            setStorageDetails(plan);
            setStoragePrice(plan.price);
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
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
          Select Your Plan
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
          <Grid
            container
            spacing={2}
            sx={
              {
                // width: "30vw",
                //   display: "flex",
                //   alignItems: "center",
                //   justifyContent: "center",
              }
            }
          >
            {duration && (
              <>
                <Grid item xs={12} md={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    1. Select Duration Range (Hours)
                  </Typography>
                  <SingleSlider
                    values={durationRange}
                    handleDurationRange={handleDurationRange}
                    plan={"duration"}
                    minValue={durationDetails?.min_range}
                    maxValue={durationDetails?.max_range}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      // justifyContent: 'space-between',
                      padding: 2,
                      backgroundColor: "#ffff",
                      borderRadius: 1,
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                      // maxWidth: '300px',
                      margin: "0 auto",
                      gap: 2,
                    }}
                  >
                    <Grid container alignItems="center">
                      <Grid item xs={12} sm={8}>
                        <Box
                          sx={{
                            display: "flex",
                            // justifyContent:"space-between",
                            alignItems: "center",

                            gap: 2,
                          }}
                        >
                          <Typography variant="subtitle1">Duration:</Typography>
                          <Typography variant="subtitle1">
                            {durationRange} hrs
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <Box
                          sx={{
                            display: "flex",
                            // justifyContent:"space-between",
                            alignItems: "center",
                            gap: 2,
                          }}
                        >
                          <Typography variant="subtitle1">Price:</Typography>
                          <Typography variant="subtitle1">
                            <CurrencyRupeeIcon sx={{ fontSize: "16px" }} />
                            {totalDurationPrice}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </>
            )}
            {storage && (
              <>
                <Grid item xs={12} md={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    2. Select Storage Range (GB)
                  </Typography>
                  <SingleSlider
                    values={sorageRange}
                    handleDurationRange={handleStorageRange}
                    plan={"storage"}
                    minValue={storageDetails?.min_range}
                    maxValue={storageDetails?.max_range}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      // justifyContent: 'space-between',
                      padding: 2,
                      backgroundColor: "#ffff",
                      borderRadius: 1,
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                      // maxWidth: '300px',
                      margin: "0 auto",
                      gap: 2,
                    }}
                  >
                    <Grid container alignItems="center" sx={{}}>
                      <Grid item xs={12} sm={8}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",

                            gap: 2,
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            // sx={{ fontWeight: 'bold', color: '#333' }}
                          >
                            Storage:
                          </Typography>
                          <Typography variant="subtitle1">
                            {sorageRange} GB
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            // sx={{ fontWeight: 'bold', color: '#333' }}
                          >
                            Price:
                          </Typography>
                          <Typography variant="subtitle1">
                            <CurrencyRupeeIcon sx={{ fontSize: "16px" }} />
                            {totalStoragePrice}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </Box>
      <Box sx={{ display: "flex", flexDirection:{xs:"column" ,sm:"row"} , pt: 2, gap:1 }}>
        <SecondaryButton
          color="inherit"
          disabled={true}
          // disabled={activeStep === 0}
          // onClick={handleback}
          sx={{ mr: 1 }}
        >
          Back
        </SecondaryButton>
        <Box sx={{ flex: "1 1 auto" }} />
        <MainButton onClick={handlenext}>
          Next
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
}

export default AddonPlan;
