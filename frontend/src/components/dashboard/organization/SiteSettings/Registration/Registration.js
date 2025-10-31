import { Box, Grid, MenuItem, Select, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import apiClients from "src/apiClients/apiClients";

function Registration() {
  const methods = [
    { value: "open", label: "Open Registration" },
    { value: "invite", label: "Join by Invitation" },
    { value: "approval", label: "Approve/Decline" },
  ];

  // ];

  const [roles, setRoles] = useState(null);
  const [method, setMethod] = useState("");
  const [methodId, setMethodId] = useState();
  const [selectedRole, setSelectedRole] = useState("");
  const [defaultRoleId, setDefaultRoleId] = useState();

  useEffect(() => {
    fetchData();
    fetchrole();
  }, []);

  const fetchData = async () => {
    const data = {
      name: ["RegistrationMethod", "RoleMapping", "DefaultRole"],
    };
    try {
      const response = await apiClients.getSiteSettings(data);
      if (response.data) {
        response.data.forEach((item) => {
          switch (item.setting.name) {
            case "RegistrationMethod":
              setMethod(item.value);
              setMethodId(item.id);
              break;
            case "DefaultRole":
              setSelectedRole(item.value);
              setDefaultRoleId(item.id);
              break;
            default:
              break;
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (event) => {
    setMethod(event.target.value);
    updateData(methodId, event.target.value);
  };

  const handleRole = (event) => {
    setSelectedRole(event.target.value);
    updateData(defaultRoleId, event.target.value);
  };

  const updateData = async (id, value) => {
    const data = {
      value: value,
    };
    try {
      const response = await apiClients.updateSiteSettings(id, data);
      if (response.message) {
        toast.success(response.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchrole = async () => {
    try {
      const response = await apiClients.getAllRoles();
      if (response.data) {
        console.log(response.data, "role");
        setRoles(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={8}>
            <Box>
              <Typography variant="h5">Registration Method</Typography>
              <Typography variant="body1" gutterBottom>
                Change the way that users register to the website
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Box sx={{ width: "200px" }}>
              <Select
                value={method}
                onChange={handleChange}
                sx={{ width: "100%" }}
              >
                {methods.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ flexGrow: 1, mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={8}>
            <Box>
              <Typography variant="h5">Default Role</Typography>
              <Typography variant="body1" gutterBottom>
                The default role to be assigned to newly created users
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Box sx={{ width: "200px" }}>
              <Select
                value={selectedRole}
                onChange={handleRole}
                sx={{ width: "100%" }}
              >
                {roles?.map(
                  (item) =>
                    item.name !== "Administrator" &&
                    item.name !== "Super Admin" && (
                      <MenuItem key={item.id} value={item.name}>
                        {item.name}
                      </MenuItem>
                    )
                )}
              </Select>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default Registration;
