import React from "react";
import { Navigate } from "react-router-dom";
import { useDispatch} from "react-redux";
import { setUser } from "src/Redux/userSlice";
export function RequireModerator({ children }) {
  const dispatch = useDispatch();
  // const data = localStorage.getItem("userRoles");
  // let user=JSON.parse(data)

  // if (user && (user.isModerator || user.isAdmin)) {
  //   return children;
  // } else {
  //   return <Navigate to="/home" />;
  // }

  const data = localStorage.getItem("user");
  let user=JSON.parse(data);
  if(user){
    dispatch(setUser(user));
  }

  if (user && (user.role.name==="Administrator" || user.role.name==="Moderator")) {
    return children;
  } else {
    return <Navigate to="/" />;
  }


}
