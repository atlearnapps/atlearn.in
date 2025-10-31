import { Box, Card, Container, Stack, Tab, Typography } from "@mui/material";
import React, { useState } from "react";
import Table from "../../../components/dashboard/organization/serverRoom/Tables";
import OnlineTable from "src/components/dashboard/organization/serverRoom/OnlineTable";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Helmet } from "react-helmet";
import { BASE_URL } from "src/apiClients/config";

function ServerRoom() {
  const navigate = useNavigate();
  const [value, setValue] = useState("1");
  const { user } = useSelector((state) => state.user);
  if (user) {
    if (user?.permission?.["ManageRooms"] !== "true") {
      navigate("/404");
    }
  }
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Helmet>
        <title>Manage Server Rooms | Atlearn LMS</title>
        <meta
          name="description"
          content="Efficiently manage and configure server rooms with Atlearn. Ensure smooth operation of virtual classrooms and online learning environments."
        />
        <link rel="canonical" href={`${BASE_URL}/organization/server-rooms`} />
      </Helmet>
      <Container maxWidth={"xl"}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography style={{ fontSize: "2rem", fontWeight: 400 }}>
            Server Room
          </Typography>
        </Stack>
        <Card>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab className="tabheading" label="offline" value="1" />

                <Tab className="tabheading" label="online" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <Table />
            </TabPanel>
            <TabPanel value="2">
              <OnlineTable />
            </TabPanel>
            <TabPanel value="3"></TabPanel>
          </TabContext>
          {/* <Container maxWidth={"xl"}>
            <Scrollbar>
              <Table />
            </Scrollbar>
          </Container> */}
        </Card>
      </Container>
    </div>
  );
}

export default ServerRoom;
