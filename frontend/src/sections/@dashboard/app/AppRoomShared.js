import PropTypes from "prop-types";
import ReactApexChart from "react-apexcharts";
import { Box, Card, CardHeader, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import RoomSharedDetails from "src/components/dashboard/roomSharedDetails/RoomSharedDetails";

AppRoomShared.propTypes = {
  title: PropTypes.string,
  chartData: PropTypes.array.isRequired,
};

export default function AppRoomShared({ title, chartData }) {
  const theme = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickedUserDetails, setClickedUserDetails] = useState(null);
  const [userName, setUserName] = useState("");

  const userNames = Array.from(new Set(chartData?.map((item) => item.userName)));
  const roomNames = Array.from(new Set(chartData?.map((item) => item.roomName)));

  const chartSeries = roomNames.map((room) => ({
    name: room,
    data: userNames.map(
      (user) =>
        chartData.find((item) => item.userName === user && item.roomName === room)?.sharedWith
          ?.length || 0
    ),
  }));

  const handleDataPointSelection = (event, chartContext, config) => {
    const selectedUser = userNames[config?.dataPointIndex];
    if (!selectedUser) return;

    const userDetails = chartData.filter(
      (item) => item.userName === selectedUser && item.sharedWith.length > 0
    );

    setUserName(selectedUser);
    setClickedUserDetails(userDetails);
    setIsModalOpen(true);
  };

  const chartOptions = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: { enabled: true },
      events: {
        dataPointSelection: handleDataPointSelection,
      },
    },
    xaxis: {
      categories: userNames,
      title: { text: "User Names" },
    },
    yaxis: {
      title: { text: "Number of Users Sharing" },
    },
    plotOptions: {
      bar: { horizontal: true },
    },
    legend: { show: false },
    grid: {
      strokeDashArray: 3,
      borderColor: theme.palette.divider,
      xaxis: { lines: { show: false } },
    },
  };

  return (
    <Card>
      <CardHeader
        title={title}
        titleTypographyProps={{ style: { fontSize: "26px", fontWeight: 600 } }}
        style={{
          backgroundColor: theme.palette.primary.main,
          padding: "15px",
          color: "white",
        }}
      />
      <Box sx={{ mx: 3, mt: 2 }} dir="ltr">
        {chartData.length > 0 ? (
          <ReactApexChart options={chartOptions} series={chartSeries} type="bar" height={350} />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: 380,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="subtitle1" sx={{ color: "#E8063C" }}>
              No Data !
            </Typography>
          </Box>
        )}
      </Box>
      <RoomSharedDetails
        open={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        clickedUserDetails={clickedUserDetails}
        userName={userName}
      />
    </Card>
  );
}
