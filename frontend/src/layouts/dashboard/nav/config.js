// component
import SvgColor from "../../../components/svg-color";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import DeleteIcon from "@mui/icons-material/Delete";
import DashboardIcon from "src/components/NavIcons/DashboardIcon";
import ManageUsersIcon from "src/components/NavIcons/ManageUsers";
import ServerRoomIcon from "src/components/NavIcons/ServerRoomIcon";
import ServerRecordingIcon from "src/components/NavIcons/ServerRecordingIcon";
import RoleIcon from "src/components/NavIcons/RoleIcon";
import SiteSettingIcon from "src/components/NavIcons/SiteSettingIcon";
import RoomConfigurationIcon from "src/components/NavIcons/RoomConfigurationIcon";
import MonitoringIcon from "src/components/NavIcons/MonitoringIcon";
import SubscriptionPlanIcon from "src/components/NavIcons/SubscriptionPlanIcon";
import TvIcon from "@mui/icons-material/Tv";
import PaymentIcon from "@mui/icons-material/Payment";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor
    src={`/assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
);

export const navConfig = [
  {
    title: "dashboard",
    path: "/dashboard/app",
    icon: icon("ic_analytics"),
  },
  {
    title: "meetings",
    path: "/dashboard/meetings",
    icon: icon("ic_blog"),
  },

  // {
  //   title: 'product',
  //   path: '/dashboard/products',
  //   icon: icon('ic_cart'),
  // },
  // {
  //   title: 'blog',
  //   path: '/dashboard/blog',
  //   icon: icon('ic_blog'),
  // }
];

export const profileNavConfig = [
  {
    title: " My Profile",
    path: "/settings/profile",
    icon: <PersonIcon sx={{ color: "primary.main" }} />,
  },
  {
    title: "My Meetings",
    path: "/settings/mymeeting",
    icon: <TvIcon sx={{ color: "primary.main" }} />,
  },
  {
    title: "My Subscriptions",
    path: "/settings/mysubscription",
    icon: <PaymentIcon sx={{ color: "primary.main" }} />,
  },
  {
    title: "My Transactions",
    path: "/settings/mytransaction",
    icon: <CurrencyExchangeIcon sx={{ color: "primary.main" }} />,
  },
  {
    title: "App Credentials",
    path: "/settings/app-credentials",
    icon: <VpnKeyIcon sx={{ color: "primary.main" }} />,
  },
  // {
  //   title: "Change Password",
  //   path: "/settings/forgetPassword",
  //   icon: <LockIcon sx={{ color: "primary.main " }} />,
  // },
  {
    title: "Delete Account",
    path: "/settings/deleteAccount",
    icon: <DeleteIcon sx={{ color: "primary.main" }} />,
  },
];

export const OrganisationConfig = [
  {
    title: "dashboard",
    path: "/organization/dashboard",
    icon: <DashboardIcon sx={{ color: "primary.main " }} />,
  },
  // {
  //   title: "Manage Users",
  //   path: "/organization/users",
  //   icon: <ManageUsersIcon sx={{ color: "#6D207B " }} />,
  // },
  {
    title: "Users",
    path: "/organization/auth0-users",
    icon: <ManageUsersIcon sx={{ color: "#6D207B " }} />,
  },
  {
    title: "Server Rooms",
    path: "/organization/server-rooms",
    icon: <ServerRoomIcon sx={{ color: "#6D207B " }} />,
  },
  {
    title: "Server Recordings",
    path: "/organization/server-recordings",
    icon: <ServerRecordingIcon sx={{ color: "#6D207B " }} />,
  },
  {
    title: "site Settings",
    path: "/organization/site-settings",
    icon: <SiteSettingIcon sx={{ color: "#6D207B " }} />,
  },
  {
    title: "Room Configuration",
    path: "/organization/room-configuration",
    icon: <RoomConfigurationIcon sx={{ color: "#6D207B " }} />,
  },
  {
    title: "Role",
    path: "/organization/roles",
    icon: <RoleIcon sx={{ color: "#6D207B " }} />,
  },
  {
    title: "Monitoring",
    path: "/organization/monitor",
    icon: <MonitoringIcon sx={{ color: "#6D207B " }} />,
  },
  {
    title: "Subscription Plans",
    path: "/organization/subscription-plans",
    icon: <SubscriptionPlanIcon sx={{ color: "#6D207B " }} />,
  },
  {
    title: "All Transactions",
    path: "/organization/alltransactions",
    icon: <SubscriptionPlanIcon sx={{ color: "#6D207B " }} />,
  },
];
