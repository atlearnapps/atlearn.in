import { Box, Container, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
// import classImage from "src/images/landingpages/Rectangle 347.svg";
// import SecondaryButton from "../Button/SecondaryButton/SecondaryButton";
import NotificationPopup from "src/components/Notification/NotificationPopup";

import MainButton from "../Button/MainButton/MainButton";
import apiClients from "src/apiClients/apiClients";
function Notification({ setNotfication, type }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  // const [daydiff, setDayDiff] = useState(0);
  const [showNotification, setShowNotfication] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const handleRoomSettings = async () => {
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await apiClients.expiredPlan();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (
      user?.user?.subscription_start_date &&
      user?.user?.subscription_expiry_date &&
      "Super Admin" !== user?.user?.role?.name &&
      "Guest" !== user?.user?.role?.name &&
      "Administrator" !== user?.user?.role?.name
    ) {
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
      // setDayDiff(expirationThreshold - daysDifference);

      if (daysDifference >= expirationThreshold) {
        if (user?.user?.subscription_pending === true) {
          setNotfication(false);
          setShowNotfication(false);
        } else {
          handleRoomSettings();
          setNotfication(true);
          setShowNotfication(true);
          setModalOpen(true);
        }
      } else {
        setNotfication(false);
        setShowNotfication(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.user]);

  const handleModalClose = () => {
    setModalOpen(false);
    navigate("/settings/mysubscription");
  };
  return (
    <div>
      {type === "modal" ? (
        <NotificationPopup
          open={modalOpen}
          handleClose={handleModalClose}
          heading={"Plan Expired"}
          message={
            "Your current plan has expired. Please renew your plan or upgrade to continue using our services."
          }
          buttonName={
            user?.user?.subscription?.name === "Free"
              ? "Upgrade Now "
              : "Renew Now"
          }
        />
      ) : (
        showNotification && (
          <Container maxWidth={"xl"} sx={{ marginTop: 0 }}>
            <Grid container spacing={2}>
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: { xs: "center", sm: "flex-end" },
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#F5F6F7",
                    padding: "20px",
                    border: "2px solid #B4CDEB",
                    borderRadius: "20px",
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  {/* <div style={{ flex: 0.5, textAlign: "center" }}>
                    <img
                      src={classImage}
                      alt="CheckIcon"
                      style={{ width: "50px", height: "50px" }}
                    />
                  </div> */}
                  <div
                    style={{
                      flex: 3,
                      textAlign: "center",
                      marginLeft:
                        location.pathname === "/settings/mysubscription"
                          ? ""
                          : "20px",
                    }}
                  >
                    {/* "Your subscription has expired. To continue enjoying our services, please renew your subscription now." */}
                    {`Your ${
                      user?.user?.subscription?.name === "Free"
                        ? user?.user?.subscription?.name + " trial "
                        : user?.user?.subscription?.name + " plan "
                    }  period has expired`}
                    {/* <br /> */}
                    <span>{` please  ${
                      user?.user?.subscription?.name === "Free"
                        ? "upgrade your plan "
                        : "renew your subscription now"
                    }`}</span>
                  </div>

                  {location.pathname !== "/settings/mysubscription" && (
                    <div style={{ flex: 1, textAlign: "center" }}>
                      <MainButton
                        onClick={() => navigate("/settings/mysubscription")}
                        style={{
                          fontSize: "0.8rem",
                          padding: "10px",
                          width: "150px",
                          marginLeft: "30px",
                        }}
                      >
                        {user?.user?.subscription?.name === "Free"
                          ? "Upgrade Now "
                          : "Renew Now"}
                      </MainButton>
                    </div>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Container>
        )
      )}
    </div>
  );
}

export default Notification;
