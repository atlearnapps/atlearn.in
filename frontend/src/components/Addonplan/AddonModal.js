import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import AddonSuccess from "./AddonSuccess";
import {
  Slide,
  Divider,
  Box,
  Container,
  Grid,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import AddonPersonDeatils from "./AddonPersonDeatils";
import AddonPlan from "./AddonPlan";
import AddonPayment from "./AddonPayment";
// import FormControl from '@mui/material/FormControl';

import MainButton from "../Button/MainButton/MainButton";
import { clearDuration, clearStorage } from "src/Redux/addonplanSlice";
import { useDispatch } from "react-redux";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} timeout={500} />;
});

function AddonModal({
  open,
  handleClose,
  addonDurationactive,
  addonStorageActive,
  session,
}) {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm")); // Matches xs and down
  const dispatch = useDispatch();
  const [activeDuration, setActiveDuration] = useState(false);
  const [activeStorage, setActiveStorage] = useState(false);

  useEffect(() => {
    if (addonDurationactive) {
      setActiveDuration(true);
    } else {
      setActiveDuration(false);
    }
    if (addonStorageActive) {
      setActiveStorage(true);
    } else {
      setActiveStorage(false);
    }
  }, [addonDurationactive, addonStorageActive]);

  const handleCloseBox = () => {
    // session();
    dispatch(clearDuration());
    dispatch(clearStorage());
    setActiveStep(0);
    handleClose();
  };
  const handleSuccessBox = () => {
    session();
    handleCloseBox();
  };

  const steps = ["Select Add-on Plan", "Add Details", "Payment"];
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div>
      <Dialog
        maxWidth={"md"}
        fullWidth={"md"}
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <DialogTitle sx={{ textAlign: "center" }}>
          Add-on Plan
          <Box mt={2} mb={2}>
            <Stepper
              activeStep={activeStep}
              orientation={isXs ? "vertical" : "horizontal"}
            >
              {steps.map((label, index) => {
                const stepProps = {};
                const labelProps = {};
                // if (isStepOptional(index)) {
                //   labelProps.optional = (
                //     <Typography variant="caption">Optional</Typography>
                //   );
                // }
                if (isStepSkipped(index)) {
                  stepProps.completed = false;
                }
                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Container>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <Box sx={{ width: "100%" }}>
                  {activeStep === steps.length ? (
                    <React.Fragment>
                      <AddonSuccess />
                      <Box
                        sx={{ display: "flex", flexDirection: "row", pt: 2 }}
                      >
                        <Box sx={{ flex: "1 1 auto" }} />
                        <MainButton onClick={handleSuccessBox}>OK</MainButton>
                      </Box>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      {activeStep === 0 ? (
                        <AddonPlan
                          handlenext={handleNext}
                          handleback={handleBack}
                          duration={activeDuration}
                          storage={activeStorage}
                          handleCloseBox={handleCloseBox}
                        />
                      ) : activeStep === 1 ? (
                        <AddonPersonDeatils
                          handlenext={handleNext}
                          handleback={handleBack}
                          handleCloseBox={handleCloseBox}
                        />
                      ) : (
                        <AddonPayment
                          handlenext={handleNext}
                          handleback={handleBack}
                          handleCloseBox={handleCloseBox}
                        />
                      )}
                    </React.Fragment>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Container>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </div>
  );
}

export default AddonModal;
