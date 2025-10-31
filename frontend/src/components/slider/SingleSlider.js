import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Slider from "@mui/material/Slider";
import { Stack } from "@mui/material";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import BackupIcon from "@mui/icons-material/Backup";

// Styled component for the slider
const PrettoSlider = styled(Slider)(({ theme }) => ({
  height: 8,
  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-thumb": {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "&::before": {
      display: "none",
    },
  },
  "& .MuiSlider-valueLabel": {
    lineHeight: 1.2,
    fontSize: 12,
    background: "unset",
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: "50% 50% 50% 0",
    backgroundColor: theme.palette.primary.main, // Use primary color from theme
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

export default function SingleSlider({
  values,
  handleDurationRange,
  plan,
  minValue,
  maxValue,
}) {
  const handleSliderChange = (event, newValue) => {
    handleDurationRange(newValue);
  };

  return (
    <Box sx={{ mt: 5 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs>
          <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
            {plan === "duration" && <QueryBuilderIcon />}
            {plan === "storage" && <BackupIcon />}
            <PrettoSlider
              defaultValue={values}
              value={values}
              onChange={handleSliderChange}
              aria-labelledby="input-slider"
              valueLabelDisplay="on"
              min={minValue}
              max={maxValue}
            />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
