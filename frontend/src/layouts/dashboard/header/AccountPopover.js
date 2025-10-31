import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// @mui
import { alpha } from "@mui/material/styles";
import {
  Box,
  Divider,
  Typography,
  MenuItem,
  Avatar,
  IconButton,
  Popover,
  useMediaQuery,
  Stack,
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { setUser } from "src/Redux/userSlice";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Badge } from "@mui/base";
import MainNotification from "src/components/Notification/MainNotification";
import siteSetting from "src/utils/siteSetting";
import { useAuth0 } from "@auth0/auth0-react";

export default function AccountPopover({ visible }) {
  const { logout, loginWithRedirect } = useAuth0();
  const tabsView = useMediaQuery("(max-width:992px)");
  const phonesView = useMediaQuery("(max-width:480px)");
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  let location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);
  const [organization, setOrganization] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [profile, setProfile] = useState(false);
  const [url, setUrl] = useState("");
  const [active, setActive] = useState(false);
  const [sitesetting, setSiteSetting] = useState(null);
  const [room, setRoom] = useState(false);

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
  useEffect(() => {
    const locationDetails = location?.pathname?.split("/")[1];

    if (locationDetails === "organization") {
      setOrganization(true);
    }
    if (locationDetails === "settings") {
      setProfile(true);
    }
    if (locationDetails === "room") {
      setRoom(true);
    }
  }, [location?.pathname]);

  useEffect(() => {
    if (user?.user?.role?.name === "Administrator") {
      setAdmin(true);
    }
    if (user?.permission) {
      if (
        user?.permission?.ManageUsers === "true" ||
        user?.permission?.ManageRooms === "true" ||
        user?.permission?.ManageRoles === "true" ||
        user?.permission?.ManageSiteSettings === "true"
      ) {
        setAdmin(true);
      }
    }

    if (user?.user) {
      setActive(true);
      const newUrl = `${process.env.REACT_APP_OVERRIDE_HOST}/api/images/${user?.user?.avatar}`;
      setUrl(newUrl);
    } else {
      setActive(false);
    }
  }, [user, user?.user?.avatar]);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleProfile = () => {
    handleClose();
    navigate("/settings/profile");
  };
  const onganization = () => {
    handleClose();
    navigate("/organization/admin");
  };
  const handlRoom = () => {
    handleClose();
    navigate("/room");
  };

  const handleLogout = async () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    dispatch(setUser(""));
    logout({
      returnTo: process.env.REACT_APP_LOGOUT_URL || window.location.origin,
    });
    handleClose();
    // await keycloak.logout();

    // navigate("/login", { replace: true });
  };

  const handleLogin = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: `/callback`,
      },
      authorizationParams: {
        prompt: "login",
      },
    });
  };
  const handleSignUp = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: `/callback`,
      },
      authorizationParams: {
        prompt: "login",
        screen_hint: "signup",
      },
    });
  };

  return (
    <>
      {active ? (
        <>
          <IconButton
            onClick={tabsView || phonesView || visible ? handleOpen : undefined}
            sx={{
              p: 0,
              ...(open && {
                "&:before": {
                  zIndex: 1,
                  content: "''",
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  position: "absolute",
                  bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
                },
              }),
            }}
          >
            <Avatar src={url} sx={{ backgroundColor: "primary.main" }} />
          </IconButton>
          {tabsView || phonesView ? null : (
            <>
              {!visible && (
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: "20px",
                      letterSpacing: "0.15%",
                    }}
                  >
                    {user?.user?.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "inline-block",
                      backgroundColor:
                        user?.user?.role?.name === "Moderator" ||
                        user?.user?.role?.name === "Administrator" ||
                        user?.user?.role?.name === "Super Admin"
                          ? "#E0F7FA"
                          : "#FCE4EC",
                      color:
                        user?.user?.role?.name === "Moderator" ||
                        user?.user?.role?.name === "Administrator" ||
                        user?.user?.role?.name === "Super Admin"
                          ? "#00796B"
                          : "#C2185B",
                      fontWeight: 500,
                      px: 1,
                      py: 0.3,
                      // mt: 0.3,
                      borderRadius: "5px",
                      fontSize: "12px",
                    }}
                  >
                    {user?.user?.role?.name === "Moderator"
                      ? "Teacher"
                      : user?.user?.role?.name === "Administrator"
                      ? "Admin"
                      : user?.user?.role?.name === "Super Admin"
                      ? "Super Admin"
                      : "Student"}
                  </Typography>
                </Box>
              )}

              {!visible &&
                (open ? (
                  <IconButton onClick={handleClose}>
                    <KeyboardArrowUpIcon />
                  </IconButton>
                ) : (
                  <IconButton onClick={handleOpen}>
                    <KeyboardArrowDownIcon />
                  </IconButton>
                ))}
            </>
          )}

          <Popover
            open={Boolean(open)}
            anchorEl={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
              sx: {
                p: 0,
                mt: 1.5,
                ml: 0.75,
                width: 180,
                "& .MuiMenuItem-root": {
                  typography: "body2",
                  borderRadius: 0.75,
                },
              },
            }}
          >
            <Box sx={{ my: 1.5, px: 2.5 }}>
              {(tabsView || phonesView) &&
                user?.user?.role?.name !== "Guest" &&
                (user?.user?.subscription?.name === "Free" ||
                  user?.user?.trial === true) && (
                  <Badge
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    color="error"
                    badgeContent={"Trial User"}
                    max={999}
                    style={{
                      backgroundColor: "#EA0000",
                      color: "white",
                      borderRadius: "10px",
                      fontSize: "10px",
                      padding: "5px",
                      // marginLeft: "6px",
                    }}
                  ></Badge>
                )}

              <Typography variant="subtitle2" noWrap>
                {user?.user?.name}
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                noWrap
              >
                {user?.user?.email}
              </Typography>
            </Box>
            <Divider sx={{ borderStyle: "dashed" }} />
            {!profile && (
              <>
                <MenuItem onClick={handleProfile} sx={{ m: 1 }}>
                  My Profile
                </MenuItem>
                <Divider sx={{ borderStyle: "dashed" }} />
              </>
            )}
            {!room && (
              <>
                <MenuItem onClick={handlRoom} sx={{ m: 1 }}>
                  Meetings
                </MenuItem>
                <Divider sx={{ borderStyle: "dashed" }} />
              </>
            )}

            {admin && !organization && (
              <>
                <MenuItem onClick={onganization} sx={{ m: 1 }}>
                  Administrator Panel
                </MenuItem>
                <Divider sx={{ borderStyle: "dashed" }} />
              </>
            )}

            <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
              Logout
            </MenuItem>
          </Popover>
          {tabsView || phonesView
            ? null
            : user?.user?.role?.name !== "Guest" &&
              (user?.user?.subscription?.name === "Free" ||
                user?.user?.trial === true) && (
                <Badge
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  color="error"
                  badgeContent={"Trial User"}
                  max={999}
                  style={{
                    backgroundColor: "#EA0000",
                    color: "white",
                    borderRadius: "10px",
                    fontSize: "10px",
                    padding: "5px",
                    marginLeft: "6px",
                  }}
                ></Badge>
              )}

          <MainNotification />
        </>
      ) : (
        <Stack
          direction={"row"}
          spacing={2}
          justifyContent={"center"}
          alignItems={"center"}
        >
          {sitesetting?.registration !== "invite" ? (
            <>
              <Box
                sx={{
                  cursor: "pointer",
                }}
                onClick={() => handleLogin()}
              >
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: "14px",
                    lineHeight: "19.6px",
                    color: "#545962",
                  }}
                >
                  Log in
                </Typography>
              </Box>
              <Box
                onClick={() => handleSignUp()}
                sx={{
                  borderRadius: "8px",
                  border: " 1px solid #6D207B",
                  // background: "#0C56AC",
                  padding: "10px 18px",
                  cursor: "pointer",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: "14px",
                    lineHeight: "19.6px",
                    color: "#545962",
                  }}
                >
                  Sign up
                </Typography>
              </Box>
            </>
          ) : (
            <Box
              onClick={() => handleLogin()}
              sx={{
                borderRadius: "8px",
                border: " 1px solid #0C56AC",
                // background: "#0C56AC",
                padding: "10px 18px",
                cursor: "pointer",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "14px",
                  lineHeight: "19.6px",
                  color: "#545962",
                }}
              >
                Log in
              </Typography>
            </Box>
          )}
        </Stack>
      )}
    </>
  );
}
