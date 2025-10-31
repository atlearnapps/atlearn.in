import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import {
  Autocomplete,
  Box,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  MenuItem,
  Popover,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import apiClients from "src/apiClients/apiClients";
import { toast } from "react-toastify";
import Iconify from "src/components/iconify";
import MainButton from "src/components/Button/MainButton/MainButton";
import SecondaryButton from "src/components/Button/SecondaryButton/SecondaryButton";
import { useSelector } from "react-redux";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { generatePassword } from "src/utils/generatePassword";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { CheckCircle, Cancel } from "@mui/icons-material";
import { validatePassword } from "src/utils/validateFields/validatePassword";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} timeout={500} />;
});

export default function AddUser({ open, handleClose, fetchData }) {
  const { user } = useSelector((state) => state.user);
  const [roles, setRoles] = useState();
  const [name, setName] = useState("");
  const [password, setPassword] = useState();
  const [role_id, setRole_Id] = useState("");
  const [verified, setVerified] = useState(false);
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [checkName, setCheckName] = useState(false);
  const [checkPassword, setCheckPassword] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [checkRole, setCheckRole] = useState(false);
  const [errors, setErrors] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [plans, setPlans] = useState();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planId, setPlanId] = useState("");
  const [checkPlan, setCheckPlan] = useState(false);

  useEffect(() => {
    fetchRoles();
    fetchPricing();
  }, []);

  const handleClosebox = () => {
    setName("");
    setPassword("");
    setRole_Id("");
    setEmail("");
    setSelectedRole(null);
    setCheckName(false);
    setCheckPassword(false);
    setCheckEmail(false);
    setCheckRole(false);
    setVerified(false);
    setErrors([]);
    setCheckPlan(false);
    setSelectedPlan(null);
    handleClose();
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
    setErrors(validatePassword(autopassword));
    setCheckPassword(false);
  };

  const checkAllField = () => {
    let error;
    if (!name) {
      setCheckName(true);
      error = true;
    }

    if (!password) {
      setCheckPassword(true);
      error = true;
    } else {
      if (errors.some((error) => !error.isValid)) {
        error = true;
      }
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

  const handleCreateUser = async () => {
    try {
      const checkRequiredField = checkAllField();
      if (checkRequiredField === false) {
        const data = {
          name,
          email,
          password,
          role_id,
          verified,
          approve: true,
          subscription_id: planId,
        };
        const response = await apiClients.createUser(data);
        if (response) {
          if (response.success === true) {
            toast.success(response.message);
          } else {
            toast.error(response.message);
          }
          fetchData();
          handleClosebox();
        }
      }
    } catch (error) {
      console.log(error);
    }
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
        // const matchedPlan = response.data?.find(
        //   (plan) => plan.name === userData?.subscription?.name
        // );
        // setSelectedPlan(matchedPlan ? matchedPlan : null);
        setPlans(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
          {"Add User"}
        </DialogTitle>
        <Divider />
        <DialogContent>
          {/* <DialogContentText id="alert-dialog-slide-description">
            Let Google help apps determine location. This means sending anonymous
            location data to Google, even when no apps are running.
          </DialogContentText> */}
          <Box>
            <Container>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography gutterBottom>
                    Name <span style={{ color: "red" }}>*</span>
                  </Typography>
                  <TextField
                    type="text"
                    placeholder="Enter Name"
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
                    placeholder="Enter Email"
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setCheckEmail(false);
                      setEmailError("");
                    }}
                    value={email}
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
                    getOptionLabel={(option) => option.name || ""}
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
                    value={selectedRole}
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
                        placeholder="Select Plan"
                        error={checkPlan}
                        helperText={checkPlan ? "Plan is required" : ""}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography gutterBottom>Verified</Typography>
                  <Select
                    sx={{ width: "100%" }}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={verified}
                    onChange={(e) => setVerified(e.target.value)}
                  >
                    <MenuItem value={true}>True</MenuItem>
                    <MenuItem value={false}>False</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    display={{ xs: "flex", sm: "flex" }}
                    flexDirection={{ xs: "column", sm: "row" }}
                    justifyContent={{ xs: "center", sm: "flex-end" }}
                    gap={1}
                  >
                    <SecondaryButton
                      onClick={handleClosebox}
                      sx={{
                        border: "1px solid #444444",
                        padding: "10px 20px",
                        color: "#444444",
                        "&:hover": {
                          backgroundColor: "#F5F7FB",
                        },
                      }}
                    >
                      Cancel
                    </SecondaryButton>
                    <MainButton onClick={handleCreateUser}>Add User</MainButton>
                  </Box>
                </Grid>
              </Grid>
            </Container>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}
