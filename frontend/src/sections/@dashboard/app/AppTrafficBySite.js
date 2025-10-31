// @mui
import PropTypes from "prop-types";
import {
  Box,
  Card,
  Paper,
  Typography,
  CardHeader,
  CardContent,
  useTheme,
} from "@mui/material";
// utils
import { fShortenNumber } from "../../../utils/formatNumber";

// ----------------------------------------------------------------------

AppTrafficBySite.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  list: PropTypes.array.isRequired,
};

export default function AppTrafficBySite({ title, subheader, list, ...other }) {
  const theme = useTheme();

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

      <CardContent>
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: "repeat(2, 1fr)",
          }}
        >
          {list.map((site) => (
            <Paper
              key={site.name}
              variant="outlined"
              sx={{ py: 2.5, textAlign: "center" }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "50px", // You can adjust the height to fit your design
                  mb: 0.5,
                }}
              >
                {site.icon}
              </Box>

              <Typography variant="h6">{fShortenNumber(site.value)}</Typography>

              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {site.name}
              </Typography>
            </Paper>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
