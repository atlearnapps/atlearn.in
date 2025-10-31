import React, { useEffect } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import success from "src/images/success-removebg-preview.png";
import { useNavigate } from "react-router-dom";
import apiClients from "src/apiClients/apiClients";
const SuccessPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const storedSessionId = localStorage.getItem("sessionId");
    const userObject = localStorage.getItem("user");
    const userId = JSON.parse(userObject);
    if (storedSessionId && userId) {
      const data = {
        user_Id: userId.id,
        sessionId: storedSessionId,
      };
      activePlan(data);
    }
  }, []);

  const activePlan = async (data) => {
    try {
      const response = await apiClients.paymentSuccess(data);
      if (response.success === true) {
        localStorage.removeItem("sessionId");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const containerStyle = {
    width: "100%",
    minHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    // margin: '10px 0',
  };

  const successTextStyle = {
    margin: "10px 0",
    color: "#4CAF50", // Use the appropriate color for success text
    fontSize: "1.5rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  };

  const successImageStyle = {
    width: "220px",
    height: "220px",
  };

  const buttonStyle = {
    // width: '40px',
    textTransform: "uppercase",
    backgroundColor: "green",
    color: "white",
    fontSize: "1rem",
    // margin: '16px 0',
    padding: "10px 18px",
    borderRadius: "8px",
  };

  const handlePaymentSuccess = () => {
    navigate("/");
  };

  return (
    <div style={{ margin: "0", padding: "0", width: "100%", height: "100%" }}>
      <Container style={containerStyle}>
        <div style={successTextStyle}>
          <img src={success} alt="" style={successImageStyle} />
          <Typography variant="h4">Payment Successful</Typography>
          <Button onClick={handlePaymentSuccess} style={buttonStyle}>
            Proceed
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default SuccessPage;
