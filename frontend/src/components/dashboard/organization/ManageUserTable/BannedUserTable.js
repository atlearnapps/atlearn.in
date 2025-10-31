import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
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
  Badge,
} from "@mui/material";
// import Iconify from "src/components/iconify/Iconify";
import SearchIcon from "@mui/icons-material/Search";
import DoneIcon from "@mui/icons-material/Done";
import apiClients from "src/apiClients/apiClients";
import BoxLoader from "src/components/Loader/BoxLoader";
import CommonTableCell from "src/components/CommonTableCell/CommonTableCell";
import { toast } from "react-toastify";
const BannedUserTable = ({ userData, fetchData }) => {
  // Dummy data for demonstration

  const columns = [
    "Name",
    "EmailAddress",
    "Role",
    "Plan",
    "Subscription Start Date",
    "Subscription Expiry Date",
    "Action",
  ];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  // const [userId, setUserId] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    const filtered = users?.filter((users) =>
      users?.name?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  useEffect(() => {
    fetchBannedUsers();
  }, [userData]);

  const fetchBannedUsers = async () => {
    try {
      setLoading(true);
      const response = await apiClients.bannedUsers();
      if (response.data) {
        setUsers(response.data);
        setFilteredUsers(response.data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
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
      status,
    };
    try {
      const response = await apiClients.userUpdate(data, userId);
      if (response) {
        if (response.success === true && response.message) {
          toast.success(response.message);
        }
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
      {loading ? (
        <BoxLoader />
      ) : users?.length ? (
        <>
          <Box mb={2}>
            <TextField
              className="homeSearch"
              label="Search"
              placeholder="Enter name to search..."
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
          <Box>
            <TableContainer
              style={{ border: "1px solid #F4F6F8" }}
              // component={Paper}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    {columns.map((column, index) => (
                      <CommonTableCell
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
                      <CommonTableCell key={index}>{row?.name}</CommonTableCell>
                      <CommonTableCell key={index}>
                        {row?.email}
                      </CommonTableCell>
                      <CommonTableCell key={index}>
                      {row?.role?.name === "Moderator"
                      ? "Teacher"
                      : row?.role?.name === "Guest"
                      ? "Student"
                      : row?.role?.name}
                      </CommonTableCell>
                      <CommonTableCell>
                        {row?.subscription?.name}
                        {(row?.subscription?.name === "Free" ||
                          row?.trial === true) && (
                          <Badge
                            anchorOrigin={{
                              vertical: "top",
                              horizontal: "right",
                            }}
                            color="error"
                            badgeContent={"Trial User"}
                            max={999}
                            style={{
                              backgroundColor: "#EA0000",
                              color: "white",
                              borderRadius: "10px",
                              fontSize: "10px",
                              padding: "5px",
                              marginLeft: "30px",
                              marginRight: "20px",
                              // marginLeft: "6px",
                            }}
                          ></Badge>
                        )}
                      </CommonTableCell>
                      <CommonTableCell>
                    {row?.subscription_start_date || "-"}
                  </CommonTableCell>
                  <CommonTableCell>
                    {row?.subscription_expiry_date || "-"}
                  </CommonTableCell>

                      <CommonTableCell key={index}>
                        <Button
                          variant="contained"
                      
                          onClick={() => handleUnbannedUser(row?.id)}
                          sx={{
                            color:"#388e3c",
                            backgroundColor: "#4caf50",
                            "&:hover": {
                            color: "#fff",
                              backgroundColor: "#388e3c",
                            },
                            padding: "10px 20px",
                            borderRadius: "8px",
                            fontWeight: "bold",
                          }}
                        >
                          <DoneIcon sx={{ mr: 1 }} />
                          Unban
                        </Button>
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
            <MenuItem onClick={handleUnbannedUser}>
              <DoneIcon sx={{ mr: 2 }} />
              Unban
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
                    There are no banned users on this server yet!
                  </Typography>
                  <Typography paragraph>
                    When a user's status gets changed to banned, they will
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

export default BannedUserTable;
