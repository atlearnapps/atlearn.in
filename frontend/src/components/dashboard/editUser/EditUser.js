import React, { useState, useEffect } from "react";
import "./EditUser.css";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  Popover,
  Slide,
  TextField,
  Typography,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import apiClients from "src/apiClients/apiClients";
import { setUser } from "src/Redux/userSlice";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { generatePassword } from "src/utils/generatePassword";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import Iconify from "src/components/iconify";
import { validatePassword } from "src/utils/validateFields/validatePassword";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { CheckCircle, Cancel } from "@mui/icons-material";
import SecondaryButton from "src/components/Button/SecondaryButton/SecondaryButton";
import MainButton from "src/components/Button/MainButton/MainButton";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} timeout={500} />;
});

function EditUser({ open, handleclose, userData, update, userID }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [selectedFile, setSelectedFile] = useState(null);
  const [roles, setRoles] = useState();
  const [role_id, setRole_Id] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState(" ");
  const [language, setLanguage] = useState("");
  const [userId, setUserId] = useState("");
  const [profile, setProfile] = useState("");
  const [checkName, setCheckName] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [checkRole, setCheckRole] = useState(false);
  // const [checkLanguage, setCheckLanguage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState();
  const [checkPassword, setCheckPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [plans, setPlans] = useState();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planId, setPlanId] = useState("");
  const [checkPlan, setCheckPlan] = useState(false);
  useEffect(() => {
    fetchRoles();

    if (userData) {
      fetchPricing();
      setName(userData?.name);
      setEmail(userData?.email);
      setPassword(userData?.password);
      setRole_Id(userData?.role.id);
      setLanguage(userData?.language);
      setSelectedRole(userData?.role);
      setUserId(userData?.id);
      setProfile(userData?.avatar ? userData?.avatar : "");
      setPlanId(userData?.subscription_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const handleClosebox = () => {
    // setOpenuser(false);
    setCheckName(false);
    setCheckEmail(false);
    setCheckRole(false);
    setCheckPlan(false);
    // setCheckLanguage(false);
    setErrors([]);
    handleclose();
  };
  const fetchRoles = async () => {
    try {
      const response = await apiClients.getAllRoles();
      if (response.data) {
        // setFilteredRole(response.data);
        setRoles(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPricing = async () => {
    try {
      const response = await apiClients.pricing();
      if (response.data) {
        const matchedPlan = response.data?.find(
          (plan) => plan.name === userData?.subscription?.name
        );
        setSelectedPlan(matchedPlan ? matchedPlan : null);
        setPlans(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const isEmailValid = (email) => {
    // const emailRegex = /^[a-z][a-z0-9._-]*@[a-z0-9.-]+\.[a-z]{2,}$/;
    const emailRegex = /^[a-z][a-z0-9._-]*@[a-z0-9-]+(\.[a-z]{2,}){1}$/;
    return emailRegex.test(email);
  };

  const handlePasswordChange = (e) => {
    setCheckPassword(false);

    const value = e.target.value;
    setPassword(value);
    if (value) {
      setErrors(validatePassword(value));
    } else {
      setErrors([]);
    }
  };

  const autogeneratePassword = () => {
    const autopassword = generatePassword();
    setPassword(autopassword);
    setCheckPassword(false);
  };

  const checkAllField = () => {
    let error;
    if (!name) {
      setCheckName(true);
      error = true;
    }

    if (email) {
      const isValid = isEmailValid(email);
      if (!isValid) {
        setCheckEmail(!isValid);
        setEmailError("Invalid Email");
        error = true;
      }
    } else {
      setCheckEmail(true);
      setEmailError("Email is required");
      error = true;
    }

    if (!selectedRole) {
      setCheckRole(true);
      error = true;
    }

    // if (!language) {
    //   setCheckLanguage(true);
    //   error = true;
    // }

    if (password) {
      if (errors.some((error) => !error.isValid)) {
        error = true;
      }
    }

    if (!selectedPlan) {
      setCheckPlan(true);
      error = true;
    }

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
        const data = {
          name,
          email,
          role_id,
          language,
          password,
          planId,
          subscriptionDate: new Date().toISOString().split("T")[0],
        };
        const response = await apiClients.userUpdate(data, userId);
        if (response.data) {
          toast.success(response.message);
          update();
          handleclose();
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
        setSelectedFile(null);
        setProfile("");
        toast.success("avatar has been updated");
        if (userID === userId) {
          session();
        }
        update();
      }
    } catch (error) {
      console.log(error);
    }
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
  // const handleInputChange = (event) => {
  //   const { name, value } = event.target;
  //   setEditUser((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));

  //   console.log();
  // };

  const uploadProfile = async (selectedFile) => {
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      setLoading(true);
      const response = await apiClients.uploadProfile(userId, formData);
      if (response) {
        if (userID === userId) {
          session();
        }
        update();
        toast.success("avatar has been updated");
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
      setSelectedFile(file);
      // setFileError("");
      uploadProfile(file);
    } else {
      setSelectedFile(null);
    }
  };
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const openpopover = Boolean(anchorEl);

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClosebox}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle sx={{ textAlign: "center", backgroundColor: "#F5F7FB" }}>
          Edit User
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box sx={{ textAlign: "center", marginBottom: "1rem" }}>
            <Box {...getRootProps()}>
              <input {...getInputProps()} />
              {selectedFile ? (
                <Avatar
                  src={URL.createObjectURL(selectedFile)}
                  // alt="Profile Picture"
                  sx={{
                    width: 120,
                    height: 120,
                    margin: "0 auto",
                    border: "4px solid #fff",
                    cursor: "pointer",
                    // backgroundColor: "#2b558f",
                  }}
                />
              ) : (
                <Avatar
                  src={`${process.env.REACT_APP_OVERRIDE_HOST}/api/images/${profile}`}
                  // alt="Profile Picture"
                  sx={{
                    width: 120,
                    height: 120,
                    margin: "0 auto",
                    border: "4px solid #fff",
                    cursor: "pointer",
                    // backgroundColor: "#2b558f",
                  }}
                />
              )}
            </Box>
            <Box
              mt={2}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Button onClick={deleteProfile} className="delete">
                Delete
              </Button>
              <Box {...getRootProps()}>
                <input {...getInputProps()} />
                <Button
                  sx={{
                    border: "1px solid #6D207B",
                    padding: "10px 20px",
                    color: "#ffff",
                    backgroundColor: "primary.main",
                    "&:hover": {
                      backgroundColor: "secondary.main",
                    },
                  }}
                >
                  {" "}
                  {loading ? (
                    <CircularProgress
                      size={"1.2rem"}
                      sx={{
                        color: "white",
                        mr: 1,
                        backgroundColor: "#6D207B",
                        "&:hover": {
                          backgroundColor: "#E8063C",
                        },
                      }}
                    />
                  ) : (
                    <FileUploadOutlinedIcon sx={{ mr: 1 }} />
                  )}
                  Upload
                </Button>
              </Box>
              <Box></Box>
            </Box>
          </Box>
          <Box sx={{ mt: 6 }}>
            <Container>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                  <Typography gutterBottom>
                    Name <span style={{ color: "red" }}>*</span>
                  </Typography>
                  <TextField
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setCheckName(false);
                    }}
                    fullWidth
                    error={checkName}
                    helperText={checkName ? "Name is required" : ""}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography gutterBottom>
                    Email <span style={{ color: "red" }}>*</span>
                  </Typography>
                  <TextField
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setCheckEmail(false);
                      setEmailError("");
                    }}
                    fullWidth
                    error={checkEmail}
                    helperText={emailError}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography gutterBottom>
                      Password <span style={{ color: "red" }}>*</span>
                    </Typography>
                    {errors.some((error) => !error.isValid) && (
                      <InfoOutlinedIcon
                        onClick={handlePopoverOpen}
                        sx={{
                          fontSize: "1rem",
                          color: errors.some((error) => !error.isValid)
                            ? "red"
                            : "",
                        }}
                      />
                    )}
                  </Box>

                  <TextField
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    onChange={handlePasswordChange}
                    value={password}
                    fullWidth
                    InputProps={{
                      // style: textFieldStyle,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={autogeneratePassword} edge="end">
                            <AutorenewIcon sx={{ fontSize: "1.3rem" }} />
                          </IconButton>
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            <Iconify
                              icon={
                                showPassword
                                  ? "eva:eye-fill"
                                  : "eva:eye-off-fill"
                              }
                            />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    error={
                      checkPassword || errors.some((error) => !error.isValid)
                    }
                    helperText={
                      checkPassword
                        ? "Password is required"
                        : errors.some((error) => !error.isValid)
                        ? "password not strong"
                        : ""
                    }
                  />
                  <Popover
                    open={openpopover}
                    anchorEl={anchorEl}
                    onClose={handlePopoverClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                  >
                    <List>
                      {errors.map((error, index) => (
                        <ListItem key={index}>
                          {error.isValid ? (
                            <CheckCircle
                              sx={{ color: "green", marginRight: 1 }}
                            />
                          ) : (
                            <Cancel sx={{ color: "red", marginRight: 1 }} />
                          )}
                          <Typography variant="body2">
                            {error.message}
                          </Typography>
                        </ListItem>
                      ))}
                    </List>
                  </Popover>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography gutterBottom>
                    Role <span style={{ color: "red" }}>*</span>
                  </Typography>
                  {/* <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    getOptionLabel={(option) => option.name}
                    options={
                      user?.user?.role?.name === "Super Admin"
                        ? roles || []
                        : roles?.filter(
                            (role) => role?.name !== "Super Admin"
                          ) || []
                    }
                    value={selectedRole}
                    onChange={(event, newValue) => {
                      setCheckRole(false);
                      setRole_Id(newValue?.id ? newValue.id : "");
                      setSelectedRole(newValue ? newValue : null);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={checkRole}
                        helperText={checkRole ? "Role is required" : ""}
                      />
                    )}
                  /> */}
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    getOptionLabel={(option) => option.name || ""}
                    options={(user?.user?.role?.name === "Super Admin"
                      ? roles || []
                      : roles?.filter((role) => role?.name !== "Super Admin") ||
                        []
                    ).map((role) => ({
                      ...role,
                      name:
                        role.name === "Moderator"
                          ? "Teacher"
                          : role.name === "Guest"
                          ? "Student"
                          : role.name,
                    }))}
                    value={
                      selectedRole
                        ? {
                            ...selectedRole,
                            name: selectedRole.name === "Moderator" ? "Teacher" : selectedRole.name === "Guest" ? "Student" : selectedRole.name,
                          }
                        : null
                    }
                    onChange={(event, newValue) => {
                      setCheckRole(false);
                      setRole_Id(newValue?.id ? newValue?.id : "");
                      setSelectedRole(newValue ? newValue : null);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select Role"
                        error={checkRole}
                        helperText={checkRole ? "Role is required" : ""}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography gutterBottom>
                    Plan <span style={{ color: "red" }}>*</span>
                  </Typography>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    getOptionLabel={(option) => option.name}
                    options={plans ? plans : []}
                    value={selectedPlan}
                    onChange={(event, newValue) => {
                      setCheckPlan(false);
                      setPlanId(newValue?.id ? newValue.id : "");
                      setSelectedPlan(newValue ? newValue : null);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={checkPlan}
                        helperText={checkPlan ? "Plan is required" : ""}
                      />
                    )}
                  />
                </Grid>
                {/* <Grid item xs={12} sm={6}>
                  <Typography gutterBottom>Language *</Typography>
                  <TextField
                    type="text"
                    placeholder="Language "
                    value={language}
                    onChange={(e) => {
                      setLanguage(e.target.value);
                      setCheckLanguage(false);
                    }}
                    fullWidth
                    error={checkLanguage}
                    helperText={checkLanguage ? "Language is required" : ""}
                  />
                </Grid> */}
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mb: 2,
                    gap: 1,
                  }}
                >
                  <SecondaryButton onClick={handleClosebox}>
                    Cancel
                  </SecondaryButton>
                  <MainButton onClick={handleUpdateUser}>Update</MainButton>
                </Grid>
              </Grid>
            </Container>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EditUser;
