import { Card, Container, Stack, Typography } from "@mui/material";
import React from "react";
import SubscriptionTable from "../../../components/dashboard/organization/SubscriptionTable";
import Scrollbar from "src/components/scrollbar/Scrollbar";
import { Helmet } from "react-helmet";
import { BASE_URL } from "src/apiClients/config";

function Subscriptionplans() {
  return (
    <div>
      <Helmet>
        <title>Choose Subscription Plans | Atlearn LMS </title>
        <meta
          name="description"
          content="Explore flexible subscription plans offered by Atlearn. Unlock AI-driven tools, virtual classrooms, and learning insights for your organization."
        />
        <link
          rel="canonical"
          href={`${BASE_URL}/organization/subscription-plans`}
        />
      </Helmet>
      <Container maxWidth={"xl"}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography  style={{ fontSize: "2rem", fontWeight: 400 }}>Subscription Plans</Typography>
        </Stack>
        <Card>
          <Container maxWidth={"xl"}>
            <Scrollbar>
              <SubscriptionTable />
            </Scrollbar>
          </Container>
        </Card>
      </Container>
    </div>
  );
}

export default Subscriptionplans;
