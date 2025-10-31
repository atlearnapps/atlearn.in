import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import apiClients from "src/apiClients/apiClients";
// import MainButton from "src/components/Button/MainButton/MainButton";
// import FarlanesLogo from "src/images/logo/Final Logo.svg";
function VerifyEmail() {
  const navigate = useNavigate();
  const [verify, setVerify] = useState();
  const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const roomId = queryParams.get("roomId");
  useEffect(() => {
    const url = window.location.href;
    const parts = url.split("/");
    const id = parts[parts.length - 2];

    if (id) {
      
      verifyEmail(id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verifyEmail = async (id) => {
    try {
      const response = await apiClients.verifyEmail(id);
      if (response.success === true) {
        setVerify("true");
        setTimeout(() => {
          if(roomId){
            navigate(`/login?roomId=${roomId}`);
          }else{
            navigate("/login");
          }
          
        }, 2000);
      } else {
        setVerify("false");
        setTimeout(() => {
          navigate("/signup");
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* <img src={FarlanesLogo} alt="FarlanesLogo" /> */}
      {verify === "true" && (
        <>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQa7R6eCfMTFpe-GTRsUSlxQz5AUsYxPckIng&usqp=CAU"
            alt="logo"
          />
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "32px",
              // lineHeight: "72px",
              textAlign: "center",
              color: "#40444B",
            }}
          >
            Email verified successfully
          </Typography>
        </>
      )}

      {verify === "false" && (
        <>
          {/* <Typography
        sx={{
          fontWeight: 600,
          fontSize: "32px",
          // lineHeight: "72px",
          textAlign: "center",
          color: "#40444B",
        }}
      >
            Email verified failed
      </Typography> */}
          <img
            style={{ width: "350px", height: "350px" }}
            src="https://media.istockphoto.com/vectors/mail-icon-for-web-design-send-new-message-vector-vector-id1219938870?k=20&m=1219938870&s=612x612&w=0&h=usv1BOz1OeU3CWN9KIZRVOnEXowwwdJ_dl7mgXqawsA="
            alt="logo"
          />
        </>
      )}
    </div>
  );
}

export default VerifyEmail;
