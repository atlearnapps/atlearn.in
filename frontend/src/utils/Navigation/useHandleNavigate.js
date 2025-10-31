import { useAuth0 } from "@auth0/auth0-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const useHandleNavigate = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { loginWithRedirect } = useAuth0();

  const handleLogin = async (link) => {
    await loginWithRedirect({
      appState: {
        returnTo: `/callback${link ? `?to=${encodeURIComponent(link)}` : ""}`,
      },
      authorizationParams: {
        prompt: "login",
      },
    });
  };

  const handleSignUp = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: `/callback?to=/room`,
      },
      authorizationParams: {
        prompt: "login",
        screen_hint: "signup",
      },
    });
  };

  const handleNavigate = (link) => {
    if (link.startsWith("http://") || link.startsWith("https://")) {
      // Open the link in a new tab or handle external navigation
      // window.location.href = link;
      window.open(link, "_blank");
    } else if (link === "/signup") {
      if (user?.user) {
        navigate("/room");
      } else {
        handleSignUp();
      }
    } else {
      if (user?.user) {
        navigate(link);
      } else {
        if (link?.length) {
          // navigate(`/login?to=${link}`);
          handleLogin(link);
        }
      }
    }
  };

  return handleNavigate;
};
