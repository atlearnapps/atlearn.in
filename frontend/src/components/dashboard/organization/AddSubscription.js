import React, { useState } from "react";
import "../../dashboard/editUser/EditUser.css";
import { toast } from "react-toastify";
import {
  Box,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Slide,
  TextField,
  Typography,
  Switch,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import apiClients from "src/apiClients/apiClients";
import MainButton from "src/components/Button/MainButton/MainButton";
import SecondaryButton from "src/components/Button/SecondaryButton/SecondaryButton";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} timeout={500} />;
});
const planData = {
  name: "",
  price: null,
  participants: null,
  duration: null,
  storage: null,
  Validity: null,
  recording: "false",
  chat: "false",
  sharedNotes: "false",
  breakout: "false",
  screenshare: "false",
  multiuserwhiteboard: "false",
  period: "month",
  sharedRoomAccess: "false",
  freelms: "false",
  courseManagement: "false",
  efficientDigitalBookManagement: "false",
  bulkEnrollment: "false",
  communicationTools: "false",
  studentManagement: "false",
  reportsAndAnalytics: "false",
  customizationAndPersonalization: "false",
  assessmentAndGrading: "false",
  multipleChoiceQuestions: "false",
  rubricGenerator: "false",
  studentWorkFeedback: "false",
  professionalEmailCommunication: "false",
  depthOfKnowledgeQuizGenerator: "false",
  careerOrCollegeCounselor: "false",
  ideaGenerator: "false",
  learnCoding: "false",
  syllabus: "false",
  assessmentOutline: "false",
  lessonPlan5Es: "false",
  claimEvidenceReasoning: "false",
  debate: "false",
  mockInterview: "false",
  projectBasedLearning: "false",
  teamBasedActivity: "false",
  battleshipStyle: "false",
  fillInTheBlankQuestions: "false",
  scenarioBasedQuestions: "false",
  trueFalseQuestions: "false",
  timelyRelevantActionableFeedback: "false",
};

function AddSubscription({ open, handleclose, fetchData }) {
  const [formData, setFormData] = useState(planData);
  const [errors, setErrors] = useState({});
  const handleChange = (event) => {
    const { name, value } = event.target;
    let parsedValue;

    if (
      ["price", "participants", "duration", "Validity", "storage"].includes(
        name
      )
    ) {
      // Convert to number for specific fields
      parsedValue = parseInt(value, 10);
    } else {
      parsedValue = value; // Keep other fields as string
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: parsedValue,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleToggleChange = (property) => {
    setFormData((prevData) => ({
      ...prevData,
      [property]: prevData[property] === "true" ? "false" : "true",
    }));
  };

  const handleClosebox = () => {
    handleclose();
  };

  const handleSubmit = async () => {
    try {
      const newErrors = {};
      const requiredFields = [
        "name",
        "price",
        "participants",
        "duration",
        "Validity",
        "storage",
      ];
      requiredFields.forEach((field) => {
        if (
          formData[field] === undefined ||
          formData[field] === null ||
          formData[field] === ""
        ) {
          newErrors[field] = "This field is required.";
        }
      });

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
      } else {
        setErrors({});
        console.log(formData, "formData");
        const response = await apiClients.createNewPlan(formData);
        if (response.success === true) {
          toast.success(response.message);
          fetchData();
          handleClosebox();
        }
      }
    } catch (error) {
      console.log();
    }
  };

  // Handle change for Select inputs
  const handleChangevalue = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Reset validity if period changes
    if (name === "period") {
      setFormData((prev) => ({ ...prev, Validity: "" }));
    }
  };

  // Determine number of validity options based on selected period
  const getValidityOptions = (period) => {
    return period === "month"
      ? [...Array(12).keys()].map((number) => number + 1)
      : period === "day"
      ? [...Array(30).keys()].map((number) => number + 1)
      : [];
  };

  return (
    <div>
      <Dialog
        // maxWidth={"md"}
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClosebox}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle sx={{ textAlign: "center", backgroundColor: "#F5F7FB" }}>
          Add Subscription Plan
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Container>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={12}>
                  <Typography gutterBottom>Plan</Typography>
                  <TextField
                    type="text"
                    name="name"
                    value={formData?.name}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography gutterBottom>Price</Typography>
                  <TextField
                    type="Number"
                    name="price"
                    value={formData?.price}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.price}
                    helperText={errors.price}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography gutterBottom>Participants</Typography>
                  <TextField
                    type="Number"
                    name="participants"
                    value={formData?.participants}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.participants}
                    helperText={errors.participants}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography gutterBottom>Period</Typography>
                  <FormControl fullWidth>
                    <Select
                      labelId="period-select-label"
                      name="period"
                      value={formData?.period}
                      onChange={handleChangevalue}
                    >
                      <MenuItem value="day">Day</MenuItem>
                      <MenuItem value="month">Month</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography gutterBottom>Validity</Typography>
                  <FormControl fullWidth error={!!errors.Validity}>
                    <Select
                      labelId="validity-select-label"
                      name="Validity"
                      value={formData?.Validity}
                      onChange={handleChange}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 200, // Set the maximum height of the dropdown menu
                            overflowY: "auto", // Ensure scroll if content exceeds height
                          },
                        },
                      }}
                    >
                      {getValidityOptions(formData?.period).map((number) => (
                        <MenuItem
                          key={number}
                          value={number}
                          sx={{
                            padding: "8px 16px", // Adjust padding if needed
                            fontSize: "0.875rem", // Adjust font size if needed
                          }}
                        >
                          {number}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{errors.Validity}</FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography gutterBottom>Duration (Hours)</Typography>
                  <TextField
                    type="Number"
                    name="duration"
                    value={formData?.duration}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.duration}
                    helperText={errors.duration}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography gutterBottom>Storage(GB)</Typography>
                  <TextField
                    type="Number"
                    name="storage"
                    value={formData?.storage}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.storage}
                    helperText={errors.storage}
                  />
                </Grid>
                <Grid container item xs={12} sm={12} alignItems="center">
                  <Typography gutterBottom>Free LMS</Typography>
                  <Box sx={{ marginLeft: "auto" }}>
                    <Switch
                      name="freelms"
                      checked={formData?.freelms === "true"}
                      onChange={() => handleToggleChange("freelms")}
                    />
                  </Box>
                </Grid>
                <Grid container item xs={12} sm={12} alignItems="center">
                  <Typography gutterBottom>MultiUser Whiteboard</Typography>
                  <Box sx={{ marginLeft: "auto" }}>
                    <Switch
                      name="multiuserwhiteboard"
                      checked={formData?.multiuserwhiteboard === "true"}
                      onChange={() => handleToggleChange("multiuserwhiteboard")}
                    />
                  </Box>
                </Grid>
                <Grid container item xs={12} sm={12} alignItems="center">
                  <Typography gutterBottom>Recording</Typography>
                  <Box sx={{ marginLeft: "auto" }}>
                    <Switch
                      name="recording"
                      checked={formData?.recording === "true"}
                      onChange={() => handleToggleChange("recording")}
                    />
                  </Box>
                </Grid>
                <Grid container item xs={12} sm={12} alignItems="center">
                  <Typography gutterBottom>Screen Share</Typography>
                  <Box sx={{ marginLeft: "auto" }}>
                    <Switch
                      name="screenshare"
                      checked={formData?.screenshare === "true"}
                      onChange={() => handleToggleChange("screenshare")}
                    />
                  </Box>
                </Grid>
                <Grid container item xs={12} sm={12} alignItems="center">
                  <Typography gutterBottom>Share Access</Typography>
                  <Box sx={{ marginLeft: "auto" }}>
                    <Switch
                      name="screenshare"
                      checked={formData?.sharedRoomAccess === "true"}
                      onChange={() => handleToggleChange("sharedRoomAccess")}
                    />
                  </Box>
                </Grid>
                <Grid container item xs={12} sm={12} alignItems="center">
                  <Typography gutterBottom>Chat</Typography>
                  <Box sx={{ marginLeft: "auto" }}>
                    <Switch
                      name="chat"
                      checked={formData?.chat === "true"}
                      onChange={() => handleToggleChange("chat")}
                    />
                  </Box>
                </Grid>
                <Grid container item xs={12} sm={12} alignItems="center">
                  <Typography gutterBottom>Shared Notes</Typography>
                  <Box sx={{ marginLeft: "auto" }}>
                    <Switch
                      name="sharedNotes"
                      checked={formData?.sharedNotes === "true"}
                      onChange={() => handleToggleChange("sharedNotes")}
                    />
                  </Box>
                </Grid>
                <Grid container item xs={12} sm={12} alignItems="center">
                  <Typography gutterBottom>Breakout</Typography>
                  <Box sx={{ marginLeft: "auto" }}>
                    <Switch
                      name="breakout"
                      checked={formData?.breakout === "true"}
                      onChange={() => handleToggleChange("breakout")}
                    />
                  </Box>
                </Grid>
                <Grid container item xs={12} sm={12} alignItems="center">
                  <Typography gutterBottom>Course Management</Typography>
                  <Box sx={{ marginLeft: "auto" }}>
                    <Switch
                      name="courseManagement"
                      checked={formData?.courseManagement === "true"}
                      onChange={() => handleToggleChange("courseManagement")}
                    />
                  </Box>
                </Grid>
                <Grid container item xs={12} sm={12} alignItems="center">
                  <Typography gutterBottom>
                    Efficient Digital Book Management
                  </Typography>
                  <Box sx={{ marginLeft: "auto" }}>
                    <Switch
                      name="efficientDigitalBookManagement"
                      checked={
                        formData?.efficientDigitalBookManagement === "true"
                      }
                      onChange={() =>
                        handleToggleChange("efficientDigitalBookManagement")
                      }
                    />
                  </Box>
                </Grid>
                <Grid container item xs={12} sm={12} alignItems="center">
                  <Typography gutterBottom>Bulk Enrollment</Typography>
                  <Box sx={{ marginLeft: "auto" }}>
                    <Switch
                      name="bulkEnrollment"
                      checked={formData?.bulkEnrollment === "true"}
                      onChange={() => handleToggleChange("bulkEnrollment")}
                    />
                  </Box>
                </Grid>
                <Grid
                  container
                  item
                  xs={12}
                  sm={12}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <h2 className=" text-xl font-fredoka font-medium mb-4 p-4 bg-blue-100 border border-blue-300 rounded-lg shadow-md">
                    LMS Features
                  </h2>
                </Grid>
                <Grid container item xs={12} sm={12} alignItems="center">
                  <Typography gutterBottom>Communication Tools</Typography>
                  <Box sx={{ marginLeft: "auto" }}>
                    <Switch
                      name="communicationTools"
                      checked={formData?.communicationTools === "true"}
                      onChange={() => handleToggleChange("communicationTools")}
                    />
                  </Box>
                </Grid>
                <Grid container item xs={12} sm={12} alignItems="center">
                  <Typography gutterBottom>Student Management</Typography>
                  <Box sx={{ marginLeft: "auto" }}>
                    <Switch
                      name="studentManagement"
                      checked={formData?.studentManagement === "true"}
                      onChange={() => handleToggleChange("studentManagement")}
                    />
                  </Box>
                </Grid>
                <Grid container item xs={12} sm={12} alignItems="center">
                  <Typography gutterBottom>Reports And Analytics</Typography>
                  <Box sx={{ marginLeft: "auto" }}>
                    <Switch
                      name="reportsAndAnalytics"
                      checked={formData?.reportsAndAnalytics === "true"}
                      onChange={() => handleToggleChange("reportsAndAnalytics")}
                    />
                  </Box>
                </Grid>
                <Grid container item xs={12} sm={12} alignItems="center">
                  <Typography gutterBottom>
                    Customization & Personalization
                  </Typography>
                  <Box sx={{ marginLeft: "auto" }}>
                    <Switch
                      name="customizationAndPersonalization"
                      checked={
                        formData?.customizationAndPersonalization === "true"
                      }
                      onChange={() =>
                        handleToggleChange("customizationAndPersonalization")
                      }
                    />
                  </Box>
                </Grid>
                <Grid container item xs={12} sm={12} alignItems="center">
                  <Typography gutterBottom>Assessment & Grading</Typography>
                  <Box sx={{ marginLeft: "auto" }}>
                    <Switch
                      name="assessmentAndGrading"
                      checked={formData?.assessmentAndGrading === "true"}
                      onChange={() =>
                        handleToggleChange("assessmentAndGrading")
                      }
                    />
                  </Box>
                </Grid>
                <Grid
                  container
                  item
                  xs={12}
                  sm={12}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <h2 className=" text-xl font-fredoka font-medium mb-4 p-4 bg-blue-100 border border-blue-300 rounded-lg shadow-md">
                    AI Features
                  </h2>
                </Grid>
                <Grid container item xs={12} sm={12} alignItems="center">
                  <Typography gutterBottom>
                    Multiple Choice Questions
                  </Typography>
                  <Box sx={{ marginLeft: "auto" }}>
                    <Switch
                      name="multipleChoiceQuestions"
                      checked={formData?.multipleChoiceQuestions === "true"}
                      onChange={() =>
                        handleToggleChange("multipleChoiceQuestions")
                      }
                    />
                  </Box>
                </Grid>
                <Grid container item xs={12} sm={12} alignItems="center">
                  <Typography gutterBottom>Rubric Generator</Typography>
                  <Box sx={{ marginLeft: "auto" }}>
                    <Switch
                      name="rubricGenerator"
                      checked={formData?.rubricGenerator === "true"}
                      onChange={() => handleToggleChange("rubricGenerator")}
                    />
                  </Box>
                </Grid>
                <Grid container item xs={12} sm={12} alignItems="center">
                  <Typography gutterBottom>Student Work Feedback</Typography>
                  <Box sx={{ marginLeft: "auto" }}>
                    <Switch
                      name="studentWorkFeedback"
                      checked={formData?.studentWorkFeedback === "true"}
                      onChange={() => handleToggleChange("studentWorkFeedback")}
                    />
                  </Box>
                </Grid>
                <Grid container item xs={12} sm={12} alignItems="center">
                  <Typography gutterBottom>
                    Professional Email Communication
                  </Typography>
                  <Box sx={{ marginLeft: "auto" }}>
                    <Switch
                      name="professionalEmailCommunication"
                      checked={
                        formData?.professionalEmailCommunication === "true"
                      }
                      onChange={() =>
                        handleToggleChange("professionalEmailCommunication")
                      }
                    />
                  </Box>
                </Grid>
                <Grid container item xs={12} sm={12} alignItems="center">
                  <Typography gutterBottom>
                    Depth of Knowledge Quiz Generator
                  </Typography>
                  <Box sx={{ marginLeft: "auto" }}>
                    <Switch
                      name="depthOfKnowledgeQuizGenerator"
                      checked={
                        formData?.depthOfKnowledgeQuizGenerator === "true"
                      }
                      onChange={() =>
                        handleToggleChange("depthOfKnowledgeQuizGenerator")
                      }
                    />
                  </Box>
                </Grid>
                <Grid container item xs={12} sm={12} alignItems="center">
                  <Typography gutterBottom>
                    Career or college counselor
                  </Typography>
                  <Box sx={{ marginLeft: "auto" }}>
                    <Switch
                      name="careerOrCollegeCounselor"
                      checked={formData?.careerOrCollegeCounselor === "true"}
                      onChange={() =>
                        handleToggleChange("careerOrCollegeCounselor")
                      }
                    />
                  </Box>
                </Grid>
                <Grid container item xs={12} sm={12} alignItems="center">
                  <Typography gutterBottom>Idea Generator</Typography>
                  <Box sx={{ marginLeft: "auto" }}>
                    <Switch
                      name="ideaGenerator"
                      checked={formData?.ideaGenerator === "true"}
                      onChange={() => handleToggleChange("ideaGenerator")}
                    />
                  </Box>
                </Grid>
                <Grid container item xs={12} sm={12} alignItems="center">
                  <Typography gutterBottom>Learn coding</Typography>
                  <Box sx={{ marginLeft: "auto" }}>
                    <Switch
                      name="learnCoding"
                      checked={formData?.learnCoding === "true"}
                      onChange={() => handleToggleChange("learnCoding")}
                    />
                  </Box>
                </Grid>
                <Grid container item xs={12} sm={12} alignItems="center">
                  <Typography gutterBottom>Syllabus</Typography>
                  <Box sx={{ marginLeft: "auto" }}>
                    <Switch
                      name="syllabus"
                      checked={formData?.syllabus === "true"}
                      onChange={() => handleToggleChange("syllabus")}
                    />
                  </Box>
                </Grid>
                <Grid container item xs={12} sm={12} alignItems="center">
                  <Typography gutterBottom>Assessment Outline</Typography>
                  <Box sx={{ marginLeft: "auto" }}>
                    <Switch
                      name="assessmentOutline"
                      checked={formData?.assessmentOutline === "true"}
                      onChange={() => handleToggleChange("assessmentOutline")}
                    />
                  </Box>
                </Grid>
                <Grid container item xs={12} sm={12} alignItems="center">
                  <Typography gutterBottom>Lesson Plan - 5 E's</Typography>
                  <Box sx={{ marginLeft: "auto" }}>
                    <Switch
                      name="lessonPlan5Es"
                      checked={formData?.lessonPlan5Es === "true"}
                      onChange={() => handleToggleChange("lessonPlan5Es")}
                    />
                  </Box>
                </Grid>
                <Grid container item xs={12} sm={12} alignItems="center">
                  <Typography gutterBottom>
                    Claim, Evidence, Reasoning
                  </Typography>
                  <Box sx={{ marginLeft: "auto" }}>
                    <Switch
                      name="claimEvidenceReasoning"
                      checked={formData?.claimEvidenceReasoning === "true"}
                      onChange={() =>
                        handleToggleChange("claimEvidenceReasoning")
                      }
                    />
                  </Box>
                </Grid>
                <Grid container item xs={12} sm={12} alignItems="center">
                  <Typography gutterBottom>Debate</Typography>
                  <Box sx={{ marginLeft: "auto" }}>
                    <Switch
                      name="debate"
                      checked={formData?.debate === "true"}
                      onChange={() => handleToggleChange("debate")}
                    />
                  </Box>
                </Grid>
                <Grid container item xs={12} sm={12} alignItems="center">
                  <Typography gutterBottom>Mock Interview</Typography>
                  <Box sx={{ marginLeft: "auto" }}>
                    <Switch
                      name="mockInterview"
                      checked={formData?.mockInterview === "true"}
                      onChange={() => handleToggleChange("mockInterview")}
                    />
                  </Box>
                </Grid>
                <Grid container item xs={12} sm={12} alignItems="center">
                  <Typography gutterBottom>Project Based Learning</Typography>
                  <Box sx={{ marginLeft: "auto" }}>
                    <Switch
                      name="projectBasedLearning"
                      checked={formData?.projectBasedLearning === "true"}
                      onChange={() =>
                        handleToggleChange("projectBasedLearning")
                      }
                    />
                  </Box>
                </Grid>
                <Grid container item xs={12} sm={12} alignItems="center">
                  <Typography gutterBottom>Team Based Activity</Typography>
                  <Box sx={{ marginLeft: "auto" }}>
                    <Switch
                      name="teamBasedActivity"
                      checked={formData?.teamBasedActivity === "true"}
                      onChange={() => handleToggleChange("teamBasedActivity")}
                    />
                  </Box>
                </Grid>
                <Grid container item xs={12} sm={12} alignItems="center">
                  <Typography gutterBottom>Battleship Style</Typography>
                  <Box sx={{ marginLeft: "auto" }}>
                    <Switch
                      name="battleshipStyle"
                      checked={formData?.battleshipStyle === "true"}
                      onChange={() => handleToggleChange("battleshipStyle")}
                    />
                  </Box>
                </Grid>
                <Grid container item xs={12} sm={12} alignItems="center">
                  <Typography gutterBottom>
                    Fill In The Blank Questions
                  </Typography>
                  <Box sx={{ marginLeft: "auto" }}>
                    <Switch
                      name="fillInTheBlankQuestions"
                      checked={formData?.fillInTheBlankQuestions === "true"}
                      onChange={() =>
                        handleToggleChange("fillInTheBlankQuestions")
                      }
                    />
                  </Box>
                </Grid>
                <Grid container item xs={12} sm={12} alignItems="center">
                  <Typography gutterBottom>Scenario-Based Questions</Typography>
                  <Box sx={{ marginLeft: "auto" }}>
                    <Switch
                      name="scenarioBasedQuestions"
                      checked={formData?.scenarioBasedQuestions === "true"}
                      onChange={() =>
                        handleToggleChange("scenarioBasedQuestions")
                      }
                    />
                  </Box>
                </Grid>
                <Grid container item xs={12} sm={12} alignItems="center">
                  <Typography gutterBottom>True/False Questions</Typography>
                  <Box sx={{ marginLeft: "auto" }}>
                    <Switch
                      name="trueFalseQuestions"
                      checked={formData?.trueFalseQuestions === "true"}
                      onChange={() => handleToggleChange("trueFalseQuestions")}
                    />
                  </Box>
                </Grid>
                <Grid container item xs={12} sm={12} alignItems="center">
                  <Typography gutterBottom>
                    Timely, relevant, and actionable feedback
                  </Typography>
                  <Box sx={{ marginLeft: "auto" }}>
                    <Switch
                      name="timelyRelevantActionableFeedback"
                      checked={
                        formData?.timelyRelevantActionableFeedback === "true"
                      }
                      onChange={() =>
                        handleToggleChange("timelyRelevantActionableFeedback")
                      }
                    />
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mb: 2,
                    gap: 1,
                  }}
                >
                  <SecondaryButton onClick={handleClosebox}>
                    Cancel
                  </SecondaryButton>
                  <MainButton
                    onClick={handleSubmit}
                    sx={{
                      border: "1px solid #0077c2",
                      padding: "10px 20px",
                      color: "#ffff",
                      backgroundColor: "#1A73E8",
                      "&:hover": {
                        backgroundColor: "#0D5EBD",
                      },
                    }}
                  >
                    Create Plan
                  </MainButton>
                </Grid>
              </Grid>
            </Container>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default AddSubscription;
