import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Popover,
  MenuItem,
  TextField,
  Box,
  InputAdornment,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Iconify from "src/components/iconify/Iconify";
import Editsubscription from "../../../components/dashboard/organization/Editsubscription";
import DeleteIcon from "@mui/icons-material/Delete";
import apiClients from "src/apiClients/apiClients";
import CloseIcon from "@mui/icons-material/Close";
import DeleteConfirmation from "src/components/confirmationPopup/confirmationPopup";
import AddSubscription from "../../../components/dashboard/organization/AddSubscription";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Animations from "src/components/Loader";
import EditIcon from "@mui/icons-material/Edit";
import MainButton from "src/components/Button/MainButton/MainButton";
import AddIcon from "@mui/icons-material/Add";
import CommonTableCell from "src/components/CommonTableCell/CommonTableCell";
import ViewAddOn from "./ViewAddOn";
const TableWithPagination = () => {
  const columns = [
    "Plans",
    "Price",
    "Duration",
    "Participants",
    "Storage",
    "Validity",
    "Recording",
    "Screen Share",
    "Share Access",
    // "Subscribers",
    "Shared Notes",
    "Chat",
    "MultiUser Whiteboard",
    "Breakout",

    "Course Management",
    "Efficient Digital Book Management",
    "Bulk Enrollment",
    "Communication Tools",
    "Student Management",
    "Reports And Analytics",
    "Customization & Personalization",
    "Assessment & Grading",
    
    "Multiple Choice Questions",
    "Rubric Generator",
    "Student Work Feedback",
    "Professional Email Communication",
    "Depth of Knowledge Quiz Generator",
    "Career or college counselor",
    "Idea Generator",
    "Learn coding",
    "Syllabus",
    "Assessment Outline",
    "Lesson Plan - 5 E's",
    "Claim, Evidence, Reasoning",
    "Debate",
    "Mock Interview",
    "Project Based Learning",
    "Team Based Activity",
    "Battleship Style",
    "Fill In The Blank Questions",
    "Scenario-Based Questions",
    "True/False Questions",
    "Timely, relevant, and actionable feedback",
    "",
  ];
  const { user } = useSelector((state) => state.user);
  const [deleteModal, setDeleteModal] = useState(false);
  const [data, setFormData] = useState();
  const [plansData, setPlansData] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [cancelIcon, setCancelIcon] = useState(false);
  const [datas, setData] = useState();
  const [open, setOpen] = useState(null);
  const [modal, setModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [loader, setLoader] = useState(true);
  const [addonOpen, setAddonOpen] = useState(false);
  useEffect(() => {}, [data]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await apiClients.pricing();
      if (response.data) {
        setPlansData(response.data);
        setFormData(response.data);
        setLoader(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchChange = (event) => {
    setCancelIcon(true);
    const { value } = event.target;
    setSearchTerm(value);
    const filtered = plansData.filter((plansData) =>
      plansData.name.toLowerCase().includes(value.toLowerCase())
    );
    setFormData(filtered);
  };

  const cancelSearch = () => {
    setSearchTerm("");
    const value = "";
    const filtered = plansData.filter((plansData) =>
      plansData.name.toLowerCase().includes(value.toLowerCase())
    );
    setFormData(filtered);
    setCancelIcon(false);
  };

  const handleDelete = async () => {
    try {
      const response = await apiClients.deletePlan(datas.id);
      if (response.success === true) {
        toast.success(response.message);
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenMenu = (event, data) => {
    setOpen(event.currentTarget);
    setData(data);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };
  const deleteUser = () => {
    setOpen(false);
    setDeleteModal(true);
  };
  const deleteUserClose = () => {
    setDeleteModal(false);
  };

  const editClose = () => {
    setModal(false);
    setAddModal(false);
  };

  const editOpen = () => {
    setModal(true);
    setOpen(false);
  };

  const addOpen = () => {
    setAddModal(true);
  };

  const handleAddonOpenModel = () => {
    setAddonOpen(true);
  };
  const handleAddoncloseModel = () => {
    setAddonOpen(false);
  };

  return (
    <>
      <div>
        {loader ? (
          <div style={{ margin: "30px" }}>
            {" "}
            <Animations />{" "}
          </div>
        ) : (
          <>
            <Box m={4}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: {
                    xs: "column",
                    sm: "row",
                  },
                  gap: 1,
                }}
              >
                <Box>
                  <TextField
                    variant="outlined"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    size="small"
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
                <Box>
                  {user?.user?.role?.name === "Super Admin" && (
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        width: "100%",
                        flexDirection: { xs: "column", md: "row" },
                      }}
                    >
                      <MainButton onClick={handleAddonOpenModel}>
                        <AddIcon sx={{ mr: 1 }} />
                        View Add-on plan
                      </MainButton>
                      <MainButton onClick={addOpen}>
                        <AddIcon sx={{ mr: 1 }} />
                        Add Subscription
                      </MainButton>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>

            <Box m={2}>
              <TableContainer
                style={{ border: "1px solid #F4F6F8", margin: 0 }}
                component={Paper}
              >
                {!data?.length ? (
                  <div style={{ textAlign: "center", marginTop: "10px" }}>
                    <SearchIcon
                      sx={{
                        color: "#0078D4", // A lighter shade of blue
                        fontSize: "5rem", // Adjust size as needed
                      }}
                    />
                    <div>
                      <div
                        style={{
                          fontSize: "2rem",
                          marginTop: "10px",
                          marginBottom: "20px",
                        }}
                      >
                        No Data Found
                      </div>
                      {searchTerm && (
                        <div style={{ marginBottom: "30px" }}>
                          {`Could not find any results for "${searchTerm}"`}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <Table>
                    <TableHead>
                      <TableRow>
                        {columns.map((column, index) => (
                          <CommonTableCell key={index}>
                            {column}
                          </CommonTableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data?.map((row, index) => (
                        <TableRow
                          sx={{
                            "&:hover": {
                              backgroundColor: "#F4F6F8",
                            },
                          }}
                          key={index}
                        >
                          <CommonTableCell>{row?.name}</CommonTableCell>
                          <CommonTableCell>{row?.price}</CommonTableCell>
                          <CommonTableCell>{row?.duration}h</CommonTableCell>
                          <CommonTableCell>{row?.participants}</CommonTableCell>
                          <CommonTableCell>{row?.storage} GB</CommonTableCell>
                          <CommonTableCell>
                            {row?.Validity} <span>{row.period}</span>
                          </CommonTableCell>
                          <CommonTableCell>{row?.recording}</CommonTableCell>
                          <CommonTableCell>{row?.screenshare}</CommonTableCell>
                          <CommonTableCell>
                            {row?.sharedRoomAccess}
                          </CommonTableCell>
                          {/* <TableCell>0</TableCell> */}
                          <CommonTableCell>{row?.sharedNotes}</CommonTableCell>
                          <CommonTableCell>{row?.chat}</CommonTableCell>
                          <CommonTableCell>
                            {row?.multiuserwhiteboard}
                          </CommonTableCell>
                          <CommonTableCell>{row?.breakout}</CommonTableCell>
                          <CommonTableCell>
                            {row?.courseManagement}
                          </CommonTableCell>
                          <CommonTableCell>
                            {row?.efficientDigitalBookManagement}
                          </CommonTableCell>
                          <CommonTableCell>
                            {row?.bulkEnrollment}
                          </CommonTableCell>
                          <CommonTableCell>
                            {row?.communicationTools}
                          </CommonTableCell>
                          <CommonTableCell>
                            {row?.studentManagement}
                          </CommonTableCell>
                          <CommonTableCell>
                            {row?.reportsAndAnalytics}
                          </CommonTableCell>
                          <CommonTableCell>
                            {row?.customizationAndPersonalization}
                          </CommonTableCell>
                          <CommonTableCell>
                            {row?.assessmentAndGrading}
                          </CommonTableCell>
                          <CommonTableCell>
                            {row?.multipleChoiceQuestions}
                          </CommonTableCell>
                          <CommonTableCell>
                            {row?.rubricGenerator}
                          </CommonTableCell>
                          <CommonTableCell>
                            {row?.studentWorkFeedback}
                          </CommonTableCell>
                          <CommonTableCell>
                            {row?.professionalEmailCommunication}
                          </CommonTableCell>
                          <CommonTableCell>
                            {row?.depthOfKnowledgeQuizGenerator}
                          </CommonTableCell>
                          <CommonTableCell>
                            {row?.careerOrCollegeCounselor}
                          </CommonTableCell>
                          <CommonTableCell>
                            {row?.ideaGenerator}
                          </CommonTableCell>
                          <CommonTableCell>{row?.learnCoding}</CommonTableCell>
                          <CommonTableCell>{row?.syllabus}</CommonTableCell>
                          <CommonTableCell>
                            {row?.assessmentOutline}
                          </CommonTableCell>
                          <CommonTableCell>
                            {row?.lessonPlan5Es}
                          </CommonTableCell>
                          <CommonTableCell>
                            {row?.claimEvidenceReasoning}
                          </CommonTableCell>
                          <CommonTableCell>{row?.debate}</CommonTableCell>
                          <CommonTableCell>
                            {row?.mockInterview}
                          </CommonTableCell>
                          <CommonTableCell>
                            {row?.projectBasedLearning}
                          </CommonTableCell>
                          <CommonTableCell>
                            {row?.teamBasedActivity}
                          </CommonTableCell>
                          <CommonTableCell>
                            {row?.battleshipStyle}
                          </CommonTableCell>
                          <CommonTableCell>
                            {row?.fillInTheBlankQuestions}
                          </CommonTableCell>
                          <CommonTableCell>
                            {row?.scenarioBasedQuestions}
                          </CommonTableCell>
                          <CommonTableCell>
                            {row?.trueFalseQuestions}
                          </CommonTableCell>
                          <CommonTableCell>
                            {row?.timelyRelevantActionableFeedback}
                          </CommonTableCell>

                          {user?.user?.role?.name === "Super Admin" && (
                            <CommonTableCell align="right">
                              <IconButton
                                size="large"
                                color="inherit"
                                onClick={(event) => handleOpenMenu(event, row)}
                              >
                                <Iconify icon={"eva:more-vertical-fill"} />
                              </IconButton>
                            </CommonTableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                    {/* <div
              style={{
                textAlign: "center",
                marginTop: "10px",
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <Button
                variant="outlined"
                disabled={page === 1} // Disable "Prev" button on the first page
                onClick={handlePrevPage}
              >
                Prev
              </Button>
             
              <Button
                variant="outlined"
                
                onClick={handleNextPage}
              >
                Next
              </Button>
            </div> */}
                  </Table>
                )}
              </TableContainer>
            </Box>
          </>
        )}
      </div>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={editOpen}>
          <EditIcon sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={deleteUser} sx={{ color: "error.main" }}>
          <DeleteIcon sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
      {addModal && (
        <AddSubscription
          open={addModal}
          handleclose={editClose}
          fetchData={fetchData}
        />
      )}
      {modal && (
        <Editsubscription
          open={modal}
          handleclose={editClose}
          data={datas}
          fetchData={fetchData}
        />
      )}
      {deleteModal && (
        <DeleteConfirmation
          open={deleteModal}
          handleClose={deleteUserClose}
          handleConfirm={handleDelete}
          fetchData={fetchData}
        />
      )}

      <ViewAddOn open={addonOpen} handleclose={handleAddoncloseModel} />
    </>
  );
};

export default TableWithPagination;
