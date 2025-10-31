import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import {
  Typography,
  Slide,
  Divider,
  Box,
  Grid,
  TextField,
} from "@mui/material";

import Button from "@mui/material/Button";
import { validateEmail } from "src/utils/validateFields/ValidateEmail";
import validatePhoneNumber from "src/utils/validateFields/validatePhoneNumber";
import { validateAccountNumber } from "src/utils/validateFields/ValiddateAccountNumber";
import { validateIFCE } from "src/utils/validateFields/ValidateIFCE";
import apiClients from "src/apiClients/apiClients";
import { setUser } from "src/Redux/userSlice";
import { useDispatch } from "react-redux";
import MainButton from "../Button/MainButton/MainButton";
import SecondaryButton from "../Button/SecondaryButton/SecondaryButton";
// import FormControl from '@mui/material/FormControl';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} timeout={500} />;
});

function BankDetailsPopup({ open, handleClose }) {
  const formdata = {
    name: "",
    email: "",
    phone: "",
    account_number: "",
    ifsc_code: "",
  };
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(formdata);
  const [errors, setErrors] = useState({});
  const handleCloseBox = () => {
    handleClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleSubmit = async () => {
    try {
      const newErrors = {};
      const requiredFields = [
        "name",
        "email",
        "phone",
        "account_number",
        "ifsc_code",
      ];
      requiredFields.forEach((field) => {
        if (
          formData[field] === undefined ||
          formData[field] === null ||
          formData[field] === ""
        ) {
          newErrors[field] = `This ${field} field is required.`;
        }
      });
      if (formData.email && !validateEmail(formData.email)) {
        newErrors.email = "Please enter a valid email address.";
      }
      if (formData.phone && !validatePhoneNumber(formData.phone)) {
        newErrors.phone = "Please enter a valid phone number.";
      }
      if (
        formData.account_number &&
        !validateAccountNumber(formData.account_number)
      ) {
        newErrors.account_number =
          "Invalid account number. It should be 9-18 digits long.";
      }
      if (formData.ifsc_code && !validateIFCE(formData.ifsc_code)) {
        newErrors.ifsc_code =
          "Invalid IFSC code. It should be 11 characters long (e.g., XXXX0YYYYYY).";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
      } else {
        setErrors({});

        const response = await apiClients.addBankDetails(formData);
        if (response.success === true) {
          session();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const session = async () => {
    try {
      const responseData = await apiClients.sessionData();
      if (responseData?.success === true) {
        if (responseData?.data) {
          dispatch(setUser(responseData.data));
          handleCloseBox();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkvalidation = () => {
    const newErrors = {};
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    } else {
      newErrors.email = "";
    }

    if (
      formData.account_number &&
      !validateAccountNumber(formData.account_number)
    ) {
      newErrors.account_number =
        "Invalid account number. It should be 9-18 digits long.";
    } else {
      newErrors.account_number = "";
    }

    if (formData.ifsc_code && !validateIFCE(formData.ifsc_code)) {
      newErrors.ifsc_code =
        "Invalid IFSC code. It should be 11 characters long (e.g., XXXX0YYYYYY).";
    } else {
      newErrors.ifsc_code = "";
    }
    if (formData.phone && !validatePhoneNumber(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number.";
    } else {
      newErrors.phone = "";
    }

    setErrors(newErrors);
  };

  return (
    <div>
      <Dialog
        maxWidth={"md"}
        fullWidth
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <DialogTitle sx={{ textAlign: "center", backgroundColor: "#F5F7FB" }}>
          <Typography variant="h4" textAlign={"center"} gutterBottom>
            Enter Your Bank Details
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box
            sx={{
              // minHeight: "200px",
              padding: { xs: 0, md: 4 },
            }}
          >
            <Grid
              container
              spacing={2}
              sx={{
                // width:{"90%"},
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Grid item xs={12} md={8}>
                <Typography gutterBottom>
                  Name <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  value={formData?.name || ""}
                  type="text"
                  placeholder="Enter Your Name"
                  name="name"
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography gutterBottom>
                  Eamil <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  value={formData?.email || ""}
                  type="text"
                  placeholder="Enter Your Email"
                  name="email"
                  onChange={handleChange}
                  onBlur={checkvalidation}
                  error={!!errors.email}
                  helperText={errors.email}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography gutterBottom>
                  Phone <span style={{ color: "red" }}>*</span>
                </Typography>
                {/* <TextField
                  value={formData?.phone || ""}
                  type="number"
                  placeholder="Enter Your Phone Number"
                  fullWidth
                  name="phone"
                  onChange={handleChange}


                  error={!!errors.phone}
                  helperText={errors.phone}
                /> */}
                <TextField
                  type="text"
                  placeholder="Enter Your Phone Number"
                  fullWidth
                  name="phone"
                  value={formData?.phone || ""}
                  onChange={(e) => {
                    let value = e.target.value;
                    if (/^\d{0,11}$/.test(value)) {
                      handleChange(e);
                    }
                  }}
                  onBlur={checkvalidation}
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                  }}
                  error={!!errors.phone}
                  helperText={errors.phone}
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography gutterBottom>
                  Bank Name <span style={{ color: "red" }}>*</span>
                </Typography>

                <TextField
                  type="text"
                  placeholder="Enter Your Bank Name"
                  name="bank_name"
                  fullWidth
                  value={formData?.bank_name || ""}
                  onChange={handleChange}
                  error={!!errors.bank_name}
                  helperText={errors.bank_name}
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography gutterBottom>
                  Branch Name <span style={{ color: "red" }}>*</span>
                </Typography>

                <TextField
                  type="text"
                  placeholder="Enter Your Branch Name"
                  name="branch_name"
                  fullWidth
                  value={formData?.branch_name || ""}
                  onChange={handleChange}
                  error={!!errors.branch_name}
                  helperText={errors.branch_name}
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography gutterBottom>
                  Account Number <span style={{ color: "red" }}>*</span>
                </Typography>
                {/* <TextField
                  value={formData?.account_number || ""}
                  type="number"
                  placeholder="Enter Your  Account Number"
                  name="account_number"
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.account_number}
                  helperText={errors.account_number}
                /> */}
                <TextField
                  type="text"
                  placeholder="Enter Your Account Number"
                  name="account_number"
                  fullWidth
                  value={formData?.account_number || ""}
                  onChange={(e) => {
                    let value = e.target.value;
                    // Restrict length to a maximum of 18 digits
                    if (/^\d{0,19}$/.test(value)) {
                      handleChange(e);
                    }
                  }}
                  onBlur={checkvalidation}
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                    // maxLength: 18,
                  }}
                  error={!!errors.account_number}
                  helperText={errors.account_number}
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography gutterBottom>
                  IFSC code <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  value={formData?.ifsc_code || ""}
                  type="text"
                  placeholder="Enter your IFSC code"
                  name="ifsc_code"
                  onChange={(e) => {
                    let value = e.target.value;

                    // Allow only alphanumeric characters (A-Z, a-z, 0-9)
                    value = value.replace(/[^A-Za-z0-9]/g, "");

                    // Limit the length to 11 characters
                    if (value.length > 11) {
                      value = value.slice(0, 11);
                    }

                    handleChange(e);
                  }}
                  onBlur={checkvalidation}
                  inputProps={{ maxLength: 11 }}
                  fullWidth
                  error={!!errors.ifsc_code}
                  helperText={errors.ifsc_code}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={handleCloseBox}>Cancel</SecondaryButton>
          <MainButton onClick={handleSubmit}>Done</MainButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default BankDetailsPopup;
