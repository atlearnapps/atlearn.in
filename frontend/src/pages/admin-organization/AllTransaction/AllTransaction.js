import { Card, Container, Stack, Typography } from "@mui/material";
import React from "react";
// import Scrollbar from "src/components/scrollbar/Scrollbar";
import AllTransactionTable from "./AllTransactionTable";
function AllTransaction() {
  return (
    <div>
      <Container maxWidth={"xl"}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography  style={{ fontSize: "2rem", fontWeight: 400 }}>All Transactions</Typography>
        </Stack>
        <Card>
          <Container maxWidth={"xl"}>
            {/* <Scrollbar> */}
              <AllTransactionTable />
            {/* </Scrollbar> */}
          </Container>
        </Card>
      </Container>
    </div>
  );
}

export default AllTransaction;
