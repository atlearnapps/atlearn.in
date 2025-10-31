import React, { useState } from "react";
import "./SiteSettings.css";
import { TabContext, TabList, TabPanel } from "@mui/lab";
// import { useDropzone } from "react-dropzone";
import {
  // Avatar,
  Box,
  // Button,
  Card,
  Container,
  Stack,
  Tab,
  Typography,
} from "@mui/material";
// import { ChromePicker } from "react-color";
// import BackupOutlinedIcon from "@mui/icons-material/BackupOutlined";
import Administration from "src/components/dashboard/organization/SiteSettings/Administration/Administration";
import Settings from "src/components/dashboard/organization/SiteSettings/Settings/Settings";
import Registration from "src/components/dashboard/organization/SiteSettings/Registration/Registration";
// import apiClients from "src/apiClients/apiClients";
// import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { BASE_URL } from "src/apiClients/config";
function SiteSettings() {
  const [value, setValue] = useState("1");
  // const [showPicker, setShowPicker] = useState(false);
  // const [showLighten, setShowLighten] = useState(false);
  // const [selectedFile, setSelectedFile] = useState(null);
  // const [fileError, setFileError] = useState("");
  // const [selectedColor, setSelectedColor] = useState("");
  // const [selectedColorId, setSelectedColorId] = useState();
  // const [slectedLightenId, SetSlectedLightenId] = useState();
  // const [slectedLighten, setSelectedLighten] = useState("");
  // const [fileId,setFileId]=useState()
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  // useEffect(() => {
  //   fetchData();
  // }, []);

  if (user) {
    if (user?.permission?.["ManageSiteSettings"] !== "true") {
      navigate("/404");
    }
  }

  // const fetchData = async () => {
  //   const data = {
  //     name: ["PrimaryColorDark", "PrimaryColor","BrandingImage"],
  //   };
  //   try {
  //     const response = await apiClients.getSiteSettings(data);
  //     if (response.data) {
  //       response.data.forEach((item) => {
  //         switch (item.setting.name) {
  //           case "PrimaryColorDark":
  //             setSelectedColor(item.value);
  //             setSelectedColorId(item.id);
  //             break;
  //           case "PrimaryColor":
  //             setSelectedLighten(item.value);
  //             SetSlectedLightenId(item.id);
  //             break;
  //             case "BrandingImage":
  //             setFileId(item.id);
  //             break;
  //           default:
  //             break;
  //         }
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // const handleButtonClick = () => {
  //   // setShowLighten(false);
  //   setShowPicker(!showPicker);
  // };
  // const hnadleLightenButtonClick = () => {
  //   // setShowPicker(false);
  //   setShowLighten(!showLighten);
  // };

  // const handleCancel = () => {
  //   // setSelectedColor(color);
  //   setShowPicker(false);
  // };

  // const handleLightenClose = () => {
  //   setShowLighten(false);
  // };

  // const handleColorChange = (newColor) => {
  //   setSelectedColor(newColor.hex);
  // };

  // const handleLighterColorChnage = (newColor) => {
  //   setSelectedLighten(newColor.hex);
  // };

  // const isFileTypeValid = (file) => {
  //   const validTypes = ["image/png", "image/jpeg", "image/svg+xml"];
  //   return validTypes.includes(file.type);
  // };

  // const onDrop = (acceptedFiles) => {
  //   const file = acceptedFiles[0];
  //   if (file && isFileTypeValid(file)) {
  //     setSelectedFile(file);

  //     updateData(fileId,file.name)
  //     setFileError("");
  //   } else {
  //     setSelectedFile(null);
  //     setFileError(
  //       "Only PNG, JPG, and SVG files are allowed. Please try again."
  //     );
  //   }
  // };

  // const { getRootProps, getInputProps } = useDropzone({ onDrop });
  // const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
  //   onDrop,
  //   accept: 'image/png, image/jpeg, image/svg+xml',
  // });

  // const fileErrorMsg =
  // isDragReject && 'Only PNG, JPG, and SVG files are allowed. Please try again.';

  // const updateData = async (id, value) => {
  //   const data = {
  //     value: value,
  //   };
  //   try {
  //     const response = await apiClients.updateSiteSettings(id, data);
  //     if (response.message) {
  //       toast.success(response.message);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <div>
       <Helmet>
       <title>Configure Site Settings | Atlearn LMS	 </title>
        <meta
          name="description"
          content="Adjust and customize your site settings on Atlearn. Tailor your platform's features to suit the needs of your organization and learners."
        />
        <link rel="canonical" href={`${BASE_URL}/organization/site-settings`} />
       </Helmet>
      <Container maxWidth={"xl"}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography  style={{ fontSize: "2rem", fontWeight: 400 }}>Site Settings</Typography>
        </Stack>
        <Card>
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  aria-label="scrollable force tabs example"
               
                >
                  {/* <Tab  className="tabheading"  label="Appearance" value="1" /> */}
                  <Tab
                    className="tabheading"
                    label="Administration"
                    value="1"
                  />
                  <Tab className="tabheading" label="Settings" value="3" />
                  <Tab className="tabheading" label="Registration" value="4" />
                </TabList>
              </Box>
              {/* <TabPanel value="1">
                <Typography variant="h5" gutterBottom>
                  Brand Color
                </Typography>
                <Button onClick={handleButtonClick} className="regularButton">
                  Regular
                </Button>
                <Button
                  onClick={hnadleLightenButtonClick}
                  sx={{
                    // border: "1px solid #0077c2",
                    padding: "10px 25px",
                    color: "#467FCF",
                    backgroundColor: "#E8EFF9",
                    "&:hover": {
                      backgroundColor: "#E8EFF40",
                    },
                  }}
                >
                  Lighten
                </Button>

                <div style={{ display: "flex", gap: 12 }}>
                  {showPicker && (
                    <div>
                      <ChromePicker
                        color={selectedColor}
                        onChange={handleColorChange}
                      />
                      <Box sx={{ marginTop: "10px" }}>
                        <Button
                          onClick={handleCancel}
                          variant="outlined"
                          sx={{ marginRight: "10px" }}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleregularColor}
                          variant="contained"
                          color="primary"
                        >
                          Save
                        </Button>
                      </Box>
                    </div>
                  )}
                  {showLighten && (
                    <div>
                      <ChromePicker
                        color={slectedLighten}
                        onChange={handleLighterColorChnage}
                      />
                      <Box sx={{ marginTop: "10px" }}>
                        <Button
                          onClick={handleLightenClose}
                          variant="outlined"
                          sx={{ marginRight: "10px" }}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleLightenColor} variant="contained" color="primary">
                          Save
                        </Button>
                      </Box>
                    </div>
                  )}
                </div>

                <Typography
                  sx={{ marginTop: "10px" }}
                  variant="h5"
                  gutterBottom
                >
                  Brand Image
                </Typography>
                <Box {...getRootProps()} className="fileUpload">
                  <input {...getInputProps()} />

                  <Avatar sx={{ width: 80, height: 80 }}>
                    <BackupOutlinedIcon
                      fontSize="large"
                      sx={{ color: "#467FCF" }}
                    />
                  </Avatar>
                  <h3>Click to Upload or drag and drop</h3>

                  <p>
                    Upload any PNG, JPG, or SVG file. Depending on the size of
                    the file, it may require additional time to upload before it
                    can be used
                  </p>
                  {selectedFile && (
                    <div>
                      <img
                        src={URL.createObjectURL(selectedFile)}
                        alt="Selected"
                        className="imageStyle"
                      />
                    </div>
                  )}
                  {fileError && <p style={{ color: "red" }}>{fileError}</p>}
                </Box>
                <Box className="removeBox">
                  <Button className="removeBranding">
                    Remove Branding Image
                  </Button>
                </Box>
              </TabPanel> */}
              <TabPanel value="1">
                <Administration />
              </TabPanel>
              <TabPanel value="3">
                <Settings />
              </TabPanel>
              <TabPanel value="4">
                <Registration />
              </TabPanel>
            </TabContext>
          </Box>
        </Card>
      </Container>
    </div>
  );
}

export default SiteSettings;
