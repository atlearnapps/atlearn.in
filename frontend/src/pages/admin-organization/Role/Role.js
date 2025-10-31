import {
  Box,
  Card,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CreateRole from "../../../components/dashboard/organization/Roles/CreateRole";
import RoleManagement from "src/components/dashboard/organization/Roles/RoleManagement";
import apiClients from "src/apiClients/apiClients";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import MainButton from "src/components/Button/MainButton/MainButton";
import AddIcon from "@mui/icons-material/Add";
import { Helmet } from "react-helmet";
import { BASE_URL } from "src/apiClients/config";
function Role() {
  const { user } = useSelector((state) => state.user);
  const [openRole, setOpenRole] = useState(false);
  const [openRoleManagement, setOpenRoleMangement] = useState(false);
  const [role, setRole] = useState();
  const [rolesDetails, setRolesDetails] = useState();
  const [filteredRole, setFilteredRole] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cancelIcon, setCancelIcon] = useState(false);
  const [adminRole, setAdminRole] = useState(false);
  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    if (user?.user?.role?.name === "Administrator") {
      setAdminRole(true);
    }
  }, [user]);

  const handleSearchChange = (event) => {
    setCancelIcon(true);
    const { value } = event.target;
    setSearchTerm(value);
    const filtered = role.filter((role) =>
      role.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredRole(filtered);
  };
  const cancelSearch = () => {
    setSearchTerm("");
    const value = "";
    const filtered = role.filter((role) =>
      role.name.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredRole(filtered);
    setCancelIcon(false);
  };

  const handleClickOpen = () => {
    setOpenRole(true);
  };
  const handleClickClose = () => {
    setOpenRole(false);
  };

  const handleOpenManagement = (e) => {
    setRolesDetails(e);
    setOpenRoleMangement(true);
  };
  const handleCloseManagement = () => {
    fetchRoles();
    setOpenRoleMangement(false);
  };
  const getRole = async (role) => {
    const data = {
      name: role,
    };
    try {
      const response = await apiClients.createRoles(data);
      if (response) {
        fetchRoles();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await apiClients.getAllRoles();
      if (response.data) {
        setFilteredRole(response.data);
        setRole(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
        <Helmet>
        <title>Manage User Roles in Your Organization</title>
        <meta
          name="description"
          content="Control user roles in your organization with Atlearn. Assign permissions, streamline tasks, and maintain secure access for your team."
        />
        <link rel="canonical" href={`${BASE_URL}/organization/roles`} />
        </Helmet>
      <Container maxWidth={"xl"}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography  style={{ fontSize: "2rem", fontWeight: 400 }}>Manage Roles</Typography>
        </Stack>
        <Card>
          {openRoleManagement ? (
            <RoleManagement role={rolesDetails} close={handleCloseManagement} />
          ) : (
            <Box m={4}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: {
                    xs: "column",
                    sm: "row",
                  },
                  gap: 1,
                }}
              >
                <Box>
                  <TextField
                    variant="outlined"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                      startAdornment: (
                        <IconButton
                          edge="start"
                          aria-label="search"
                          size="large"
                        >
                          <SearchIcon />
                        </IconButton>
                      ),
                      endAdornment: cancelIcon ? (
                        <InputAdornment position="end">
                          <IconButton onClick={cancelSearch}>
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ) : (
                        <InputAdornment position="end">
                          {/* <IconButton >
                          <CloseIcon fontSize="small" />
                        </IconButton> */}
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                <Box>
                  <MainButton
                    onClick={handleClickOpen}
                
                  >
                    <AddIcon sx={{ mr: 1 }} />
                    Create Role
                  </MainButton>
                </Box>
              </Box>
              <Box border={1} borderColor={"#f5f5f5"} mt={3}>
                <Box m={1}>Roles</Box>
                <Divider />
                {filteredRole.map((item, index) => (
                  <>
                    <Box key={index} m={3}>
                      {/* <Box
                   
                        onClick={() =>
                          adminRole && item.name === "Super Admin"
                            ? null
                            : handleOpenManagement(item)
                        }
                        sx={{
                          display: "flex",
                          gap: 1,
                          alignItems: "center",
                          cursor:
                            adminRole && item.name === "Super Admin"
                              ? "not-allowed"
                              : "pointer",
                          opacity:
                            adminRole && item.name === "Super Admin" ? 0.5 : 1,
                        }}
                      >
                        <VerifiedUserIcon style={{ color: item.color }} />
                        <LockOutlinedIcon fontSize="small" />
                        <Typography variant="h6">{item.name}</Typography>
                      </Box> */}
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          alignItems: "center",
                          cursor:
                            adminRole && item.name === "Super Admin"
                              ? "not-allowed"
                              : "pointer",
                          opacity:
                            adminRole && item.name === "Super Admin" ? 0.5 : 1,
                        }}
                      >
                        <Tooltip
                          title={
                            adminRole && item.name === "Super Admin"
                              ? "Admins cannot access Super Admin"
                              : ""
                          }
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: 1,
                              alignItems: "center",
                            }}
                            onClick={() =>
                              adminRole && item.name === "Super Admin"
                                ? null
                                : handleOpenManagement(item)
                            }
                          >
                            <VerifiedUserIcon style={{ color: item.color }} />
                            <LockOutlinedIcon fontSize="small" />
                            <Typography variant="h5">{item.name}</Typography>
                          </div>
                        </Tooltip>
                      </Box>
                    </Box>
                    <Divider />
                  </>
                ))}
              </Box>
            </Box>
          )}
        </Card>
      </Container>
      <CreateRole
        open={openRole}
        handleClose={handleClickClose}
        getRole={getRole}
      />
    </div>
  );
}

export default Role;
