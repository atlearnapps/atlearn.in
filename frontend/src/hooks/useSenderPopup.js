// hooks/useSenderPopup.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useSenderPopup = (senderId = "1b7b4ea2a06741") => {

const location = useLocation();

    useEffect(() => {
      if (
        !document.querySelector(
          'script[src="https://cdn.sender.net/accounts_resources/universal.js"]'
        )
      ) {
        (function (s, e, n, d, er) {
          s["Sender"] = er;
          s[er] =
            s[er] ||
            function () {
              (s[er].q = s[er].q || []).push(arguments);
            };
          s[er].l = 1 * new Date();
          const a = e.createElement(n),
            m = e.getElementsByTagName(n)[0];
          a.async = 1;
          a.src = d;
          m.parentNode.insertBefore(a, m);
        })(
          window,
          document,
          "script",
          "https://cdn.sender.net/accounts_resources/universal.js",
          "sender"
        );
      }
  
      // Initialize Sender.net popup with your ID
      window.sender && window.sender("1b7b4ea2a06741");
    }, [location.pathname]);
};


