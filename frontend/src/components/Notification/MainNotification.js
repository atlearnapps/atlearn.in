import {
  Avatar,
  Badge,
  Box,
  Card,
  CardContent,
  ClickAwayListener,
  Fade,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Popper,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import apiClients from "src/apiClients/apiClients";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MainButton from "../Button/MainButton/MainButton";
import {  fToNow } from "src/utils/formatTime";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
// styles
const ListItemWrapper = styled("div")(({ theme }) => ({
  cursor: "pointer",
  padding: 16,
  "&:hover": {
    background: theme.palette.gray,
  },
  "& .MuiListItem-root": {
    padding: 0,
  },
}));

function MainNotification() {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnReadCount] = useState(0);
  const [expanded, setExpanded] = useState(false);
  // const [scheduleId, setScheduleId] = useState([]);
  // const [notifications,setNotifications]=useState([])
  const theme = useTheme();

 
  useEffect(() => {
    // Fetch notifications immediately on mount
    fetchNotification();

    // Set an interval to fetch notifications every 1 minute (60000ms)
    const interval = setInterval(() => {
      fetchNotification();
    }, 60000); // 60000ms = 1 minute

    // Clear the interval on component unmount to avoid memory leaks
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (open && unreadCount > 0) {
      updateNotificationReadStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((previousOpen) => !previousOpen);
  };
  const handleClose = (event) => {
    setOpen(false);
  };

  const canBeOpen = open && Boolean(anchorEl);
  const id = canBeOpen ? "spring-popper" : undefined;

  const fetchNotification = async () => {
    try {
      const response = await apiClients.getNotification();
      if (response?.data) {
        setNotifications(response?.data);
        setUnReadCount(response?.unReadCount);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateNotificationReadStatus = async () => {
    try {
      const response = await apiClients.markAsRead();
      if (response) {
        fetchNotification();
        setUnReadCount(0);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      const data = {
        notificationId: id,
      };
      const response = await apiClients.deleteNotification(data);
      if (response.success === true) {
        fetchNotification();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteAllNotification = async()=>{
    try{
      const response = await apiClients.deleteNotificationById();
      if(response.success === true){
        fetchNotification();
      }
    }catch(error){
      console.log(error);
      
    }
  }

  return (
    <div>
      <Box>
        <IconButton aria-describedby={id} onClick={handleClick}>
          <Badge badgeContent={unreadCount} color="primary">
            <NotificationsNoneIcon color="action" sx={{fontSize:"1.8rem"}} />
          </Badge>
        </IconButton>
      </Box>
      <Popper
        sx={{
          zIndex: 1300, // Adjust the zIndex value as needed
        }}
        //   id={id} open={open} anchorEl={anchorEl} transition
        placement={"bottom"}
        open={open}
        anchorEl={anchorEl}
        role={undefined}
        transition
        disablePortal
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [5, 20],
            },
          },
        ]}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Fade {...TransitionProps}>
              <Paper>
                <Card sx={{ minWidth: 330 }}>
                  <CardContent>
                    <List
                      sx={{
                        width: "100%",
                        maxWidth: 330,
                        py: 0,
                        borderRadius: "10px",
                        [theme.breakpoints.down("md")]: {
                          maxWidth: 300,
                        },
                        "& .MuiListItemSecondaryAction-root": {
                          top: 22,
                        },
                        "& .MuiDivider-root": {
                          my: 0,
                        },
                        "& .list-container": {
                          pl: 7,
                        },
                      }}
                    >
                      {notifications?.length > 0 ? (
                        <>
                          <Box
                            sx={{
                              maxHeight: expanded ? "65vh" : "40vh", // Full screen height if expanded
                              overflowY: "auto",
                              px: 1,
                              transition: "max-height 0.3s ease", // Smooth transition effect
                              // border: '1px solid lightgray', // Optional: border for visual structure
                              borderRadius: 2,
                            }}
                          >
                            {notifications.map((item) => (
                              <ListItemWrapper
                                key={item?.id}
                                sx={{
                                  mb: 2,
                                  boxShadow: 2,
                                  borderRadius: 2,
                                  p: 2,
                                }}
                              >
                                <ListItem
                                  alignItems="center"
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: "primary.main" }}>
                                      <NotificationsNoneIcon fontSize="small" />
                                    </Avatar>
                                  </ListItemAvatar>
                                  <ListItemText
                                    primary={
                                      <Typography
                                        variant="subtitle1"
                                        fontWeight="bold"
                                      >
                                        {item?.title}
                                      </Typography>
                                    }
                                  />
                                  <Box>
                                    <IconButton
                                      onClick={() =>
                                        handleDeleteNotification(item?.id)
                                      }
                                      aria-label="delete"
                                    >
                                      <DeleteOutlineIcon
                                        sx={{ color: "red", fontSize: "20px" }}
                                      />
                                    </IconButton>
                                  </Box>
                                </ListItem>

                                <Grid
                                  container
                                  direction="column"
                                  className="list-container"
                                >
                                  <Grid item xs={12} sx={{ pb: 1 }}>
                                    <Typography
                                      variant="subtitle2"
                                      color="textSecondary"
                                    >
                                      {item?.message}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12}>
                                    {/* Displaying the timestamp below the message */}
                                    <Typography
                                      variant="caption"
                                      color="textSecondary"
                                      sx={{ textAlign: "right" }}
                                    >
                                      {fToNow(item?.created_at)}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </ListItemWrapper>
                            ))}
                          </Box>

                          {/* <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              mt: 2,
                            }}
                          >
                            <MainButton
                              variant="contained"
                              onClick={toggleExpand}
                              style={{ padding: "6px" }}
                            >
                              {expanded ? "See Less" : "See More"}
                            </MainButton>
                          </Box> */}
                 <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
        }}
      >
        {/* Delete All Button */}
        {notifications.length > 0 && (
          <MainButton
            variant="contained"
            color="error"
            onClick={handleDeleteAllNotification}
            style={{     padding: "4px 6px", fontSize:"14px" }}
          >
            Delete All
            <DeleteForeverIcon sx={{ ml: 1, fontSize:"20px" }} />
          </MainButton>
        )}

        {/* Centered See More Button */}
        <Box sx={{ flexGrow: 1, textAlign: "center" }}>
          <MainButton
            variant="contained"
            onClick={toggleExpand}
            style={{     padding: "4px 6px",fontSize:"14px" }}
          >
            {expanded ? "See Less" : "See More"}
          </MainButton>
        </Box>
      </Box>
                        </>
                      ) : (
                        <Grid item xs={12} sx={{ pb: 2 }}>
                          <Typography variant="subtitle2">
                            No notifications available.
                          </Typography>
                        </Grid>
                      )}
                    </List>
                  </CardContent>
                </Card>
              </Paper>
            </Fade>
          </ClickAwayListener>
        )}
      </Popper>
    </div>
  );
}

export default MainNotification;
