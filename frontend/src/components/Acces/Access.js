import {
  Avatar,
  Box,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import AddIcon from "@mui/icons-material/Add";
import ShareAccess from "./ShareAccess/ShareAccess";
import "./Access.css";
import SearchIcon from "@mui/icons-material/Search";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import apiClients from "src/apiClients/apiClients";
import { toast } from "react-toastify";
import SecondaryButton from "../Button/SecondaryButton/SecondaryButton";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Access({ Roomid }) {
  // const Roomid = useParams();
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [sharesUsers, setSharedUsers] = useState();
  useEffect(() => {
    if (Roomid) {
      fetchData(Roomid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Roomid]);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClickClose = () => {
    if (Roomid) {
      fetchData(Roomid);
    }
    setOpen(false);
  };

  const fetchData = async (id) => {
    try {
      const response = await apiClients.share_access(id);
      if (response.data) {
        setSharedUsers(response.data);
      } else if (response.success === false) {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteShareUser = async (id, userId) => {
    try {
      const response = await apiClients.deleteShareAccess(id);
      if (response.success === true) {
        toast.success(response.message);
        if (user?.user?.id === userId) {
          navigate("/room");
        }

        if (Roomid) {
          fetchData(Roomid);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {sharesUsers?.length ? (
        <Container>
          <div
            style={{
              marginTop: "20px",
              marginBottom: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TextField
              className="homeSearch"
              label="Search"
              variant="outlined"
              // value={searchTerm}
              // onChange={handleSearchChange}
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <SecondaryButton onClick={handleClickOpen} className="secondButton">
              <AddIcon fontSize="small" sx={{ marginRight: "10px" }} /> Share
              Access
            </SecondaryButton>
          </div>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              // minHeight: "40vh",
              border: "1px solid #ccc",
              borderRadius: "10px",
            }}
          >
            {sharesUsers.map((item, index) => (
              <>
                <Container>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        p: 2,
                      }}
                    >
                      <Avatar sx={{ width: 44, height: 44 }} />
                      <Typography
                        sx={{
                          fontWeight: 500,
                          fontSize: "16px",
                          color: "primary.main",
                        }}
                      >
                        {item?.user?.name}
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton
                        onClick={() =>
                          handleDeleteShareUser(item?.id, item?.user_id)
                        }
                      >
                        <DeleteOutlineIcon sx={{color:"red"}} />
                      </IconButton>
                    </Box>
                  </Box>
                </Container>
                <Divider />
              </>
            ))}
          </Box>
        </Container>
      ) : (
        <div
          style={{
            minHeight: "40vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "2px dashed #ccc",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Avatar sx={{ width: 80, height: 80 }}>
              <PersonAddAltIcon sx={{ color: "#001B48", fontSize: 40 }} />
            </Avatar>

            <Typography variant="h5" align="center" color="primary">
              Time to add some users!
            </Typography>

            <p style={{ textAlign: "center" }}>
              To add new users, click the button below and search or select the
              users you want to share this room with.
            </p>
            <SecondaryButton onClick={handleClickOpen}>
              <AddIcon fontSize="small" sx={{ marginRight: "10px" }} /> Share
              Access
            </SecondaryButton>
          </Box>
        </div>
      )}
      <ShareAccess open={open} handleClose={handleClickClose} Roomid={Roomid} />
    </>
  );
}

export default Access;
