import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
// import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
// import { useHandleNavigate } from "src/utils/Navigation/useHandleNavigate";
import { UseAuth } from "src/utils/UseAuth/UseAuth";

function Register() {
  const auth = UseAuth();
  //   const { user } = useSelector((state) => state.user);
  //   const handleNavigate = useHandleNavigate();
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithRedirect } = useAuth0();

  // ✅ Extract "to" query param from URL
  const searchParams = new URLSearchParams(location.search);
  const link = searchParams.get("to"); // 👉 "/room?role=moderator"

  const handleSignUp = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: `/callback${link ? `?to=${encodeURIComponent(link)}` : ""}`,
      },
      authorizationParams: {
        prompt: "login",
        screen_hint: "signup",
      },
    });
  };

  useEffect(() => {
    if (auth.user) {
      navigate("/");
    } else {
      handleSignUp();
    }
  }, [auth.user]);

  return null;
}

export default Register;
