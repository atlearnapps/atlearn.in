import PropTypes from "prop-types";
import ReactApexChart from "react-apexcharts";
// @mui
import {
  Autocomplete,
  Box,
  Card,
  CardHeader,
  Checkbox,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
// utils
import { fNumber } from "../../../utils/formatNumber";
// components
import { useChart } from "../../../components/chart";
import { useState } from "react";

// ----------------------------------------------------------------------

AppConversionRates.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartData: PropTypes.array.isRequired,
};

export default function AppConversionRates({
  title,
  subheader,
  chartData,
  direction,
  users,
  setSelectedNamesData,
  ...other
}) {
  const theme = useTheme();
  const chartLabels = chartData.map((i) => i.label);

  const chartSeries = chartData.map((i) => i.value);

  const chartOptions = useChart({
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: () => "",
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: direction ? false : true,
        barHeight: "28%",
        borderRadius: 2,
      },
    },
    xaxis: {
      categories: chartLabels,
    },
    // legend: {
    //   position: 'top',
    // },
  });

  const allNames = users ? users : []; // Full list of names
  const [selectedNames, setSelectedNames] = useState([]);

  const handleChange = (event, newValue) => {
    setSelectedNamesData(newValue);
    setSelectedNames(newValue); // Store the selected objects
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
        style={{backgroundColor:theme.palette.primary.main,padding:"15px",color:"white"}}
      />

      <Box sx={{ mx: 3,mt:2 }} dir="ltr">
        {allNames?.length > 0 && (
          <Autocomplete
            sx={{ width: "350px" }}
            limitTags={2}
            multiple
            id="searchable-autocomplete"
            options={allNames}
            disableCloseOnSelect
            getOptionLabel={(option) => option.name} // Display the name property
            value={selectedNames}
            onChange={handleChange}
            isOptionEqualToValue={(option, value) => option.id === value.id} // Compare by id
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox checked={selected} style={{ marginRight: 8 }} />
                {option.name} {/* Display the name in the list */}
              </li>
            )}
            renderInput={(params) => (
              <TextField {...params} placeholder="Search Users..." />
            )}
            ListboxProps={{
              style: {
                maxHeight: "200px", // Adjust the maxHeight as needed
                overflowY: "auto",
              },
            }}
          />
        )}

        {chartData?.length > 0 ? (
          <ReactApexChart
            type="bar"
            series={[{ data: chartSeries }]}
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
