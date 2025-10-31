
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
// @mui
import { styled } from "@mui/material/styles";
//
import Header from "./header";
import ProfileNav from "./nav/ProfileNavIndex";
import BackButton from "src/components/Button/BackButton/BackButton";
import apiClients from "src/apiClients/apiClients";
import { setUser } from "src/Redux/userSlice";
import { useDispatch } from "react-redux";

// import backgroundImage from "../../images/blue-abstract-gradient-wave-wallpaper.jpg"

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const StyledRoot = styled("div")({
  display: "flex",
  minHeight: "100%",
  overflow: "hidden",
  // backgroundImage: `url(${backgroundImage})`,
  backgroundColor: "#F7F8FA",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center center",
});

const Main = styled("div")(({ theme }) => ({
  flexGrow: 1,
  overflow: "auto",
  minHeight: "100%",
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up("lg")]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

// ----------------------------------------------------------------------

export default function ProfileDashboardLayout() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    fetchTotalDuration();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const session = async () => {
    try {
      const responseData = await apiClients.sessionData();
      if (responseData?.success === true) {
        if (responseData?.data) {
          dispatch(setUser(responseData.data));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTotalDuration = async () => {
    try {
      const response = await apiClients.getTotalduration();
      if (response) {
        session();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <StyledRoot>
      <Header onOpenNav={() => setOpen(true)} />

      <ProfileNav openNav={open} onCloseNav={() => setOpen(false)} />

      <Main>
        <div style={{marginLeft:"10px"}}>
        <BackButton />
        </div>
    
        <Outlet />
      </Main>
    </StyledRoot>
  );
}
