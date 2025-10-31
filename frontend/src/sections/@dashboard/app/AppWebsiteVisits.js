// import 'rsuite/dist/rsuite.min.css';
import PropTypes from "prop-types";
import ReactApexChart from "react-apexcharts";
// @mui
import { Card, CardHeader, Box, Typography, useTheme } from "@mui/material";
// components
import { useChart } from "../../../components/chart";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import DatePickerPIc from "react-datepicker";
import CustomInput from "src/components/CustomInput";
import "src/App.css";
// ----------------------------------------------------------------------

AppWebsiteVisits.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartData: PropTypes.array.isRequired,
  chartLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
  onYearChange: PropTypes.func,
};

export default function AppWebsiteVisits({
  title,
  subheader,
  chartLabels,
  chartData,
  onYearChange,
  fetchdata,
  ...other
}) {
  const [yearstr, setYear] = useState(dayjs());
  const theme = useTheme();
  const handleYearChange = (newDate) => {
    // Extract the year from the new date and pass it to the parent component
    const newYear = dayjs(newDate).year();
    setYear(newDate);
    onYearChange(newYear);
  };

  const chartOptions = useChart({
    plotOptions: { bar: { columnWidth: "16%" } },
    fill: { type: chartData.map((i) => i.fill) },
    labels: chartLabels,
    // xaxis: { type: 'datetime' },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      // categories: [chartData?.xaxis],
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== "undefined") {
            return `${y.toFixed(0)} visits`;
          }
          return y;
        },
      },
    },
  });

  const [dateRange, setDateRange] = useState([null, null]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  // const [currentYear, setCurrentYear] = useState(new Date("2023-02-25").getFullYear());
  useEffect(() => {
    if (dateRange[0]) {
      setStartDate(dateRange[0]);
    } else {
      setStartDate(undefined);
    }

    if (dateRange[1]) {
      setEndDate(dateRange[1]);
    } else {
      setEndDate(undefined);
    }
  }, [dateRange]);

  const convertDate = (dates) => {
    const startDate = new Date(dates[0]);
    const endDate = new Date(dates[1]);

    const formattedStartDate = startDate.toISOString().split("T")[0]; // "2024-09-01"
    const formattedEndDate = endDate.toISOString().split("T")[0]; // "2024-09-24"
    fetchdata(null, formattedStartDate, formattedEndDate);
  };

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        titleTypographyProps={{ style: { fontSize: "20px", fontWeight: 600 } }}
        subheaderTypographyProps={{
          style: { fontSize: "26px", fontWeight: 600 },
        }}
        sx={{backgroundColor:theme.palette.primary.main,padding:"15px",color:"white"}}
      ></CardHeader>

      <Box sx={{ p: 3, pb: 1, minHeight: 364 }} dir="ltr">
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                value={dayjs(yearstr)}
                label="Year"
                views={["year"]}
                onChange={handleYearChange}
              />
            </DemoContainer>
          </LocalizationProvider>

          {/* <DateRangePicker size="lg" /> */}
          <DatePickerPIc
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => {
              convertDate(update);
              setDateRange(update);
            }}
            calendarStartDay={1}
            placeholderText="Select a date range" // Placeholder text
            customInput={<CustomInput placeholder="Select a date range" />}
          />
        </Box>

        {chartData[0]?.data?.length > 0 ? (
          <ReactApexChart
            type="line"
            series={chartData}
            options={chartOptions}
            height={364}
          />
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
            <Typography
              variant="subtitle1"
              sx={{ color: "#E8063C" }}
              // style={{
              //   fontSize: "1.6rem",
              // }}
            >
              No Data !
            </Typography>
          </Box>
        )}
      </Box>
    </Card>
  );
}
