import { Auth0Provider } from "@auth0/auth0-react";
import React from "react";
// import { useNavigate } from "react-router-dom";

export const Auth0ProviderWithNavigate = ({ children }) => {
  //   const navigate = useNavigate();

  const domain = process.env.REACT_APP_AUTH0_DOMAIN;
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
  // const redirectUri = process.env.REACT_APP_AUTH0_CALLBACK_URL;
  const audience = process.env.REACT_APP_AUTH0_AUDIENCE;

  //   const onRedirectCallback = (appState) => {
  //     navigate(appState?.returnTo || window.location.pathname);
  //   };
  const onRedirectCallback = (appState) => {
    // console.log(appState,"appState");
    // window.location.href = appState.returnTo;
    // const returnTo = appState?.returnTo || window.location.pathname;
    const returnTo = appState?.returnTo;
    window.history.replaceState({}, document.title, returnTo);
  };

  if (!(domain && clientId && audience)) {
    return null;
  }

  return (
    // <Auth0Provider
    //   domain={domain}
    //   clientId={clientId}
    //   authorizationParams={{
    //     audience: audience,
    //     redirect_uri: window.location.origin,

    //   }}
    //   // onRedirectCallback={onRedirectCallback}
    //   // cacheLocation="localstorage" // keep session across tabs
    //   // useRefreshTokens={true} // refresh silently
    //         cacheLocation="memory"
    //   useRefreshTokens={true}
    // >
    //   {children}
    // </Auth0Provider>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        audience: audience,
        redirect_uri: window.location.origin,
        scope: "openid profile email", // ✅ removed offline_access
      }}
      onRedirectCallback={onRedirectCallback}
      cacheLocation="memory" // keep default, safer than localstorage
      useRefreshTokens={false} // ✅ disable refresh tokens
    >
      {children}
    </Auth0Provider>
  );
};
