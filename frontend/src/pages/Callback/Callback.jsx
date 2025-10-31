import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import apiClients from "src/apiClients/apiClients";
import Loader from "src/components/New components/Loader/Loader";
import RoleModal from "src/components/userProfile/modal/RoleModal";

function Callback() {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const roomId = queryParams.get("roomId");
  const checkoutId = queryParams.get("checkout");
  const sheduledId = queryParams.get("scheduleId");
  const [loading, setLoading] = useState(true);
  // let Role = queryParams.get("role");

  const navigateLink = queryParams.get("to");
  // Extract role from 'to' query parameter
  const extractRole = () => {
    if (navigateLink) {
      const toParams = new URLSearchParams(navigateLink.split("?")[1]); // Extract role
      return toParams.get("role") || null;
    }
    return queryParams.get("role") || null;
  };

  // eslint-disable-next-line no-unused-vars
  const [role, setRole] = useState(extractRole());
  const [roleModalOpen, setRoleModalOpen] = useState(false);

  useEffect(() => {
    const saveUserToDB = async () => {
      if (user && !localStorage.getItem("access_token")) {
        setLoading(true);
        const accessToken = await getAccessTokenSilently();
        localStorage.setItem("access_token", accessToken);

        try {
          const data = {
            email: user.email,
            name: user?.nickname || user.name,
            external_id: user?.sub,
            role: role || null,
          };
          const response = await apiClients.auth0Verification(data);
          if (response.data) {
            localStorage.setItem("user", JSON.stringify(response.data));

            if (!response.data.role_id) {
              setRoleModalOpen(true);
            } else if (navigateLink) {
              navigate(`${navigateLink}`);
            } else if (roomId && sheduledId) {
              navigate(
                `/Join-meeting?roomId=${roomId}&scheduleId=${sheduledId}`
              );
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
            setLoading(false);
          }
        } catch (error) {
          setLoading(false);
          navigate("/");
          console.error("Failed to save user to database:", error);
        }
      } else {
        setLoading(false);
        navigate("/");
      }
    };

    saveUserToDB();
  }, [user, isAuthenticated, role]);

  return (
    <div>
      {loading && (
        <div>
          <Loader />
        </div>
      )}
      <RoleModal
        open={roleModalOpen}
        handleClose={() => setRoleModalOpen(false)}
        user_email={user?.email}
      />
    </div>
  );
}

export default Callback;
