import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import { Slide, Divider, useTheme } from "@mui/material";

import Button from "@mui/material/Button";

// import FormControl from '@mui/material/FormControl';

import formatDateUtils from "src/utils/FormateDateUtils";
import MainButton from "src/components/Button/MainButton/MainButton";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} timeout={500} />;
});

function RoomSharedDetails({
  open,
  handleClose,
  clickedUserDetails,
  userName,
}) {
  const theme = useTheme();
  const handleCloseBox = () => {
    handleClose();
  };

  return (
    <div>
      <Dialog
        maxWidth={"lg"}
        fullWidth
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <DialogTitle sx={{ textAlign: "center", backgroundColor: "#F5F7FB" }}>
          {userName} - Room Shared Details.
        </DialogTitle>
        <Divider />
        <DialogContent>
          {clickedUserDetails && clickedUserDetails.length > 0 ? (
            // <table
            //   style={{
            //     width: "100%",
            //     borderCollapse: "collapse",
            //     border: "1px solid #ddd",
            //   }}
            // >
            //   <thead>
            //     <tr
            //       style={{
            //         backgroundColor: theme.palette.primary.main,
            //         color: "white",
            //       }}
            //     >
            //       <th style={{ border: "1px solid #ddd", padding: "8px" }}>
            //         Room Name
            //       </th>
            //       <th style={{ border: "1px solid #ddd", padding: "8px" }}>
            //         Shared Users
            //       </th>
            //     </tr>
            //   </thead>
            //   <tbody>
            //     {clickedUserDetails.map((detail, index) => (
            //       <tr key={index}>
            //         <td
            //           style={{
            //             border: "1px solid #ddd",
            //             padding: "8px",
            //             verticalAlign: "top",
            //           }}
            //         >
            //           {detail.roomName}
            //         </td>
            //         <td style={{ border: "1px solid #ddd", padding: "8px" }}>
            //           <table
            //             style={{
            //               width: "100%",
            //               borderCollapse: "collapse",
            //               border: "1px solid #ddd",
            //             }}
            //           >
            //             <thead>
            //               <tr
            //                 style={{
            //                   backgroundColor: theme.palette.primary.main,
            //                   color: "white",
            //                 }}
            //               >
            //                 <th
            //                   style={{
            //                     border: "1px solid #ddd",
            //                     padding: "4px",
            //                   }}
            //                 >
            //                   User Name
            //                 </th>
            //                 <th
            //                   style={{
            //                     border: "1px solid #ddd",
            //                     padding: "4px",
            //                   }}
            //                 >
            //                   Date Shared
            //                 </th>
            //               </tr>
            //             </thead>
            //             <tbody>
            //               {detail.sharedWith.map((user, userIndex) => (
            //                 <tr key={userIndex}>
            //                   <td
            //                     style={{
            //                       border: "1px solid #ddd",
            //                       padding: "4px",
            //                     }}
            //                   >
            //                     {user.name}
            //                   </td>
            //                   <td
            //                     style={{
            //                       border: "1px solid #ddd",
            //                       padding: "4px",
            //                     }}
            //                   >
            //                     {formatDateUtils(new Date(user.date))}
            //                   </td>
            //                 </tr>
            //               ))}
            //             </tbody>
            //           </table>
            //         </td>
            //       </tr>
            //     ))}
            //   </tbody>
            // </table>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                border: "1px solid #ddd",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: theme.palette.primary.main,
                    color: "white",
                    textAlign: "center",
                  }}
                >
                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    Room Name
                  </th>
                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    Shared Users
                  </th>
                </tr>
              </thead>
              <tbody>
                {clickedUserDetails.map((detail, index) => (
                  <tr
                    key={index}
                    style={{
                      transition: "background-color 0.3s ease",
                      textAlign: "center",
                    }}
                  >
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "12px",
                        verticalAlign: "top",
                      }}
                    >
                      {detail.roomName}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "12px" }}>
                      <table
                        style={{
                          width: "100%",
                          borderCollapse: "collapse",
                          border: "1px solid #ddd",
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                          borderRadius: "8px",
                          overflow: "hidden",
                        }}
                      >
                        <thead>
                          <tr
                            style={{
                              backgroundColor: theme.palette.primary.main,
                              color: "white",
                            }}
                          >
                            <th
                              style={{
                                border: "1px solid #ddd",
                                padding: "8px",
                                fontWeight: "bold",
                              }}
                            >
                              User Name
                            </th>
                            <th
                              style={{
                                border: "1px solid #ddd",
                                padding: "8px",
                                fontWeight: "bold",
                              }}
                            >
                              Date Shared
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {detail.sharedWith.map((user, userIndex) => (
                            <tr
                              key={userIndex}
                              style={{
                                transition: "background-color 0.3s ease",
                              }}
                            >
                              <td
                                style={{
                                  border: "1px solid #ddd",
                                  padding: "8px",
                                }}
                              >
                                {user.name}
                              </td>
                              <td
                                style={{
                                  border: "1px solid #ddd",
                                  padding: "8px",
                                }}
                              >
                                {formatDateUtils(new Date(user.date))}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No details available</p>
          )}
        </DialogContent>
        <DialogActions>
          {/* <Button
            onClick={handleCloseBox}
            sx={{
              border: "1px solid #444444",
              padding: "10px 20px",
              color: "#444444",
              "&:hover": {
                backgroundColor: "#F5F7FB",
              },
            }}
          >
            Cancel
          </Button> */}
          <MainButton onClick={handleCloseBox}>OK</MainButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default RoomSharedDetails;
