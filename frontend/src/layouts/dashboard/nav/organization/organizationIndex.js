import PropTypes from "prop-types";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// @mui
import { Box, Link, Drawer } from "@mui/material";

// hooks
import useResponsive from "../../../../hooks/useResponsive";
// components
// import Logo from "../../../../components/logo";
// import FarlanesLogo from "src/assets/images/Logo/atlearnMainLogo.svg";
import Logo from "src/components/Logo";
import Scrollbar from "../../../../components/scrollbar";
import NavSection from "../../../../components/nav-section";
//
import { OrganisationConfig } from "../config";
import { useSelector } from "react-redux";

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

// ----------------------------------------------------------------------

OrganizationIndex.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function OrganizationIndex({ openNav, onCloseNav }) {
  const { user } = useSelector((state) => state.user);
  const { pathname } = useLocation();
  // const user = JSON.parse(localStorage.getItem("user"));
  const isDesktop = useResponsive("up", "lg");
  const navigator = useNavigate();
  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

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
      {/* <Box sx={{ px: 2.5, py: 3, display: "inline-flex" }}>
        <Logo />
      </Box> */}

      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none">
          {/* <StyledAccount>
            <Avatar src={account.photoURL} alt="photoURL" />

            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: "text.primary" }}>
                {user?.name}
              </Typography>

              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {account.role}
              </Typography>
            </Box>
          </StyledAccount> */}
        </Link>
      </Box>

      <NavSection data={OrganisationConfig} userPermission={user?.permission} />

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
              overflowY: "auto",
              // mt: 11.7,
              //  borderRight: 'none'
              // boxShadow: '2px 0px 5px rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          <Box
            onClick={() => navigator("/")}
            sx={{ display: "inline-flex", cursor: "pointer" }}
          >
            {/* <img src={FarlanesLogo} alt="logo"></img> */}
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
            {/* <img src={FarlanesLogo} alt="logo"></img> */}
              <Logo/>
          </Box>
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
