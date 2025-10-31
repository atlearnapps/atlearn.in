import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Popover,
  MenuItem,
  Paper,
  Avatar,
  Box,
  TextField,
  InputAdornment,
  Badge,
} from "@mui/material";
import Iconify from "src/components/iconify/Iconify";
import apiClients from "src/apiClients/apiClients";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteUser from "src/components/confirmationPopup/confirmationPopup";
import CreateRoom from "src/components/dashboard/createRoom/CreateRoom";
import HomeIcon from "@mui/icons-material/Home";
import EditIcon from "@mui/icons-material/Edit";
// import BlockIcon from "@mui/icons-material/Block";
import EditUser from "src/components/dashboard/editUser/EditUser";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import CommonTableCell from "src/components/CommonTableCell/CommonTableCell";
import formatString from "src/utils/stringUtils";

const ManageUserTable = ({ userData, fetchData }) => {
  const columns = [
    "Name",
    "Email Address",
    "Role",
    "Plan",
    "Subscription Start Date",
    "Subscription Expiry Date",
    "Status",
    "Action",
  ];
  const { user } = useSelector((state) => state.user);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [users, setUsers] = useState();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roomModal, setRoomModal] = useState(false);
  const [editModal, setEditModel] = useState(false);
  const [editUser, setEditUser] = useState();
  const [userId, setUserId] = useState();
  const [status, setStatus] = useState(true);
  const [cancelIcon, setCancelIcon] = useState(false);
  const [bannedConfirmationOpen, setBannedConfirmationOpen] = useState(false);
  useEffect(() => {
    if (userData) {
      setStatus(true);
      setUsers(userData);
      setFilteredUsers(userData);
    }
  }, [userData]);

  const handleSearchChange = (event) => {
    setCancelIcon(true);
    const { value } = event.target;
    setSearchTerm(value);
    const filtered = users.filter((users) =>
      users.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const cancelSearch = () => {
    setSearchTerm("");
    const value = "";
    const filtered = users.filter((users) =>
      users.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCancelIcon(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenMenu = (event, data) => {
    setOpen(event.currentTarget);
    setEditUser(data);
    setUserId(data.id);
  };

  const handleUpdate = () => {
    fetchData();
  };
  const handleCloseMenu = () => {
    setOpen(null);
  };

  const edituser = () => {
    setOpen(false);
    setEditModel(true);
  };

  const editUserClose = () => {
    setEditModel(false);
  };

  const deleteUser = () => {
    setOpen(false);
    setDeleteModal(true);
  };
  const deleteUserClose = () => {
    setDeleteModal(false);
  };

  const handleOpenbannedConfirmation = () => {
    setBannedConfirmationOpen(true);
  };

  const handleCloseBannedConfirmation = () => {
    setBannedConfirmationOpen(false);
  };
  const roomopen = () => {
    setOpen(false);
    setRoomModal(true);
  };
  const roomclose = () => {
    setRoomModal(false);
  };
  const handleDeleteUser = async () => {
    try {
      const response = await apiClients.deleteUser(userId);
      if (response) {
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnbannedUser = async () => {
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
        handleCloseMenu();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleCreateRoom = async (value) => {
    const data = {
      name: value,
      user: userId,
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

      <Box>
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
                  <TableCell
                    align="center"
                    colSpan={7}
                    style={{ borderBottom: "none" }}
                  >
                    No Users Found
                  </TableCell>
                </TableRow>
              )}
              {(rowsPerPage > 0
                ? filteredUsers?.slice(
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
                  <CommonTableCell
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mt: 1,
                    }}
                  >
                    <Avatar
                      src={`${process.env.REACT_APP_OVERRIDE_HOST}/api/images/${row?.avatar}`}
                    />
                    <div>{row?.name}</div>
                  </CommonTableCell>
                  <CommonTableCell>{row?.email}</CommonTableCell>
                  <CommonTableCell>
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
                  <CommonTableCell align="center">
                    <span
                      style={{
                        color: row?.expired === false ? "green" : "red",
                        fontWeight: 500,
                        padding: "5px 10px",
                        borderRadius: "5px",
                        backgroundColor:
                          row?.expired === false ? "#e0f2e9" : "#f2e0e0",
                        fontSize: "14px",
                      }}
                    >
                      {formatString(row?.expired ? "Expired" : "Active") || "-"}
                    </span>
                  </CommonTableCell>
                  {user?.user?.role?.name === "Administrator" &&
                  row?.role?.name === "Super Admin" ? (
                    <CommonTableCell>{""}</CommonTableCell>
                  ) : (
                    <CommonTableCell align="left">
                      <IconButton
                        size="large"
                        color="inherit"
                        onClick={(event) => handleOpenMenu(event, row)}
                      >
                        <Iconify icon={"eva:more-vertical-fill"} />
                      </IconButton>
                    </CommonTableCell>
                  )}
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
          count={users?.length || 0}
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
        <MenuItem onClick={edituser}>
          <EditIcon sx={{ mr: 2, color: "primary.main" }} />
          View
        </MenuItem>
        <MenuItem onClick={roomopen}>
          <HomeIcon sx={{ mr: 2, color: "primary.main" }} />
          Create Room
        </MenuItem>
        {/* {user?.user?.id !== userId && (
          <MenuItem onClick={handleOpenbannedConfirmation}>
            <BlockIcon sx={{ mr: 2, color: "primary.main" }} />
            Ban
          </MenuItem>
        )} */}

        <MenuItem onClick={deleteUser} sx={{ color: "error.main" }}>
          <DeleteIcon sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
      {editModal && (
        <EditUser
          open={editModal}
          handleclose={editUserClose}
          userData={editUser}
          update={handleUpdate}
          userID={user?.user?.id}
        />
      )}

      <DeleteUser
        open={deleteModal || bannedConfirmationOpen}
        handleClose={
          bannedConfirmationOpen
            ? handleCloseBannedConfirmation
            : deleteUserClose
        }
        handleConfirm={
          bannedConfirmationOpen ? handleUnbannedUser : handleDeleteUser
        }
        heading={bannedConfirmationOpen ? "Account Banned Confirmation" : null}
        message={
          bannedConfirmationOpen
            ? "Are you sure you want to ban this user?"
            : null
        }
      />

      <CreateRoom
        open={roomModal}
        handleClosebox={roomclose}
        handleCreateRoom={handleCreateRoom}
      />
    </>
  );
};

export default ManageUserTable;
