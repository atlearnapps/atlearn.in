import {
  Table,
  TableContainer,
  TableRow,
  Typography,
  Paper,
  TableHead,
  TableBody,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import React, { useState, useEffect } from "react";
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Scrollbar from "src/components/scrollbar/Scrollbar";
import { Pagination } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { toast } from "react-toastify";
import VideoIcon from "src/images/Featured icon.svg";
import PlayCircleFilledWhiteOutlinedIcon from "@mui/icons-material/PlayCircleFilledWhiteOutlined";
import ShareIcon from "@mui/icons-material/Share";
import {
  FacebookShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  WhatsappIcon,
  FacebookIcon,
  TelegramIcon,
  LinkedinIcon,
} from "react-share";
import CommonTableCell from "src/components/CommonTableCell/CommonTableCell";
function PublicRecordTable({ recordData }) {
  const rowsPerPage = 5; // Number of rows to display per page
  const [page, setPage] = React.useState(1);
  const [recordings, setRecordings] = useState([]);
  const [filteredRecordings, setFilteredRecordings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [shareUrl, setShareUrl] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event, item) => {
    setShareUrl(item.url);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    setRecordings(recordData);
    setFilteredRecordings(recordData?.getFormat?.slice(0, rowsPerPage));
  }, [recordData]);

  if (user) {
    if (user?.permission?.["ManageRecordings"] !== "true") {
      navigate("/404");
    }
  }
  const handleChangePage = (event, newPage) => {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    setFilteredRecordings(recordings?.getFormat?.slice(startIndex, endIndex));

    setPage(newPage);
  };
  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    const filtered = recordings?.getFormat?.filter((recordings) =>
      recordings?.recording?.name.toLowerCase().includes(value.toLowerCase())
    );
    if (!value) {
      setFilteredRecordings(filtered?.slice(0, rowsPerPage));
    } else {
      setFilteredRecordings(filtered);
    }
  };

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    toast.success("The recording URLs have been copied.");
  };

  const handlePlay = (url) => {
    window.open(url);
  };

  return (
    <div>
      <Box mb={2}>
        <TextField
          className="homeSearch"
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Scrollbar>
        <TableContainer
          component={Paper}
          style={{ border: "1px solid #F4F6F8" }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <CommonTableCell>Name</CommonTableCell>
                <CommonTableCell>Moderator</CommonTableCell>
                <CommonTableCell>Participants</CommonTableCell>
                <CommonTableCell>Duration</CommonTableCell>
                {/* <TableCell>Users</TableCell> */}
                {/* <TableCell>Visibility</TableCell> */}
                {/* <TableCell>Formats</TableCell> */}
                <CommonTableCell>View</CommonTableCell>
                <CommonTableCell>Share</CommonTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!filteredRecordings?.length && (
                <TableRow sx={{ height: "200px" }}>
                  <CommonTableCell
                    align="center"
                    colSpan={7}
                    style={{ borderBottom: "none" }}
                  >
                    No records
                  </CommonTableCell>
                </TableRow>
              )}
              {filteredRecordings?.map((row) => (
                <TableRow key={row.id}>
                  <CommonTableCell>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: {
                          md: "row",
                          xs: "column",
                        },
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <img src={VideoIcon} alt="VideoIcon" />
                      <Box>
                        <Typography>{row?.recording?.name}</Typography>
                        <Typography
                          style={{ fontSize: "0.8rem", color: "gray" }}
                        >
                          {row?.recording?.recorded_at}
                        </Typography>
                      </Box>
                    </Box>
                  </CommonTableCell>
                  <CommonTableCell>
                    {recordings?.roomVal?.user?.name}
                  </CommonTableCell>
                  <CommonTableCell>
                    {row?.recording?.participants}
                  </CommonTableCell>
                  <CommonTableCell>
                    {row?.recording?.length} mins
                  </CommonTableCell>

                  <CommonTableCell>
                    <Box>
                      <Tooltip title="Copy">
                        <IconButton onClick={() => handleCopy(row?.url)}>
                          <ContentCopyIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Play">
                        <IconButton onClick={() => handlePlay(row?.url)}>
                          <PlayCircleFilledWhiteOutlinedIcon
                            sx={{ color: "#0C56AC" }}
                          />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CommonTableCell>
                  <CommonTableCell>
                    <Tooltip title="Share">
                      <IconButton
                        onClick={(e) => {
                          handleClick(e, row);
                        }}
                        size="small"
                        // sx={{ ml: 2 }}
                        aria-controls={open ? "account-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                      >
                        {/* <Avatar sx={{ width: 32, height: 32 }}>M</Avatar> */}
                        <ShareIcon />
                      </IconButton>
                    </Tooltip>
                  </CommonTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination
          count={Math.ceil(recordings?.getFormat?.length / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
          style={{
            marginTop: "16px",
            display: "flex",
            justifyContent: "center",
            marginBottom:'10px'
          }}
        />
      </Scrollbar>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem>
          {/* <WhatsappShareButton /> Profile */}
          <WhatsappShareButton url={shareUrl} quote={""} hashtag={""}>
            <WhatsappIcon size={30} round={true} />
          </WhatsappShareButton>{" "}
        </MenuItem>
        <MenuItem>
          <TelegramShareButton url={shareUrl} quote={""} hashtag={""}>
            <TelegramIcon size={30} round={true} />
          </TelegramShareButton>{" "}
        </MenuItem>
        <MenuItem>
          <FacebookShareButton url={shareUrl} quote={""} hashtag={""}>
            <FacebookIcon size={30} round={true} />
          </FacebookShareButton>{" "}
        </MenuItem>
        <MenuItem>
          <LinkedinShareButton url={shareUrl} quote={""} hashtag={""}>
            <LinkedinIcon size={30} round={true} />
          </LinkedinShareButton>{" "}
        </MenuItem>
      </Menu>
    </div>
  );
}

export default PublicRecordTable;
