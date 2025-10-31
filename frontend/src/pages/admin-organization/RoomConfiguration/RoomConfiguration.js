import {
  Box,
  Card,
  Container,
  Grid,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import apiClients from "src/apiClients/apiClients";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { BASE_URL } from "src/apiClients/config";
function RoomConfiguration() {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const options = [
    { value: "true", label: "Enabled" },
    // {
    //   value: "default_enabled",
    //   label: "Optional (default:enabled)",
    // },
    // {
    //   value: "optional",
    //   label: "Optional (default:disabled)",
    // },
    { value: "false", label: "Disabled" },
  ];

  const initialConfig = {
    record: { value: null, id: null },
    muteOnStart: { value: null, id: null },
    guestPolicy: { value: null, id: null },
    glAnyoneCanStart: { value: null, id: null },
    glAnyoneJoinAsModerator: { value: null, id: null },
    glRequireAuthentication: { value: null, id: null },
    glModeratorAccessCode: { value: null, id: null },
    glViewerAccessCode: { value: null, id: null },
  };

  const [config, setConfig] = useState(initialConfig);
  
  useEffect(() => {
    fetchRoomConfig();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (user) {
    if (user?.permission?.["ManageSiteSettings"] !== "true") {
      navigate("/404");
    }
  }


  const fetchRoomConfig = async () => {
    try {
      const response = await apiClients.getAllRoomConfig();
      if (response.data) {
        response.data.forEach((item) => {
          const optionName = item.meeting_option.name;
          if (config.hasOwnProperty(optionName)) {
            setConfig((prevConfig) => ({
              ...prevConfig,
              [optionName]: { value: item.value, id: item.id },
            }));
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (event, optionName, id) => {
    const selectedValue = event.target.value;
    setConfig((prevConfig) => ({
      ...prevConfig,
      [optionName]: { ...prevConfig[optionName], value: selectedValue }, // Update only the value
    }));
    if (selectedValue) {
      handleUpdateRoomConfig(id, selectedValue);
    }
  };

  const handleUpdateRoomConfig = async (id, value) => {
    const data = {
      value,
    };
    try {
      const response = await apiClients.updateRoomCnfig(id, data);
      if (response.message) {
        toast.success(response.message);
        // fetchRoomConfig();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Helmet>
      <title>Configure Virtual Rooms | Atlearn LMS	 </title>
        <meta
          name="description"
          content="Set up and configure virtual rooms for online learning with Atlearn. Optimize your virtual classroom settings for seamless educational experiences."
        />
        <link rel="canonical" href={`${BASE_URL}/organization/room-configuration`} />
      </Helmet>
      <Container maxWidth={"xl"}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography style={{ fontSize: "2rem", fontWeight: 400 }}>
            Room Configuration
          </Typography>
        </Stack>
        <Card>
          <Box sx={{ flexGrow: 1, m: 4 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} lg={8}>
                <Box>
                  <Typography variant="h5">
                    Allow Room to be recorded
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Allows room owners to specify whether they want the option
                    to record a room or not. If enabled, the moderator must
                    still click the 'Record' button once the meeting has
                    started.
                  </Typography>
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                lg={4}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: {
                    xs: "center",
                    sm: "end",
                    md: "end",
                    lg: "end",
                    xl: "end",
                  },
                }}
              >
                <Box sx={{ width: "250px" }}>
                  <Select
                    value={config["record"].value}
                    onChange={(event) =>
                      handleChange(event, "record", config["record"].id)
                    }
                    sx={{ width: "100%" }}
                  >
                    {options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              </Grid>
              <Grid item xs={12} lg={8}>
                <Box>
                  <Typography variant="h5">
                    Require users to be signed in before joining
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Only allows users with a Greenlight account to join the
                    meeting. If they are not signed in, they will be redirected
                    to the login page when attempting to join a room.
                  </Typography>
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                lg={4}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: {
                    xs: "center",
                    sm: "end",
                    md: "end",
                    lg: "end",
                    xl: "end",
                  },
                }}
              >
                <Box sx={{ width: "250px" }}>
                  <Select
                    value={config["glRequireAuthentication"].value}
                    onChange={(event) =>
                      handleChange(
                        event,
                        "glRequireAuthentication",
                        config["glRequireAuthentication"].id
                      )
                    }
                    sx={{ width: "100%" }}
                  >
                    {options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              </Grid>
              <Grid item xs={12} lg={8}>
                <Box>
                  <Typography variant="h5">
                    Require moderator approval before joining
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Prompts the moderator of the BigBlueButton meeting when a
                    user tries to join. If the user is approved, they will be
                    able to join the meeting.
                  </Typography>
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                lg={4}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: {
                    xs: "center",
                    sm: "end",
                    md: "end",
                    lg: "end",
                    xl: "end",
                  },
                }}
              >
                <Box sx={{ width: "250px" }}>
                  <Select
                    value={config["guestPolicy"].value}
                    onChange={(event) =>
                      handleChange(
                        event,
                        "guestPolicy",
                        config["guestPolicy"].id
                      )
                    }
                    sx={{ width: "100%" }}
                  >
                    {options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              </Grid>
              <Grid item xs={12} lg={8}>
                <Box>
                  <Typography variant="h5">
                    Allow any user to start a meeting
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Allow any user to start the meeting at any time. By default,
                    only the room owner can start the meeting.
                  </Typography>
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                lg={4}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: {
                    xs: "center",
                    sm: "end",
                    md: "end",
                    lg: "end",
                    xl: "end",
                  },
                }}
              >
                <Box sx={{ width: "250px" }}>
                  <Select
                    value={config["glAnyoneCanStart"].value}
                    onChange={(event) =>
                      handleChange(
                        event,
                        "glAnyoneCanStart",
                        config["glAnyoneCanStart"].id
                      )
                    }
                    sx={{ width: "100%" }}
                  >
                    {options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              </Grid>
              <Grid item xs={12} lg={8}>
                <Box>
                  <Typography variant="h5">
                    All users join as moderators
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Gives all users the moderator privileges in BigBlueButton
                    when they join the meeting.
                  </Typography>
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                lg={4}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: {
                    xs: "center",
                    sm: "end",
                    md: "end",
                    lg: "end",
                    xl: "end",
                  },
                }}
              >
                <Box sx={{ width: "250px" }}>
                  <Select
                    value={config["glAnyoneJoinAsModerator"].value}
                    onChange={(event) =>
                      handleChange(
                        event,
                        "glAnyoneJoinAsModerator",
                        config["glAnyoneJoinAsModerator"].id
                      )
                    }
                    sx={{ width: "100%" }}
                  >
                    {options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              </Grid>
              <Grid item xs={12} lg={8}>
                <Box>
                  <Typography variant="h5">
                    Mute users when they join
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Automatically mutes the user when they join the
                    BigBlueButton meeting.
                  </Typography>
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                lg={4}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: {
                    xs: "center",
                    sm: "end",
                    md: "end",
                    lg: "end",
                    xl: "end",
                  },
                }}
              >
                <Box sx={{ width: "250px" }}>
                  <Select
                    value={config["muteOnStart"].value}
                    onChange={(event) =>
                      handleChange(
                        event,
                        "muteOnStart",
                        config["muteOnStart"].id
                      )
                    }
                    sx={{ width: "100%" }}
                  >
                    {options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              </Grid>
              <Grid item xs={12} lg={8}>
                <Box>
                  <Typography variant="h5">Viewer Access Code</Typography>
                  <Typography variant="body1" gutterBottom>
                    Allows room owners to have a random alphanumeric code that
                    can be shared with users. The code, if generated, will be
                    required for users to join the room meetings.
                  </Typography>
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                lg={4}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: {
                    xs: "center",
                    sm: "end",
                    md: "end",
                    lg: "end",
                    xl: "end",
                  },
                }}
              >
                <Box sx={{ width: "250px" }}>
                  <Select
                    value={config["glViewerAccessCode"].value}
                    onChange={(event) =>
                      handleChange(
                        event,
                        "glViewerAccessCode",
                        config["glViewerAccessCode"].id
                      )
                    }
                    sx={{ width: "100%" }}
                  >
                    {options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              </Grid>
              <Grid item xs={12} lg={8}>
                <Box>
                  <Typography variant="h5">Moderator Access Code</Typography>
                  <Typography variant="body1" gutterBottom>
                    Allows room owners to have a random alphanumeric code that
                    can be shared with users. The code, if generated, will not
                    be required and when used on any room meeting will join the
                    user as a moderator.
                  </Typography>
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                lg={4}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: {
                    xs: "center",
                    sm: "end",
                    md: "end",
                    lg: "end",
                    xl: "end",
                  },
                }}
              >
                <Box sx={{ width: "250px" }}>
                  <Select
                    value={config["glModeratorAccessCode"].value}
                    onChange={(event) =>
                      handleChange(
                        event,
                        "glModeratorAccessCode",
                        config["glModeratorAccessCode"].id
                      )
                    }
                    sx={{ width: "100%" }}
                  >
                    {options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Card>
      </Container>
    </div>
  );
}

export default RoomConfiguration;
