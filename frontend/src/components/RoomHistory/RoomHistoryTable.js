import {
  Container,
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
  Skeleton,
} from "@mui/material";

import React, { useState, useEffect } from "react";
import Scrollbar from "src/components/scrollbar/Scrollbar";
import { Pagination } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import apiClients from "src/apiClients/apiClients";
import PlayCircleFilledWhiteOutlinedIcon from "@mui/icons-material/PlayCircleFilledWhiteOutlined";
import CommonTableCell from "src/components/CommonTableCell/CommonTableCell";
import NoRecordings from "../Recordings/NoRecordings";
function RoomHistoryTable({ meeting_id }) {
  const rowsPerPage = 5;
  const [page, setPage] = React.useState(1);
  const [lastPage, setLastPage] = useState();
  const [filteredRecordings, setFilteredRecordings] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, meeting_id]);

  const fetchData = async () => {
    if (!meeting_id) {
      return;
    }
    try {
      const response = await apiClients.getAllAnalyticsByMeetingId(
        meeting_id,
        page,
        rowsPerPage
      );
      if (response.data) {
        setLastPage(response.pagination.lastPage);
        setFilteredRecordings(response.data);
        setLoader(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handlePlay = (rowData) => {
    if (!rowData?.internal_id) {
      console.log("Internal Id have issues");
    }
    const analyticsURL = `${process.env.REACT_APP_MEETING_HOST}/learning-analytics-dashboard/?meeting=${rowData?.internal_id}&report=${rowData?.dashboard_access_token}`;
    // window.open(analyticsURL);
    window.location.href = analyticsURL;
  };

  function tsToHHmmss(ts) {
    return new Date(ts).toISOString().substr(11, 8);
  }

  return (
    <div>
      {loader ? (
        <Skeleton
          variant="rectangular"
          sx={{ borderRadius: "12px" }}
          width={"100%"}
          height={400}
        />
      ) : filteredRecordings?.length > 0 ? (
        <>
          <Scrollbar>
            <Container maxWidth={"xl"}>
              <TableContainer
                style={{ border: "1px solid #F4F6F8", minHeight: "300px" }}
                component={Paper}
              >
                {!filteredRecordings?.length ? (
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
                        style={{
                          fontSize: "1.6rem",
                          color: "#E8063C",
                        }}
                      >
                        No Records Found
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
                        <CommonTableCell>Meeting Id</CommonTableCell>
                        <CommonTableCell>Started On</CommonTableCell>
                        <CommonTableCell>Ended On</CommonTableCell>
                        <CommonTableCell>Participant</CommonTableCell>
                        <CommonTableCell>Duration</CommonTableCell>
                        <CommonTableCell>Actions</CommonTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredRecordings?.map((row, index) => (
                        <TableRow
                          sx={{
                            "&:hover": {
                              backgroundColor: "#F4F6F8",
                            },
                          }}
                          key={index}
                        >
                          <CommonTableCell>{row?.meeting_id}</CommonTableCell>
                          <CommonTableCell>
                            {row?.created_on
                              ? new Date(+row.created_on).toLocaleString()
                              : "No Date"}
                          </CommonTableCell>
                          <CommonTableCell>
                            {row?.ended_on
                              ? new Date(+row.ended_on).toLocaleString()
                              : "No Date"}
                          </CommonTableCell>
                          <CommonTableCell>
                            {row?.participants_count
                              ? row?.participants_count
                              : 1}
                          </CommonTableCell>
                          {/* <CommonTableCell>{row?.createdOn && row?.endedOn ? handleDuration(+row.createdOn,+row.endedOn) : 'No Date'}</CommonTableCell> */}
                          <CommonTableCell>
                            {row?.duration
                              ? tsToHHmmss(+row.duration)
                              : "No Date"}
                          </CommonTableCell>
                          <CommonTableCell>
                            <Tooltip
                              title={
                                row.internal_id
                                  ? "View"
                                  : "Not available for Zoom meeting."
                              }
                            >
                              <Box>
                                <IconButton
                                  disabled={row.internal_id ? false : true}
                                  onClick={() => handlePlay(row)}
                                >
                                  <PlayCircleFilledWhiteOutlinedIcon
                                    sx={{
                                      color: row.internal_id
                                        ? "#0C56AC"
                                        : "disable",
                                    }}
                                  />
                                </IconButton>
                              </Box>
                            </Tooltip>
                          </CommonTableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TableContainer>
              {filteredRecordings?.length > 0 && (
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
            </Container>
          </Scrollbar>
        </>
      ) : (
        <NoRecordings />
      )}
    </div>
  );
}

export default RoomHistoryTable;
