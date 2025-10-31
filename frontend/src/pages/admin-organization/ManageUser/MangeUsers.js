import { useEffect, useState } from "react";
import { Card, Stack, Container, Typography, Box, Tab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import apiClients from "src/apiClients/apiClients";
import AddUser from "src/components/dashboard/adduser/AddUser";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import ManageUserTable from "src/components/dashboard/organization/ManageUserTable/ManageUserTable";
import BannedUserTable from "src/components/dashboard/organization/ManageUserTable/BannedUserTable";
import MainButton from "src/components/Button/MainButton/MainButton";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Animations from "src/components/Loader";
import PendingUserTable from "src/components/dashboard/organization/ManageUserTable/PendingUserTable";
import SecondaryButton from "src/components/Button/SecondaryButton/SecondaryButton";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import siteSetting from "src/utils/siteSetting";
import InviteUser from "src/components/dashboard/adduser/InviteUser";
import { Helmet } from "react-helmet";
import { BASE_URL } from "src/apiClients/config";
import SendMessage from "src/components/dashboard/sendMail/SendMessage";
// ----------------------------------------------------------------------

export default function UserPage() {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [openuser, setOpenuser] = useState(false);
  const [loader, setLoader] = useState(true);
  const [value, setValue] = useState("1");
  const [users, setUsers] = useState([]);
  const [method, setMethod] = useState("");
  const [sitesetting, setSiteSetting] = useState(null);
  const [openInvite, setOpenInvite] = useState(false);



  useEffect(() => {
    fetchData();
    fetchSiteSetting();
  }, []);

  useEffect(() => {
    // Call fetchData function when the component mounts
    const getData = async () => {
      try {
        const result = await siteSetting();
        if (result) {
          setSiteSetting(result);
        }

        // Handle the data as needed
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getData();
  }, []);
  const fetchSiteSetting = async () => {
    const data = {
      name: ["RegistrationMethod"],
    };
    try {
      const response = await apiClients.getSiteSettings(data);
      if (response.data) {
        response.data.forEach((item) => {
          switch (item.setting.name) {
            case "RegistrationMethod":
              setMethod(item.value);

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

  if (user) {
    if (user?.permission?.["ManageUsers"] !== "true") {
      navigate("/404");
    }
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClickOpen = () => {
    setOpenuser(true);
  };

  const handleClose = () => {
    setOpenuser(false);
  };

  const handleCloseInvite = () => {
    setOpenInvite(false);
  };

  const fetchData = async () => {
    try {
      const resp = await apiClients.getAllNewUsers();
      if (resp.data) {
        setUsers(resp.data);
        setLoader(false);
      }
    } catch (error) {
      console.log(error);
    }
  };



  return (
    <>
      <Helmet>
        <title>Manage Organization Users - Atlearn</title>
        <meta
          name="description"
          content="Efficiently manage users in your organization with Atlearn. Assign roles, control access, and ensure smooth team collaboration effortlessly."
        />
        <link rel="canonical" href={`${BASE_URL}/organization/users`} />
      </Helmet>

      <Container maxWidth={"xl"}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography style={{ fontSize: "2rem", fontWeight: 400 }}>
            Manage Users
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {sitesetting?.registration === "invite" && (
              <SecondaryButton onClick={() => setOpenInvite(true)}>
                <MailOutlineIcon sx={{ mr: 1 }} />
                Invite User
              </SecondaryButton>
            )}

            <MainButton onClick={handleClickOpen}>
              <AddIcon sx={{ mr: 1 }} />
              New User
            </MainButton>
          
              {/* <MainButton onClick={handleClickOpen}>
                <AddIcon sx={{ mr: 1 }} />
                New User
              </MainButton> */}
              <SendMessage users={users} />
          
          </Box>
        </Stack>
        <AddUser
          open={openuser}
          handleClose={handleClose}
          fetchData={fetchData}
        />
        {openInvite && (
          <InviteUser open={openInvite} handleClose={handleCloseInvite} />
        )}

        <Card>
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                  // sx={{
                  //   '& .MuiTab-root': {
                  //     color: 'primary.main',
                  //     '&.Mui-selected': {
                  //       color: 'primary.main',
                  //     },
                  //   },
                  //   '& .MuiTabs-indicator': {
                  //     backgroundColor: 'primary.main',
                  //   },
                  // }}
                >
                  {/* <Tab className="tabheading" label="Active" value="1" /> */}
                  {/* {method === "approval" && (
                    <Tab className="tabheading" label="Pending" value="2" />
                  )}
                  <Tab className="tabheading" label="Banned" value="3" /> */}
                </TabList>
              </Box>
              <TabPanel value="1">
                {loader ? (
                  <Animations />
                ) : (
                  <ManageUserTable userData={users} fetchData={fetchData} />
                )}
              </TabPanel>
              <TabPanel value="2">
                {loader ? (
                  <Animations />
                ) : (
                  <PendingUserTable userData={users} fetchData={fetchData} />
                )}
              </TabPanel>
              <TabPanel value="3">
                {loader ? (
                  <Animations />
                ) : (
                  <BannedUserTable userData={users} fetchData={fetchData} />
                )}
              </TabPanel>
            </TabContext>
          </Box>
        </Card>
      </Container>
    </>
  );
}
