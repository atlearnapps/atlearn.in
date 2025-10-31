import PropTypes from "prop-types";
import { NavLink as RouterLink } from "react-router-dom";
// @mui
import { Box, List, ListItemText } from "@mui/material";
//
import { StyledNavItem, StyledNavItemIcon } from "./styles";

// ----------------------------------------------------------------------

NavSection.propTypes = {
  data: PropTypes.array,
};

export default function NavSection({
  data = [],
  guest,
  userPermission,
  ...other
}) {
  return (
    <Box {...other}>
      <List disablePadding sx={{ p: 1 }}>
        {guest
          ? data.map((item) => {
              if (item.title === "My Subscriptions") {
                return null;
              }
              if (item.title === "My Meetings") {
                return null;
              }
              if (item.title === "My Transactions") {
                return null;
              }
              return <NavItem key={item.title} item={item} />;
            })
          : userPermission
          ? data.map((item) => {
              if (
                item.title === "dashboard" &&
                userPermission?.["ManageRoles"] === "true"
              ) {
                return <NavItem key={item.title} item={item} />; // Skip rendering the item
              }

              if (
                item.title === "Manage Users" &&
                userPermission?.["ManageUsers"] === "true"
              ) {
                return <NavItem key={item.title} item={item} />;
              }
              if (
                item.title === "Users" &&
                userPermission?.["ManageUsers"] === "true"
              ) {
                return <NavItem key={item.title} item={item} />;
              }
              if (
                item.title === "Server Rooms" &&
                userPermission?.["ManageRooms"] === "true"
              ) {
                return <NavItem key={item.title} item={item} />;
              }
              if (
                item.title === "Server Recordings" &&
                userPermission?.["ManageRecordings"] === "true"
              ) {
                return <NavItem key={item.title} item={item} />;
              }
              if (
                item.title === "site Settings" &&
                userPermission?.["ManageSiteSettings"] === "true"
              ) {
                return <NavItem key={item.title} item={item} />;
              }
              if (
                item.title === "Room Configuration" &&
                userPermission?.["ManageSiteSettings"] === "true"
              ) {
                return <NavItem key={item.title} item={item} />;
              }
              if (
                item.title === "Role" &&
                userPermission?.["ManageRoles"] === "true"
              ) {
                return <NavItem key={item.title} item={item} />; // Skip rendering the item
              }
              if (
                item.title === "Monitoring" &&
                userPermission?.["ManageRoles"] === "true"
              ) {
                return <NavItem key={item.title} item={item} />; // Skip rendering the item
              }
              if (
                item.title === "Subscription Plans" &&
                userPermission?.["ManageRoles"] === "true"
              ) {
                return <NavItem key={item.title} item={item} />; // Skip rendering the item
              }
              if (
                item.title === "All Transactions" &&
                userPermission?.["ManageRoles"] === "true"
              ) {
                return <NavItem key={item.title} item={item} />; // Skip rendering the item
              }

              return null;
            })
          : data.map((item) => <NavItem key={item.title} item={item} />)}
      </List>
    </Box>
  );
}

// ----------------------------------------------------------------------

NavItem.propTypes = {
  item: PropTypes.object,
};

function NavItem({ item }) {
  const { title, path, icon, info } = item;

  return (
    <>
      <StyledNavItem
        component={RouterLink}
        to={path}
        sx={{
          "&.active": {
            // color: 'text.primary',
            // bgcolor: 'action.selected',
            fontWeight: "fontWeightBold",
            color: "primary.main",
          },
        }}
      >
        <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>

        <ListItemText
          disableTypography
          primary={title}
          style={{ fontSize: "18px" }}
        />

        {info && info}
      </StyledNavItem>
    </>
  );
}
