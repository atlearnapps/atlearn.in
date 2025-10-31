import {
  // Autocomplete,
  Avatar,
  Box,
  Button,
  // CircularProgress,
  Container,
  Divider,
  Grid,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import MainButton from "src/components/Button/MainButton/MainButton";
import DeleteButton from "src/components/Button/DeleteButton/DeleteButton";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
// import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { setUser } from "src/Redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import apiClients from "src/apiClients/apiClients";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Notification from "src/components/Notification/expiredNotification";
// import AccountGif from "src/images/profile/Account.gif";
import { Helmet } from "react-helmet";
import axios from "axios";
import { usersToken } from "src/apiClients/token";
import EditIcon from "@mui/icons-material/Edit";
import CancelButton from "src/components/Button/CancelButton/CancelButton";
import { BASE_URL } from "src/apiClients/config";

function AdminProfile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [selectedFile, setSelectedFile] = useState(null);
  const tabsView = useMediaQuery("(max-width:992px)");
  const phonesView = useMediaQuery("(max-width:480px)");
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [subscription, setSubscription] = useState();
  const [language, setLanguage] = useState("");
  const [userId, setUserId] = useState(user?.user?.id);
  const [profile, setProfile] = useState(null);
  const [notification, setNotfication] = useState(false);
  const [checkName, setCheckName] = useState(false);
  // const [checkLanguage, setCheckLanguage] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [lmsUserId, setLmsUserId] = useState(null);
  const [role, setRole] = useState("");

  useEffect(() => {
    setName(user?.user?.name);
    setEmail(user?.user?.email);
    setLanguage(user?.user?.language);
    setUserId(user?.user?.id);
    setProfile(user?.user?.avatar);
    setSubscription(user?.user?.subscription?.name);
    setRole(user?.user?.role?.name);
    // fetchUserDetails();
    // if (user?.user?.email) {
    //   fetchUserDetails(user?.user?.email);
    // }
  }, [user]);

  const uploadProfile = async (selectedFile) => {
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      setLoading(true);
      const response = await apiClients.uploadProfile(userId, formData);
      if (response) {
        toast.success("avatar has been updated");
        session();
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const isFileTypeValid = (file) => {
    const validTypes = ["image/png", "image/jpeg", "image/svg+xml"];
    return validTypes.includes(file.type);
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && isFileTypeValid(file)) {
      setProfile(file);
      setSelectedFile(file);
      uploadProfile(file);
    } else {
      setSelectedFile(null);
      toast.error("Invalid file format. Please upload PNG, JPEG, or SVG.");
    }
  };
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

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

  const checkAllField = () => {
    let error;
    if (!name) {
      setCheckName(true);
      error = true;
    }

    // if (!language) {
    //   setCheckLanguage(true);
    //   error = true;
    // }

    if (error) {
      return error;
    } else {
      return false;
    }
  };

  const handleUpdateUser = async () => {
    try {
      const checkRequiredField = checkAllField();
      if (checkRequiredField === false) {
        updateUserDetails(name);
        const data = {
          name,
          email,
          language,
        };
        const response = await apiClients.userUpdate(data, userId);
        if (response.data) {
          if (response.message) {
            toast.success(response.message);
          }
          session();
          // dispatch(setUser(response.data));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProfile = async () => {
    try {
      const response = await apiClients.deleteProfile(userId);
      if (response.success === true) {
        toast.success("avatar has been updated");
        setSelectedFile(null);
        session();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  // const fetchUserDetails = async (email) => {
  //   try {
  //     const response = await axios.get(
  //       `https://lms.atlearn.in/webservice/rest/server.php`,
  //       {
  //         params: {
  //           wstoken: usersToken, // Replace with your token
  //           wsfunction: "core_user_get_users_by_field",
  //           moodlewsrestformat: "json",
  //           field: "email",
  //           "values[0]": email,
  //         },
  //       }
  //     );
  //     console.log(response);
  //     if (response.data[0]?.id) {
  //       setLmsUserId(response.data[0]?.id);
  //     }
  //     if (response.data[0].fullname !== user?.user?.email) {
  //       const data = {
  //         name: response.data[0].fullname,
  //         email: user?.user?.email,
  //       };
  //       const updateProfile = await apiClients.userUpdateProfile(data);
  //       // if (updateProfile) {
  //       //   // session();
  //       // }
  //     }
  //   } catch (err) {
  //     console.error("Error fetching user data:", err);
  //   }
  // };

  const updateUserDetails = async (name) => {
    try {
      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `https://lms.atlearn.in/webservice/rest/server.php`,
        params: {
          wstoken: usersToken,
          wsfunction: "core_user_update_users",
          moodlewsrestformat: "json",
          "users[0][id]": lmsUserId,
          "users[0][firstname]": name,
          "users[0][lastname]": "",
        },
        headers: {},
      };

      const response = await axios.request(config);
      if (response) {
        console.log(response);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Profile Settings | Customize Your Atlearn Experience</title>
        <meta
          name="description"
          content="Update your Atlearn profile settings to personalize your learning experience. Manage details, preferences, and access AI-powered tools seamlessly"
        />
        <link rel="canonical" href={`${BASE_URL}/settings/profile`} />
      </Helmet>
      <Notification setNotfication={setNotfication} />

      <div>
        <Box>
          <Container maxWidth={"xl"}>
            <Box
              mt={notification ? 5 : 10}
              sx={{
                marginBottom: "20px",
                background: "rgb(255, 255, 255)",
                minHeight: "70vh",
                borderRadius: "12px",
                boxShadow:
                  "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px",
                transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
              }}
            >
              <Grid
                container
                spacing={2}
                sx={{
                  paddingLeft: "30px",
                  paddingRight: "30px",
                  paddingBottom: "10px",
                }}
              >
                <Grid item xs={12} md={6}>
                  <Box
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      gap: 100,
                    }}
                  >
                    <Box
                      sx={{
                        textAlign: "center",
                        marginBottom: "1rem",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{ position: "relative", display: "inline-block" }}
                        {...getRootProps()}
                      >
                        <input {...getInputProps()} />
                        {/* Avatar with circular border */}
                        <Avatar
                          src={
                            selectedFile
                              ? URL.createObjectURL(selectedFile)
                              : `${process.env.REACT_APP_OVERRIDE_HOST}/api/images/${profile}`
                          }
                          sx={{
                            width: 120,
                            height: 120,
                            border: "4px solid primary.main", // Outer circular border
                            backgroundColor: "primary.main", // Background like the image
                            cursor: "pointer",
                          }}
                        />

                        {/* Edit Icon with pencil shape */}
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: -5, // Slightly outside avatar
                            right: -5,
                            width: 35,
                            height: 35,
                            backgroundColor: "#fff",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: 2,
                            cursor: "pointer",
                          }}
                        >
                          <EditIcon
                            sx={{ fontSize: 20, color: "primary.main" }}
                          />
                        </Box>
                      </Box>
                      {/* <Box {...getRootProps()}>
                        <input {...getInputProps()} />
                        <MainButton>
                          {loading ? (
                            <CircularProgress
                              size={"1.2rem"}
                              sx={{ color: "white", mr: 1 }}
                            />
                          ) : (
                            <FileUploadOutlinedIcon sx={{ mr: 1 }} />
                          )}
                          Upload photo
                        </MainButton>
                      </Box> */}
                      {/* onClick={uploadProfile} */}
                      <Tooltip
                        title={
                          selectedFile || profile
                            ? "Remove your profile photo"
                            : "Please upload a photo first"
                        }
                        arrow
                      >
                        <span>
                          <DeleteButton
                            onClick={deleteProfile}
                            disabled={!(selectedFile || profile)}
                          >
                            <HighlightOffOutlinedIcon sx={{ mr: 1 }} />
                            Remove photo
                          </DeleteButton>
                        </span>
                      </Tooltip>
                    </Box>
                    {!tabsView && !phonesView && (
                      <Box>
                        <Divider orientation="vertical" />
                      </Box>
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12} md={5}>
                  <Box>
                    <Typography
                      style={{ fontSize: "2rem", fontWeight: 400 }}
                      // variant="h4"
                      gutterBottom
                    >
                      Update Profile
                    </Typography>
                    <Box display={"flex"} flexDirection={"column"} gap={2}>
                      <Box>
                        <Typography gutterBottom>Name *</Typography>
                        <TextField
                          type="text"
                          placeholder="Name"
                          name="name"
                          fullWidth
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            setCheckName(false);
                          }}
                          error={checkName}
                          helperText={checkName ? "Name is required" : ""}
                        />
                      </Box>
                      <Box>
                        <Typography gutterBottom>Email *</Typography>
                        <TextField
                          type="email"
                          placeholder="Email"
                          name="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          fullWidth
                          disabled
                        />
                      </Box>
                      {/* <Box>
                        <Typography gutterBottom>Language *</Typography>

                        <Autocomplete
                          options={languages}
                          value={language}
                          onChange={(e, value) => {
                            setLanguage(value);
                            setCheckLanguage(false);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select Language"
                              error={checkLanguage}
                              helperText={
                                checkLanguage ? "Language is required" : ""
                              }
                            />
                          )}
                          // style={{ width: 300 }}
                        />
                      </Box> */}
                      <Box>
                        <Typography gutterBottom>Role </Typography>
                        <TextField
                          type="text"
                          placeholder="Role"
                          name="role"
                          value={
                            role === "Moderator"
                              ? "Teacher"
                              : role === "Guest"
                              ? "Student"
                              : ""
                          }
                          // onChange={(e) => setLanguage(e.target.value)}
                          // readonly
                          disabled
                          fullWidth
                        />
                      </Box>
                      {subscription && (
                        <Box>
                          <Typography gutterBottom>Subscription </Typography>
                          <TextField
                            type="text"
                            placeholder="Subscription"
                            name="subscription"
                            value={subscription}
                            disabled
                            fullWidth
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Button
                                    onClick={() =>
                                      navigate("/settings/mysubscription")
                                    }
                                    sx={{ border: "1px solid black" }}
                                  >
                                    Upgrade
                                  </Button>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Box>
                      )}

                      <Box
                        display={{ xs: "flex", sm: "flex" }}
                        flexDirection={{ xs: "column", sm: "row" }}
                        justifyContent={{ xs: "center", sm: "flex-end" }}
                        gap={1}
                      >
                        <MainButton onClick={handleUpdateUser}>
                          Update
                        </MainButton>
                        <CancelButton onClick={handleCancel}>
                          Cancel
                        </CancelButton>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Container>
        </Box>
      </div>
    </>
  );
}

export default AdminProfile;
