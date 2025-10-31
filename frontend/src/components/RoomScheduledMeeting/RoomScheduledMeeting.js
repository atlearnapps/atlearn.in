import {
  Table,
  TableContainer,
  TableRow,
  Typography,
  Paper,
  TableHead,
  TableBody,
  Box,
  IconButton,
  Tooltip,
  TablePagination,
  MenuItem,
  Menu,
  Skeleton,
} from "@mui/material";
import {
  FacebookShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  WhatsappIcon,
  FacebookIcon,
  TelegramIcon,
  LinkedinIcon,
} from "react-share";
import React, { useEffect, useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Scrollbar from "src/components/scrollbar/Scrollbar";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VideoIcon from "src/images/Featured icon.svg";
import ShareIcon from "@mui/icons-material/Share";
import CommonTableCell from "../CommonTableCell/CommonTableCell";
import apiClients from "src/apiClients/apiClients";
import { formatDateRange } from "src/utils/formateDateRange";
import { calculateTimeDifference } from "src/utils/FormateDateUtils";
import EditIcon from "@mui/icons-material/Edit";
import ScheduleRoom from "src/pages/room/Moderator/SingleRoom/ScheduleRoom";
import SecondaryButton from "../Button/SecondaryButton/SecondaryButton";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { useTheme } from "@mui/material/styles";
import DeleteConfirmation from "src/components/confirmationPopup/confirmationPopup";

function RoomScheduledMeeting({ Roomid, room }) {
  const theme = useTheme();
  const url = window.location.origin;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [scheduledMeetings, setScheduledMeetings] = useState([]);
  const [sheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleData, setScheduleData] = useState(null);
  const [shareUrl, setShareUrl] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [deleteScheduleMeetingConfirm, setDeleteScheduleMeetngConfirm] =
    useState(false);
  const [scheduleRomId, setScheduleRoomId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleClick = (event, item) => {
    setShareUrl(
      `${window.location.origin}/Join-meeting?roomId=${room?.friendly_id}&scheduleId=${item?.id}`
    );
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    setLoading(true);
    if (Roomid) {
      fetchScheduleMeetings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Roomid, room]);

  const fetchScheduleMeetings = async (id) => {
    try {
      const response = await apiClients.get_room_scheduled_meetings(Roomid);
      if (response.data) {
        setScheduledMeetings(response.data);
        setLoading(false);
      } else {
        setScheduledMeetings([]);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
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

  const handleScheduleOpen = () => {
    setScheduleOpen(true);
  };

  const handleScheduleClose = () => {
    setScheduleOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCopy = (roomid, scheduled_id) => {
    navigator.clipboard.writeText(
      `${window.location.origin}/Join-meeting?roomId=${roomid}&scheduleId=${scheduled_id}`
    );
    toast.success(
      "The schedule meeting URL has been copied. The link can be used to join the meeting."
    );
  };
  const handleDeleteScheduleMeeingModal = (id) => {
    setScheduleRoomId(id);
    setDeleteScheduleMeetngConfirm(true);
  };

  const handleDeleteConirmationClose = () => {
    setDeleteScheduleMeetngConfirm(false);
  };

  const handleDeleteScheduleMeeing = async () => {
    try {
      const response = await apiClients.deleteScheduleMeeting(scheduleRomId);

      if (response.data.success === true) {
        toast.success(response.data.message);
        fetchScheduleMeetings();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // // Example of filtering and pagination logic
  // const filteredRecordings = sampleRecordings; // Apply any filtering logic here
  // const rowsPerPage = 2;
  // const page = 1;
  // const paginatedRecordings = filteredRecordings.slice(
  //   (page - 1) * rowsPerPage,
  //   page * rowsPerPage
  // );

  // console.log(paginatedRecordings);

  return (
    <div>
      {loading ? (
        <Skeleton
          variant="rectangular"
          sx={{ borderRadius: "12px" }}
          width={"100%"}
          height={400}
        />
      ) : scheduledMeetings?.length > 0 ? (
        <>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <SecondaryButton
              onClick={() => {
                handleScheduleOpen();
                setScheduleData(null);
              }}
            >
              {" "}
              <AddIcon fontSize="small" sx={{ marginRight: "10px" }} />
              Schedule Meeting
            </SecondaryButton>
          </Box>
          <Scrollbar>
            <TableContainer
              component={Paper}
              style={{ border: "1px solid #F4F6F8" }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <CommonTableCell>Date</CommonTableCell>
                    <CommonTableCell>Time</CommonTableCell>
                    <CommonTableCell>Duration</CommonTableCell>
                    <CommonTableCell>Price</CommonTableCell>
                    <CommonTableCell>Public View</CommonTableCell>
                    <CommonTableCell>Share</CommonTableCell>
                    <CommonTableCell>Action </CommonTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!scheduledMeetings?.length && (
                    <TableRow sx={{ height: "200px" }}>
                      <CommonTableCell
                        align="center"
                        colSpan={7}
                        style={{ borderBottom: "none" }}
                      >
                        No Scheduled Meeting
                      </CommonTableCell>
                    </TableRow>
                  )}
                  {(rowsPerPage > 0
                    ? scheduledMeetings?.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : scheduledMeetings
                  ).map((row, index) => (
                    <TableRow key={index}>
                      <CommonTableCell>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: {
                              md: "row",
                              xs: "column",
                            },
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <img src={VideoIcon} alt="VideoIcon" />
                          <Box>
                            <Typography>
                              {" "}
                              {
                                formatDateRange(row?.startDate, row?.endDate)
                                  .formattedStartDate
                              }
                            </Typography>
                          </Box>
                        </Box>
                      </CommonTableCell>

                      <CommonTableCell>
                        {
                          formatDateRange(row?.startDate, row?.endDate)
                            .formattedStartTime
                        }{" "}
                        -{" "}
                        {
                          formatDateRange(row?.startDate, row?.endDate)
                            .formattedEndTime
                        }{" "}
                        (IST)
                      </CommonTableCell>
                      <CommonTableCell>
                        {calculateTimeDifference(row?.startDate, row?.endDate)}
                      </CommonTableCell>
                      <CommonTableCell>{row?.price || "Free"}</CommonTableCell>
                      <CommonTableCell>
                        {row?.public_view ? "Yes" : "No"}
                      </CommonTableCell>

                      <CommonTableCell>
                        <Box>
                          <Tooltip title="Copy">
                            <IconButton
                              onClick={() =>
                                handleCopy(room?.friendly_id, row?.id)
                              }
                            >
                              <ContentCopyIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Share">
                            <IconButton
                              onClick={(e) => {
                                handleClick(e, row);
                              }}
                              size="small"
                              // sx={{ ml: 2 }}
                              aria-controls={open ? "account-menu" : undefined}
                              aria-haspopup="true"
                              aria-expanded={open ? "true" : undefined}
                            >
                              {/* <Avatar sx={{ width: 32, height: 32 }}>M</Avatar> */}
                              <ShareIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </CommonTableCell>
                      <CommonTableCell>
                        <Box>
                          <Tooltip title="View / Edit">
                            <IconButton
                              // disabled={notification ? true : false}
                              style={{
                                marginLeft: "4px",
                                color: "#007BFF",
                              }}
                              onClick={() => fetchSchedule(row?.id)} // You need to implement the edit functionality
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              onClick={() =>
                                handleDeleteScheduleMeeingModal(row?.id)
                              }
                            >
                              <DeleteOutlineIcon sx={{ color: "red" }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </CommonTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {scheduledMeetings?.length > 0 && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={scheduledMeetings?.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            )}
            {/* <Pagination
                    count={Math.ceil(recordings?.getFormat?.length / rowsPerPage)}
                    page={page}
                    onChange={handleChangePage}
                    style={{
                      marginTop: "16px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  /> */}
          </Scrollbar>
        </>
      ) : (
        <Box>
          <div
            style={{
              minHeight: "40vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              {/* <img  src={RecordIcon} alt="recordicon" /> */}
              <ScheduleIcon
                sx={{ fontSize: "3rem", color: theme.palette.primary.main }}
              />
              <h3 className="text-center text-primary">
                You don't have any scheduled meetings yet!
              </h3>

              <p className="text-center">
                Scheduled meetings will appear here once you create and schedule
                them.
              </p>
              <Box mt={2}>
                <SecondaryButton
                  onClick={() => {
                    handleScheduleOpen();
                    setScheduleData(null);
                  }}
                >
                  <AddIcon fontSize="small" sx={{ marginRight: "10px" }} />
                  Schedule Meeting
                </SecondaryButton>
              </Box>
            </Box>
          </div>
        </Box>
      )}

      {sheduleOpen && (
        <ScheduleRoom
          open={sheduleOpen}
          handleClosebox={handleScheduleClose}
          scheduleData={scheduleData}
          FetchRoomData={fetchScheduleMeetings}
          url={`${url}/Join-meeting?roomId=${room?.friendly_id}`}
          myMeeting={true}
          room={room}
        />
      )}

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem>
          {/* <WhatsappShareButton /> Profile */}
          <WhatsappShareButton url={shareUrl} quote={""} hashtag={""}>
            <WhatsappIcon size={30} round={true} />
          </WhatsappShareButton>{" "}
        </MenuItem>
        <MenuItem>
          <TelegramShareButton url={shareUrl} quote={""} hashtag={""}>
            <TelegramIcon size={30} round={true} />
          </TelegramShareButton>{" "}
        </MenuItem>
        <MenuItem>
          <FacebookShareButton url={shareUrl} quote={""} hashtag={""}>
            <FacebookIcon size={30} round={true} />
          </FacebookShareButton>{" "}
        </MenuItem>
        <MenuItem>
          <LinkedinShareButton url={shareUrl} quote={""} hashtag={""}>
            <LinkedinIcon size={30} round={true} />
          </LinkedinShareButton>{" "}
        </MenuItem>
      </Menu>

      <DeleteConfirmation
        open={deleteScheduleMeetingConfirm}
        handleClose={handleDeleteConirmationClose}
        handleConfirm={handleDeleteScheduleMeeing}
        message={"Are you sure you want to delete this scheduled meeting?"}
      />
    </div>
  );
}

export default RoomScheduledMeeting;
