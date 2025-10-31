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
  Badge,
} from "@mui/material";
// import Iconify from "src/components/iconify/Iconify";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
// import BlockIcon from "@mui/icons-material/Block";
import apiClients from "src/apiClients/apiClients";
import BoxLoader from "src/components/Loader/BoxLoader";
import CommonTableCell from "src/components/CommonTableCell/CommonTableCell";
import Iconify from "src/components/iconify/Iconify";
import ViewAuth0UserModal from "./ViewAuth0UserModal";
import ChangePasswordModal from "./ChangePasswordModal";
import LockResetIcon from "@mui/icons-material/LockReset";
import DeleteConfirmation from "src/components/confirmationPopup/confirmationPopup";
import { toast } from "react-toastify";
import formatString from "src/utils/stringUtils";
import CreateRoom from "../../createRoom/CreateRoom";
import HomeIcon from "@mui/icons-material/Home";
const Auth0UserTable = ({ userData, fetchData }) => {
  // Dummy data for demonstration

  const columns = [
    "Name",
    "Email",
    "Email Verified",
    "Role",
    "Plan",
    "Subscription Start Date",
    "Subscription Expiry Date",
    "Status",
    "Provider",
    "User ID",
    "Last Login",
    "Logins Count",
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
  const [openView, setOpenView] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [roomModal, setRoomModal] = useState(false);

    const roomclose = () => {
    setRoomModal(false);
  };
  const handleOpenMenu = (event, data) => {
    setSelectedUser(data);
    setOpen(event.currentTarget);
  };
  const handleOpen = (user) => {
    setSelectedUser(user);
    setOpenView(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenView(false);
    setSelectedUser(null);
  };

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    const filtered = users?.filter((users) =>
      users?.name?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  useEffect(() => {
    fetchAuth0Users();
  }, [userData]);

  const fetchAuth0Users = async () => {
    try {
      setLoading(true);
      const response = await apiClients.getAllAuth0users();
      if (response) {
        setUsers(response);
        setFilteredUsers(response);
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

  const handleDeleteUser = async () => {
    try {
      const response = await apiClients.deleteAuth0User(selectedUser?.user_id);
      if (response) {
        toast.success("User deleted successfully");
        handleDeleteConirmationClose();
        fetchAuth0Users();
      } else {
        toast.error("Failed to delete user. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to delete user. Please try again.");
      handleDeleteConirmationClose();
      console.log(error);
    }
  };

  const handleDeleteConirmationClose = () => {
    setDeleteConfirm(false);
    setOpen(null);
  };

    const roomopen = () => {
    setOpen(false);
    setRoomModal(true);
  };

   const handleCreateRoom = async (value) => {
      const data = {
        name: value,
        user_external_id: selectedUser?.user_id ,
      };
      try {
        const response = await apiClients.createRooms(data);
        if (response) {
          fetchData();
        }
        if (response.success === true) {
          toast.success(response.message);
        }
      } catch (error) {
        console.log();
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
                        colSpan={columns.length}
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
                      key={index}
                      sx={{
                        "&:hover": { backgroundColor: "#F4F6F8" },
                      }}
                      onClick={(event) => {
                        event.stopPropagation();
                        handleOpen(row);
                      }}
                    >
                      <CommonTableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar
                            src={row?.picture}
                            alt={row?.name}
                            sx={{ width: 40, height: 40 }}
                          />
                          <Box>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                color: "#1a73e8", // Google blue style
                                fontWeight: "bold",
                                cursor: "pointer",
                                "&:hover": { textDecoration: "underline" },
                              }}
                            >
                              {row?.name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {row?.email}
                            </Typography>
                          </Box>
                        </Box>
                      </CommonTableCell>
                      <CommonTableCell>{row?.email || "-"}</CommonTableCell>
                      <CommonTableCell>
                        {row?.email_verified ? "Yes" : "No"}
                      </CommonTableCell>
                      <CommonTableCell>
                        {row?.app_metadata?.role || "-"}
                      </CommonTableCell>
                      <CommonTableCell>
                        {row?.app_metadata?.plan || "-"}
                        {(row?.app_metadata?.plan === "Free" ||
                          row?.app_metadata?.trial === true) && (
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
                        {row?.app_metadata?.subscription_start_date || "-"}
                      </CommonTableCell>
                      <CommonTableCell>
                        {row?.app_metadata?.subscription_expiry_date || "-"}
                      </CommonTableCell>
                      <CommonTableCell align="center">
                        <span
                          style={{
                            color:
                              row?.app_metadata?.expired === false
                                ? "green"
                                : row?.app_metadata?.expired === true
                                ? "red"
                                : "gray",
                            fontWeight: 500,
                            padding: "5px 10px",
                            borderRadius: "5px",
                            backgroundColor:
                              row?.app_metadata?.expired === false
                                ? "#e0f2e9"
                                : row?.app_metadata?.expired === true
                                ? "#f2e0e0"
                                : "#f2f2f2",
                            fontSize: "14px",
                          }}
                        >
                          {formatString(
                            row?.app_metadata?.expired === true
                              ? "Expired"
                              : row?.app_metadata?.expired === false
                              ? "Active"
                              : "-"
                          )}
                        </span>
                      </CommonTableCell>
                      <CommonTableCell>
                        {row?.identities?.[0]?.provider || "-"}
                      </CommonTableCell>
                      <CommonTableCell>{row?.user_id || "-"}</CommonTableCell>
                      <CommonTableCell>
                        {row?.last_login
                          ? new Date(row.last_login).toLocaleString()
                          : "-"}
                      </CommonTableCell>
                      <CommonTableCell>
                        {row?.logins_count || 0}
                      </CommonTableCell>

                      {/* Action Column */}
                      <CommonTableCell align="left">
                        <IconButton
                          size="large"
                          color="inherit"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleOpenMenu(event, row);
                          }}
                        >
                          <Iconify icon={"eva:more-vertical-fill"} />
                        </IconButton>
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
            <MenuItem onClick={() => setOpenView(true)}>
              <EditIcon sx={{ mr: 2, color: "primary.main" }} />
              View
            </MenuItem>
            <MenuItem onClick={() => setOpenPasswordModal(true)}>
              <LockResetIcon sx={{ mr: 2, color: "primary.main" }} />
              Change Password
            </MenuItem>
            {/* <MenuItem>
              <BlockIcon sx={{ mr: 2, color: "primary.main" }} />
              Ban
            </MenuItem> */}
                    <MenuItem onClick={roomopen}>
                      <HomeIcon sx={{ mr: 2, color: "primary.main" }} />
                      Create Room
                    </MenuItem>
            <MenuItem
              onClick={() => setDeleteConfirm(true)}
              sx={{ color: "error.main" }}
            >
              <DeleteIcon sx={{ mr: 2 }} />
              Delete
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

      <ViewAuth0UserModal
        open={openView}
        handleClose={handleClose}
        userData={selectedUser}
        fetchData={fetchAuth0Users}
      />

      <ChangePasswordModal
        open={openPasswordModal}
        handleClose={() => {
          setOpenPasswordModal(false);
          setOpen(false);
        }}
        userId={selectedUser?.user_id || ""}
      />

      <DeleteConfirmation
        open={deleteConfirm}
        handleClose={handleDeleteConirmationClose}
        handleConfirm={handleDeleteUser}
      />

            <CreateRoom
              open={roomModal}
              handleClosebox={roomclose}
              handleCreateRoom={handleCreateRoom}
            />
    </>
  );
};

export default Auth0UserTable;
