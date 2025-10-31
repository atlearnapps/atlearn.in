import { useAuth0 } from "@auth0/auth0-react";
import { Box, Container, Typography } from "@mui/material";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setUser } from "src/Redux/userSlice";
import apiClients from "src/apiClients/apiClients";
import { BASE_URL } from "src/apiClients/config";
import DeleteUser from "src/components/confirmationPopup/confirmationPopup";

function DeleteAccount() {
  const navigate = useNavigate();
  const data = localStorage.getItem("user");
  let user = JSON.parse(data);
  const [deleteModal, setDeleteModal] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [userId, setUserId] = useState(user ? user.id : "");
  const dispatch = useDispatch();
  const { logout } = useAuth0();
  const deleteUser = () => {
    setDeleteModal(true);
  };
  const deleteUserClose = () => {
    setDeleteModal(false);
  };

  const handleDeleteUser = async () => {
    try {
      const response = await apiClients.deleteUser(userId);
      if (response.message) {
        if (response.success === true) {
          toast.success(response.message);
          localStorage.removeItem("user");
          localStorage.removeItem("access_token");
          logout({
            logoutParams: {
              returnTo: window.location.origin, 
            },
          });
          dispatch(setUser(""));
          navigate("/");
        } else {
          toast.error(response.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Helmet>
        <title>Delete Your Atlearn Account - Easy Process</title>
        <meta
          name="description"
          content="Looking to delete your Atlearn account? Follow our simple, step-by-step guide to close your account securely and with minimal hassle."
        />
        <link rel="canonical" href={`${BASE_URL}/settings/deleteAccount`} />
      </Helmet>
      <Box>
        <Container maxWidth={"xl"}>
          <Box
            mt={8}
            sx={{
              marginBottom: "20px",
              background: "rgb(255, 255, 255)",
              minHeight: "40vh",
              borderRadius: "12px",
              boxShadow:
                "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px",
              transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
            }}
          >
            <Box sx={{ mt: { xs: 0, sm: 6 } }}>
              <Box
                sx={{
                  width: "100%",
                  // minHeight: "60vh",
                  padding: "10Px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    mt: { xs: 0, sm: 6 },
                    textAlign: "center",
                  }}
                >
                  <Typography sx={{ m: 1, pt: 2 }} variant="h3" gutterBottom>
                    Permanently Delete your Account
                  </Typography>
                  <Box
                    sx={{
                      mt: { xs: 0, sm: 4 },
                      pb: { xs: 0, sm: 8 },
                      width: { xs: "100%", md: "100%", lg: "50%" },
                    }}
                  >
                    <Container>
                      <Typography gutterBottom sx={{ textAlign: "center" }}>
                        If you choose to delete your account, it will NOT be
                        recoverable.<br></br> All information regarding your
                        account, including settings, meetings, and recording
                        will be removed.
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          mt: 2,
                        }}
                      >
                        <Box
                          onClick={deleteUser}
                          color="error"
                          sx={{
                            backgroundColor: "#cd201f",
                            color: "#fff",
                            padding: "10px 20px",
                            fontWeight: "700",
                            fontSize: "16px",
                            "&:hover": { backgroundColor: "#cd201f" },
                            cursor: "pointer",
                            borderRadius: "8px",
                          }}
                        >
                          <Typography align="center">Delete Account</Typography>
                        </Box>
                      </Box>
                    </Container>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
          <DeleteUser
            open={deleteModal}
            handleClose={deleteUserClose}
            handleConfirm={handleDeleteUser}
          />
        </Container>
      </Box>
    </div>
  );
}

export default DeleteAccount;
