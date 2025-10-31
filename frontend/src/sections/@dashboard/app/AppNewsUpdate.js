// @mui
import PropTypes from "prop-types";
import {
  Box,
  Stack,
  Link,
  Card,
  Divider,
  Typography,
  CardHeader,
  TextField,
  InputAdornment,
  IconButton,
  useTheme,
} from "@mui/material";
// utils
import { fDateTime, fToNow } from "../../../utils/formatTime";
// components

import Scrollbar from "../../../components/scrollbar";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

// ----------------------------------------------------------------------

AppNewsUpdate.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  list: PropTypes.array.isRequired,
};

export default function AppNewsUpdate({ title, subheader, list, ...other }) {
  const theme = useTheme();
  const [cancelIcon, setCancelIcon] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [room, setRooms] = useState(list);
  const handleSearchChange = (event) => {
    setCancelIcon(true);
    const { value } = event.target;
    setSearchTerm(value);
    const filtered = list.filter((users) =>
      users.title.toLowerCase().includes(value.toLowerCase())
    );
    setRooms(filtered);
  };
  const cancelSearch = () => {
    setSearchTerm("");
    const value = "";
    const filtered = list.filter((users) =>
      users.title.toLowerCase().includes(value.toLowerCase())
    );
    setRooms(filtered);
    setCancelIcon(false);
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
        style={{
          backgroundColor: theme.palette.primary.main,
          padding: "15px",
          color: "white",
        }}
      />
      <Box m={2}>
        <TextField
          className="homeSearch"
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            endAdornment: cancelIcon ? (
              <InputAdornment position="end">
                <IconButton onClick={cancelSearch}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : (
              <InputAdornment position="end">
                {/* <IconButton >
                <CloseIcon fontSize="small" />
              </IconButton> */}
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Scrollbar sx={{ height: "350px", overflow: "auto" }}>
        <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
          {room?.map((news) => (
            <NewsItem key={news.id} news={news} />
          ))}
        </Stack>
      </Scrollbar>

      <Divider />

      {/* <Box sx={{ p: 2, textAlign: 'right' }}>
        <Button size="small" color="inherit" endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />}>
          View all
        </Button>
      </Box> */}
    </Card>
  );
}

// ----------------------------------------------------------------------

NewsItem.propTypes = {
  news: PropTypes.shape({
    description: PropTypes.string,
    image: PropTypes.string,
    postedAt: PropTypes.instanceOf(Date),
    title: PropTypes.string,
    owner: PropTypes.string,
    duration: PropTypes.string,
  }),
};

function NewsItem({ news }) {
  const { image, title, postedAt, owner, duration } = news;

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box
        component="img"
        alt={title}
        src={image}
        sx={{ width: 48, height: 48, borderRadius: 1.5, flexShrink: 0 }}
      />

      <Box sx={{ minWidth: 240, flexGrow: 1 }}>
        <Link color="inherit" variant="subtitle1" underline="hover" noWrap>
          {title}
        </Link>

        <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
          Owner:{owner}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
          duration:{duration ? parseInt(duration, 10) : 0}
        </Typography>
      </Box>

      <Typography
        variant="caption"
        sx={{ pr: 3, flexShrink: 0, color: "text.secondary" }}
      >
        {fDateTime(postedAt)}
      </Typography>
    </Stack>
  );
}
