import {
  Box,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ForgetPasswordIcon from "../../images/password/Featured icon.svg";
import MainButton from "src/components/Button/MainButton/MainButton";
import Iconify from "src/components/iconify";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import apiClients from "src/apiClients/apiClients";
import SingInGif from "src/images/signup/Signup with bg.gif";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });
  const [passwordInputError, setPasswordInputError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [paramsId,setParamsId]=useState();
  useEffect(() => {
    const url = window.location.href;
    const parts = url.split("/");
    const id = parts[parts.length - 2];
    if (id) {
      setParamsId(id);
    }
  }, []);
  const checkConfirmPassword = () => {
    if (password === confirmPassword) {
      setConfirmPasswordError(false);
    } else {
      setConfirmPasswordError(true);
    }
  };

  const handleConfirmPassword = (e) => {
    setConfirmPasswordError(false);
    setConfirmPassword(e.target.value);
  };

  const CheckPassword = () => {
   
    if (!password) {
      setPasswordInputError(true);
    }
  };
  const textFieldStyle = {
    width: "360px",
    height: "56px",
    borderRadius: "8px",
    // background: "#F5F7FB",
    background: "white",
  };

  const rootStyle = {
    borderRadius: "8px",
  };
  const handlePassword = (e) => {

    setPasswordInputError(false);
    const newPassword = e.target.value;

    // Perform your password strength checks and set errors accordingly
    const newErrors = {
      length: newPassword.length >= 8,
      lowercase: /[a-z]/.test(newPassword),
      uppercase: /[A-Z]/.test(newPassword),
      number: /\d/.test(newPassword),
      specialChar: /[!@#$%^&*()_+[\]{};:'"<>,.?/~\\-]/.test(newPassword),
    };
    setPassword(newPassword);
    setPasswordErrors(newErrors);
  };

  const checkError = () => {
    
    if (!password) {
      CheckPassword();
    }
    if (!confirmPassword) {
      setConfirmPasswordError(true);
    }
  };

  const handleResetPassword = async()=>{
     try{
      checkError();
      const isAllFalse = Object.values(passwordErrors).every(
        (value) => value === true
      );
      if(isAllFalse){
        if(password===confirmPassword){
          const data = {
            password,
            confirmPassword
          };
          const response = await apiClients.resetPassword(paramsId,data);
          if(response.success === true){
            toast.success(response.message);
            navigate("/login")
          }
        }
      }
    
    }catch(error){
      console.log(error);
    }
    
   
   
  }
  return (
    <div>
      <Grid container>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            backgroundColor:"white",
            width: "100%",
            maxHeight: "100vh",
            display: { xs: "none", md: "block" },
          }}
        >
           <Box
            sx={{
              height: "100%",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <img
              src={SingInGif}
              alt="Login"
              style={{height: "90%", }}
            />
          </Box>
        </Grid>
        <Grid
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
          item
          md={6}
          xs={12}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              // justifyContent: "center",
              // alignItems: "center",
              gap: "24px",
              width: "360px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "24px",
              }}
            >
              <Box>
                <img src={ForgetPasswordIcon} alt="logo" />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: "30px",
                      lineHeight: "38px",
                      color: "#40444B",
                    }}
                  >
                    Enter New Password
                  </Typography>
                </Box>
                {/* <Box>
                  <Typography
                    sx={{
                      fontWeight: 400,
                      fontSize: "17px",
                      lineHeight: "23.8px",
                      color: "#545962",
                    }}
                  >
                    No worries! We will send you the password
                  </Typography>
                </Box> */}
              </Box>
            </Box>
            <Box>
              <Stack spacing={2}>
                <InputLabel> Password</InputLabel>
                <TextField
                  name="password"
                  // label="Email address"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter New Password"
                  onChange={handlePassword}
                  onFocus={() => setIsFocused(true)}
                  // onBlur={CheckEmail}
                  error={passwordInputError}
                  InputProps={{
                    style: textFieldStyle,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          <Iconify
                            icon={
                              showPassword ? "eva:eye-fill" : "eva:eye-off-fill"
                            }
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  style={rootStyle}
                />
                {passwordInputError && (
                  <span style={{ color: "red" }}>Please enter Passwords </span>
                )}
                {/* {emailError && (
            <span style={{ color: "red" }}>{errorEmailMessage}</span>
          )} */}
                <div
                  className="passwordcheck"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingLeft: "20px",
                    gap: "20px",
                  }}
                >
                  <ul>
                    <li
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      {isFocused &&
                        (passwordErrors.length ? (
                          <CheckCircleIcon
                            style={{ color: "green", fontSize: "1rem" }}
                          />
                        ) : (
                          <CancelIcon
                            style={{ color: "red", fontSize: "1rem" }}
                          />
                        ))}
                      At least 8 characters
                    </li>
                    <li
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      {isFocused &&
                        (passwordErrors.lowercase ? (
                          <CheckCircleIcon
                            style={{ color: "green", fontSize: "1rem" }}
                          />
                        ) : (
                          <CancelIcon
                            style={{ color: "red", fontSize: "1rem" }}
                          />
                        ))}
                      At least 1 lowercase character
                    </li>
                    <li
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      {isFocused &&
                        (passwordErrors.uppercase ? (
                          <CheckCircleIcon
                            style={{ color: "green", fontSize: "1rem" }}
                          />
                        ) : (
                          <CancelIcon
                            style={{ color: "red", fontSize: "1rem" }}
                          />
                        ))}
                      At least 1 uppercase character
                    </li>
                  </ul>
                  <ul>
                    <li
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      {isFocused &&
                        (passwordErrors.number ? (
                          <CheckCircleIcon
                            style={{ color: "green", fontSize: "1rem" }}
                          />
                        ) : (
                          <CancelIcon
                            style={{ color: "red", fontSize: "1rem" }}
                          />
                        ))}
                      At least 1 number
                    </li>
                    <li
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      {isFocused &&
                        (passwordErrors.specialChar ? (
                          <CheckCircleIcon
                            style={{ color: "green", fontSize: "1rem" }}
                          />
                        ) : (
                          <CancelIcon
                            style={{ color: "red", fontSize: "1rem" }}
                          />
                        ))}
                      At least 1 non-alphanumeric character
                    </li>
                  </ul>
                </div>
                <InputLabel> confirm Password</InputLabel>
                <TextField
                  name="confirmpassword"
                  // label="Email address"
                  placeholder="Confirm your new password"
                  onChange={handleConfirmPassword}
                  onBlur={checkConfirmPassword}
                  error={confirmPasswordError}
                  InputProps={{
                    style: textFieldStyle,
                  }}
                  style={rootStyle}
                />
               {confirmPasswordError && (
              <span style={{ color: "red" }}>Passwords do not match</span>
            )}

                <MainButton onClick={handleResetPassword}>Submit</MainButton>
              </Stack>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

export default ResetPassword;
