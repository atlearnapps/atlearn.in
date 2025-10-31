import {
  Card,
  Container,
  Stack,
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
import React, { useState, useEffect } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Scrollbar from "src/components/scrollbar/Scrollbar";
import { Pagination } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import apiClients from "src/apiClients/apiClients";
import VideoIcon from "src/images/Featured icon.svg";
import { toast } from "react-toastify";
import DeleteConfirmation from "src/components/confirmationPopup/confirmationPopup";
import PlayCircleFilledWhiteOutlinedIcon from "@mui/icons-material/PlayCircleFilledWhiteOutlined";
import Animations from "src/components/Loader";
import CommonTableCell from "src/components/CommonTableCell/CommonTableCell";
import { Helmet } from "react-helmet";
import { BASE_URL } from "src/apiClients/config";
function ServerRecordings() {
  const rowsPerPage = 5; // Number of rows to display per page
  const [page, setPage] = React.useState(1);
  // const [recordings, setRecordings] = useState(rows);
  const [lastPage, setLastPage] = useState();
  const [filteredRecordings, setFilteredRecordings] = useState([]);
  const [allRecordings, setAllrecordings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useSelector((state) => state.user);
  const [formatId, setFormatId] = useState();
  const [deleteModal, setDeleteModal] = useState(false);
  const [loader, setLoader] = useState(true);
  const [shareUrl, setShareUrl] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchData = async () => {
    try {
      const response = await apiClients.getAllRecordings(page, rowsPerPage);
      if (response.data) {
        setLastPage(response.pagination.lastPage);
        setFilteredRecordings(response.data);
        setAllrecordings(response.data)
        setLoader(false)
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (user) {
    if (user?.permission?.["ManageRecordings"] !== "true") {
      navigate("/404");
    }
  }
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };



  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    const filtered = allRecordings.filter((recordings) =>
      recordings?.recording?.name?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredRecordings(filtered);
  };

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    toast.success("The recording URLs have been copied.");
  };
  const handlePlay = (url) => {
    window.open(url);
  };

  const handleOpen = (id) => {
    setFormatId(id);
    setDeleteModal(true);
  };

  const handleClose = () => {
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

  const handleShareClick = (event, item) => {
    setShareUrl(item.url);
    setAnchorEl(event.currentTarget);
  };
  const handleShareClose = () => {
    setAnchorEl(null);
  };

  // const startIndex = (page - 1) * rowsPerPage;
  // const endIndex = startIndex + rowsPerPage;
  // const paginatedRows = filteredRecordings.slice(startIndex, endIndex);

  return (
    <div>
      <Helmet>
      <title>Access Server Recordings | Atlearn LMS	</title>
        <meta
          name="description"
          content="Review and manage all server recordings with Atlearn. Keep track of your recorded sessions and enhance your organization's learning experience."
        />
        <link rel="canonical" href={`${BASE_URL}/organization/server-recordings`} />
      </Helmet>
      <Container maxWidth={"xl"}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography  style={{ fontSize: "2rem", fontWeight: 400 }}>Server Recordings</Typography>
        </Stack>
        <Card>
        {loader? <div style={{ margin:"30px"}}> <Animations /> </div>:
          <>
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
            <Container maxWidth={"xl"}>
              <TableContainer
                style={{ border: "1px solid #F4F6F8", minHeight: "300px" }}
                component={Paper}
              >
                {!filteredRecordings?.length ? (
                  <div
                    style={{
                      width: "100%",
                      height: "300px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                      // marginTop: "10px",
                    }}
                  >
                    <SearchIcon
                      sx={{
                        color: "#6D207B", // A lighter shade of blue
                        fontSize: "4rem", // Adjust size as needed
                      }}
                    />
                    <div>
                      <Typography
                        style={{
                          fontSize: "1.6rem",
                          color:"#E8063C"
                        }}
                      >
                        No Records Found
                      </Typography>
                      {/* {searchTerm && (
                       <div style={{ marginBottom: "30px" }}>
                         {`Could not find any results for "${searchTerm}"`}
                       </div>
                     )} */}
                    </div>
                  </div>
                ) : (
                  <Table>
                    <TableHead>
                      <TableRow>
                        <CommonTableCell>Name</CommonTableCell>
                        <CommonTableCell>Duration</CommonTableCell>
                        <CommonTableCell>participants</CommonTableCell>
                        <CommonTableCell>View</CommonTableCell>
                        {/* <TableCell>Formats</TableCell> */}
                        <CommonTableCell>Actions</CommonTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
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
                          <CommonTableCell>{row?.recording?.length} mins</CommonTableCell>
                          <CommonTableCell>{row?.recording?.participants}</CommonTableCell>
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
                              <Tooltip title="Share">
                          <IconButton
                            onClick={(e) => {
                              handleShareClick(e, row);
                            }}
                            size="small"
                            // sx={{ ml: 2 }}
                            aria-controls={Boolean(anchorEl) ? "account-menu" : undefined}
                            aria-haspopup="true"
                            aria-expanded={Boolean(anchorEl) ? "true" : undefined}
                          >
                            {/* <Avatar sx={{ width: 32, height: 32 }}>M</Avatar> */}
                            <ShareIcon />
                          </IconButton>
                        </Tooltip>
                            </Box>
                          </CommonTableCell>
                          {/* <TableCell>{row?.recording?.visibility}</TableCell> */}

                          {/* <TableCell>{row?.recording_type}</TableCell> */}
                          <CommonTableCell>
                            <Tooltip title="Delete">
                            <IconButton onClick={() => handleOpen(row?.id)}>
                              <DeleteOutlineIcon sx={{ color: "red" }} />
                            </IconButton>
                            </Tooltip>
                          </CommonTableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TableContainer>
              {filteredRecordings?.length > 0 && (
                <Pagination
                  // count={Math.ceil(filteredRecordings.length / rowsPerPage)}
                  count={lastPage}
                  page={page}
                  onChange={handleChangePage}
                  style={{
                    marginTop: "16px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                />
              )}
            </Container>
          </Scrollbar>
          </>
          }
        </Card>
        <DeleteConfirmation
          open={deleteModal}
          handleClose={handleClose}
          handleConfirm={handleDelete}
        />
      </Container>
      <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={Boolean(anchorEl)}
            onClose={handleShareClose}
            onClick={handleShareClose}
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

export default ServerRecordings;
