import { useState } from "react";
import { Outlet} from "react-router-dom";
// @mui
import { styled } from "@mui/material/styles";
//
import Header from "./header";
// import ProfileNav from './nav/ProfileNavIndex';
import OrganizationIndex from "./nav/organization/organizationIndex";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import ExpiredCard from "src/components/Notification/ExpiredCard";
import BackButton from "src/components/Button/BackButton/BackButton";
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

export default function OrganizationLayout() {
  const [open, setOpen] = useState(false);
  const [expired, setExpired] = useState(false);
  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    if (user?.user) {
      if (
        user?.user?.subscription_start_date &&
        user?.user?.subscription_expiry_date &&
        user?.user?.role?.name !== "Super Admin" &&
        user?.user?.role?.name !== "Administrator"
      ) {
        // const subscriptionStartDate = new Date("2024-01-01");
        const subscriptionStartDate = new Date(
          user?.user?.subscription_start_date
        );
        const subscriptionEndDate = new Date(
          user?.user?.subscription_expiry_date
        );

        const timeDiff = subscriptionEndDate - subscriptionStartDate;
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        const currentDate = new Date();
        const daysDifference = Math.floor(
          (currentDate - subscriptionStartDate) / (1000 * 60 * 60 * 24)
        );

        const expirationThreshold = daysDiff;

        if (daysDifference >= expirationThreshold) {
          setExpired(true);
        } else {
          setExpired(false);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);


  return (
    <StyledRoot>
      <Header onOpenNav={() => setOpen(true)} />
      {expired ? null : (
        <OrganizationIndex openNav={open} onCloseNav={() => setOpen(false)} />
      )}

      <Main>
        <BackButton/>
        {expired ? <ExpiredCard /> : <Outlet />}
      </Main>
    </StyledRoot>
  );
}
