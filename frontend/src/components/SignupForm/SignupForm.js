import { useState } from "react";
import { useNavigate } from "react-router-dom";
// @mui
import {
  Stack,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Link,
  Box,
  CircularProgress,
} from "@mui/material";

// components
import Iconify from "src/components/iconify";
import apiClients from "src/apiClients/apiClients";
//style
import "./singup.css";
import MainButton from "src/components/Button/MainButton/MainButton";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { toast } from "react-toastify";
import { setUser } from "src/Redux/userSlice";
import { useDispatch } from "react-redux";
// ----------------------------------------------------------------------

export default function SignupForm({ createAccount }) {
  const textFieldStyle = {
    width: "100%",
    // height: '56px',

    borderRadius: "8px",
    // background: "#F5F7FB",
    background: "white",
  };

  const rootStyle = {
    borderRadius: "8px",
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nameError, setNameError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [passwordInputError, setPasswordInputError] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleEmail = (e) => {
    setEmailError(false);
    setEmail(e.target.value);
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
    console.log(newErrors, "newErrors");
    setPassword(newPassword);
    setPasswordErrors(newErrors);
  };

  const handleName = (e) => {
    setNameError(false);
    setName(e.target.value);
  };

  const handleConfirmPassword = (e) => {
    setConfirmPasswordError(false);
    setConfirmPassword(e.target.value);
  };

  const CheckName = () => {
    const nameRegex = /^[a-zA-Z\s\d]+$/;
    if (!nameRegex.test(name)) {
      setNameError(true);
    } else {
      setNameError(false);
    }
  };

  const CheckEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
  };

  const CheckPassword = () => {
    if (!password) {
      setPasswordInputError(true);
    }
  };

  const checkConfirmPassword = () => {
    if (password === confirmPassword) {
      setConfirmPasswordError(false);
    } else {
      setConfirmPasswordError(true);
    }
  };

  const checkError = () => {
    if (!name) {
      setNameError(true);
    }
    if (!email) {
      setEmailError(true);
    }
    if (!password) {
      CheckPassword();
    }
    if (!confirmPassword) {
      setConfirmPasswordError(true);
    }
  };

  const handleClick = async () => {
    checkError();
    const isAllFalse = Object.values(passwordErrors).every(
      (value) => value === true
    );
    if (isAllFalse && !emailError) {
      if (password === confirmPassword && name && email) {
        const data = {
          name,
          email,
          password,
        };
        setLoading(true);
        const response = await apiClients.createAccount(data);

        if (response.success === true) {
          setLoading(false);
          if (response?.data?.token) {
            localStorage.setItem(
              "user",
              JSON.stringify(response?.data?.data.user)
            );
            localStorage.setItem(
              "access_token",
              JSON.stringify(response?.data?.token)
            );
            dispatch(setUser(response?.data?.data));
          } else {
            setLoading(false);
            toast.error(response.message);
          }
        } else {
          setLoading(false);
          console.log(" error");
        }
      }
    }
  };

  return (
    <>
      <div>
        <Box mb={2}>
          <Typography variant="h5" gutterBottom sx={{ color: "#6D207B" }}>
            Sign Up
          </Typography>
        </Box>
        <Stack direction="column">
          <Stack spacing={1}>
            {/* <InputLabel> Full Name</InputLabel> */}
            <TextField
              fullWidth
              name="text"
              placeholder="Enter your name"
              onChange={handleName}
              onBlur={CheckName}
              InputProps={{
                style: textFieldStyle,
              }}
              style={rootStyle}
              error={nameError}
            />
            {nameError && (
              <span style={{ color: "red" }}>
                {" "}
                Please enter a valid name (letters only){" "}
              </span>
            )}
            {/* <InputLabel> Email</InputLabel> */}
            <TextField
              name="email"
              placeholder=" Enter your email "
              onChange={handleEmail}
              onBlur={CheckEmail}
              error={emailError}
              InputProps={{
                style: textFieldStyle,
              }}
              style={rootStyle}
              autoComplete="new-email"
            />
            {emailError && (
              <span style={{ color: "red" }}>
                {" "}
                Please enter a valid email address
              </span>
            )}
            {/* <InputLabel> Password</InputLabel> */}
            <TextField
              name="password"
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              onChange={handlePassword}
              // onBlur={CheckPassword}
              error={passwordInputError}
              style={rootStyle}
              onFocus={() => setIsFocused(true)}
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
              autoComplete="new-password"
            />
            {passwordInputError && (
              <span style={{ color: "red" }}>Please enter Passwords </span>
            )}
            {/* {passwordError && (
          <span style={{color:"red"}}>Invalid Password</span>
        )} */}
            {/* <div
          className="passwordcheck"
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingLeft: "20px",
            gap:"20px"
          }}
        >
          <ul >
            <li style={{ color: passwordErrors.length ? "red" : "inherit" }}>
              At least 8 characters
            </li>
            <li style={{ color: passwordErrors.lowercase ? "red" : "inherit" }}>
              At least 1 lowercase character
            </li>
            <li style={{ color: passwordErrors.uppercase ? "red" : "inherit" }}>
              At least 1 uppercase character
            </li>
          </ul>
          <ul>
            <li style={{ color: passwordErrors.number ? "red" : "inherit" }}>
              At least 1 number
            </li>
            <li
              style={{ color: passwordErrors.specialChar ? "red" : "inherit" }}
            >
              At least 1 non alphanumeric character
            </li>
          </ul>
        </div> */}
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
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  {isFocused &&
                    (passwordErrors.length ? (
                      <CheckCircleIcon
                        style={{ color: "green", fontSize: "1rem" }}
                      />
                    ) : (
                      <CancelIcon style={{ color: "red", fontSize: "1rem" }} />
                    ))}
                  At least 8 characters
                </li>
                <li
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  {isFocused &&
                    (passwordErrors.lowercase ? (
                      <CheckCircleIcon
                        style={{ color: "green", fontSize: "1rem" }}
                      />
                    ) : (
                      <CancelIcon style={{ color: "red", fontSize: "1rem" }} />
                    ))}
                  At least 1 lowercase character
                </li>
                <li
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  {isFocused &&
                    (passwordErrors.uppercase ? (
                      <CheckCircleIcon
                        style={{ color: "green", fontSize: "1rem" }}
                      />
                    ) : (
                      <CancelIcon style={{ color: "red", fontSize: "1rem" }} />
                    ))}
                  At least 1 uppercase character
                </li>
              </ul>
              <ul>
                <li
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  {isFocused &&
                    (passwordErrors.number ? (
                      <CheckCircleIcon
                        style={{ color: "green", fontSize: "1rem" }}
                      />
                    ) : (
                      <CancelIcon style={{ color: "red", fontSize: "1rem" }} />
                    ))}
                  At least 1 number
                </li>
                <li
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  {isFocused &&
                    (passwordErrors.specialChar ? (
                      <CheckCircleIcon
                        style={{ color: "green", fontSize: "1rem" }}
                      />
                    ) : (
                      <CancelIcon style={{ color: "red", fontSize: "1rem" }} />
                    ))}
                  At least 1 non-alphanumeric character
                </li>
              </ul>
            </div>
            {/* <InputLabel> Password Confirmation</InputLabel> */}
            <TextField
              name="confirmpassword"
              onChange={handleConfirmPassword}
              onBlur={checkConfirmPassword}
              placeholder="Enter your Password Confirmation"
              type="password"
              error={confirmPasswordError}
              InputProps={{
                style: textFieldStyle,
              }}
              style={rootStyle}
            ></TextField>
            {confirmPasswordError && (
              <span style={{ color: "red" }}>Passwords do not match</span>
            )}
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ my: 2 }}
          >
            {/* <Checkbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link> */}
          </Stack>

          {/* <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        onClick={handleClick}
      >
        Sign up
      </LoadingButton> */}
          <Stack direction="column" alignItems="center" spacing={1}>
            <MainButton
              onClick={handleClick}
              style={{
                width: "100%",
                height: "44px",
                borderRadius: "8px",
                color: "#6D207B",
              }}
            >
              {loading && (
                <CircularProgress
                  size={"1.2rem"}
                  sx={{ color: "white", mr: 1 }}
                />
              )}
              Sign Up
            </MainButton>
          </Stack>

          <Stack
            mt={2}
            mb={2}
            direction="column"
            alignItems="center"
            spacing={2}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography>Already member?</Typography>
              <Link
                onClick={() => navigate("/login")}
                variant="subtitle2"
                underline="hover"
                sx={{ cursor: "pointer", color: "#6D207B" }}
              >
                Sign In
              </Link>
            </Stack>
          </Stack>
        </Stack>
      </div>
    </>
  );
}
