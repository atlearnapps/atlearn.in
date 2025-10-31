import {
  Card,
  Container,
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
  Skeleton,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Scrollbar from "src/components/scrollbar/Scrollbar";
import { Pagination } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useSelector } from "react-redux";
import apiClients from "src/apiClients/apiClients";
import VideoIcon from "src/images/Featured icon.svg";
import { toast } from "react-toastify";
import DeleteConfirmation from "src/components/confirmationPopup/confirmationPopup";
import PlayCircleFilledWhiteOutlinedIcon from "@mui/icons-material/PlayCircleFilledWhiteOutlined";
import NoRecordings from "src/components/Recordings/NoRecordings";
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
function ModeratorRecords() {
  const rowsPerPage = 5; // Number of rows to display per page
  const [page, setPage] = React.useState(1);
  // const [recordings, setRecordings] = useState(rows);
  const [moderatorRecord, setModeratorRecords] = useState([]);
  const [filteredRecordings, setFilteredRecordings] = useState([]);
  // const [recordings,setRecordings]=useState([])
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useSelector((state) => state.user);
  const [formatId, setFormatId] = useState();
  const [deleteModal, setDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
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
    if (user?.user) {
      fetchData(user.user.id);
    }
  }, [user]);

  const fetchData = async (id) => {
    try {
      setLoading(true);
      const response = await apiClients.userRecords(id);
      if (response.data) {
        setFilteredRecordings(response.data.slice(0, rowsPerPage));
        // setRecordings (response.data.slice(0, rowsPerPage));
        setModeratorRecords(response.data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleChangePage = (event, newPage) => {
    const startIndex = (newPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    setFilteredRecordings(moderatorRecord.slice(startIndex, endIndex));
    // setRecordings(moderatorRecord.slice(startIndex, endIndex));
    setPage(newPage);
  };

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    const filtered = moderatorRecord.filter((recordings) =>
      recordings?.recording?.name?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredRecordings(filtered);
  };

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    toast.success("The recording URLs have been copied.");
  };

  const handleOpen = (id) => {
    setFormatId(id);
    setDeleteModal(true);
  };

  const handleDeleteClose = () => {
    setDeleteModal(false);
  };

  const handleDelete = async () => {
    try {
      const response = await apiClients.deleteRecord(formatId);
      if (response.success === true) {
        toast.success("The recording  have been deleted.");
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePlay = (url) => {
    window.open(url);
  };

  //   const startIndex = (page - 1) * rowsPerPage;
  //   const endIndex = startIndex + rowsPerPage;
  //   const paginatedRows = filteredRecordings.slice(startIndex, endIndex);

  return (
    <div>
      {loading ? (
        <Box
          sx={{
            // marginTop: "20px",
            background: "rgb(255, 255, 255)",
            minHeight: "40vh",
            borderRadius: "12px",
            boxShadow:
              "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px",
            transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
          }}
        >
          <Box p={2}>
            <Skeleton
              variant="rectangular"
              sx={{ borderRadius: "12px" }}
              width={"100%"}
              height={400}
            />
          </Box>
        </Box>
      ) : moderatorRecord?.length > 0 ? (
        <Card>
          <Box m={2}>
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
            <Container maxWidth={"600px"}>
              <TableContainer
                component={Paper}
                style={{ border: "1px solid #F4F6F8" }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <CommonTableCell>Name</CommonTableCell>
                      <CommonTableCell>Duration</CommonTableCell>
                      <CommonTableCell>Participants</CommonTableCell>
                      <CommonTableCell>View</CommonTableCell>
                      <CommonTableCell>Share</CommonTableCell>
                      <CommonTableCell>Actions</CommonTableCell>
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
                    {filteredRecordings?.map((row, index) => (
                      <TableRow
                        sx={{
                          "&:hover": {
                            backgroundColor: "#F4F6F8",
                          },
                        }}
                        key={index}
                      >
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
                            <img
                              src={VideoIcon}
                              alt="VideoIcon"
                              style={{ marginRight: "8px" }}
                            />
                            <Box>
                              <Typography variant="h6" fontWeight="bold">
                                {row?.recording?.name}
                              </Typography>
                              <Typography
                                style={{ fontSize: "0.8rem", color: "gray" }}
                              >
                                {row?.recording?.recorded_at}
                              </Typography>
                              <Typography
                                style={{ fontSize: "0.8rem", color: "gray" }}
                                fontWeight="bold"
                              >
                                {row?.recording?.room?.user?.name}
                              </Typography>
                            </Box>
                          </Box>
                        </CommonTableCell>
                        <CommonTableCell>
                          {row?.recording?.length} mins
                        </CommonTableCell>
                        <CommonTableCell>
                          {row?.recording?.participants}
                        </CommonTableCell>
                        {/* <TableCell>{row?.recording?.visibility}</TableCell> */}
                        <CommonTableCell>
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
                        <CommonTableCell>
                          <IconButton onClick={() => handleOpen(row?.id)}>
                            <DeleteOutlineIcon sx={{ color: "red" }} />
                          </IconButton>
                        </CommonTableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Pagination
                count={Math.ceil(moderatorRecord.length / rowsPerPage)}
                page={page}
                onChange={handleChangePage}
                style={{
                  marginTop: "16px",
                  display: "flex",
                  justifyContent: "center",
                  marginBottom:"16px"
                }}
              />

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
            </Container>
          </Scrollbar>
          <DeleteConfirmation
            open={deleteModal}
            handleClose={handleDeleteClose}
            handleConfirm={handleDelete}
          />
        </Card>
      ) : (
        <Box
          sx={{
            marginTop: "20px",
            background: "rgb(255, 255, 255)",
            minHeight: "30vh",
            borderRadius: "12px",
            boxShadow:
              "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px",
            transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
          }}
        >
          <NoRecordings />
        </Box>
      )}
    </div>
  );
}

export default ModeratorRecords;
