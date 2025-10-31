import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Link, Drawer } from "@mui/material";
import useResponsive from "../../../hooks/useResponsive";
// components
import Scrollbar from "../../../components/scrollbar";
import NavSection from "../../../components/nav-section";
//
import { profileNavConfig } from "./config";
import { useSelector } from "react-redux";
import FarlanesLogo from "src/assets/images/Logo/Atlearn-Dark-Logo-WO-BG.svg";
import Logo from "src/components/Logo";
// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

// ----------------------------------------------------------------------

ProfileNav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function ProfileNav({ openNav, onCloseNav }) {
  const { pathname } = useLocation();
  const { user } = useSelector((state) => state.user);
  const isDesktop = useResponsive("up", "lg");
  const [GuestUser, setGuestUser] = useState(true);
  const navigator = useNavigate();
  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (user?.permission?.["CreateRoom"] === "true") {
      setGuestUser(false);
    } else {
      setGuestUser(true);
    }
  }, [user?.permission]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        "& .simplebar-content": {
          height: 1,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none"></Link>
      </Box>

      <NavSection data={profileNavConfig} guest={GuestUser} />

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              backgroundColor: "white",

              // background: "none",
              overflowY: "auto",
            },
          }}
        >
          <Box
            onClick={() => navigator("/")}
            sx={{ display: "inline-flex", cursor: "pointer" }}
          >

            <Logo/>
          </Box>

          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH },
          }}
        >
          <Box
            onClick={() => navigator("/")}
            sx={{  display: "inline-flex", cursor: "pointer" }}
          >
     <Logo/>
          </Box>
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
