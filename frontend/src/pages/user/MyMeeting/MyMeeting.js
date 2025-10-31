import {
  Box,
  Card,
  Container,
  IconButton,
  MenuItem,
  Paper,
  Popover,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import apiClients from "src/apiClients/apiClients";
import Scrollbar from "src/components/scrollbar/Scrollbar";
import EditIcon from "@mui/icons-material/Edit";
import ScheduleRoom from "src/pages/room/Moderator/SingleRoom/ScheduleRoom";
import Notification from "src/components/Notification/expiredNotification";
import CommonTableCell from "src/components/CommonTableCell/CommonTableCell";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useNavigate } from "react-router-dom";
import MainButton from "src/components/Button/MainButton/MainButton";
import AddIcon from "@mui/icons-material/Add";
import NewRoom from "src/components/NewRoom/NewRoom";
import { toast } from "react-toastify";
import Iconify from "src/components/iconify";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteConfirmation from "src/components/confirmationPopup/confirmationPopup";
import extractTime from "src/utils/extractTime";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useSelector } from "react-redux";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Helmet } from "react-helmet";
import formatDurationFromMilliseconds from "src/utils/formatDurationFromMilliseconds";
import { BASE_URL } from "src/apiClients/config";

const columns = [
  "Meeting Name",
  "Last Session",
  "Recordings",
  "Duration",
  "Participants",
  "Online",
  "Scheduled Meetings",
  "Action",
];

function MyMeeting() {
  const { user } = useSelector((state) => state.user);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rooms, setRooms] = useState([]);
  const [filterRooms, setFilterRoom] = useState([]);
  const [sheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleData, setScheduleData] = useState(null);
  const [notification, setNotfication] = useState(false);
  const [openCreateRoom, setOpenCreateRoom] = useState(false);
  const [open, setOpen] = useState(null);
  const [singleRoom, setSingleRoom] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteScheduleMeetingConfirm, setDeleteScheduleMeetngConfirm] =
    useState(false);
  const [scheduleRomId, setScheduleRoomId] = useState(null);

  const navigate = useNavigate();
  const url = window.location.origin;
  useEffect(() => {
    FetchRoomData();
  }, []);

  const handleScheduleOpen = () => {
    setOpen(false);
    setScheduleOpen(true);
  };
  const handleScheduleClose = () => {
    setScheduleOpen(false);
  };
  const FetchRoomData = async () => {
    try {
      const response = await apiClients.getScheduleMeeting();
      if (response.data) {
        setRooms(response.data);
        setFilterRoom(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSchedule = async (id) => {
    try {
      const response = await apiClients.getsingleScheduleMeeting(id);
      if (response.data) {
        setScheduleData(response.data);
        handleScheduleOpen();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateRoom = async (value, price, image, type,provider) => {
    // const data = {
    //   name: value,
    // };
    const formData = new FormData();
    formData.append("name", value);
    formData.append("image", image);
    formData.append("room_type", type);
    formData.append("provider", provider);
    try {
      const response = await apiClients.createRooms(formData);
      if (response) {
        FetchRoomData();
      }
      if (response.success === true) {
        toast.success(response.message);
      }
    } catch (error) {
      console.log();
    }
  };
  const handleDeleteRoom = async () => {
    try {
      const response = await apiClients.removeRoom(singleRoom?.id);
      if (response.success === true) {
        setOpen(false);
        FetchRoomData();
      }else if (response.success === false) {
        setOpen(false);
        toast.error(response.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rooms?.length - page * rowsPerPage);

  const handleClickOpen = () => {
    setOpenCreateRoom(true);
  };
  const handleClickClose = () => {
    setOpenCreateRoom(false);
  };
  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleOpenMenu = (event, data) => {
    setScheduleData(null);
    setSingleRoom(data);
    setOpen(event.currentTarget);
  };
  const navigateRoomSettings = () => {
    navigate(
      `/room/${singleRoom?.friendly_id}?settings=true&roomid=${singleRoom.id}`
    );
  };
  const handleDeleteConirmationOpen = () => {
    setOpen(false);
    setDeleteConfirm(true);
  };

  const handleDeleteConirmationClose = () => {
    setDeleteConfirm(false);
    setDeleteScheduleMeetngConfirm(false);
  };

  const handleDeleteScheduleMeeingModal = (id) => {
    setScheduleRoomId(id);
    setDeleteScheduleMeetngConfirm(true);
  };

  const handleDeleteScheduleMeeing = async () => {
    try {
      const response = await apiClients.deleteScheduleMeeting(scheduleRomId);

      if (response.data.success === true) {
        toast.success(response.data.message);
        FetchRoomData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCopy = (roomid, scheduled_id) => {
    navigator.clipboard.writeText(
      `${window.location.origin}/Join-meeting?roomId=${roomid}&scheduleId=${scheduled_id}`
    );
    toast.success(
      "The schedule meeting URL has been copied. The link can be used to join the meeting."
    );
  };

  return (
    <div>
      <Helmet>
        <title>My Meetings | Manage Your Online Classes on Atlearn</title>
        <meta
          name="description"
          content="Access and manage your scheduled meetings with Atlearn’s online classroom platform. Stay organized for seamless virtual learning sessions."
        />
        <link rel="canonical" href={`${BASE_URL}/settings/mymeeting`} />

      </Helmet>
      <Box sx={{ mb: 2 }}>
        <Notification setNotfication={setNotfication} />
      </Box>

      <Container maxWidth={"xl"}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Box sx={{ mb: { xs: 2, md: 0 } }}>
            <Typography    style={{ fontSize: "2rem", fontWeight: 400 }}>My Meetings</Typography>
            {user?.user?.duration_spent > 0 && (
              <Box
                sx={{
                  backgroundColor: "#f0f4f8",
                  padding: "10px",
                  borderRadius: "8px",
                  display: "inline-block",
                  marginTop: "10px",
                }}
              >
                <Typography variant="body1" sx={{ color: "#3f51b5" }}>
                  Hours spent : {formatDurationFromMilliseconds(user?.user?.duration_spent)}
                </Typography>
              </Box>
            )}
          </Box>
          <Tooltip
            title={
              user?.permission?.["RoomLimit"] <= rooms?.length
                ? "Room limit reached. Cannot create more rooms."
                : ""
            }
            enterTouchDelay={0}
            arrow
          >
            <Box>
              <MainButton
                disabled={
                  user?.permission?.["RoomLimit"] <= rooms?.length ||
                  user?.user?.expired === true
                    ? true
                    : false
                }
                onClick={handleClickOpen}
              >
                <AddIcon sx={{ mr: 1 }} />
                New Meeting
              </MainButton>
            </Box>
          </Tooltip>
        </Stack>
        <Card>
          <Scrollbar>
            <Box>
              <TableContainer
                style={{ border: "1px solid #F4F6F8" }}
                component={Paper}
              >
                <Table sx={{ minHeight: "30vh" }}>
                  <TableHead>
                    <TableRow>
                      {columns.map((column, index) => (
                        <CommonTableCell
                          align="center"
                          //   sx={{ whiteSpace: "nowrap" }}
                          key={index}
                          style={{ minWidth: "25%" }}
                        >
                          {column}
                        </CommonTableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!filterRooms?.length && (
                      <TableRow sx={{ height: "100px" }}>
                        <CommonTableCell
                          align="center"
                          colSpan={columns.length}
                          style={{ borderBottom: "none" }}
                        >
                          No Meeting Found
                        </CommonTableCell>
                      </TableRow>
                    )}
                    {(rowsPerPage > 0
                      ? filterRooms?.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                      : filterRooms
                    ).map((row, index) => (
                      <TableRow
                        sx={
                          {
                            // "&:hover": {
                            //   backgroundColor: "#F4F6F8",
                            // },
                          }
                        }
                        key={index}
                      >
                        <CommonTableCell
                          align="center"
                          style={{ minWidth: "25%" }}
                        >
                          {row?.name || "-"}
                        </CommonTableCell>
                        <CommonTableCell
                          align="center"
                          style={{ minWidth: "25%" }}
                        >
                          {row?.last_session
                            ? row?.last_session
                            : "No previous session created"}
                        </CommonTableCell>
                        <CommonTableCell
                          style={{ cursor: "pointer" }}
                          onClick={() => navigate(`/room/${row?.friendly_id}`)}
                          align="center"
                        >
                          <VisibilityOutlinedIcon sx={{ color: "blue" }} />
                          View
                        </CommonTableCell>
                        <CommonTableCell
                          align="center"
                          style={{ minWidth: "25%" }}
                        >
                          {formatDurationFromMilliseconds(parseInt(row?.room_duration, 10)) ||
                            0}
                        </CommonTableCell>
                        <CommonTableCell
                          align="center"
                          style={{ minWidth: "25%" }}
                        >
                          {row?.participants || "0"}
                        </CommonTableCell>
                        <CommonTableCell
                          align="center"
                          style={{ minWidth: "25%" }}
                        >
                          <span
                            style={{
                              color: row?.online === true ? "green" : "red",
                              fontWeight: 500,
                              padding: "5px 10px",
                              borderRadius: "5px",
                              backgroundColor:
                                row?.status === "active"
                                  ? "#e0f2e9"
                                  : "#f2e0e0",
                              fontSize: "14px",
                            }}
                          >
                            {row?.online === true ? "Yes" : "No"}
                          </span>
                        </CommonTableCell>

                        <CommonTableCell align="center">
                          {row?.existingMeetings &&
                          row?.existingMeetings?.length > 0 ? (
                            row?.existingMeetings?.map((meeting) => (
                              <Typography
                                key={meeting?.id}
                                style={{
                                  backgroundColor: "#F4F6F8",
                                  padding: "4px",
                                  border: "1px solid #F4F6F8",
                                  borderRadius: "5px",
                                  marginBottom: "2px",
                                  cursor: notification
                                    ? "not-allowed"
                                    : "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {extractTime(
                                  meeting?.startDate,
                                  meeting?.endDate
                                )}
                                <Tooltip title="Copy Link">
                                  <IconButton
                                    disabled={notification ? true : false}
                                    onClick={() =>
                                      handleCopy(row?.friendly_id, meeting?.id)
                                    } // You need to implement the edit functionality
                                  >
                                    <ContentCopyIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Edit">
                                  <IconButton
                                    disabled={notification ? true : false}
                                    style={{
                                      marginLeft: "4px",
                                      color: "#007BFF",
                                    }}
                                    onClick={() => fetchSchedule(meeting?.id)} // You need to implement the edit functionality
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <IconButton
                                    disabled={notification ? true : false}
                                    sx={{ color: "error.main" }}
                                    onClick={() =>
                                      handleDeleteScheduleMeeingModal(
                                        meeting?.id
                                      )
                                    } // You need to implement the edit functionality
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                              </Typography>
                            ))
                          ) : (
                            <Typography>No scheduled meetings</Typography>
                          )}
                        </CommonTableCell>
                        <CommonTableCell
                          align="center"
                          style={{ minWidth: "25%", cursor: "pointer" }}
                        >
                          <Tooltip
                            title={
                              user?.user?.expired
                                ? "Your plan has expired. Please upgrade to continue. "
                                : ""
                            }
                          >
                            <span>
                              <IconButton
                                disabled={
                                  user?.user?.expired === true ? true : false
                                }
                                size="large"
                                color="inherit"
                                onClick={(event) => handleOpenMenu(event, row)}
                              >
                                <Iconify icon={"eva:more-vertical-fill"} />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </CommonTableCell>
                      </TableRow>
                    ))}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <CommonTableCell colSpan={columns.length} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {filterRooms?.length > 0 && (
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  component="div"
                  count={rooms?.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              )}
            </Box>
          </Scrollbar>

          <Popover
            open={Boolean(open)}
            anchorEl={open}
            onClose={handleCloseMenu}
            anchorOrigin={{ vertical: "top", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
              sx: {
                p: 1,
                // width: ,
                "& .MuiMenuItem-root": {
                  px: 1,
                  typography: "body2",
                  borderRadius: 0.75,
                },
              },
            }}
          >
            <MenuItem onClick={navigateRoomSettings}>
              <SettingsIcon sx={{ mr: 2, color: "primary.main" }} />
              Settings
            </MenuItem>

            <MenuItem
              onClick={handleScheduleOpen}
              sx={{ color: "primary.main" }}
            >
              <CalendarMonthIcon sx={{ mr: 2 }} />
              Schedule New Meeting
            </MenuItem>
            <MenuItem
              onClick={handleDeleteConirmationOpen}
              sx={{ color: "error.main" }}
            >
              <DeleteIcon sx={{ mr: 2 }} />
              Delete
            </MenuItem>
          </Popover>
          {/* </Container> */}
        </Card>
      </Container>
      {sheduleOpen && (
        <ScheduleRoom
          open={sheduleOpen}
          handleClosebox={handleScheduleClose}
          scheduleData={scheduleData}
          FetchRoomData={FetchRoomData}
          room={singleRoom}
          // url={`${url / singleRoom?.friendly_id}/join`}
          url={`${url}/Join-meeting?roomId=${singleRoom?.friendly_id}`}
          myMeeting={true}
        />
      )}
      <NewRoom
        open={openCreateRoom}
        handleClose={handleClickClose}
        handleCreateRoom={handleCreateRoom}
      />
      <DeleteConfirmation
        open={deleteConfirm || deleteScheduleMeetingConfirm}
        handleClose={handleDeleteConirmationClose}
        handleConfirm={
          deleteScheduleMeetingConfirm
            ? handleDeleteScheduleMeeing
            : handleDeleteRoom
        }
      />
    </div>
  );
}

export default MyMeeting;
