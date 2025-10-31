import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

function App() {
  const {
    isLoading,
    isAuthenticated,
    loginWithRedirect,
    getAccessTokenSilently,
    user,
    logout,
  } = useAuth0();
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!isLoading && !isAuthenticated) {
  //     getAccessTokenSilently()
  //       .then(() => {
  //         // User session found, no redirect needed
  //         console.log("SSO: User auto-logged in");
  //       })
  //       .catch(() => {
  //         // No existing session, fallback to login screen
  //         // loginWithRedirect();
  //       });
  //   }
  // }, [isLoading, isAuthenticated, getAccessTokenSilently, loginWithRedirect]);
  // // useEffect(() => {
  // //         console.log("rediect to callback");
  // //   if (!isLoading && isAuthenticated && user) {
  // //     console.log("rediect to callback");
      
  // //     navigate("/callback");
  // //   }
  // // }, [isLoading, isAuthenticated, user, navigate]);

  // if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {isAuthenticated ? (
        <h2>Welcome {user?.name}</h2>
      ) : (
        <p>Redirecting to login...</p>
      )}
      <header style={{ padding: 16, display: "flex", gap: 8 }}>
        {!isAuthenticated ? (
          <button onClick={() => loginWithRedirect()}>Log in</button>
        ) : (
          <>
            <span>Hi {user?.name}</span>
            <button
              onClick={() => {
                localStorage.removeItem("user");
                localStorage.removeItem("access_token");
                logout({
                  logoutParams: {
                    returnTo: window.location.origin, // back to current site
                    // For IdP/global logout across apps, also add "federated" at the dashboard level if needed.
                  },
                });
              }}
            >
              Log out
            </button>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
