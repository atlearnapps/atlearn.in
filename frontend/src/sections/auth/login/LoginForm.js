import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// @mui
import {
  Link,
  Stack,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  InputLabel,
  Box,
} from "@mui/material";
// import { LoadingButton } from "@mui/lab";
// components
import Iconify from "../../../components/iconify";
import apiClients from "src/apiClients/apiClients";
import MainButton from "src/components/Button/MainButton/MainButton";
import SocialLogin from "src/images/Social Login/GoogleLogo.svg";
// ----------------------------------------------------------------------

import config from "src/config";
import siteSetting from "src/utils/siteSetting";

export default function LoginForm() {
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
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [errorEmailMessage, setErrorEmailMessage] = useState(
    "Please enter a valid email address"
  );
  const [errorPasswordMessage, setErrorPasswordMessage] = useState(
    "Please enter a password"
  );
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const roomId = queryParams.get("roomId");
  const navigateLink = queryParams.get("to");
  const [sitesetting, setSiteSetting] = useState(null);
  useEffect(() => {
    const data = localStorage.getItem("user");
    if (data) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Call fetchData function when the component mounts
    const getData = async () => {
      try {
        const result = await siteSetting();
        if (result) {
          setSiteSetting(result);
        }

        // Handle the data as needed
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getData();
  }, []);

  const handleEmail = (e) => {
    setEmailError(false);
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPasswordError(false);
    setPassword(e.target.value);
  };

  const CheckEmail = () => {
    setErrorEmailMessage("Please enter a valid email address");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
  };

  const checkfields = () => {
    setErrorPasswordMessage("Please enter a password");
    if (!email) {
      setEmailError(true);
    }
    if (!password) {
      setPasswordError(true);
    }
  };

  const handleClick = async () => {
    checkfields();
    // toast.error("Something Wrong");
    if (email && password) {
      if (!emailError) {
        const data = {
          email,
          password,
        };

        try {
          const response = await apiClients.login(data);
          if (response) {
            if (response.success === false) {
              toast.error(response.message);
            }
            if (response?.token) {
              // dispatch(setUser(response.data));
              localStorage.setItem("user", JSON.stringify(response.data));
              localStorage.setItem(
                "access_token",
                JSON.stringify(response.token)
              );

              if (roomId) {
                navigate(`/room/${roomId}/join`);
              } else if (navigateLink) {
                navigate(navigateLink);
              } else if (
                response?.data?.role?.name === "Administrator" ||
                response?.data?.role?.name === "Super Admin"
              ) {
                navigate("/organization/dashboard", { replace: true });
              } else {
                navigate("/room", { replace: true });
              }
              toast.success(response.message);
              // navigate("/room", { replace: true });

              // if (response?.data?.role?.name === "Moderator") {
              //   toast.success(response.message);
              //   navigate("/room", { replace: true });
              // } else if (response?.data?.role?.name === "Administrator") {
              //   toast.success(response.message);
              //   navigate("/dashboard", { replace: true });
              // }
            }
          } else {
            toast.error("Something Wrong");
          }
        } catch (error) {
          toast.error(error);
        }
      }
    } else {
      toast.error("Something Wrong");
    }
  };

  return (
    <>
      <Stack direction="column" alignItems="center">
        <Stack spacing={2}>
          <InputLabel> Email</InputLabel>
          <TextField
            name="email"
            // label="Email address"
            placeholder="Enter your email"
            onChange={handleEmail}
            onBlur={CheckEmail}
            error={emailError}
            InputProps={{
              style: textFieldStyle,
            }}
            style={rootStyle}
          />
          {emailError && (
            <span style={{ color: "red" }}>{errorEmailMessage}</span>
          )}
          <InputLabel> Password</InputLabel>
          <TextField
            name="password"
            placeholder="Enter your password"
            type={showPassword ? "text" : "password"}
            onChange={handlePassword}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleClick();
              }
            }}
            error={passwordError}
            style={rootStyle}
            InputProps={{
              style: textFieldStyle,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    <Iconify
                      icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {passwordError && (
            <span style={{ color: "red" }}>{errorPasswordMessage}</span>
          )}

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="end"
            sx={{ my: 2, width: "100%", ml: 4 }}
          >
            {/* <Stack direction="row" alignItems="center">
              <Checkbox name="remember" label="Remember me" />
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "14px",
                  lineHeight: "19.6px",
                  color: "#545962",
                }}
              >
                Remember me
              </Typography>
            </Stack> */}
            <Stack>
              <Typography
                onClick={() => navigate("/forgetpassword")}
                sx={{
                  fontWeight: 500,
                  fontSize: "14px",
                  lineHeight: "19.6px",
                  color: "#545962",
                  cursor: "pointer",
                  mb: 1,
                }}
              >
                Forgot Password
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      {/* <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        onClick={handleClick}
      >
        Login
      </LoadingButton>  */}

      <Stack direction="column" alignItems="center" spacing={2}>
        <MainButton
          onClick={handleClick}
          style={{
            width: "100%",
            height: "44px",
            borderRadius: "8px",
            padding: "8px, 14px, 8px, 14px",
          }}
        >
          Sign In
        </MainButton>
        {/* {sitesetting?.registration !== "invite" && ( */}
        <Box
          onClick={() => window.open(`${config.baseApiUrl}/api/auth/google`)}
          sx={{
            width: "100%",
            height: "44px",
            border: "1px solid #DFE2E7",
            borderRadius: "8px",
            backgroundColor: "#FFFFFF",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
            transition: "background-color 0.3s", // Add a smooth transition for the hover effect
            "&:hover": {
              backgroundColor: "#F0F0F0", // Adjust the background color on hover
            },
          }}
        >
          <img
            src={SocialLogin}
            alt="logo"
            style={{ height: "100%", objectFit: "cover" }}
          />
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: "14px",
              lineHeight: "19.6px",
              color: "#545962",
            }}
          >
            Continue with Google
          </Typography>
        </Box>
        {/* )} */}
      </Stack>
      {sitesetting?.registration !== "invite" && (
        <Stack mt={2} direction="column" alignItems="center" spacing={2}>
          {/* <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link> */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "19.6px",
                color: "#545962",
              }}
            >
              Don't have an account?
            </Typography>
            <Link
              onClick={() => navigate("/signup")}
              variant="subtitle2"
              underline="hover"
              sx={{ cursor: "pointer", color: "primar.main" }}
            >
              Sign Up
            </Link>
          </Stack>
        </Stack>
      )}
    </>
  );
}
