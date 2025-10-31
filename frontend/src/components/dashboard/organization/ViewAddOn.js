import React, { useEffect, useState } from "react";

import {
  Box,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Slide,
  TextField,
  Typography,
} from "@mui/material";
import apiClients from "src/apiClients/apiClients";
import MainButton from "src/components/Button/MainButton/MainButton";
import SecondaryButton from "src/components/Button/SecondaryButton/SecondaryButton";

import AirbnbSliderComponent from "src/components/slider/AirbnbSliderComponent";
import { toast } from "react-toastify";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} timeout={500} />;
});

const planData = {
  duration_min_range: null,
  duration_max_range: null,
  storage_min_range: null,
  storage_max_range: null,
  price_per_duration: null,
  price_per_storage: null,
};

function ViewAddOn({ open, handleclose }) {
  const [formData, setFormData] = useState(planData);
  const [errors, setErrors] = useState({});
  const [durationRange, setDurationRange] = useState([]);
  const [storageRange, setStorageRange] = useState([]);
  const handleClosebox = () => {
    handleclose();
  };
  useEffect(() => {
    fetchAddonPlan();
  }, []);

  const fetchAddonPlan = async () => {
    try {
      const response = await apiClients.getAddonPlan();
      if (response.data) {
        const duration = [];
        const storage = [];
        const updatedData = { ...planData };
        response.data.forEach((item) => {
          if (item.add_on_plan_name === "duration") {
            updatedData.duration_min_range = item.min_range;
            updatedData.duration_max_range = item.max_range;
            updatedData.price_per_duration = item.price;
            duration.push(item.min_range, item.max_range);
          } else if (item.add_on_plan_name === "storage") {
            updatedData.storage_min_range = item.min_range;
            updatedData.storage_max_range = item.max_range;
            updatedData.price_per_storage = item.price;
            storage.push(item.min_range, item.max_range);
          }
        });
        setDurationRange(duration);
        setStorageRange(storage);
        setFormData(updatedData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdatePlan = async() => {
    const newErrors = {};
    const requiredFields = [
      "duration_min_range",
      "price_per_duration",
      "duration_max_range",
      "storage_min_range",
      "storage_max_range",
      "price_per_storage",
    ];

    requiredFields.forEach((field) => {
      const value = formData[field];
      if (
        value === undefined ||
        value === null ||
        value === 0 ||
        (typeof value === "string" && value.trim() === "") ||
        (typeof value === "number" && isNaN(value))
      ) {
        newErrors[field] =
          value === undefined
            ? "This field is missing."
            : value === null
            ? "This field cannot be null."
            : value === 0
            ? "This field cannot be zero."
            : typeof value === "string" && value.trim() === ""
            ? "This field cannot be an empty string."
            : "This field must be a valid number.";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      const response = await apiClients.updateAddonPlan(formData);
      if (response.success === true) {
        toast.success(response.message);
        // fetchData();
        handleClosebox();
      }

      console.log(formData, "formData");
     
    }
  };

  // Handle change for Select inputs
  const handleChangevalue = (event) => {
    const { name, value } = event.target;
    let parsedValue;

    if (
      ["price_per_duration", "price_per_storage"].includes(
        name
      )
    ) {
      parsedValue = parseInt(value, 10);
    } else {
      parsedValue = value;
    }
    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleDurationRange = (values) => {
    setFormData((prev) => ({
      ...prev,
      duration_min_range: values[0],
      duration_max_range: values[1],
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      duration_min_range: "",
      duration_max_range: "",
    }));
    setDurationRange(values);
  };
  const handleStorageRange = (values) => {
    setFormData((prev) => ({
      ...prev,
      storage_min_range: values[0],
      storage_max_range: values[1],
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      storage_min_range: "",
      storage_max_range: "",
    }));

    setStorageRange(values);
  };
  return (
    <div>
      <Dialog
          // maxWidth={"lg"}
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClosebox}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle sx={{ textAlign: "center", backgroundColor: "#F5F7FB" }}>
          Add-on Plan
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Container>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <Typography variant="h5" gutterBottom>
                    1. Select Duration Range (Hours)
                  </Typography>

                  <AirbnbSliderComponent
                    values={durationRange}
                    handleDurationRange={handleDurationRange}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Grid container alignItems="center">
                    <Grid item xs={12} sm={6}>
                      <Typography  gutterBottom>Price Per Duration</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        type="Number"
                        name="price_per_duration"
                        value={formData?.price_per_duration}
                        onChange={handleChangevalue}
                        fullWidth
                        error={!!errors.price_per_duration}
                        helperText={errors.price_per_duration}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={12} mt={3}>
                  <Typography variant="h5" gutterBottom>
                    2. Select Storage Range (GB)
                  </Typography>

                  <AirbnbSliderComponent
                    values={storageRange}
                    handleDurationRange={handleStorageRange}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Grid container alignItems="center">
                    <Grid item xs={12} sm={6}>
                      <Typography  gutterBottom>Price Per Storage</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        type="Number"
                        name="price_per_storage"
                        value={formData?.price_per_storage}
                        onChange={handleChangevalue}
                        fullWidth
                        error={!!errors.price_per_storage}
                        helperText={errors.price_per_storage}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mb: 2,
                    gap: 1,
                    mt: 2,
                  }}
                >
                  <SecondaryButton onClick={handleClosebox}>
                    Cancel
                  </SecondaryButton>
                  <MainButton
                    onClick={handleUpdatePlan}
                    sx={{
                      border: "1px solid #0077c2",
                      padding: "10px 20px",
                      color: "#ffff",
                      backgroundColor: "#1A73E8",
                      "&:hover": {
                        backgroundColor: "#0D5EBD",
                      },
                    }}
                  >
                    Update Plan
                  </MainButton>
                </Grid>
              </Grid>
            </Container>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default ViewAddOn;
