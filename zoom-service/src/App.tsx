import "./App.css";
import { useEffect, useState } from "react";
import { ZoomMtg } from "@zoom/meetingsdk";

ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const authEndpoint =
    import.meta.env.VITE_OVERRIDE_HOST + "/api/zoom/generate-signature";
  const sdkKey = import.meta.env.VITE_MEETING_SDK_KEY;
  const leaveUrl = import.meta.env.VITE_LEAVE_URL;

  const getQueryParam = (param: string) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param) || "";
  };

  const meetingNumber = getQueryParam("meetingNumber");
  const userName = getQueryParam("userName") || "Guest";
  const role = parseInt(getQueryParam("role") || "0", 10);
  const passWord = getQueryParam("passWord") || "";

  const getSignature = async () => {
    if (!meetingNumber) {
      setError(true);
      return;
    }

    setLoading(true);
    setError(false);

    try {
      const req = await fetch(authEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetingNumber, role }),
      });
      const res = await req.json();
      startMeeting(res.signature);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  function startMeeting(signature: string) {
    document.getElementById("zmmtg-root")!.style.display = "block";

    ZoomMtg.init({
      leaveUrl: leaveUrl,
      patchJsMedia: true,
      leaveOnPageUnload: true,
      success: () => {
        ZoomMtg.join({
          signature,
          sdkKey,
          meetingNumber,
          passWord,
          userName,
          userEmail: "",
          tk: "",
          zak: "",
          success: (success: unknown) => console.log("Joined Meeting", success),
          error: (error: unknown) => console.log("Join Error", error),
        });
      },
      error: (error: unknown) => console.log("Init Error", error),
    });
  }

  useEffect(() => {
    if (meetingNumber) {
      getSignature();
    } else {
      setError(true);
    }
  }, [meetingNumber]);

  return (
    <div className="App">
      {loading && (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      )}

      {error && (
        <div className="error-message">
          <h2>Meeting Number Not Found</h2>
          <p>
            Please provide a valid meeting number in the URL to join the Zoom
            meeting.
          </p>
          <a href="https://www.atlearn.in" className="back-home-button">
            Back to Home
          </a>
        </div>
      )}
      {/* 
      <main>
        {!error && !loading && <p>Preparing to join the meeting...</p>}
      </main> */}
    </div>
  );
}

export default App;
