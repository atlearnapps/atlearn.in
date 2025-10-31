import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

export default function AppWrapper({ children }) {
  const {
    user,
    isLoading,
    isAuthenticated,
    getAccessTokenSilently,
    // loginWithRedirect,
  } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      getAccessTokenSilently()
        .then(() => {
          navigate("/callback");
        })
        .catch((err) => {
          console.error(
            "❌ Silent login failed:",
            err.error || err.message,
            err
          );
          //    loginWithRedirect();
        });
    } else if (
      !isLoading &&
      isAuthenticated &&
      user &&
      !localStorage.getItem("access_token")
    ) {
      navigate("/callback");
    }
  }, [isLoading, isAuthenticated, getAccessTokenSilently, navigate]);

  return children;
}
