import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  TextField,
  Typography,
  Autocomplete,
} from "@mui/material";
import apiClients from "src/apiClients/apiClients";
import { toast } from "react-toastify";

function ViewAuth0UserModal({ open, handleClose, userData, fetchData }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    email_verified: false,
  });
  const [errors, setErrors] = useState({ name: "", email: "" });

  // Role & Plan States
  const [roles, setRoles] = useState([]);
  const [plans, setPlans] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        email_verified: userData.email_verified || false,
      });
      fetchRoles();
      fetchPlans();
    }
  }, [userData, open]);

  const fetchRoles = async () => {
    try {
      const response = await apiClients.getAllRoles();
      if (response.data) {
        setRoles(response.data);

        // role mapping from props
        let roleFromProps = null;
        if (userData?.app_metadata?.role === "Teacher") {
          roleFromProps = "Moderator";
        } else if (userData?.app_metadata?.role === "Student") {
          roleFromProps = "Guest";
        }

        // Priority 1: role from props
        if (roleFromProps) {
          const matchedRole = response.data.find(
            (r) => r.name === roleFromProps
          );
          setSelectedRole(matchedRole || null);
        }
        // Priority 2: role from app_metadata
        else if (userData?.app_metadata?.role) {
          const matchedRole = response.data.find(
            (r) => r.name === userData?.app_metadata?.role
          );
          setSelectedRole(matchedRole || null);
        }
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const fetchPlans = async () => {
    try {
      const response = await apiClients.pricing();
      if (response.data) {
        setPlans(response.data);

        // Preselect plan if stored in app_metadata
        if (userData?.app_metadata?.plan) {
          const matchedPlan = response.data.find(
            (p) => p.name === userData.app_metadata.plan // match by plan name
          );
          setSelectedPlan(matchedPlan || null);
        }
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVerifiedChange = (e) => {
    setFormData((prev) => ({ ...prev, email_verified: e.target.checked }));
  };

  const validateForm = () => {
    let valid = true;
    let newErrors = { name: "", email: "" };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Enter a valid email address";
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSave = async () => {
    if (!userData) return;
    if (!validateForm()) return;

    const updatedFields = {};
    if (formData.name !== userData.name) updatedFields.name = formData.name;
    if (formData.email !== userData.email) updatedFields.email = formData.email;
    if (formData.email_verified !== userData.email_verified) {
      updatedFields.email_verified = formData.email_verified;
    }

    // Add role/plan updates into app_metadata
    updatedFields.app_metadata = {
      ...(userData.app_metadata || {}),
      role_id: selectedRole?.id || null,
      subscription_id: selectedPlan?.id || null,
    };

    console.log("Updating with fields:", updatedFields);
    
    try {
      const response = await apiClients.updateAuth0User(
        userData.user_id,
        updatedFields
      );
      if (response) {
        fetchData();
        toast.success("User details updated successfully");
      }
      handleClose();
    } catch (error) {
      toast.error("Update failed");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{ fontWeight: "bold", fontSize: "1.2rem", textAlign: "center" }}
      >
        Edit User Profile
      </DialogTitle>

      <DialogContent dividers>
        {userData && (
          <Box display="flex" flexDirection="column" gap={3}>
            {/* Profile Section */}
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                src={userData.picture}
                alt={userData.name}
                sx={{ width: 64, height: 64, border: "2px solid #eee" }}
              />
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {userData.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  User ID: {userData.user_id}
                </Typography>
              </Box>
            </Box>

            <Divider />

            {/* Editable Fields */}
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                error={!!errors.name}
                helperText={errors.name}
              />

              <TextField
                label="Email Address"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                error={!!errors.email}
                helperText={errors.email}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.email_verified}
                    onChange={handleVerifiedChange}
                    sx={{ "&.Mui-checked": { color: "#1976d2" } }}
                  />
                }
                label="Email Verified"
              />

              {/* Role Selection */}
              <Autocomplete
                options={roles || []}
                getOptionLabel={(option) => option?.name || ""}
                value={
                  selectedRole
                    ? roles.find((r) => r.name === selectedRole.name) || null
                    : null
                }
                onChange={(e, newValue) => {
                  setSelectedRole(newValue); // store the whole role object
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Select Role" />
                )}
              />

              {/* Plan Selection */}
              <Autocomplete
                options={plans || []}
                getOptionLabel={(option) => option?.name || ""}
                value={
                  selectedPlan
                    ? plans.find((p) => p.name === selectedPlan.name) || null
                    : null
                }
                onChange={(e, newValue) => setSelectedPlan(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Select Plan" />
                )}
              />
            </Box>

            <Divider />

            {/* Read-only Info */}
            <Box display="flex" flexDirection="column" gap={1}>
              <Typography variant="body2" color="text.secondary">
                <b>Provider:</b> {userData.identities?.[0]?.provider}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <b>Last Login:</b>{" "}
                {userData.last_login
                  ? new Date(userData.last_login).toLocaleString()
                  : "-"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <b>Logins Count:</b> {userData.logins_count}
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>

      {/* Footer Buttons */}
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={handleClose}
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            color: "#555",
            border: "1px solid #ddd",
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            backgroundColor: "primary.main",
            "&:hover": { backgroundColor: "primary.main", color: "white" },
          }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ViewAuth0UserModal;
