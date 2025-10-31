import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ToastContainer } from "react-toastify";
import AOS from "aos";
import "aos/dist/aos.css";
import "react-toastify/dist/ReactToastify.css";
// routes
import Router from "./routes";
// theme
import ThemeProvider from "./theme";
// components
import { StyledChart } from "./components/chart";
import ScrollToTop from "./components/scroll-to-top";
import "./App.css";
import { Provider } from "react-redux";
import store from "../src/Redux/store";
// import { useRef } from 'react';
// import TawkMessengerReact from "@tawk.to/tawk-messenger-react";
import { useEffect } from "react";
import Preloader from "./components/New components/Preloader/Preloader";
import AppWrapper from "./utils/UseAuth/AppWrapper";
// import { useAuth0 } from "@auth0/auth0-react";
// import { useAuth0 } from "@auth0/auth0-react";
// ----------------------------------------------------------------------

export default function App() {
  // const { isLoading,user } = useAuth0();

  // const tawkMessengerRef = useRef();
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      once: true, // Whether animation should happen only once
    });
  }, []);


  return (
    <Provider store={store}>
      <HelmetProvider>
        <BrowserRouter>
          <ThemeProvider>
            <ScrollToTop />
            <StyledChart />
            <ToastContainer />
            <Preloader />
            {/* {isAuthenticated && <SaveUser />} */}
            {/* <KeycloakProvider client={authInstance}> */}
            <AppWrapper>
            <Router />
            </AppWrapper>

            {/* </KeycloakProvider> */}
            {/* <div className="App">
              <TawkMessengerReact
                propertyId="6630a4e71ec1082f04e91599"
                widgetId="1hsn08aa9"
              />
            </div> */}
          </ThemeProvider>
        </BrowserRouter>
      </HelmetProvider>
    </Provider>
  );
}
