import React from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
function AuthNavBar() {
  // const { keycloak} = useKeycloak();
  const navigate = useNavigate();
  // const token = keycloak.token;
  // console.log(token, "token");
  // const profile = keycloak.loadUserProfile();
  // console.log('Retrieved user profile:', profile);
  // const isAdmin = keycloak.hasRealmRole("admin");
  // console.log(isAdmin,"isAdmin");
  return (
    <div
      style={{
        height: "65px",
        borderBottom: "1px solid rgba(0,40,100,0.12)",
        paddingTop: "15px",
        display: "flex",
        justifyContent: "end",
      }}
    >
      <div>
        <Button  sx={{mr:2}} onClick={()=>navigate("/login")} variant="outlined">Sign in</Button>

        {/* <Button
          sx={{ mr: 4 }}
          onClick={() => keycloak.login()}
          variant="outlined"
        >
          Sign in
        </Button>
        <Button
          sx={{ mr: 4 }}
          onClick={() => keycloak.logout()}
          variant="outlined"
        >
          logout
        </Button> */}

        <Button sx={{mr:4}} onClick={()=>navigate("/signup")} variant="outlined">Sign up</Button>
      </div>
    </div>
  );
}

export default AuthNavBar;
