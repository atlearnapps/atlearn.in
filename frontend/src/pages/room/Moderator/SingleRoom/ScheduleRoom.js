import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {
  Typography,
  Divider,
  TextField,
  Box,
  Container,
  Grid,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Tooltip,
  Select,
  MenuItem,
  Chip,
  FormHelperText,
} from "@mui/material";

import {
  LocalizationProvider,
  MobileDateTimePicker,
} from "@mui/x-date-pickers";
import "@mui/lab";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import MainButton from "src/components/Button/MainButton/MainButton";
import apiClients from "src/apiClients/apiClients";
import { toast } from "react-toastify";
import BankDetailsPopup from "src/components/BankDetails/BankDetailsPopup";
import { useSelector } from "react-redux";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FormControl } from "@mui/base";
import CancelButton from "src/components/Button/CancelButton/CancelButton";


function ScheduleRoom({
  open,
  handleClosebox,
  url,
  room,
  scheduleData,
  FetchRoomData,
  myMeeting,
}) {
  const scheduledata = {
    title: room ? room.name : "",
    description: "",
    startDate: "",
    endDate: "",
    guestEmail: "",
    url: url ? url : "",
    roomid: room ? room.id : "",
    public_view: false,
    price: null,
  };

  const [description, setDescription] = useState("");
  const { user } = useSelector((state) => state.user);
  const [formData, setFormData] = useState(scheduledata);
  const [checkStart, setCheckStart] = useState(false);
  const [checkEnd, setCheckEnd] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(false);
  const [paidRoom, setPaidRoom] = useState(false);
  const [openbank, setOpenBank] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const [duration, setDuration] = useState({ hours: 0, minutes: 0 });
  const [guestEmail, setGuestEmail] = useState("");
  const [validEmails, setValidEmails] = useState([]);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    if (scheduleData) {
      setFormData({
        title: scheduleData?.title,
        description: scheduleData?.description,
        startDate: scheduleData?.startDate,
        endDate: scheduleData?.endDate,
        guestEmail: scheduleData?.guestEmail,
        url: scheduleData?.url,
        public_view: scheduleData?.public_view,
        price: scheduleData?.price,
      });
      const durationVal = getDuration(
        scheduleData?.startDate,
        scheduleData?.endDate
      );
      if (duration) {
        setDuration(durationVal);
      }
      if (scheduleData?.guestEmail) {
        const collectedEmails = scheduleData?.guestEmail
          ?.split(",")
          .map((email) => email.trim());
        if (collectedEmails?.length > 0) {
          setValidEmails(collectedEmails);
        }
      }
    } else {
      setFormData(scheduledata);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleData]);
  const handleGuestEmailChange = (field, val) => {
    setEmailError(false);
    const value = val;
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
          const updatedEmails = [...prev, ...valid];

          // Store as a comma-separated string in another state
          setFormData((prevFormData) => ({
            ...prevFormData,
            guestEmail: updatedEmails.join(", "), // Convert array to comma-separated string
          }));

          return updatedEmails;
        });
        setGuestEmail("");
      }
    
    } else {
      setGuestEmail(value);
      // setFormData((prevFormData) => ({
      //   ...prevFormData,
      //   guestEmail: value, // Convert array to comma-separated string
      // }));
    }
  };

  const handleDelete = (emailToDelete) => {
    setValidEmails((prevEmails) => {
      const updatedEmails = prevEmails.filter(
        (email) => email !== emailToDelete
      );

      // Also update formData's guestEmail field
      setFormData((prevFormData) => ({
        ...prevFormData,
        guestEmail: updatedEmails.join(", "), // Convert back to string format
      }));

      return updatedEmails;
    });
  };

  function getDuration(startDate, endDate) {
    // Convert strings to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate the difference in milliseconds
    const diffMs = end - start;

    // Convert milliseconds to hours and minutes
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    return {
      hours: hours.toString(),
      minutes: minutes.toString(),
    };
  }

  const handleClose = () => {
    setFormData(scheduledata);
    handleClosebox();
  };

  const handleCloseBankDetailsPopup = () => {
    setOpenBank(false);
    // handleClose();
  };

  const handleCheckStartDates = (newvalue) => {
    if (formData?.startDate) {
      const currentDate = new Date();
      // const startDate = new Date(formData.startDate);
      const startDate = newvalue;
      if (startDate < currentDate) {
        setCheckStart(true);
      } else {
        setCheckStart(false);
      }
    }
  };
  // const handleCheckEndDate = (newvalue) => {
  //   if (formData?.endDate && formData?.startDate) {
  //     const startDate = new Date(formData.startDate);
  //     // const endDate = new Date(formData.endDate);
  //     const endDate = newvalue;

  //     if (endDate <= startDate) {
  //       setCheckEnd(true);
  //     } else {
  //       setCheckEnd(false);
  //     }
  //   }
  // };

  const handleChange = (field, newvalue) => {
    let value = newvalue;
    if (field === "guestEmail") {
      setEmailError(false);
    }
    if (field === "startDate" || field === "endDate") {
      const formateDate = formatDateString(value);
      if (formateDate) {
        value = formateDate;
      }
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  const checkfields = () => {
    const currentDate = new Date();
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    let fieldError;
    if (!formData.startDate || startDate < currentDate) {
      fieldError = true;
      setCheckStart(true);
    }
    if (!formData.endDate || endDate <= startDate) {
      fieldError = true;
      setCheckEnd(true);
    }

    if (duration?.hours === 0 && duration?.minutes === 0) {
      fieldError = true;
      setCheckEnd(true);
    }

    if (!formData?.public_view) {
      if (!formData.guestEmail) {
        fieldError = true;
        setEmailError(true);
      }
    }
    if (paidRoom) {
      if (!formData.price) {
        fieldError = true;
        setPriceError(true);
      }
    }

    // if (error === true) {
    //   fieldError = true;
    //   setError(true);
    // }

    if (fieldError) {
      return fieldError;
    } else {
      return false;
    }
  };

  const CreateSheduleMeeting = async () => {
    try {
      const checkAllField = checkfields();
      if (checkAllField === false) {
        if (paidRoom && !user?.user?.bank_details_id) {
          setOpenBank(true);
          return; // Exit early if bank details are required but missing
        }

        setLoading(true);
        const response = await apiClients.sheduleMeeting(formData);
        setLoading(false); // Ensure loading is set back to false after the request

        if (response.success) {
          if (myMeeting) {
            FetchRoomData();
          }

          toast.success("Meeting Scheduled");
          handleClose();
        } else {
          toast.error(response.message);
        }
      }
    } catch (error) {
      console.error(error); // Use console.error for better error logging
    }
  };

  function formatDateString(dateString) {
    const date = new Date(dateString);

    const options = {
      timeZone: "Asia/Kolkata", // Specify the time zone explicitly
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    return date.toLocaleString("en-US", options);
  }

  const updateScheduleMeeting = async () => {
    try {
      const checkAllField = checkfields();
      if (checkAllField === false) {
        if (paidRoom && !user?.user?.bank_details_id) {
          setOpenBank(true);
          return; // Exit early if bank details are required but missing
        }
        const response = await apiClients.updateScheduleMeeting(
          scheduleData.id,
          formData
        );
        if (response.success === true) {
          FetchRoomData();
          toast.success(response.message);
          handleClose();
        } else {
          toast.error(response.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCopy = (id) => {
    if (id === true) {
      navigator.clipboard.writeText(scheduleData?.url);
    } else {
      navigator.clipboard.writeText(
        `${window.location.origin}/Join-meeting?roomId=${id}`
      );
    }

    toast.success(
      "The meeting URL has been copied. The link can be used to join the meeting."
    );
  };

  // const handleEmailBlur = () => {
  //   // Validate emails using a regular expression
  //   const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   const emailList = formData?.guestEmail
  //     .split(",")
  //     .map((email) => email.trim());
  //   const invalidEmails = emailList.filter(
  //     (email) => !emailPattern.test(email)
  //   );

  //   if (invalidEmails.length > 0) {
  //     setEmailError(true);
  //   }
  // };

  const handleEmailBlur = (val) => {
    // Validate emails using a regular expression
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // const emailList = formData?.guestEmail
    //   .split(",")
    //   .map((email) => email.trim());
    // const invalidEmails = emailList.filter(
    //   (email) => !emailPattern.test(email)
    // );

    const mail = val.target.value;
    const ValidEmail = emailPattern.test(mail);
    if (ValidEmail) {
      setValidEmails((prev) => {
        const updatedEmails = [...prev, mail];

        // Store as a comma-separated string in another state
        setFormData((prevFormData) => ({
          ...prevFormData,
          guestEmail: updatedEmails.join(", "), // Convert array to comma-separated string
        }));

        return updatedEmails;
      });
      setGuestEmail("");
    } else {
      setEmailError(true);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
    ],
  };

  function getEndDate(startDate, duration) {
    // Convert startDate string into a Date object
    const dateObj = new Date(startDate);

    // Add duration
    dateObj.setHours(dateObj.getHours() + parseInt(duration.hours, 10));
    dateObj.setMinutes(dateObj.getMinutes() + parseInt(duration.minutes, 10));

    // Manually format the output to match the exact format of startDate
    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    const formattedDate = dateObj.toLocaleDateString("en-US", options);

    let hours = dateObj.getHours();
    let minutes = dateObj.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12; // Convert 24-hour format to 12-hour format

    return `${formattedDate}, ${hours}:${minutes} ${ampm}`;
  }

  const handleEndDate = (field, value) => {
    setCheckEnd(false);
    setDuration((prev) => ({ ...prev, [field]: value }));

    const updatedDuration = {
      ...duration,
      [field]: value,
    };

    const newEndDate = getEndDate(formData?.startDate, updatedDuration);
    if (newEndDate) {
      setFormData((prev) => ({ ...prev, endDate: newEndDate }));
    }
  };

  return (
    <>
      <div>
        <Dialog
          maxWidth="sm"
          fullWidth
          onClose={handleClose}
          open={open}
          sx={{ "& .MuiDialog-paper": { p: 0 } }}
        >
          <DialogTitle sx={{ textAlign: "center", backgroundColor: "#F5F7FB" }}>
            Schedule Meeting
          </DialogTitle>
          <Divider />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DialogContent>
              <Box>
                <Container>
                  <Grid container spacing={4}>
                    <Grid item xs={12}>
                      {/* <InputLabel> Title</InputLabel> */}
                      <Typography
                        gutterBottom
                        style={{
                          wordBreak: "break-word",
                          fontSize: `calc(0.5rem + 1vw)`,
                          // fontWeight: 500,
                        }}
                      >
                        {formData?.title}
                      </Typography>
                      <Divider />
                    </Grid>

                    <Grid item xs={12}>
                      <Grid container alignItems="center">
                        <Grid item xs={12}>
                          <ReactQuill
                            theme="snow"
                            // value={description}
                            value={formData?.description}
                            // onChange={setDescription}
                            onChange={(value) => {
                              setDescription(value);
                              handleChange("description", value);
                            }}
                            modules={modules}
                            placeholder="Write your description here..."
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <Grid container alignItems="flex-start" spacing={2}>
                        <Grid
                          item
                          xs={12}
                          md={6}
                          mt={2}
                          // sx={{
                          //   display: { xs: "none", sm: "block" },
                          // }}
                        >
                          {/* <AccessTimeIcon /> */}
                          <Typography>
                            Start Date and Time (IST)
                            <span className="text-red-500 text-sm"> * </span>:
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={5} md={6}>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              position: "relative",
                            }}
                          >
                            <MobileDateTimePicker
                              label=" Date & Time"
                              value={
                                formData?.startDate
                                  ? new Date(formData?.startDate)
                                  : null
                              }
                              minDateTime={new Date()}
                              inputFormat="dd/MM/yyyy hh:mm a"
                              onChange={(date) => {
                                handleChange("startDate", date);
                                handleCheckStartDates(date);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  fullWidth
                                  error={checkStart}
                                />
                              )}
                            />
                            {checkStart && (
                              <Typography
                                variant="caption"
                                color="error"
                                sx={{ mt: 1 }}
                              >
                                Please select a Date and Time
                              </Typography>
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <Grid container alignItems="flex-start" spacing={2}>
                        <Grid
                          item
                          xs={12}
                          md={3}
                          mt={2}
                          // sx={{
                          //   display: { xs: "none", sm: "block" },
                          // }}
                        >
                          <Typography>
                            Duration{" "}
                            <span className="text-red-500 text-sm"> * </span>:{" "}
                          </Typography>
                        </Grid>

                        {/* Duration Selection */}
                        <Grid item xs={6}>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              gap: 2,
                              alignItems: "center",
                            }}
                          >
                            <FormControl>
                              <Select
                                value={duration.hours}
                                onChange={(e) => {
                                  handleEndDate("hours", e.target.value);
                                  // getEndDate(e.target.value)
                                }}
                                MenuProps={{
                                  PaperProps: {
                                    sx: {
                                      maxHeight: 200, // Limits dropdown height
                                    },
                                  },
                                }}
                              >
                                {[...Array(24).keys()].map((h) => (
                                  <MenuItem key={h} value={h}>
                                    {h} {h <= 1 ? "hour" : "hours"}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            {/* Minutes */}
                            <FormControl fullWidth>
                              {/* <InputLabel>Minutes</InputLabel> */}
                              <Select
                                value={duration.minutes}
                                onChange={(e) => {
                                  handleEndDate("minutes", e.target.value);
                                }}
                              >
                                {[0, 15, 30, 45].map((m) => (
                                  <MenuItem key={m} value={m}>
                                    {m} {m === 0 ? "minute" : "minutes"}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Box>
                          {checkEnd && (
                            <FormHelperText sx={{ color: "red" }}>
                              Please select a duration
                            </FormHelperText>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <Grid container alignItems="center" spacing={2}>
                        <Grid
                          item
                          xs={1}
                          mt={2}
                          sx={{
                            display: { xs: "none", sm: "block" },
                          }}
                        >
                          <VideocamOutlinedIcon />
                        </Grid>
                        <Tooltip title={"Copy Meeting URL"}>
                          <Grid item xs={11} md={10}>
                            <MainButton
                              onClick={() => {
                                handleCopy(room ? room?.friendly_id : true);
                              }}
                              style={{ display: "flex", gap: "10px" }}
                            >
                              {` Join  meeting`}
                              <ContentCopyIcon />
                            </MainButton>
                          </Grid>
                        </Tooltip>
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <Grid container>
                        <Grid
                          item
                          xs={1}
                          mt={3}
                          sx={{
                            display: { xs: "none", sm: "block" },
                          }}
                        >
                          <PersonIcon />
                        </Grid>
                        <Grid item xs={12} sm={11}>
                          <Box>
                            <TextField
                              fullWidth
                              multiline
                              label="Add Guest"
                              variant="outlined"
                              value={guestEmail}
                              onChange={(e) =>
                                handleGuestEmailChange(
                                  "guestEmail",
                                  e.target.value
                                )
                              }
                              onBlur={handleEmailBlur}
                              error={emailError}
                              helperText={
                                emailError ? "Invalid email(s) format" : ""
                              }
                              placeholder="Enter comma-separated emails"
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
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <Grid container alignItems="center" spacing={2}>
                        {/* <Grid item xs={11}>
                          <FormControlLabel
                            label="Add Meeting Price"
                            control={
                              <Checkbox
                                checked={paidRoom || formData.price}
                                onChange={(e) => {
                                  setPaidRoom(e.target.checked);
                                  if (e.target.checked === false) {
                                    handleChange("price", null);
                                  }
                                }}
                              />
                            }
                          />
                        </Grid> */}
                        {(paidRoom || formData.price) && (
                          <Grid item xs={12} sm={12}>
                            <Typography gutterBottom>
                              Price (INR)
                              <span className="text-red-500 text-sm"> * </span>
                            </Typography>
                            <TextField
                              type="text"
                              placeholder="Enter Price..."
                              name="price"
                              fullWidth
                              value={formData?.price || ""}
                              onChange={(e) => {
                                let value = e.target.value;
                                if (/^\d{0,5}$/.test(value)) {
                                  handleChange("price", value);
                                }
                              }}
                              inputProps={{
                                inputMode: "numeric",
                                pattern: "[0-9]*",
                              }}
                              error={priceError}
                              helperText={
                                priceError
                                  ? "Enter a valid price (max 5 digits, no negative values)"
                                  : ""
                              }
                            />
                          </Grid>
                        )}

                        <Grid item xs={11}>
                          <FormControlLabel
                            label="Public View"
                            control={
                              <Checkbox
                                checked={formData?.public_view}
                                onChange={(e) => {
                                  setEmailError(false);
                                  handleChange("public_view", e.target.checked);
                                }}
                              />
                            }
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <Box
                        display={{ xs: "flex", sm: "flex" }}
                        flexDirection={{ xs: "column", sm: "row" }}
                        justifyContent={{ xs: "center", sm: "flex-end" }}
                        gap={1}
                      >
                        {scheduleData ? (
                          <MainButton onClick={updateScheduleMeeting}>
                            {loading && (
                              <CircularProgress
                                size={"1.2rem"}
                                sx={{ color: "white", mr: 1 }}
                              />
                            )}
                            update Meeting
                          </MainButton>
                        ) : (
                          <MainButton onClick={CreateSheduleMeeting}>
                            {loading && (
                              <CircularProgress
                                size={"1.2rem"}
                                sx={{ color: "white", mr: 1 }}
                              />
                            )}
                            Schedule Meeting
                          </MainButton>
                        )}
                        <CancelButton onClick={handleClose}>
                          Cancel
                        </CancelButton>
                      </Box>
                    </Grid>
                  </Grid>
                </Container>
              </Box>
            </DialogContent>
          </LocalizationProvider>
        </Dialog>
      </div>
      <BankDetailsPopup
        open={openbank}
        handleClose={handleCloseBankDetailsPopup}
      />
    </>
  );
}

export default ScheduleRoom;
