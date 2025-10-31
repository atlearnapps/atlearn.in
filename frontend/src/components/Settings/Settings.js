import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  styled,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { FileCopy } from "@mui/icons-material";
import CachedIcon from "@mui/icons-material/Cached";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import "./Settings.css";
import SecondaryButton from "../Button/SecondaryButton/SecondaryButton";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import apiClients from "src/apiClients/apiClients";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import MainButton from "../Button/MainButton/MainButton";
import CheckIcon from "@mui/icons-material/Check";
import ErrorTwoToneIcon from "@mui/icons-material/ErrorTwoTone";
import { useDropzone } from "react-dropzone";
import EditIcon from "@mui/icons-material/Edit";
import BBBLogo from "src/assets/images/home/new/bbb.webp";
import ZoomLogo from "src/assets/images/home/new/z.webp";
import DeleteConfirmation from "src/components/confirmationPopup/confirmationPopup";

const List = styled("ul")({
  margin: 0,
  padding: 0,
  listStyle: "none",
});

const ListItem = styled("li")({
  display: "flex",
  alignItems: "center",
});

const CheckIconStyled = styled(CheckIcon)({
  marginRight: "8px",
  color: "green",
});

const options = [
  "Start Meeting",
  "End Metting",
  "Share Screen",
  "Record Meeting ( If allow room to be recorded )",
];

function Settings({ getdata, Roomid, Duration, Storage }) {
  const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: "rgba(0, 0, 0, 0.87)",
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
  }));
  const navigate = useNavigate();
  const roomId = useParams();
  const [roomName, setRoomName] = useState();
  const [roomSettings, setRoomSettings] = useState([]);
  const { user } = useSelector((state) => state.user);
  const [checkName, setCheckName] = useState(false);
  const [roomDetail, setRoomDetails] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [roomImage, setRoomImage] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const roomvalue = queryParams.get("roomid");
  const [metingProvider, setMeetingProvider] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  useEffect(() => {
    if (roomId) {
      fetchData(roomId.id);
      fetchRoomSettings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  useEffect(() => {
    if (roomSettings) {
      if (Duration) {
        if (roomSettings["glModeratorAccessCode"]?.value !== "false") {
          handleDeleteAccessCode("glModeratorAccessCode");
        }
        if (roomSettings["glAnyoneJoinAsModerator"]?.value === "true") {
          handleSwitchChange("glAnyoneJoinAsModerator", false);
        }
        if (roomSettings["glAnyoneCanStart"]?.value === "true") {
          handleSwitchChange("glAnyoneCanStart", false);
        }
      }
      if (Storage) {
        if (roomSettings["record"]?.value === "true") {
          handleSwitchChange("record", false);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomSettings, Duration, Storage]);

  const fetchData = async (id) => {
    try {
      const response = await apiClients.getOneRoom(id);
      if (response.data) {
        setRoomDetails(response.data);
        setRoomName(response.data.name);
        setRoomImage(response.data.cover_image_url);
        setMeetingProvider(response.data.provider);
      } else if (response.success === false) {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async (img, provider) => {
    try {
      if (roomName) {
        setCheckName(false);
        // const data = {
        //   id: Roomid || roomvalue,
        //   name: roomName,
        // };
        const formData = new FormData();
        formData.append("id", Roomid || roomvalue);
        formData.append("name", roomName);
        formData.append("image", img || null);
        formData.append("provider", provider || null);
        const response = await apiClients.updateRoom(formData);
        if (response.success === true) {
          setLoading(false);
          toast.success(response.message);
          getdata(roomId.id);
        }
        setLoading(false);
      } else {
        setLoading(false);
        setCheckName(true);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleDeleteRoom = async () => {
    try {
      const response = await apiClients.removeRoom(Roomid || roomvalue);
      if (response.success === true) {
        navigate("/room");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteConirmationOpen = () => {
    // setRoomId(id);
    setDeleteConfirm(true);
  };

  const handleDeleteConirmationClose = () => {
    setDeleteConfirm(false);
  };

  const fetchRoomSettings = async () => {
    try {
      const response = await apiClients.allRoomSetting(Roomid || roomvalue);
      if (response.data) {
        const settings = {};

        response?.data?.forEach((item) => {
          settings[item?.meeting_option?.name] = {
            id: item.id,
            // permissionName: item.permission.name,
            value: item.value,
          };
        });
        setRoomSettings(settings);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSwitchChange = (key, newValue) => {
    setRoomSettings((prevData) => {
      const id = prevData[key]?.id;
      let value = newValue;
      if (key === "guestPolicy") {
        if (newValue === true) {
          value = "ASK_MODERATOR";
        } else {
          value = "ALWAYS_ACCEPT";
        }
      }
      const updatedData = {
        ...prevData,
        [key]: { value: value.toString(), id },
      };
      return updatedData;
    });
    handleUpdateRoom_Settings(key, newValue);
  };

  const handleUpdateRoom_Settings = async (key, newValue) => {
    let value = newValue;
    if (key === "guestPolicy") {
      if (newValue === true) {
        value = "ASK_MODERATOR";
      } else {
        value = "ALWAYS_ACCEPT";
      }
    }
    const room_Id = roomSettings[key]?.id;
    const data = {
      value: value.toString(),
    };
    try {
      const response = await apiClients.updateRoomSettings(room_Id, data);
      if (response.message) {
        toast.success(response.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGenerateAccessCode = async (key) => {
    try {
      const id = roomSettings[key]?.id;
      const response = await apiClients.generateAccessCode_Viewers(id);
      if (response.message) {
        toast.success(response.message);
        fetchRoomSettings();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteAccessCode = async (key) => {
    try {
      const id = roomSettings[key]?.id;
      const response = await apiClients.deleteAccessCode_Viewers(id);
      if (response.message) {
        toast.success(response.message);
        fetchRoomSettings();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleCopyaccessCode_View = () => {
    navigator.clipboard.writeText(
      `${roomSettings["glViewerAccessCode"]?.value}`
    );
    toast.success("The access code has been copied.");
  };
  const handleCopyaccessCode_Moderator = () => {
    navigator.clipboard.writeText(
      `${roomSettings["glModeratorAccessCode"]?.value}`
    );
    toast.success("The access code has been copied.");
  };

  const isFileTypeValid = (file) => {
    const validTypes = ["image/png", "image/jpeg", "image/svg+xml"];
    return validTypes.includes(file.type);
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && isFileTypeValid(file)) {
      // setProfile(file);
      setUploadedImage(file);
      handleUpdate(file);
      // uploadProfile(file);
    } else {
      toast.error("Invalid file format. Please upload PNG, JPEG, or SVG.");
      // setSelectedFile(null);
    }
  };
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  // const handleRemoveImage = () => {
  //   setUploadedImage(null); // Clear the image
  // };

  const handleChange = (e) => {
    const { value } = e.target;
    setMeetingProvider(value);
    setLoading(true);
    handleUpdate(null, value);
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={8}>
          <Grid item xs={12} lg={6}>
            <Box>
              <Typography gutterBottom className="headcolor">
                Meeting Name
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Tooltip
                  title={
                    user?.user?.id === roomDetail?.user_id
                      ? ""
                      : "Access not available to edit"
                  }
                >
                  <TextField
                    disabled={
                      user?.user?.id === roomDetail?.user_id ? false : true
                    }
                    type="text"
                    placeholder="Enter a role name..."
                    value={roomName}
                    onChange={(e) => {
                      setCheckName(false);
                      setRoomName(e.target.value);
                    }}
                    fullWidth
                    InputProps={{
                      style: { height: "47px" },
                    }}
                    error={checkName}
                    helperText={checkName ? "Name is required" : ""}
                  />
                </Tooltip>

                <MainButton
                  disabled={
                    user?.user?.id === roomDetail?.user_id ? false : true
                  }
                  onClick={handleUpdate}
                >
                  update
                </MainButton>
              </Box>
              <Box>
                <Typography
                  gutterBottom
                  className="headcolor"
                  sx={{ mb: 1, mt: 1 }}
                >
                  {loading && (
                    <CircularProgress
                      size={"1rem"}
                      sx={{ color: "primary.main", mr: 1 }}
                    />
                  )}
                  Meeting Provider
                </Typography>
                <TextField
                  select
                  fullWidth
                  name="provider"
                  value={metingProvider || ""}
                  onChange={handleChange}
                  // error={!!errors.provider}
                  // helperText={errors.provider}
                  placeholder="Select Meeting Provider"
                >
                  <MenuItem value="zoom">
                    <Box display="flex" alignItems="center" gap={1}>
                      <img src={ZoomLogo} alt="Zoom" width={20} height={20} />
                      <Typography variant="body2">Zoom</Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value="bbb">
                    <Box display="flex" alignItems="center" gap={1}>
                      <img
                        src={BBBLogo}
                        alt="BigBlueButton"
                        width={20}
                        height={20}
                      />
                      <Typography variant="body2">BigBlueButton</Typography>
                    </Box>
                  </MenuItem>
                </TextField>
              </Box>
              <Box
                {...getRootProps()}
                sx={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px dashed grey",
                  padding: "16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  "&:hover": { borderColor: "blue" },
                  mt: 2,
                }}
              >
                <input {...getInputProps()} />
                {uploadedImage ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={URL.createObjectURL(uploadedImage)}
                      alt="Uploaded"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "200px",
                        borderRadius: "8px",
                        marginBottom: "8px",
                      }}
                    />

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
                      <EditIcon sx={{ fontSize: 20, color: "primary.main" }} />
                    </Box>
                  </Box>
                ) : roomImage ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={`${process.env.REACT_APP_OVERRIDE_HOST}/api/images/${roomImage}`}
                      alt="Uploaded"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "200px",
                        borderRadius: "8px",
                        marginBottom: "8px",
                      }}
                    />

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
                      <EditIcon sx={{ fontSize: 20, color: "primary.main" }} />
                    </Box>
                  </Box>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    Add Meeting Banner Image
                  </Typography>
                )}
              </Box>
            </Box>
            <Box mt={2}>
              <Box>
                <Typography gutterBottom className="headcolor">
                  Access code for viewers
                </Typography>

                {roomSettings["glViewerAccessCode"]?.value === "false" ? (
                  <SecondaryButton
                    onClick={() =>
                      handleGenerateAccessCode("glViewerAccessCode")
                    }
                  >
                    Generate
                  </SecondaryButton>
                ) : (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <TextField
                      type="text"
                      // placeholder="Enter a role name..."
                      value={roomSettings["glViewerAccessCode"]?.value}
                      name="name"
                      fullWidth
                      InputProps={{
                        style: { height: "47px" },
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleCopyaccessCode_View}>
                              <FileCopy />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <IconButton
                      onClick={() =>
                        handleGenerateAccessCode("glViewerAccessCode")
                      }
                    >
                      <CachedIcon />
                    </IconButton>
                    <IconButton
                      onClick={() =>
                        handleDeleteAccessCode("glViewerAccessCode")
                      }
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Box>
            <Box mt={2}>
              <Box>
                {roomDetail?.provider === "bbb" && (
                  <>
                    <Typography
                      gutterBottom
                      className="headcolor"
                      component="div"
                    >
                      Access code for moderators
                      <LightTooltip
                        title={
                          <>
                            <Box sx={{ textAlign: "center", width: "100%" }}>
                              <p>Moderator can access</p>
                            </Box>

                            <List>
                              {options.map((option, index) => (
                                <ListItem key={index}>
                                  <CheckIconStyled />
                                  {option}
                                </ListItem>
                              ))}
                            </List>
                          </>
                        }
                        arrow
                      >
                        <IconButton>
                          <ErrorTwoToneIcon />
                        </IconButton>
                      </LightTooltip>
                    </Typography>
                    {roomSettings["glModeratorAccessCode"]?.value ===
                    "false" ? (
                      <Tooltip
                        title={
                          Duration
                            ? "Duration limits exceeded.Upgrading to an add-on plan."
                            : ""
                        }
                      >
                        <span>
                          <SecondaryButton
                            disabled={Duration}
                            onClick={() =>
                              handleGenerateAccessCode("glModeratorAccessCode")
                            }
                          >
                            Generate
                          </SecondaryButton>
                        </span>
                      </Tooltip>
                    ) : (
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <TextField
                          type="text"
                          value={roomSettings["glModeratorAccessCode"]?.value}
                          name="name"
                          fullWidth
                          InputProps={{
                            style: { height: "47px" },
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={handleCopyaccessCode_Moderator}
                                >
                                  <FileCopy />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                        <IconButton
                          onClick={() =>
                            handleGenerateAccessCode("glModeratorAccessCode")
                          }
                        >
                          <CachedIcon />
                        </IconButton>
                        <IconButton
                          onClick={() =>
                            handleDeleteAccessCode("glModeratorAccessCode")
                          }
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      </Box>
                    )}
                  </>
                )}
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Typography gutterBottom className="headcolor">
              User Settings
            </Typography>
            {/* {user?.user?.subscription?.recording === "true" && ( )} */}
            {user?.permission?.CanRecord === "true" &&
              roomDetail?.provider === "bbb" && (
                <Box className="userSetting">
                  <Box>
                    <Typography variant="body1" gutterBottom>
                      Allow room to be recorded
                    </Typography>
                  </Box>
                  <Tooltip
                    title={
                      user?.user?.subscription?.recording !== "true"
                        ? "Upgrade your plan to unlock this feature."
                        : Storage
                        ? "Storage limits exceeded.Upgrading to an add-on plan."
                        : ""
                    }
                    arrow
                  >
                    <Box mb={1}>
                      <Switch
                        disabled={
                          user?.user?.subscription?.recording !== "true"
                            ? true
                            : Storage
                            ? true
                            : false
                        }
                        checked={
                          roomSettings["record"]?.value === "true"
                            ? true
                            : false
                        }
                        onChange={(event) =>
                          handleSwitchChange("record", event.target.checked)
                        }
                      />
                    </Box>
                  </Tooltip>
                </Box>
              )}

            <Box className="userSetting">
              <Box>
                <Typography variant="body1" gutterBottom>
                  Require users to be signed in before joining
                </Typography>
              </Box>
              <Box mb={1}>
                <Switch
                  checked={
                    roomSettings["glRequireAuthentication"]?.value === "true"
                      ? true
                      : false
                  }
                  onChange={(event) =>
                    handleSwitchChange(
                      "glRequireAuthentication",
                      event.target.checked
                    )
                  }
                />
              </Box>
            </Box>
            {roomDetail?.provider === "bbb" && (
              <Box className="userSetting">
                <Box>
                  <Typography variant="body1" gutterBottom>
                    Require moderator approval before joining
                  </Typography>
                </Box>
                <Box mb={1}>
                  <Switch
                    checked={
                      roomSettings["guestPolicy"]?.value === "ALWAYS_ACCEPT"
                        ? false
                        : true
                    }
                    onChange={(event) =>
                      handleSwitchChange("guestPolicy", event.target.checked)
                    }
                  />
                </Box>
              </Box>
            )}

            <Box className="userSetting">
              <Box>
                <Typography variant="body1" gutterBottom>
                  Allow any user to start this meeting
                </Typography>
              </Box>
              <Tooltip
                title={
                  Duration
                    ? "Duration limits exceeded.Upgrading to an add-on plan."
                    : ""
                }
              >
                <Box mb={1}>
                  <Switch
                    disabled={Duration}
                    checked={
                      roomSettings["glAnyoneCanStart"]?.value === "true"
                        ? true
                        : false
                    }
                    onChange={(event) =>
                      handleSwitchChange(
                        "glAnyoneCanStart",
                        event.target.checked
                      )
                    }
                  />
                </Box>
              </Tooltip>
            </Box>
            {roomDetail?.provider === "bbb" && (
              <Box className="userSetting">
                <Box>
                  <Typography variant="body1" gutterBottom>
                    All users join as moderators
                  </Typography>
                </Box>
                <Tooltip
                  title={
                    Duration
                      ? "Duration limits exceeded.Upgrading to an add-on plan."
                      : ""
                  }
                >
                  <Box mb={1}>
                    <Switch
                      disabled={Duration}
                      checked={
                        roomSettings["glAnyoneJoinAsModerator"]?.value ===
                        "true"
                          ? true
                          : false
                      }
                      onChange={(event) =>
                        handleSwitchChange(
                          "glAnyoneJoinAsModerator",
                          event.target.checked
                        )
                      }
                    />
                  </Box>
                </Tooltip>
              </Box>
            )}

            <Box className="userSetting">
              <Box>
                <Typography variant="body1" gutterBottom>
                  Mute users when they join
                </Typography>
              </Box>
              <Box mb={1}>
                <Switch
                  checked={
                    roomSettings["muteOnStart"]?.value === "true" ? true : false
                  }
                  onChange={(event) =>
                    handleSwitchChange("muteOnStart", event.target.checked)
                  }
                />
              </Box>
            </Box>
            {user?.user?.id === roomDetail?.user_id && (
              <Box className="deletebox">
                <Box mb={1}>
                  <Button onClick={handleDeleteConirmationOpen} className="deletRoom">
                    Delete Meeting
                  </Button>
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
      <DeleteConfirmation
        open={deleteConfirm}
        handleClose={handleDeleteConirmationClose}
        handleConfirm={handleDeleteRoom}
      />
    </div>
  );
}

export default Settings;
