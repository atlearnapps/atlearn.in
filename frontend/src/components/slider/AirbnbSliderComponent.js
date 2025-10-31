import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Slider from "@mui/material/Slider";


const AirbnbSlider = styled(Slider)(({ theme }) => ({
  // color: "#3a8589",
  height: 50,
  padding: "13px 0",
  "& .MuiSlider-thumb": {
    height: 27,
    width: 27,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    "&:hover": {
      boxShadow: "0 0 0 8px rgba(58, 133, 137, 0.16)",
    },
  },
  "& .MuiSlider-track": {
    height: 5,
  },
  "& .MuiSlider-rail": {
    color: theme.palette.mode === "dark" ? "#bfbfbf" : "#d8d8d8",
    opacity: theme.palette.mode === "dark" ? undefined : 1,
    height: 5,
  },
  "& .MuiSlider-valueLabel": {
    lineHeight: 1.2,
    fontSize: 12,
    background: "unset",
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: "50% 50% 50% 0",
    //   backgroundColor: "#52af77",
    backgroundColor: "#6D207B",
    transformOrigin: "bottom left",
    transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
    "&::before": { display: "none" },
    "&.MuiSlider-valueLabelOpen": {
      transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
    },
    "& > *": {
      transform: "rotate(45deg)",
    },
  },
}));

export default function InputSlider({ values, handleDurationRange }) {
  //   const [value, setValue] = React.useState(values);

  const handleSliderChange = (event, newValue) => {
    // console.log(newValue, "newValuenewValuenewValue");
    handleDurationRange(newValue);
    // setValue(newValue);
  };

  return (
    <Box sx={{ mt: 5 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs>
          <AirbnbSlider
            defaultValue={values}
            value={values}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            valueLabelDisplay="on"
            min={1}
          />
        </Grid>
  
      </Grid>
    </Box>
  );
}
