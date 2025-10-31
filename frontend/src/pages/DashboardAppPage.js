import { Helmet } from "react-helmet-async";
import { Grid, Container } from "@mui/material";
// components
import Iconify from "../components/iconify";
import meetingIcon from "src/images/room/Vector (3).svg";
// sections
import {
  AppNewsUpdate,
  AppOrderTimeline,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppConversionRates,
  AppTasks,
  // AppRoomShared,
} from "../sections/@dashboard/app";
import apiClients from "src/apiClients/apiClients";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SecondaryButton from "src/components/Button/SecondaryButton/SecondaryButton";
import classImage from "src/images/landingpages/Rectangle 347.svg";
import LiveRoomTable from "src/components/dashboard/chart/liveRoom/LiveRoomTable";
import { setPageLoading } from "src/Redux/loadingSlice";
import { UseAuth } from "src/utils/UseAuth/UseAuth";
// import { AppRoomShared } from "src/sections/@dashboard/app/AppRoomShared";
// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const today = new Date();
  const yearstr = today.getFullYear();
  const { user } = useSelector((state) => state.user);
  const [chartData, setChartData] = useState();
  const [roomUpdates, setRoomUpdates] = useState();
  const [roomStatus, setRoomStatus] = useState();
  const [subscription_Count, setSubScription_Count] = useState([]);
  const [schedule_Count, setSchedule_Count] = useState([]);
  const [notification, setNotfication] = useState(false);
  const [daydiff, setDayDiff] = useState();
  const [invitesData, setInvitesData] = useState();
  const [feedbackData, setFeedbackData] = useState([]);
  const [year, setYear] = useState(yearstr);
  const [users, setUsers] = useState([]);
  const [selectedNames, setSelectedNames] = useState([]);
  // const [sharedRoom, setSharedRoom] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = UseAuth();
  useEffect(() => {
    dispatch(setPageLoading(true));
    if (user) {
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
        setDayDiff(expirationThreshold - daysDifference);

        if (daysDifference >= expirationThreshold) {
          setNotfication(false);
        } else {
          if (expirationThreshold - daysDifference <= 14) {
            setNotfication(true);
          } else {
            setNotfication(false);
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    romUpdates();
    scheduleMeeting();
    subscriptionCount();
    invitesSent();
    get_feedback();
    fetchUsers();
    // fetchRoomSharedDetails();
  }, []);

  useEffect(() => {
    roomCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNames]);

  useEffect(() => {
    if (year) {
      roomVisiters(year);
    }
  }, [year]);

  const roomCount = async () => {
    try {
      const data = {
        user: selectedNames ? selectedNames : null,
      };
      const response = await apiClients.roomCount(data);
      if (response.data) {
        setChartData(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const romUpdates = async () => {
    try {
      const response = await apiClients.roomUpdates();
      if (response?.data) {
        let data = response.data;
        data?.sort((a, b) => new Date(b.date) - new Date(a.date));
        setRoomUpdates(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const roomVisiters = async (year, start, end) => {
    try {
      const data = {
        year: year,
        startDate: start ? start : null,
        endDate: end ? end : null,
      };
      const response = await apiClients.roomVisitors(data);
      if (response?.data) {
        setRoomStatus(response?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const scheduleMeeting = async () => {
    try {
      const response = await apiClients.scheduleCount();
      if (response.data) {
        setSchedule_Count(response.data);
      }
      // const data = response?.data || [];
      // const duplicatedData = Array(15).fill(data);
      // setSchedule_Count(duplicatedData);
    } catch (error) {
      console.log(error);
    }
  };

  const subscriptionCount = async () => {
    try {
      const response = await apiClients.subscriptionCount();
      if (response.data) {
        setSubScription_Count(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const invitesSent = async () => {
    try {
      const response = await apiClients.invitesSent();
      if (response.data) {
        setInvitesData(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const get_feedback = async () => {
    try {
      const response = await apiClients.get_feedback();
      if (response.data) {
        setFeedbackData(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onYearChange = (data) => {
    setYear(data);
  };

  const fetchUsers = async () => {
    try {
      const response = await apiClients.all_users();
      if (response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const fetchRoomSharedDetails = async () => {
  //   try {
  //     const response = await apiClients.roomShared();
  //     if (response.data) {
  //       setSharedRoom(response.data);
  //     }
  //   } catch (error) {
  //     console.log();
  //   }
  // };

  return (
    <>
      <Helmet>
        <title>Atlearn Organization Dashboard Overview</title>
        <meta
          name="description"
          content="Explore the Atlearn Organization Dashboard. Manage users, monitor performance, and access insights for better organizational management."
        />
        <link rel="canonical" href="https://www.atlearn.in" />
      </Helmet>

      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
            mb: 2,
          }}
        >
          {notification && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#F5F6F7",
                padding: "20px",
                border: "2px solid #B4CDEB",
                borderRadius: "20px",
                // position: "relative", // added position relative
              }}
            >
              <div style={{ flex: 0.5, textAlign: "center" }}>
                <img
                  src={classImage}
                  alt="CheckIcon"
                  style={{ width: "50px", height: "50px" }}
                />
              </div>
              <div style={{ flex: 3, textAlign: "center" }}>
                {`Your ${
                  user?.user?.subscription?.name === "Free"
                    ? user?.user?.subscription?.name + " trial "
                    : user?.user?.subscription?.name + " plan "
                }  period has only ${daydiff}  days remaining.`}
              </div>
              <div style={{ flex: 1, textAlign: "center" }}>
                <SecondaryButton
                  onClick={() => navigate("/Pricing")}
                  style={{ fontSize: "0.8rem", padding: "10px" }}
                >
                  Get it now
                </SecondaryButton>
              </div>
            </div>
          )}
        </Grid>
      </Grid>

      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={12}>
            {/* <LiveRoom /> */}
            <LiveRoomTable />
          </Grid>

          {roomStatus && (
            <Grid item xs={12} md={6} lg={8}>
              <AppWebsiteVisits
                onYearChange={onYearChange}
                title="Room Visits"
                // chartLabels={roomStatus?.formattedDate}
                chartLabels={["2024-03-01", "2024-04-01", "2024-05-01"]}
                chartData={[
                  {
                    name: "",
                    type: "area",
                    fill: "gradient",
                    data: roomStatus?.participants,
                    // xaxis:roomStatus?.date
                  },
                ]}
                fetchdata={roomVisiters}
              />
            </Grid>
          )}
          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Scheduled Meetings"
              list={schedule_Count?.map((item, index) => ({
                id: index,
                title: item.name,
                type: `order${index + 1}`,
                time: new Date(item?.date),
              }))}
            />
          </Grid>

          {chartData && (
            <Grid item xs={12} md={6} lg={12}>
              <AppConversionRates
                title="Room Rates"
                chartData={chartData}
                users={users}
                setSelectedNamesData={setSelectedNames}
              />
            </Grid>
          )}

          {subscription_Count && (
            <Grid item xs={12} md={6} lg={12}>
              <AppConversionRates
                title="Subscription Plan"
                chartData={subscription_Count}
                direction={true}
              />
            </Grid>
          )}
          {/* {sharedRoom?.length>0 && (
            <Grid item xs={12} md={6} lg={12}>
              <AppRoomShared title="Room Shared" chartData={sharedRoom} />
            </Grid>
          )} */}
          {roomUpdates && (
            <Grid item xs={12} md={6} lg={6}>
              <AppNewsUpdate
                title="Rooms History"
                list={roomUpdates.map((item, index) => ({
                  id: index,
                  title: item.name,
                  image: meetingIcon,
                  postedAt: new Date(item.date),
                  owner: item.owner,
                  duration: item.duration,
                }))}
              />
            </Grid>
          )}

          <Grid item xs={12} md={6} lg={6}>
            <AppTasks
              title="Feedback"
              list={feedbackData}
              fechData={get_feedback}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite
              title="Invites Sent"
              list={[
                {
                  name: "Email",
                  value: invitesData?.email?.total
                    ? invitesData?.email?.total
                    : 0,
                  icon: (
                    <Iconify
                      icon={"eva:email-fill"}
                      color="#DF3E30"
                      width={32}
                    />
                  ),
                },
              ]}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
