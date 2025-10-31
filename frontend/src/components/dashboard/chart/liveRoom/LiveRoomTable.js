import {
  Box,
  CircularProgress,
  Container,
  IconButton,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Scrollbar from "src/components/scrollbar/Scrollbar";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import apiClients from "src/apiClients/apiClients";
import SearchIcon from "@mui/icons-material/Search";
import MainButton from "src/components/Button/MainButton/MainButton";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

function LiveRoomTable() {
  const rowsPerPage = 5;
  const [page, setPage] = React.useState(1);
  const [loadingRoom, setLoadingRoom] = useState(null);
  const [liveRooms, setLiveRooms] = useState([]);
  const [filterLiveRooms, setFilterLiveRoom] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    fetchLiveRooms();
  }, []);

  const handleChangePage = (event, newPage) => {
    const startIndex = (newPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    setFilterLiveRoom(liveRooms.slice(startIndex, endIndex));
    setPage(newPage);
  };

  const fetchLiveRooms = async () => {
    try {
      const response = await apiClients.liveRoom();
      if (response.data.filtered) {
        setLiveRooms(response.data.filtered);
        setFilterLiveRoom(response.data.filtered.slice(0, rowsPerPage));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleStartMeeting = async (id) => {
    setLoadingRoom(id);
    try {
      setLoading(true);
      const response = await apiClients.startMeeting(id);
      if (response.data) {
        setLoading(false);
        // window.location.href = response.data.joinModeratorUrl;
        window.open(response.data.joinModeratorUrl);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  const handleCopy = (id) => {
    // navigator.clipboard.writeText(`${window.location.origin}/room/${id}/join`);
    navigator.clipboard.writeText(
      `${window.location.origin}/Join-meeting?roomId=${id}`
    );
    toast.success(
      "The meeting URL has been copied. The link can be used to join the meeting."
    );
  };
  const handleJoinZoomMeeting = async (id) => {
    try {
      // const response = await apiClients.joinZoomMeeting();

      setLoading(true);
      let data = {
        name: user?.user?.name,
      };
      const friendly_id = id;
      // const response = await apiClients.joinMeeting(friendly_id, data);
      const response = await apiClients.joinZoomMeeting(friendly_id, data);
      if (response?.url) {
        window.location.href = response?.url;
      } else if (response.success === false) {
        toast.error(response.message);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      style={{
        marginBottom: "20px",
        background: "rgb(255, 255, 255)",
        minHeight: "42vh",
        borderRadius: "12px",
        boxShadow:
          "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px",
        transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
      }}
    >
      <Box
        sx={{
          backgroundColor: "primary.main",
          borderTopLeftRadius: "12px", // Rounded top left corner
          borderTopRightRadius: "12px",
          padding: "10px",
          color: "white",
        }}
      >
        <Typography variant="h5" sx={{ padding: "10px" }}>
          Live Rooms
        </Typography>
      </Box>

      <Scrollbar>
        <Container maxWidth={"600px"} sx={{ paddingBottom: "10px" }}>
          <TableContainer
            component={Paper}
            style={{
              border: "1px solid #F4F6F8",
              minHeight: "300px",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          >
            {!filterLiveRooms?.length ? (
              <div
                style={{
                  width: "100%",
                  height: "300px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  // marginTop: "10px",
                }}
              >
                <SearchIcon
                  sx={{
                    color: "#6D207B", // A lighter shade of blue
                    fontSize: "4rem", // Adjust size as needed
                  }}
                />
                <div>
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "#E8063C" }}
                    // style={{
                    //   fontSize: "1.6rem",
                    // }}
                  >
                    No Live Rooms
                  </Typography>
                  {/* {searchTerm && (
                    <div style={{ marginBottom: "30px" }}>
                      {`Could not find any results for "${searchTerm}"`}
                    </div>
                  )} */}
                </div>
              </div>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Owner</TableCell>
                    <TableCell>Room ID</TableCell>
                    <TableCell>Participants</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filterLiveRooms?.map((row, index) => (
                    <TableRow
                      sx={{
                        "&:hover": {
                          backgroundColor: "#F4F6F8",
                        },
                      }}
                      key={index}
                    >
                      <TableCell>{row?.name}</TableCell>
                      <TableCell>{row?.user?.name} </TableCell>
                      <TableCell>{row?.friendly_id}</TableCell>
                      <TableCell>{row?.participants}</TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Copy">
                          <IconButton
                            onClick={(e) => {
                              handleCopy(row.friendly_id);
                            }}
                          >
                            <ContentCopyIcon sx={{ color: "#6D207B" }} />
                          </IconButton>
                        </Tooltip>
                        <MainButton
                          onClick={(e) => {
                            // e.stopPropagation();
                            row?.provider === "zoom"
                              ? handleJoinZoomMeeting(row.friendly_id)
                              : handleStartMeeting(row.friendly_id);
                          }}
                          style={{ padding: "2px 30px" }}
                        >
                          {loading && loadingRoom === row.friendly_id && (
                            <CircularProgress
                              size={"1.2rem"}
                              sx={{ color: "white" }}
                            />
                          )}
                          <Box ml={loading ? 2 : 0}> join</Box>
                        </MainButton>
                        {/* <IconButton>
                        <DeleteOutlineIcon />
                      </IconButton> */}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TableContainer>
          {filterLiveRooms?.length > 0 && (
            <Pagination
              count={Math.ceil(liveRooms.length / rowsPerPage)}
              page={page}
              onChange={handleChangePage}
              style={{
                marginTop: "16px",
                display: "flex",
                justifyContent: "center",
              }}
            />
          )}
        </Container>
      </Scrollbar>
    </div>
  );
}

export default LiveRoomTable;
