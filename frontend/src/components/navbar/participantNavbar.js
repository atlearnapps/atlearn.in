import React from "react";
import { useNavigate } from 'react-router-dom';
import Container from "@mui/material/Container";
import { green, pink } from "@mui/material/colors";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import HomeIcon from "@mui/icons-material/Home";
import VideocamIcon from "@mui/icons-material/Videocam";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { IconButton, ListItemIcon, Menu, MenuItem } from "@mui/material";
import { Logout} from "@mui/icons-material";
function ParticipantNavbar() {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout=()=>{
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    handleClose();
    navigate('/login', { replace: false });

  }

  return (
    <div
      style={{
        height: "65px",
        borderBottom: "1px solid rgba(0,40,100,0.12)",
        background:"#ffff"
        // background: "linear-gradient(195deg, rgb(66, 66, 74), rgb(25, 25, 25))"
      }}
    >
      <Container maxWidth="lg">
        <div
          style={{
            height: "65px",
            borderBottom: "1px solid rgba(0,40,100,0.12)",
            paddingTop: "15px",
            display: "flex",
            justifyContent: "end",
          }}
        >
          <Stack direction="row" spacing={2} mb={1}>
          <IconButton  onClick={() => navigate("/room")}>
          <Avatar style={{ cursor: "pointer" }}>
              <HomeIcon />
            </Avatar>
          </IconButton>
            
            <IconButton onClick={() => navigate("/recordings")}>
            <Avatar   style={{ cursor: "pointer", backgroundColor: pink[500] }}>
              <VideocamIcon />
            </Avatar>
            </IconButton>
            
            <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar  style={{ cursor: "pointer", backgroundColor: green[500] }}>
              <AccountCircle />
            </Avatar>
          </IconButton>
          <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => navigate("/userprofile")}>
          <Avatar /> Profile
        </MenuItem>
        
        {/* <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem> */}
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
          </Stack>
        </div>
      </Container>
    </div>
  );
}

export default ParticipantNavbar;
