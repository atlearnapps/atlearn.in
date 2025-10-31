// @mui
import PropTypes from "prop-types";
import {
  Card,
  Typography,
  CardHeader,
  CardContent,
  Stack,
  useTheme,
} from "@mui/material";
import {
  Timeline,
  TimelineDot,
  TimelineItem,
  TimelineContent,
  TimelineSeparator,
  TimelineConnector,
} from "@mui/lab";
// utils
import { fDateTime } from "../../../utils/formatTime";

// ----------------------------------------------------------------------

AppOrderTimeline.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  list: PropTypes.array.isRequired,
};

export default function AppOrderTimeline({ title, subheader, list, ...other }) {
  const theme = useTheme();
  return (
    <Card {...other} sx={{height:"540px"}} >
      <CardHeader
        title={title}
        subheader={subheader}
        titleTypographyProps={{ style: { fontSize: "20px", fontWeight: 600 } }}
        subheaderTypographyProps={{
          style: { fontSize: "26px", fontWeight: 600 },
        }}
        sx={{backgroundColor:theme.palette.primary.main,padding:"15px",color:"white"}}
      />

      <CardContent
        sx={{
          "& .MuiTimelineItem-missingOppositeContent:before": {
            display: "none",
          },
          maxHeight: "480px", // Set a max height for the scrollable area
          overflowY: "auto",
        }}
      >
        {list?.length > 0 ? (
          <Timeline>
            {list?.map((item, index) => (
              <OrderItem
                key={index}
                item={item}
                isLast={index === list?.length - 1}
              />
            ))}
          </Timeline>
       
        ) : (
          <Stack
            sx={{
              height: "30vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="subtitle1" sx={{ color: "#E8063C" }}>
              No Schedule Meeting
            </Typography>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

// ----------------------------------------------------------------------

OrderItem.propTypes = {
  isLast: PropTypes.bool,
  item: PropTypes.shape({
    time: PropTypes.instanceOf(Date),
    title: PropTypes.string,
    type: PropTypes.string,
  }),
};

function OrderItem({ item, isLast }) {
  const { type, title, time } = item;
  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot
          color={
            (type === "order1" && "primary") ||
            (type === "order2" && "success") ||
            (type === "order3" && "info") ||
            (type === "order4" && "warning") ||
            "error"
          }
        />
        {isLast ? null : <TimelineConnector />}
      </TimelineSeparator>

      <TimelineContent>
        <Typography variant="subtitle2">{title}</Typography>

        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {fDateTime(time)}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
}
