import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  // TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Popover,
  MenuItem,
  TextField,
  Box,
  InputAdornment,
  Typography,
  Avatar,
  Card,
  Button,
  Paper,
} from "@mui/material";
// import Iconify from "src/components/iconify/Iconify";
import SearchIcon from "@mui/icons-material/Search";
import DoneIcon from "@mui/icons-material/Done";
import apiClients from "src/apiClients/apiClients";
import CloseIcon from "@mui/icons-material/Close";
import CommonTableCell from "src/components/CommonTableCell/CommonTableCell";
const PendingUserTable = ({ userData, fetchData }) => {
  // Dummy data for demonstration

  const columns = ["Name", "EmailAddress", "Approve", "Decline"];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  // const [userId, setUserId] = useState("");

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    const filtered = users.filter((users) =>
      users.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  useEffect(() => {
    fetchBannedUsers();
  }, [userData]);

  const fetchBannedUsers = async () => {
    try {
      const response = await apiClients.pendingUsers();
      if (response.data) {
        console.log(response.data, "response.data");
        // setBannedUsers(response.data);
        setUsers(response.data);
        setFilteredUsers(response.data);
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
  // const handleOpenMenu = (event, data) => {
  //   setOpen(event.currentTarget);
  //   setUserId(data.id);
  //   // setEditUser(data);
  // };
  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleUnbannedUser = async (userId) => {
    const data = {
      status: true,
      approve: true,
    };
    try {
      const response = await apiClients.userUpdate(data, userId);
      if (response) {
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handlePendingUser = async (userId) => {
    const data = {
      approve: true,
    };
    try {
      const response = await apiClients.userUpdate(data, userId);
      if (response) {
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, users?.length - page * rowsPerPage);

  return (
    <>
      {users?.length ? (
        <>
          <Box mb={2}>
            <TextField
              className="homeSearch"
              label="Search"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box
            sx={{
              marginRight: {
                xs: 0,
                md: 30,
              },
            }}
          >
            <TableContainer
              style={{ border: "1px solid #F4F6F8" }}
              component={Paper}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    {columns.map((column, index) => (
                      <CommonTableCell
                        isHeader={true}
                        sx={{ whiteSpace: "nowrap" }}
                        key={index}
                      >
                        {column}
                      </CommonTableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!filteredUsers?.length && (
                    <TableRow sx={{ height: "100px" }}>
                      <CommonTableCell
                        align="center"
                        colSpan={7}
                        style={{ borderBottom: "none" }}
                      >
                        No Users Found
                      </CommonTableCell>
                    </TableRow>
                  )}
                  {(rowsPerPage > 0
                    ? filteredUsers.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : filteredUsers
                  ).map((row, index) => (
                    <TableRow
                      sx={{
                        "&:hover": {
                          backgroundColor: "#F4F6F8",
                        },
                      }}
                      key={index}
                    >
                      <CommonTableCell key={index}>{row.name}</CommonTableCell>
                      <CommonTableCell key={index}>{row.email}</CommonTableCell>
                      <CommonTableCell key={index}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={()=>handlePendingUser(row?.id)}
                          sx={{
                            backgroundColor: "#4caf50",
                            "&:hover": {
                              backgroundColor: "#388e3c",
                            },
                            padding: "10px 20px",
                            borderRadius: "8px",
                            fontWeight: "bold",
                          }}
                        >
                          <DoneIcon sx={{ mr: 1 }} />
                          Approve
                        </Button>
                      </CommonTableCell>
                      <CommonTableCell key={index}>
                        {" "}
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={()=>handleUnbannedUser(row?.id)}
                          sx={{
                            backgroundColor: "#f44336",
                            "&:hover": {
                              backgroundColor: "#d32f2f",
                            },
                            padding: "10px 20px",
                            borderRadius: "8px",
                            fontWeight: "bold",
                          }}
                        >
                          <CloseIcon sx={{ mr: 1 }} />
                          Decline
                        </Button>
                      </CommonTableCell>

                      {/* <CommonTableCell >
                      <IconButton
                        size="large"
                        color="inherit"
                        onClick={(event) => handleOpenMenu(event, row)}
                      >
                        <Iconify icon={"eva:more-vertical-fill"} />
                      </IconButton>
                    </CommonTableCell> */}
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
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={users?.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>

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
            <MenuItem onClick={handlePendingUser}>
              <DoneIcon sx={{ mr: 2, color: "green" }} />
              Approve
            </MenuItem>
            <MenuItem onClick={handleUnbannedUser}>
              <CloseIcon sx={{ mr: 2, color: "red" }} />
              Decline
            </MenuItem>
          </Popover>
        </>
      ) : (
        <>
          <Card sx={{ minHeight: "20vh" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <Avatar sx={{ width: 80, height: 80 }} />
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <Box>
                <Box
                  sx={{
                    textAlign: "center",
                    margin: "10px",
                  }}
                >
                  <Typography variant="h6" paragraph sx={{ color: "#6D207B" }}>
                    There are no pending users on this server yet!
                  </Typography>
                  <Typography paragraph>
                    When a user's status gets changed to pending, they will
                    appear here.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Card>
        </>
      )}
    </>
  );
};

export default PendingUserTable;
