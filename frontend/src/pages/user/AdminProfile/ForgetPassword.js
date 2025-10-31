import {
  Box,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import apiClients from "src/apiClients/apiClients";
import MainButton from "src/components/Button/MainButton/MainButton";
import SecondaryButton from "src/components/Button/SecondaryButton/SecondaryButton";
import Iconify from "src/components/iconify/Iconify";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { BASE_URL } from "src/apiClients/config";

function ForgetPassword() {
  const data = localStorage.getItem("user");
  let user = JSON.parse(data);
  const [userId, setUserId] = useState(user ? user.id : "");
  const [new_password, setNew_password] = useState("");
  const [old_password, setOld_password] = useState("");
  const [confirm_password, setConfirm_password] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });
  const [currentPasswordError, setCurrentPasswordError] = useState(false);
  const [passwordInputError, setPasswordInputError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setUserId(user ? user.id : "");
  }, [user]);

  const handleCancel = () => {
    // Go back to the previous page
    navigate(-1);
  };

  const handlePassword = (e) => {
    setPasswordInputError(false);
    const errors = {
      length: false,
      lowercase: false,
      uppercase: false,
      number: false,
      specialChar: false,
    };

    setPasswordErrors(errors);
    setNew_password(e.target.value);
  };

  const CheckPassword = () => {
    const passwordLengthRegex = /^.{8,}$/;
    const lowercaseRegex = /^(?=.*[a-z])/;
    const uppercaseRegex = /^(?=.*[A-Z])/;
    const numberRegex = /^(?=.*\d)/;
    const specialCharRegex = /^(?=.*[^a-zA-Z\d\s:])/;

    const errors = {
      length: !passwordLengthRegex.test(new_password),
      lowercase: !lowercaseRegex.test(new_password),
      uppercase: !uppercaseRegex.test(new_password),
      number: !numberRegex.test(new_password),
      specialChar: !specialCharRegex.test(new_password),
    };

    setPasswordErrors(errors);

    if (!new_password) {
      setPasswordInputError(true);
    }
  };

  const handleoldPassword = (e) => {
    setCurrentPasswordError(false);
    setOld_password(e.target.value);
  };

  const checkCurrentPassword = () => {
    if (!old_password) {
      setCurrentPasswordError(true);
    }
  };
  const handleconfirmpassword = (e) => {
    setConfirmPasswordError(false);
    setConfirm_password(e.target.value);
  };

  const checkConfirmPassword = () => {
    if (new_password === confirm_password) {
      setConfirmPasswordError(false);
    } else {
      setConfirmPasswordError(true);
    }
  };

  const checkfield = () => {
    let valid = true;
    if (user?.provider !== "google") {
      if (!old_password) {
        setCurrentPasswordError(true);
        valid = false;
      }
    }

    if (!new_password) {
      CheckPassword();
      valid = false;
    }

    if (new_password !== confirm_password) {
      setConfirmPasswordError(true);
      valid = false;
    }

    return valid;
  };

  const handleUpdatePassword = async () => {
    const validFiled = checkfield();
    if (validFiled === true) {
      const data = {
        old_password,
        new_password,
        confirm_password,
      };
      try {
        const response = await apiClients.changePassword(userId, data);
        if (response.success === true) {
          toast.success(response.message);
          setNew_password("");
          setOld_password("");
          setConfirm_password("");
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div>
      <Helmet>
        <title>Recover Your Account Password - Atlearn </title>
        <meta
          name="description"
          content="Easily recover your Atlearn account password. Follow quick steps to regain access and continue exploring our innovative learning solutions."
        />
        <link
          rel="canonical"
          href={`${BASE_URL}/settings/forgetPassword`}
        />
      </Helmet>
      <Box>
        <Container maxWidth={"xl"}>
          <Box
            mt={8}
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
            <Typography
              sx={{ ml: 2, pt: 2, textAlign: "center" }}
              variant="h3"
              gutterBottom
            >
              Change Password
            </Typography>

            <Box sx={{ mt: 6 }}>
              <Container>
                <Grid
                  container
                  spacing={4}
                  sx={{
                    // width:{"90%"},
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {user?.provider !== "google" && (
                    <Grid item xs={12} sm={8}>
                      <Typography gutterBottom>Current Password</Typography>
                      <TextField
                        value={old_password}
                        type="text"
                        placeholder="Enter your password"
                        onChange={handleoldPassword}
                        onBlur={checkCurrentPassword}
                        fullWidth
                      />
                      {currentPasswordError && (
                        <span style={{ color: "red" }}>
                          Current Password is required
                        </span>
                      )}
                    </Grid>
                  )}

                  <Grid item xs={12} sm={8}>
                    <Typography gutterBottom> New Password</Typography>
                    <TextField
                      value={new_password}
                      name="password"
                      placeholder="Enter new  password"
                      type={showPassword ? "text" : "password"}
                      onChange={handlePassword}
                      onBlur={CheckPassword}
                      error={passwordInputError}
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
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
                    />

                    <div
                      className="passwordcheck"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        paddingLeft: "20px",
                      }}
                    >
                      <ul>
                        <li
                          style={{
                            color: passwordErrors.length ? "red" : "inherit",
                          }}
                        >
                          At least 8 characters
                        </li>
                        <li
                          style={{
                            color: passwordErrors.lowercase ? "red" : "inherit",
                          }}
                        >
                          At least 1 lowercase character
                        </li>
                        <li
                          style={{
                            color: passwordErrors.uppercase ? "red" : "inherit",
                          }}
                        >
                          At least 1 uppercase character
                        </li>
                      </ul>
                      <ul>
                        <li
                          style={{
                            color: passwordErrors.number ? "red" : "inherit",
                          }}
                        >
                          At least 1 number
                        </li>
                        <li
                          style={{
                            color: passwordErrors.specialChar
                              ? "red"
                              : "inherit",
                          }}
                        >
                          At least 1 non alphanumeric character
                        </li>
                      </ul>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Typography gutterBottom>Confirm password</Typography>
                    <TextField
                      value={confirm_password}
                      type="password"
                      placeholder="Confirm your new password"
                      // label="confirmPassword "
                      name="confirmPassword"
                      onBlur={checkConfirmPassword}
                      onChange={handleconfirmpassword}
                      fullWidth
                    />
                    {confirmPasswordError && (
                      <span style={{ color: "red" }}>
                        Passwords do not match
                      </span>
                    )}
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={8}
                    mb={2}
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", md: "row" },
                      justifyContent: "end",
                      alignItems: "ceneter",
                      gap: 1,
                    }}
                  >
                    <SecondaryButton onClick={handleCancel}>
                      Cancel
                    </SecondaryButton>
                    <MainButton onClick={handleUpdatePassword}>
                      Change Password
                    </MainButton>
                  </Grid>
                </Grid>
              </Container>
            </Box>
          </Box>
        </Container>
      </Box>
    </div>
  );
}

export default ForgetPassword;
