import { Helmet } from "react-helmet-async";
import { filter } from "lodash";
import { useEffect, useState } from "react";
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Box,
  Tab,
} from "@mui/material";
// components
import Iconify from "../components/iconify";
import Scrollbar from "../components/scrollbar";
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";
import DeleteIcon from "@mui/icons-material/Delete";
import HomeIcon from "@mui/icons-material/Home";
// sections
import { UserListHead, UserListToolbar } from "../sections/@dashboard/user";

import apiClients from "src/apiClients/apiClients";
import AddUser from "src/components/dashboard/adduser/AddUser";
import EditUser from "src/components/dashboard/editUser/EditUser";
import DeleteUser from "src/components/confirmationPopup/confirmationPopup";
import CreateRoom from "src/components/dashboard/createRoom/CreateRoom";
import { TabContext, TabList, TabPanel } from "@mui/lab";
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "name", label: "Name", alignRight: false },
  { id: "email", label: "Email", alignRight: false },
  { id: "role", label: "Role", alignRight: false },
  { id: "isVerified", label: "Verified", alignRight: false },
  { id: "status", label: "Status", alignRight: false },
  { id: "" },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserPage() {
  const [open, setOpen] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openuser, setOpenuser] = useState(false);
  const [editModal, setEditModel] = useState(false);
  const [editUser, setEditUser] = useState();
  const [deleteModal, setDeleteModal] = useState(false);
  const [roomModal, setRoomModal] = useState(false);
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClickOpen = () => {
    setOpenuser(true);
  };

  const handleClose = () => {
    setOpenuser(false);
  };

  const handleOpenMenu = (event, data) => {
    setOpen(event.currentTarget);
    setEditUser(data);
  };

  useEffect(() => {
    (async () => {
      const resp = await apiClients.getAllUsers();
      console.log("res", resp);
      if (resp.data) {
        setAllUsers(resp.data);
      }
    })();
  }, []);
  console.log("g", allUsers);
  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = allUsers.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - allUsers.length) : 0;

  const filteredUsers = applySortFilter(
    allUsers,
    getComparator(order, orderBy),
    filterName
  );

  const isNotFound = !filteredUsers.length && !!filterName;

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
  const roomopen = () => {
    setOpen(false);
    setRoomModal(true);
  };
  const roomclose = () => {
    setRoomModal(false);
  };

  return (
    <>
      <Helmet>
        <title> Admin Panel | atlearn </title>
      </Helmet>

      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Manage Users
          </Typography>
          <Button
            onClick={handleClickOpen}
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New User
          </Button>
        </Stack>
        <AddUser open={openuser} handleClose={handleClose} />
        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  <Tab label="Active" value="1" />
                  <Tab label="Banned" value="2" />
                </TabList>
              </Box>
              <TabPanel value="1">
                <Scrollbar>
                  <TableContainer sx={{ minWidth: 800 }}>
                    <Table>
                      <UserListHead
                        order={order}
                        orderBy={orderBy}
                        headLabel={TABLE_HEAD}
                        rowCount={allUsers.length}
                        numSelected={selected.length}
                        onRequestSort={handleRequestSort}
                        onSelectAllClick={handleSelectAllClick}
                      />
                      <TableBody>
                        {allUsers
                          ?.slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          ?.map((row) => {
                            const { id, name, role, email, isVerified } = row;
                            const selectedUser = selected.indexOf(name) !== -1;

                            return (
                              <TableRow
                                hover
                                key={id}
                                tabIndex={-1}
                                role="checkbox"
                                selected={selectedUser}
                              >
                                <TableCell padding="checkbox">
                                  <Checkbox
                                    checked={selectedUser}
                                    onChange={(event) =>
                                      handleClick(event, name)
                                    }
                                  />
                                </TableCell>

                                <TableCell
                                  component="th"
                                  scope="row"
                                  padding="none"
                                >
                                  <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={2}
                                  >
                                    <Avatar alt={name} />
                                    <Typography variant="subtitle2" noWrap>
                                      {name}
                                    </Typography>
                                  </Stack>
                                </TableCell>

                                <TableCell align="left">{email}</TableCell>

                                <TableCell align="left">{role}</TableCell>

                                <TableCell align="left">
                                  {isVerified ? "Yes" : "No"}
                                </TableCell>

                                <TableCell align="right">
                                  <IconButton
                                    size="large"
                                    color="inherit"
                                    onClick={(event) =>
                                      handleOpenMenu(event, row)
                                    }
                                  >
                                    <Iconify icon={"eva:more-vertical-fill"} />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        {emptyRows > 0 && (
                          <TableRow style={{ height: 53 * emptyRows }}>
                            <TableCell colSpan={6} />
                          </TableRow>
                        )}
                      </TableBody>

                      {isNotFound && (
                        <TableBody>
                          <TableRow>
                            <TableCell
                              align="center"
                              colSpan={6}
                              sx={{ py: 3 }}
                            >
                              <Paper
                                sx={{
                                  textAlign: "center",
                                }}
                              >
                                <Typography variant="h6" paragraph>
                                  Not found
                                </Typography>

                                <Typography variant="body2">
                                  No results found for &nbsp;
                                  <strong>&quot;{filterName}&quot;</strong>.
                                  <br /> Try checking for typos or using
                                  complete words.
                                </Typography>
                              </Paper>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      )}
                    </Table>
                  </TableContainer>
                </Scrollbar>

                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={allUsers.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TabPanel>
              <TabPanel value="2">
                <Card sx={{minHeight: "20vh",}}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop:"10px"
                    }}
                  >
                    <Avatar
                      
                      sx={{ width: 100, height: 100 }}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop:"10px"
                      
                    }}
                  >
                    <Box>
                      <Box
                        sx={{
                          textAlign: "center",
                        }}
                      >
                        <Typography variant="h6" paragraph sx={{color:"#1A73E8"}}>
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
              </TabPanel>
            </TabContext>
          </Box>
        </Card>
      </Container>

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
          <EditIcon sx={{ mr: 2 }} />
          View
        </MenuItem>
        <MenuItem onClick={roomopen}>
          <HomeIcon sx={{ mr: 2 }} />
          Create Room
        </MenuItem>
        <MenuItem onClick={edituser}>
          <BlockIcon sx={{ mr: 2 }} />
          Ban
        </MenuItem>
        <MenuItem onClick={deleteUser} sx={{ color: "error.main" }}>
          <DeleteIcon sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
      <EditUser open={editModal} handleclose={editUserClose} user={editUser} />
      <DeleteUser open={deleteModal} handleClose={deleteUserClose} />
      <CreateRoom open={roomModal} handleClosebox={roomclose} />
    </>
  );
}
