import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Popover,
  MenuItem,
  TextField,
  Box,
  InputAdornment,
  CircularProgress,
  Pagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Iconify from "src/components/iconify/Iconify";
import apiClients from "src/apiClients/apiClients";
import { useNavigate } from "react-router-dom";
import DeleteConfirmation from "src/components/confirmationPopup/confirmationPopup";
import CancelPresentationOutlinedIcon from "@mui/icons-material/CancelPresentationOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
// import ViewIcon from "src/components/NavIcons/ViewIcon";
import ResyncIcon from "src/components/NavIcons/ResyncIcon";
import DeleteIcons from "src/components/NavIcons/DeleteIcons";
import Animations from "src/components/Loader";
import CommonTableCell from "src/components/CommonTableCell/CommonTableCell";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import formatDateUtils from "src/utils/FormateDateUtils";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import SettingsIcon from "@mui/icons-material/Settings";

const TableWithPagination = () => {
  const columns = [
    "Room Name",
    "Room Owner",
    "Room ID",
    "Recordings",
    "Created",
    "Participants",
    "Status",
    "Action",
  ];
  const navigate = useNavigate();
  const perpage = 5;
  const [page, setPage] = useState(1);
  // const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [room, setRoom] = useState();
  const [filterRoom, setFilterRoom] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [stopMeetingLoader, setStopMeetingLoader] = useState(false);
  const [cancelIcon, setCancelIcon] = useState(false);
  const [loader, setLoader] = useState(true);
  const [syncLoader, setSyncLoader] = useState(false);
  const [lastPage, setLastPage] = useState();

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perpage]);

  const fetchData = async () => {
    try {
      setLoader(true);
      const response = await apiClients.getAllRooms(page, perpage, false);
      if (response.data) {
        setLastPage(response.pagination.lastPage);
        setRoom(response);
        setFilterRoom(response?.data);
        setLoader(false);
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  const handleStart = async () => {
    try {
      setLoading(true);
      const response = await apiClients.startMeeting(data.friendly_id);
      if (response.data) {
        window.open(response.data.joinModeratorUrl);
        setLoading(false);
        handleCloseMenu();
        fetchData();
        // window.location.href = response.data.joinModeratorUrl;
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const navigateRoomSettings = () => {
    navigate(`/room/${data?.friendly_id}?settings=true&roomid=${data.id}`);
  };

  const handleSyncRecord = async () => {
    try {
      setSyncLoader(true);
      const response = await apiClients.roomRecord(data.friendly_id);
      if (response.data) {
        toast.success("The room recordings have been synchronized.");
        setSyncLoader(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleStopMeeting = async () => {
    try {
      setStopMeetingLoader(true);
      const response = await apiClients.endMeeting(data.friendly_id);
      if (response) {
        setStopMeetingLoader(false);
        handleCloseMenu();
        if (response.success === true) {
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
        fetchData();
      }
    } catch (error) {
      setStopMeetingLoader(false);
      console.log(error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // const handleView = async () => {
  //   navigate(`/room/${data.friendly_id}`);
  // };

  const handleDelete = async () => {
    try {
      const response = await apiClients.removeRoom(data.id);
      if (response) fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchChange = (event) => {
    setCancelIcon(true);
    const { value } = event.target;
    setSearchTerm(value);
    const filtered = room?.data?.filter((room) =>
      room.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilterRoom(filtered);
  };

  const cancelSearch = () => {
    setSearchTerm("");
    const value = "";
    const filtered = room?.data?.filter((room) =>
      room.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilterRoom(filtered);
    setCancelIcon(false);
  };

  const handleOpenMenu = (event, data) => {
    setOpen(event.currentTarget);
    setData(data);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };
  const deleteUser = () => {
    setOpen(false);
    setDeleteModal(true);
  };
  const deleteUserClose = () => {
    setDeleteModal(false);
  };

  // const handleNextPage = () => {
  //   setPage((prevPage) => prevPage + 1);
  // };

  // const handlePrevPage = () => {
  //   setPage((prevPage) => prevPage - 1);
  // };

  return (
    <>
      {loader ? (
        <div style={{ margin: "30px" }}>
          {" "}
          <Animations />{" "}
        </div>
      ) : (
        <>
          <Box m={2}>
            <TextField
              className="homeSearch"
              label="Search"
              placeholder="Enter room name "
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              size="small"
              InputProps={{
                endAdornment: cancelIcon ? (
                  <InputAdornment position="end">
                    <IconButton onClick={cancelSearch}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : (
                  <InputAdornment position="end"></InputAdornment>
                ),
              }}
            />
          </Box>
          <TableContainer style={{ border: "1px solid #F4F6F8" }}>
            {!filterRoom?.length ? (
              <div style={{ textAlign: "center", marginTop: "10px" }}>
                <SearchIcon
                  sx={{
                    color: "#0078D4", // A lighter shade of blue
                    fontSize: "5rem", // Adjust size as needed
                  }}
                />
                <div>
                  <div
                    style={{
                      fontSize: "2rem",
                      marginTop: "10px",
                      marginBottom: "20px",
                    }}
                  >
                    No Rooms Found
                  </div>
                  {searchTerm && (
                    <div style={{ marginBottom: "30px" }}>
                      {`Could not find any results for "${searchTerm}"`}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    {columns.map((column, index) => (
                      <CommonTableCell
                        // sx={{ whiteSpace: "nowrap" }}
                        key={index}
                      >
                        {column}
                      </CommonTableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filterRoom?.map((row, index) => (
                    <TableRow
                      sx={{
                        "&:hover": {
                          backgroundColor: "#F4F6F8",
                        },
                      }}
                      key={index}
                    >
                      <CommonTableCell>{row?.name}</CommonTableCell>
                      <CommonTableCell>{row?.user?.name}</CommonTableCell>
                      <CommonTableCell>{row?.friendly_id}</CommonTableCell>
                      <CommonTableCell
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate(`/room/${row?.friendly_id}`)}
                        // align="center"
                      >
                        <VisibilityOutlinedIcon sx={{ color: "blue" }} />
                        View
                      </CommonTableCell>
                      <CommonTableCell>
                        {formatDateUtils(new Date(row?.created_at))}
                      </CommonTableCell>
                      {/* <CommonTableCell>{row?.last_session}</CommonTableCell> */}
                      <CommonTableCell>{row?.participants}</CommonTableCell>

                      <CommonTableCell>
                        {row?.online === false ? (
                          <span
                            style={{
                              color: "white",
                              backgroundColor: "#dc3545",
                              padding: "4px",
                              border: "1px solid #dc3545",
                              borderRadius: "5px",
                            }}
                          >
                            Not Running
                          </span>
                        ) : (
                          <span
                            style={{
                              color: "white",
                              backgroundColor: "green",
                              padding: "4px",
                              border: "1px solid green",
                              borderRadius: "5px",
                            }}
                          >
                            Online
                          </span>
                        )}
                      </CommonTableCell>

                      <CommonTableCell align="left">
                        <IconButton
                          size="large"
                          color="inherit"
                          onClick={(event) => handleOpenMenu(event, row)}
                        >
                          <Iconify icon={"eva:more-vertical-fill"} />
                        </IconButton>
                      </CommonTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TableContainer>
          {filterRoom?.length > 0 && (
            <Pagination
              // count={Math.ceil(filteredRecordings.length / rowsPerPage)}
              count={lastPage}
              page={page}
              onChange={handleChangePage}
              style={{
                marginTop: "16px",
                display: "flex",
                justifyContent: "center",
              }}
            />
          )}

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
            <MenuItem onClick={handleStart}>
              {loading ? (
                <CircularProgress
                  size={"1.2rem"}
                  sx={{ marginRight: "10px" }}
                />
              ) : (
                <PlayCircleOutlineIcon sx={{ mr: 2, color: "#6D207B" }} />
              )}
              {data?.online ? "Join " : "Start"}
            </MenuItem>
            {data?.online &&
              (stopMeetingLoader ? (
                <MenuItem
                  onClick={handleStopMeeting}
                  sx={{ color: "error.main" }}
                >
                  <CircularProgress
                    size={"1.2rem"}
                    sx={{ color: "red", marginRight: "10px" }}
                  />
                  Stop Meeting
                </MenuItem>
              ) : (
                <MenuItem
                  onClick={handleStopMeeting}
                  sx={{ color: "error.main" }}
                >
                  <CancelPresentationOutlinedIcon sx={{ mr: 2 }} />
                  Stop Meeting
                </MenuItem>
              ))}

            {/* {data?.online && (
          <MenuItem onClick={handleStopMeeting} sx={{ color: "error.main" }}>
            <CancelPresentationOutlinedIcon sx={{ mr: 2 }} />
            Stop Meeting
          </MenuItem>
        )}
          */}

            <MenuItem onClick={navigateRoomSettings}>
              <SettingsIcon sx={{ mr: 2, color: "primary.main" }} />
              Settings
            </MenuItem>
            <MenuItem onClick={handleSyncRecord}>
              {syncLoader ? (
                <CircularProgress
                  size={"1.2rem"}
                  sx={{ marginRight: "10px" }}
                />
              ) : (
                <ResyncIcon sx={{ mr: 2 }} />
              )}
              Re-Sync Recordings
            </MenuItem>
            {/* <MenuItem>
          <ResyncIcon sx={{ mr: 2 }} />
          Re-Sync Recordings
        </MenuItem> */}
            <MenuItem onClick={deleteUser} sx={{ color: "error.main" }}>
              <DeleteIcons sx={{ color: "red", mr: 2 }} />
              Delete
            </MenuItem>
          </Popover>
          <DeleteConfirmation
            open={deleteModal}
            handleClose={deleteUserClose}
            handleConfirm={handleDelete}
          />
        </>
      )}
    </>
  );
};

export default TableWithPagination;
