import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import StudentIcon from "src/assets/images/home/student_icon.svg";
import TeacherIcon from "src/assets/images/home/teacher_icon.svg";
import { Slide, Divider } from "@mui/material";
import apiClients from "src/apiClients/apiClients";
import { useLocation, useNavigate } from "react-router-dom";
import MainButton from "src/components/Button/MainButton/MainButton";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} timeout={500} />;
});

function RoleModal({ open, handleClose, user_email }) {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");
  const [roleError, setRoleError] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const roomId = queryParams.get("roomId");
  const checkoutId = queryParams.get("checkout");
  const sheduledId = queryParams.get("scheduleId");
  const Role = queryParams.get("role");
  const navigateLink = queryParams.get("to");
  const handleRoleClick = (role) => {
    setRoleError(false);
    setSelectedRole(role);
  };

  const isSelected = (role) =>
    selectedRole === role ? "ring-2 ring-blue-500" : "";

  // const handleCloseBox = () => {
  //   handleClose();
  // };

  const handleAddRole = async () => {
    try {
      if (selectedRole) {
        const data = {
          userEmail: user_email,
          role: selectedRole,
        };
        const response = await apiClients.addRole(data);
        if (response.data) {
          // localStorage.setItem("user", JSON.stringify(response.data));
          // // localStorage.setItem("access_token", JSON.stringify(response.token));
          // if (response?.data?.role?.name === "Administrator") {
          //   navigate("/organization/dashboard", { replace: true });
          // } else {
          //   navigate("/room", { replace: true });
          // }

          if (navigateLink) {
            navigate(`${navigateLink}`);
          } else if (roomId && sheduledId) {
            navigate(`/Join-meeting?roomId=${roomId}&scheduleId=${sheduledId}`);
          } else if (roomId) {
            navigate(`/room/${roomId}/join`);
          } else if (checkoutId) {
            if (response?.data?.role?.name === "Guest") {
              navigate("/room", { replace: true });
            } else {
              navigate(`/checkout?id=${checkoutId}`);
            }
          } else if (
            response?.data?.role?.name === "Administrator" ||
            response?.data?.role?.name === "Super Admin"
          ) {
            navigate("/organization/dashboard", { replace: true });
          } else {
            navigate("/room", { replace: true });
          }
        }
      } else {
        setRoleError(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Dialog
        maxWidth="sm"
        fullWidth
        open={open}
        TransitionComponent={Transition}
        PaperProps={{
          className:
            "rounded-2xl overflow-hidden bg-white/90 backdrop-blur-xl shadow-2xl",
        }}
      >
        {/* Header */}
        <DialogTitle className="bg-primaryColor text-center ">
          <h2 className="text-3xl font-extrabold text-white tracking-wide">
            Pick Your Role
          </h2>
        </DialogTitle>

        {/* Content */}
        <DialogContent>
          <div className="flex justify-center py-4">
            <div className="rounded-xl w-full max-w-lg">
              <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                {/* Student Card */}
                <div
                  className={`flex flex-col items-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-xl p-6 cursor-pointer transform transition-all hover:scale-105 hover:shadow-2xl ${
                    selectedRole === "Guest"
                      ? "ring-4 ring-[#6E8AF5]"
                      : "ring-2 ring-transparent"
                  }`}
                  onClick={() => handleRoleClick("Guest")}
                >
                  <div className="rounded-full bg-gradient-to-r from-[#001B48] to-[#6E8AF5] p-5 shadow-lg">
                    <img
                      src={StudentIcon}
                      alt="Student"
                      className="w-16 h-16"
                    />
                  </div>
                  <p className="mt-4 text-lg font-semibold text-gray-800">
                    I'm a Student
                  </p>
                </div>

                {/* Teacher Card */}
                <div
                  className={`flex flex-col items-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-xl p-6 cursor-pointer transform transition-all hover:scale-105 hover:shadow-2xl ${
                    selectedRole === "Moderator"
                      ? "ring-4 ring-[#001B48]"
                      : "ring-2 ring-transparent"
                  }`}
                  onClick={() => handleRoleClick("Moderator")}
                >
                  <div className="rounded-full bg-gradient-to-r from-[#6E8AF5] to-[#001B48] p-5 shadow-lg">
                    <img
                      src={TeacherIcon}
                      alt="Teacher"
                      className="w-16 h-16"
                    />
                  </div>
                  <p className="mt-4 text-lg font-semibold text-gray-800">
                    I'm a Teacher
                  </p>
                </div>
              </div>

              {/* Error Message */}
              {roleError && (
                <p className="mt-6 text-center text-red-500 font-medium text-lg">
                  Please select a role
                </p>
              )}
            </div>
          </div>
        </DialogContent>

        {/* Footer */}
        <DialogActions className=" pb-6 justify-center">
          <MainButton onClick={handleAddRole}>Done</MainButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default RoleModal;
