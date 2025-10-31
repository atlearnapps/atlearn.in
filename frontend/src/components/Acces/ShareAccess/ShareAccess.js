import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import SearchIcon from "@mui/icons-material/Search";
import {
  Avatar,
  Box,
  Checkbox,
  CircularProgress,
  Container,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  styled,
  TextField,
  Tooltip,
  tooltipClasses,
  Typography,
} from "@mui/material";
import apiClients from "src/apiClients/apiClients";
import { toast } from "react-toastify";
import MainButton from "src/components/Button/MainButton/MainButton";
import SecondaryButton from "src/components/Button/SecondaryButton/SecondaryButton";
import { useSelector } from "react-redux";
import CheckIcon from "@mui/icons-material/Check";
import ErrorTwoToneIcon from "@mui/icons-material/ErrorTwoTone";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} timeout={500} />;
});

export default function ShareAccess({ open, handleClose, Roomid }) {
  const { user } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [noUser, setNoUser] = useState(false);
  const [checked, setChecked] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState([]);

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
    "As a free user, you can only share access with other free users.",
    "If you're subscribed to a different plan with recording enabled, you can only share access with users who also have recording enabled.",
    "Students you can share access"
  ];

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

  const handleChange = (event) => {
    setChecked(event.target.checked);
    if (searchTerm && event.target.checked) {
      if (emailValid(searchTerm)) {
        setEmailError("");
      } else {
        setEmailError("Invalid email address");
      }
    } else {
      setEmailError("");
    }
  };

  function emailValid(email) {
    // const emailRegex = /^[a-z][a-z0-9._-]*@[a-z0-9.-]+\.[a-z]{2,}$/;
    const emailRegex = /^[a-z][a-z0-9._-]*@[a-z0-9-]+(\.[a-z]{2,}){1}$/;
    return emailRegex.test(email);
  }

  const handleSearchChange = (event) => {
    setEmailError("");
    const { value } = event.target;
    setSearchTerm(value);
    if (value.length >= 3) {
      handleSearchUser(value);
    } else {
      setFilteredUsers(selectedUserData);
      setUsers([]);
      setNoUser(false);
      // setSelectedUsers([]);
    }
  };

  // Helper function to add unique users to the data state
  function addUniqueUsers(sourceArray) {
    setFilteredUsers((prevData) => {
      const existingUserIds = new Set(prevData.map((user) => user.id));
      const newUsers = sourceArray.filter(
        (user) => !existingUserIds.has(user.id)
      );
      return [...prevData, ...newUsers];
    });
  }

  const handleSearchUser = async (userName) => {
    try {
      const data = {
        name: userName,
        RoomId: Roomid,
      };
      const response = await apiClients.shareable_users(data);
      if (response.data) {
        if (selectedUserData?.length > 0) {
          addUniqueUsers(selectedUserData);
        }
        addUniqueUsers(response.data);
        setUsers(response.data);
      } else {
        if (selectedUsers?.length === 0) {
          setFilteredUsers([]);
        } else if (selectedUserData?.length > 0) {
          setFilteredUsers(selectedUserData);
        }
        setUsers([]);
        setNoUser(true);
        // setSelectedUsers([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClosebox = () => {
    setEmailError("");
    setSearchTerm("");
    setUsers([]);
    setNoUser(false);
    setSelectedUsers([]);
    setSelectedUserData([]);
    setFilteredUsers([]);
    setChecked(false);
    handleClose();
  };

  const toggleUserSelection = (index) => {
    const updatedSelectedUsers = [...selectedUsers];
    if (updatedSelectedUsers.includes(index)) {
      updatedSelectedUsers.splice(updatedSelectedUsers.indexOf(index), 1);
      setFilteredUsers((prev) => {
        const filteredData = prev.filter((user) => user.id !== index);

        return filteredData;
      });
      setSelectedUserData((prev) => {
        const filteredData = prev.filter((user) => user.id !== index);

        return filteredData;
      });
    } else {
      updatedSelectedUsers.push(index);
    }
    // Update selected user data
    const newUserData = users.filter((user) =>
      updatedSelectedUsers.includes(user.id)
    );
    setSelectedUserData((prev) => {
      // Combine the previous state and new user data
      const combinedData = [...prev, ...newUserData];

      // Use a Map to filter out duplicates based on user IDs
      const uniqueData = Array.from(
        new Map(combinedData.map((user) => [user.id, user])).values()
      );

      return uniqueData;
    });

    setSelectedUsers(updatedSelectedUsers);
  };
  const handleShareClick = () => {
    // const selectedUserNames = selectedUsers.map((index) => users[index].id);
    const sharedData = selectedUsers.map((id) => ({
      user_id: id,
      room_id: Roomid,
    }));
    if (sharedData?.length) {
      handleShareRoomAccess(sharedData);
    }
  };

  const handleShareRoomAccess = async (data) => {
    try {
      const response = await apiClients.createSharedAccess(data);
      if (response.success === true) {
        toast.success(response.message);
        handleClosebox();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInviteUser = async () => {
    try {
      if (searchTerm) {
        if (emailValid(searchTerm)) {
          setEmailError("");
          const data = {
            email: searchTerm,
          };
          // eslint-disable-next-line no-unused-vars
          const response = apiClients.inviteNewUser(data);
          toast.success("The invite been successfully shared via email");
          handleClosebox();
        } else {
          setLoading(false);
          setEmailError("Invalid email address");
        }
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

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
          {"Share Room Access"}
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box sx={{ mt: 6 }}>
            <Container>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={12}>
                  <Box>
                    {checked && <Box m={1}> Email Address</Box>}

                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Search user name or email"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      error={Boolean(emailError)}
                      helperText={emailError}
                      InputProps={{
                        startAdornment: (
                          <IconButton
                            edge="start"
                            aria-label="search"
                            size="large"
                          >
                            <SearchIcon />
                          </IconButton>
                        ),
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Box>
                    {filteredUsers?.length > 0 ? (
                      <>
                        <Box m={1}>
                          Users
                          <LightTooltip
                            title={
                              <>
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
                            placement="right-end"
                          >
                            <IconButton>
                              <ErrorTwoToneIcon />
                            </IconButton>
                          </LightTooltip>
                        </Box>
                        <Divider />
                        {filteredUsers.map((item, index) => (
                          <>
                            <Box
                              key={index}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <LightTooltip
                                title={
                                  (user?.user.subscription?.recording ===
                                    "true" &&
                                    item.subscription?.recording === "true") ||
                                  (user?.user.subscription?.recording ===
                                    "false" &&
                                    item.subscription?.recording === "false") ||
                                  item?.role?.name === "Guest"
                                    ? ""
                                    : " You can't share access with this user."
                                }
                                arrow
                                placement="right-end"
                              >
                                <span>
                                  <Checkbox
                                    // disabled={
                                    //   (user?.user.subscription?.recording ===
                                    //     "true" &&
                                    //     item.subscription?.recording ===
                                    //       "true") ||
                                    //   (user?.user.subscription?.recording ===
                                    //     "false" &&
                                    //     item.subscription?.recording ===
                                    //       "false")
                                    //     ? false
                                    //     : true
                                    // }

                                    // disabled={
                                    //   item?.role?.name === "Guest" ?false:true
                                    // }
                                    disabled={
                                      (user?.user.subscription?.recording ===
                                        "true" &&
                                        item.subscription?.recording ===
                                          "true") ||
                                      (user?.user.subscription?.recording ===
                                        "false" &&
                                        item.subscription?.recording ===
                                          "false") ||
                                      item?.role?.name === "Guest"
                                        ? false
                                        : true
                                    }
                                    checked={selectedUsers.includes(item.id)}
                                    onChange={() =>
                                      toggleUserSelection(item.id)
                                    }
                                  />
                                </span>
                              </LightTooltip>

                              <Avatar
                                sx={{ width: 24, height: 24 }}
                                src="/broken-image.jpg"
                              />
                              {item.name}
                            </Box>
                          </>
                        ))}
                      </>
                    ) : (
                      <>
                        {noUser ? (
                          <>
                            <Typography sx={{ fontWeight: "700" }}>
                              No user found
                            </Typography>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={checked}
                                    onChange={handleChange}
                                  />
                                }
                                label="Invite them to join Atlearn"
                              />
                            </FormGroup>
                          </>
                        ) : (
                          <Typography sx={{ fontWeight: "700" }}>
                            Please type three (3) characters or more to show the
                            other users
                          </Typography>
                        )}
                      </>
                    )}

                    {/* <Divider /> */}
                  </Box>
                </Grid>
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
                  {checked ? (
                    <MainButton onClick={handleInviteUser}>
                      {loading && (
                        <CircularProgress
                          size={"1.2rem"}
                          sx={{ color: "white" }}
                        />
                      )}
                      <Box ml={loading ? 2 : 0}>Invite</Box>
                    </MainButton>
                  ) : (
                    <MainButton onClick={handleShareClick}>Share</MainButton>
                  )}
                </Grid>
              </Grid>
            </Container>
          </Box>
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleClosebox}>Disagree</Button>
          <Button onClick={handleClosebox}>Agree</Button>
        </DialogActions> */}
      </Dialog>
    </div>
  );
}
