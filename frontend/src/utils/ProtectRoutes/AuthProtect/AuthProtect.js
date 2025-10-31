import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser,clearUser } from "src/Redux/userSlice";
import { UseAuth } from "src/utils/UseAuth/UseAuth";

export function AuthProtect({ children }) {
  const auth = UseAuth();

  const dispatch = useDispatch();

  const data = localStorage.getItem("user");
  let user = JSON.parse(data);
  useEffect(() => {
    if (auth.user) {
      dispatch(setUser(auth.user));
    }else{
      dispatch(clearUser());
    }
  }, [auth.user, dispatch]);

  if (user) {
    return children;
  } else {
    return <Navigate to="/" />;
  }
}
