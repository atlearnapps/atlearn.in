import {
  Box,
  Button,
  Divider,
  Switch,
  TextField,
  Typography,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import apiClients from "src/apiClients/apiClients";
import DeleteConfirmation from "src/components/confirmationPopup/confirmationPopup";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function RoleManagement({ role, close }) {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [Rolename, setRoleName] = useState(role.name);
  const [deleteRole, setDeleteRole] = useState(false);
  const [processedData, setProcessedData] = useState([]);

  useEffect(() => {
    handleRole_premission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (user) {
    if (user?.permission?.["ManageRoles"] !== "true") {
      navigate("/404");
    }
  }
  const handleclose = () => {
    close();
  };
  const handleDelete = async () => {
    try {
      const response = await apiClients.deleteRole(role.id);
      if (response) {
        if (response.success === false) {
          toast.error(response.message);
        } else {
          toast.success(response.message);
        }
        close();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteConfirmation = () => {
    setDeleteRole(true);
  };
  const handleUpdate = async () => {
    try {
      const data = {
        name: Rolename,
      };
      // eslint-disable-next-line no-unused-vars
      const response = await apiClients.updateRole(role.id, data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleClose = () => {
    setDeleteRole(false);
  };
  const handleRole_premission = async () => {
    try {
      const response = await apiClients.getRole_Permission_ById(role.id);
      if (response.data) {
        const processed = {};

        response.data.forEach((item) => {
          processed[item.permission.name] = {
            roleId: item.role.id,
            permissionId: item.permission.id,
            // permissionName: item.permission.name,
            value: item.value,
          };
        });
        setProcessedData(processed);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleSwitchChange = (key, newValue) => {
    setProcessedData((prevData) => {
      const roleId = prevData[key]?.roleId;
      const permissionId = prevData[key]?.permissionId;
      const updatedData = {
        ...prevData,
        [key]: { value: newValue.toString(), roleId, permissionId },
      };
      return updatedData;
    });
    if (key !== "RoomLimit") {
      handleUpdateRole_Permission(key, newValue);
    }
  };

  const handleUpdateRole_Permission = async (key, value) => {
    const data = {
      role_id: processedData[key]?.roleId,
      permission_id: processedData[key]?.permissionId,
      value: value.toString(),
    };
    try {
      const response = await apiClients.updateRole_Permission(data);
      if (response.message) {
        toast.success(response.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Box m={3}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex" }}>
            <Typography
              onClick={handleclose}
              variant="h5"
              gutterBottom
              sx={{ cursor: "pointer" }}
            >
              Role/
            </Typography>
            <Typography variant="h5" gutterBottom>
              {role.name}
            </Typography>
          </Box>
          <Box
            onClick={handleclose}
            sx={{
              display: "flex",
              gap: 1,
              cursor: "pointer",
              ":hover": { color: "blue" },
            }}
          >
            <ArrowCircleLeftOutlinedIcon />
            <Typography variant="body1" gutterBottom>
              back
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Box mt={2}>
          <Typography variant="body1" gutterBottom>
            Role Name
          </Typography>
          <Tooltip
            title={
              role.name === "Administrator" ||
              role.name === "Super Admin" ||
              role.name === "Moderator" ||
              role.name === "Guest"
                ? "Default role is not editable "
                : ""
            }
          >
            <TextField
              disabled={
                role.name === "Administrator" ||
                role.name === "Super Admin" ||
                role.name === "Moderator" ||
                role.name === "Guest"
              }
              type="text"
              placeholder="Enter a role name..."
              name="name"
              value={Rolename}
              style={{
                cursor:
                  role.name === "Administrator" || role.name === "Super Admin"
                    ? "not-allowed"
                    : "auto",
              }}
              onChange={(e) => setRoleName(e.target.value)}
              onBlur={handleUpdate}
            />
          </Tooltip>
        </Box>
        <Box mt={4}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="body1" gutterBottom>
                Allow users with this role to create rooms
              </Typography>
            </Box>
            <Box mb={1}>
              <Switch
                checked={
                  processedData["CreateRoom"]?.value === "true" ? true : false
                }
                onChange={(event) =>
                  handleSwitchChange("CreateRoom", event.target.checked)
                }
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Box>
              <Typography variant="body1" gutterBottom>
                Allow users with this role to record their meetings
              </Typography>
            </Box>
            <Box mb={1}>
              <Switch
                checked={
                  processedData["CanRecord"]?.value === "true" ? true : false
                }
                onChange={(event) =>
                  handleSwitchChange("CanRecord", event.target.checked)
                }
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Box>
              <Typography variant="body1" gutterBottom>
                Allow users with this role to manage users
              </Typography>
            </Box>
            <Box mb={1}>
              <Switch
                checked={
                  processedData["ManageUsers"]?.value === "true" ? true : false
                }
                onChange={(event) =>
                  handleSwitchChange("ManageUsers", event.target.checked)
                }
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Box>
              <Typography variant="body1" gutterBottom>
                Allow users with this role to manage server rooms
              </Typography>
            </Box>
            <Box mb={1}>
              <Switch
                checked={
                  processedData["ManageRooms"]?.value === "true" ? true : false
                }
                onChange={(event) =>
                  handleSwitchChange("ManageRooms", event.target.checked)
                }
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Box>
              <Typography variant="body1" gutterBottom>
                Allow users with this role to manage server recordings
              </Typography>
            </Box>
            <Box mb={1}>
              <Switch
                checked={
                  processedData["ManageRecordings"]?.value === "true"
                    ? true
                    : false
                }
                onChange={(event) =>
                  handleSwitchChange("ManageRecordings", event.target.checked)
                }
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Box>
              <Typography variant="body1" gutterBottom>
                Allow users with this role to manage site settings
              </Typography>
            </Box>
            <Box mb={1}>
              <Switch
                checked={
                  processedData["ManageSiteSettings"]?.value === "true"
                    ? true
                    : false
                }
                onChange={(event) =>
                  handleSwitchChange("ManageSiteSettings", event.target.checked)
                }
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Box>
              <Typography variant="body1" gutterBottom>
                Include users with this role in the dropdown for sharing rooms
              </Typography>
            </Box>
            <Box mb={1}>
              <Switch
                checked={
                  processedData["SharedList"]?.value === "true" ? true : false
                }
                onChange={(event) =>
                  handleSwitchChange("SharedList", event.target.checked)
                }
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Box>
              <Typography variant="body1" gutterBottom>
                Room Limit
              </Typography>
            </Box>
            <Box>
              <TextField
                type="number"
                value={processedData["RoomLimit"]?.value}
                onChange={(event) =>
                  handleSwitchChange("RoomLimit", event.target.value)
                }
                onBlur={(e) =>
                  handleUpdateRole_Permission("RoomLimit", e.target.value)
                }
                inputProps={{ min: 0, max: 100 }}
              />
            </Box>
          </Box>
          {role.name === "Administrator" ||
          role.name === "Moderator" ||
          role.name === "Guest" ||
          role.name === "Super Admin" ? null : (
            <Box sx={{ display: "flex", justifyContent: "end", mt: 2 }}>
              <Button
                onClick={handleDeleteConfirmation}
                className="removeBranding"
              >
                Delete
              </Button>
            </Box>
          )}
        </Box>
      </Box>
      <DeleteConfirmation
        open={deleteRole}
        handleClose={handleClose}
        handleConfirm={handleDelete}
      />
    </div>
  );
}

export default RoleManagement;
