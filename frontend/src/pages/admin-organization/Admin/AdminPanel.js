import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const { user } = useSelector((state) => state?.user);
  const navigate = useNavigate();

  useEffect(() => {
    const navigateTo = () => {
      const { permission } = user;
      const {
        ManageUsers,
        ManageRooms,
        ManageRecordings,
        ManageSiteSettings,
        ManageRoles,
      } = permission;

      if (ManageRoles === "true") {
        return "/organization/dashboard";
      }

      if (ManageUsers === "true") {
        return "/organization/users";
      }

      if (ManageRooms === "true") {
        return "/organization/server-rooms";
      }

      if (ManageRecordings === "true") {
        return "/organization/server-recordings";
      }

      if (ManageSiteSettings === "true") {
        return "/organization/site-settings";
      }

      if (ManageRoles === "true") {
        return "/organization/roles";
      }

      // If none of the permissions match, redirect to a default route
      return "/";
    };

    const route = navigateTo();
    navigate(route, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null; // This component does not render anything
}
