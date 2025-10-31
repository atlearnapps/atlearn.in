import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import apiClients from "src/apiClients/apiClients";
import { BASE_URL } from "src/apiClients/config";
import MainButton from "src/components/Button/MainButton/MainButton";

function Feedback() {
  const formdata = {
    name: "",
    email: "",
    message: "",
  };
  const [formData, setFormData] = useState();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setFormData(formdata);
    // return () => {
    //   setFormData({});
    // };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleSubmit = async () => {
    try {
      const newErrors = {};
      const requiredFields = ["name", "email", "message"];
      requiredFields.forEach((field) => {
        if (
          formData[field] === undefined ||
          formData[field] === null ||
          formData[field] === ""
        ) {
          newErrors[field] = `This ${field} field is required.`;
        }
      });
      if (formData.email && !validateEmail(formData.email)) {
        newErrors.email = "Please enter a valid email address.";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
      } else {
        setErrors({});
        const data = formData;
        // eslint-disable-next-line no-unused-vars
        setLoading(true);
        const responnse = await apiClients.feedback(data);
        if (responnse.success === true) {
          toast.success(responnse.message);
        } else {
          toast.error("someting error");
        }
        setLoading(false);
        setFormData(formdata);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  const validateEmail = (email) => {
    // You can use a regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };

    if (name === "email" && !validateEmail(value)) {
      newErrors.email = "Please enter a valid email address";
    } else {
      delete newErrors.email;
    }

    setErrors(newErrors);
  };

  return (
    <>
      <Helmet>
        <title> Share Your Feedback - Help Improve Atlearn</title>
        <meta
          name="description"
          content="Have suggestions or feedback about Atlearn? Share your thoughts to help us enhance your virtual learning experience. We value your input."
        />
        <link rel="canonical" href={`${BASE_URL}/feedback`} />
      </Helmet>
      <section>
        {/* banner section */}
        <div className="bg-lightGrey10 dark:bg-lightGrey10-dark relative z-0 overflow-y-visible py-50px md:py-20 lg:py-100px ">
          {/* animated icons */}
          <div>
            {/* <img
              className="absolute left-0 bottom-0 md:left-[14px] lg:left-[50px] lg:bottom-[21px] 2xl:left-[165px] 2xl:bottom-[60px] animate-move-var z-10"
              src="./assets/images/herobanner/herobanner__1.png"
              alt=""
            /> */}
            <img
              className="absolute left-0 top-0 lg:left-[50px] lg:top-[100px] animate-spin-slow hidden md:block"
              src="./assets/images/herobanner/herobanner__2.png"
              alt=""
            />
            <img
              className="absolute right-[30px] top-0 md:right-10 lg:right-[575px] 2xl:top-20 animate-move-var2 opacity-50 hidden md:block"
              src="./assets/images/herobanner/herobanner__3.png"
              alt=""
            />
            <img
              className="absolute right-[30px] top-[212px] md:right-10 md:top-[157px] lg:right-[45px] lg:top-[100px] animate-move-hor"
              src="./assets/images/herobanner/herobanner__5.png"
              alt=""
            />
          </div>
          <div className="container relative">
            <div className="text-center">
              <h1 className="text-3xl md:text-size-40 2xl:text-size-55 font-bold text-blackColor dark:text-blackColor-dark mb-7 md:mb-6 pt-3">
                Feedback
              </h1>
              <p className="text-size-15md:text-lg text-blackColor dark:text-blackColor-dark font-medium">
                Get in touch with us for any questions or support—we're here to
                help
              </p>
            </div>
          </div>
        </div>
      </section>

      <Box>
        <Container>
          <Box sx={{ marginTop: "10px" }}>
            <Grid container justifyContent="center">
              <Grid item xs={10}>
                <Card sx={{ mb: 6.25 }} elevation={4}>
                  <CardContent sx={{ p: 4 }}>
                    <Grid container spacing={4}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          type="text"
                          label="Name"
                          name="name"
                          placeholder="Enter Your Name"
                          value={formData?.name || ""}
                          onChange={handleChange}
                          error={!!errors.name}
                          helperText={errors.name}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          type="text"
                          name="email"
                          label="Email Address"
                          placeholder="Enter Your Email Address"
                          value={formData?.email || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={!!errors.email}
                          helperText={errors.email}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <FormControl fullWidth>
                          <TextField
                            id="outlined-multiline-static1"
                            placeholder="Message"
                            name="message"
                            multiline
                            fullWidth
                            rows={4}
                            value={formData?.message || ""}
                            onChange={handleChange}
                            error={!!errors.message}
                            helperText={errors.message}
                          />
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"end"}
                        gap={1}
                      >
                        {/* <SecondaryButton>Cancel</SecondaryButton> */}
                        <MainButton onClick={handleSubmit}>
                          {loading && (
                            <CircularProgress
                              size={"1.2rem"}
                              sx={{ color: "white", mr: 2 }}
                            />
                          )}
                          Submit
                        </MainButton>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default Feedback;
