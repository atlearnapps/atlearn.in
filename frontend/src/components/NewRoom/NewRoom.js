import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import {
  Box,
  Container,
  Divider,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import MainButton from "../Button/MainButton/MainButton";
// import SecondaryButton from "../Button/SecondaryButton/SecondaryButton";
import BankDetailsPopup from "../BankDetails/BankDetailsPopup";
import { useSelector } from "react-redux";
import { useDropzone } from "react-dropzone";
import { useLocation } from "react-router-dom";
import CancelButton from "../Button/CancelButton/CancelButton";
import EditIcon from "@mui/icons-material/Edit";
import BBBLogo from "src/assets/images/home/new/bbb.webp";
import ZoomLogo from "src/assets/images/home/new/z.webp";
import { toast } from "react-toastify";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} timeout={500} />;
});

export default function NewRoom({ open, handleClose, handleCreateRoom }) {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const roomTYpe = queryParams.get("type");

  const formdata = {
    name: "",
    price: null,
    room_type: roomTYpe ? roomTYpe : "",
    provider: "zoom",
  };

  const [formData, setFormData] = useState(formdata);
  const [errors, setErrors] = useState({});
  const [paidRoom, setPaidRoom] = useState(false);
  const [openbank, setOpenBank] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleClosebox = () => {
    setFormData(formdata);
    setErrors({});
    setPaidRoom(false);
    setUploadedImage(null);
    handleClose();
  };
  const handleCloseBankDetailsPopup = () => {
    setOpenBank(false);
    handleClosebox();
  };

  const CreateRoom = () => {
    const newErrors = {};
    const requiredFields = ["name", "room_type"];
    requiredFields.forEach((field) => {
      if (
        formData[field] === undefined ||
        formData[field] === null ||
        formData[field] === ""
      ) {
        newErrors[field] = `This ${field} field is required.`;
      }
    });
    if(formData.name?.length<2){
      newErrors.name = "Name must be at least 2 characters long.";
    }
    if (paidRoom) {
      if (!formData.price?.trim()) {
        newErrors.price = "Price is required.";
      } else if (!/^\d+$/.test(formData.price)) {
        newErrors.price = "Price must be a whole number without decimals.";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});

      if (paidRoom) {
        if (user?.user?.bankDetailsId) {
          handleCreateRoom(
            formData?.name,
            formData?.price,
            uploadedImage,
            formData?.room_type,
            formData?.provider
          );
          handleClosebox();
        } else {
          setOpenBank(true);
        }
      } else {
        handleCreateRoom(
          formData?.name,
          formData?.price,
          uploadedImage,
          formData?.room_type,
          formData?.provider
        );
        handleClosebox();
      }

      // handleClosebox();
    }
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

  const isFileTypeValid = (file) => {
    const validTypes = ["image/png", "image/jpeg", "image/svg+xml"];
    return validTypes.includes(file.type);
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && isFileTypeValid(file)) {
      // setProfile(file);
      setUploadedImage(file);
      // uploadProfile(file);
    } else {
       toast.error("Invalid file format. Please upload PNG, JPEG, or SVG.");
      // setSelectedFile(null);
    }
  };
  const { getRootProps, getInputProps } = useDropzone({ onDrop });



  return (
    <>
      <div>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClosebox}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle sx={{ textAlign: "center", backgroundColor: "#F5F7FB" }}>
            {"Create a New Meeting"}
          </DialogTitle>
          <Divider />
          <DialogContent>
            <Box >
              <Container>
                <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Box
                      {...getRootProps()}
                      sx={{
                        position: "relative", 
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px dashed grey",
                        padding: "16px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        "&:hover": { borderColor: "blue" },
                      }}
                    >
                      <input {...getInputProps()} />
                      {uploadedImage ? (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <img
                            src={URL.createObjectURL(uploadedImage)}
                            alt="Uploaded"
                            style={{
                              maxWidth: "100%",
                              maxHeight: "200px",
                              borderRadius: "8px",
                              marginBottom: "8px",
                            }}
                          />
                                   <Box
                          sx={{
                            position: "absolute",
                            bottom: -5, // Slightly outside avatar
                            right: -5,
                            width: 35,
                            height: 35,
                            backgroundColor: "#fff",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: 2,
                            cursor:"pointer"
                          }}
                        >
                          <EditIcon sx={{ fontSize: 20, color: "primary.main" }} />
                        </Box>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                           Add Meeting Banner Image
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Typography gutterBottom>
                      Meeting Name
                      <span className="text-red-500 text-sm"> * </span>
                    </Typography>
                    <TextField
                      type="text"
                      placeholder="Enter a meeting name..."
                      name="name"
                      fullWidth
                      value={formData?.name || ""}
                      onChange={handleChange}
                      error={!!errors.name}
                      helperText={errors.name}
                    />
                  </Grid>

                  {/* Room Type Dropdown */}
                  <Grid item xs={12}>
                    <Typography gutterBottom>
                      Meeting Type
                      <span className="text-red-500 text-sm"> * </span>
                    </Typography>
                    <TextField
                      select
                      fullWidth
                      name="room_type"
                      value={formData?.room_type || ""}
                      onChange={handleChange}
                      error={!!errors.room_type}
                      helperText={errors.room_type}
                      placeholder="Select room type"
                    >
                      <MenuItem value="online_class">Online Meeting</MenuItem>
                      <MenuItem value="webinar">Webinar</MenuItem>
                      <MenuItem value="training">Training</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography gutterBottom>
                      Meeting Provider
                      <span className="text-red-500 text-sm"> * </span>
                    </Typography>
                    <TextField
                      select
                      fullWidth
                      name="provider"
                      value={formData?.provider || ""}
                      onChange={handleChange}
                      error={!!errors.provider}
                      helperText={errors.provider}
                      placeholder="Select Meeting Provider"
                    >
                      <MenuItem value="zoom">
                        <Box display="flex" alignItems="center" gap={1}>
                          <img
                            src={ZoomLogo}
                            alt="Zoom"
                            width={20}
                            height={20}
                          />
                          <Typography variant="body2">Zoom</Typography>
                        </Box>
                      </MenuItem>
                      <MenuItem value="bbb">
                        <Box display="flex" alignItems="center" gap={1}>
                          <img
                            src={BBBLogo}
                            alt="BigBlueButton"
                            width={20}
                            height={20}
                          />
                          <Typography variant="body2">BigBlueButton</Typography>
                        </Box>
                      </MenuItem>
                      {/* <MenuItem value="bbb">BigBlueButton</MenuItem>
                      <MenuItem value="zoom">Zoom</MenuItem> */}
                    </TextField>
                  </Grid>



                  <Grid item xs={12}>
                    <Box
                      display={{ xs: "flex", sm: "flex" }}
                      flexDirection={{ xs: "column", sm: "row" }}
                      justifyContent={{ xs: "center", sm: "flex-end" }}
                      gap={1}
                    >
                      <MainButton onClick={CreateRoom}>
                        Create Meeting
                      </MainButton>
                      <CancelButton onClick={handleClosebox}>
                        Cancel
                      </CancelButton>
                    </Box>
                  </Grid>
                </Grid>
              </Container>
            </Box>
          </DialogContent>
        </Dialog>
      </div>
      <BankDetailsPopup
        open={openbank}
        handleClose={handleCloseBankDetailsPopup}
      />
    </>
  );
}
