import { Box, Switch, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import apiClients from "src/apiClients/apiClients";
import { toast } from "react-toastify";
function Settings() {
  const [shareRoom, setShareRoom] = useState(false);
  const [presentation, setPresentation] = useState(false);
  const [shareId, setShareId] = useState(null);
  const [presentationId, setPresentationId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = {
      name: ["ShareRooms", "PreuploadPresentation"],
    };
    try {
      const response = await apiClients.getSiteSettings(data);
      if (response.data) {
        response.data.forEach((item) => {
          switch (item.setting.name) {
            case "ShareRooms":
              // setShareRoom(item.value);
              setShareRoom(item.value === "true" ? true : false);
              setShareId(item.id);
              break;
            case "PreuploadPresentation":
              // setPresentation(item.value);
              setPresentation(item.value === "true" ? true : false);
              setPresentationId(item.id);
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

  const handleShareRoomChange = () => {
    const newValue = !shareRoom;
    setShareRoom(newValue);

    if (shareId) {
      updateData(shareId, newValue);
    }
  };

  const handlePresentationChange = () => {
    const newValue = !presentation;
    setPresentation(newValue);

    if (presentationId) {
      updateData(presentationId, newValue);
    }
  };

  const updateData = async (id, value) => {
    const data = {
      value: value.toString(),
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

  return (
    <>
      <Box mb={2}>
        <Typography variant="h5">Allow Users to Share Rooms</Typography>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="body1" gutterBottom>
            Setting to disabled will remove the button from the room options
            dropdown, preventing users from sharing rooms
          </Typography>
          <Switch checked={shareRoom} onChange={handleShareRoomChange}  />
        </Box>
      </Box>
      <Box>
        <Typography variant="h5">
          Allow Users to Preupload Presentations
        </Typography>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="body1" gutterBottom >
            Users can preupload a presentation to be used as the default
            presentation for that specific room
          </Typography>
          <Switch checked={presentation} onChange={handlePresentationChange} />
        </Box>
      </Box>
    </>
  );
}

export default Settings;
