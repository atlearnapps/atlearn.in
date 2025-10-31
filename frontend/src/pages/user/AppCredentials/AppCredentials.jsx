import { Button, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaCopy,
  FaSyncAlt,
  FaTimesCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import apiClients from "src/apiClients/apiClients";

const AppCredentials = () => {
  const [showSecret, setShowSecret] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    fetchCredentials();
  }, []);

  // const copyToClipboard = (text) => {
  //   navigator.clipboard.writeText(text);
  //   toast.success("Copied");
  // };

  const copyToClipboard = async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "absolute";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      toast.success("Copied");
    } catch (error) {
      toast.error("Failed to copy");
      console.error("Copy failed:", error);
    }
  };

  const fetchCredentials = async () => {
    try {
      const response = await apiClients.getCredentials();
      if (response) {
        setClientId(response.client_id);
        // setClientSecret(response.client_secret);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGenerateCredential = async () => {
    try {
      const response = await apiClients.generateClient();
      if (response) {
        setClientId(response.client_id);
        setClientSecret(response.client_secret);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRegenerateSecret = async () => {
    try {
      const response = await apiClients.regenerateSecret();
      if (response) {
        setClientSecret(response.new_client_secret);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRevokeCredentials = async () => {
    try {
      const response = await apiClients.revokeCredentials();
      if (response) {
        setClientId("");
        setClientSecret("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center   p-4">
      <div className="w-full lg:max-w-[50%] bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Client Credentials
        </h2>

        <div className="mb-4">
          <label className="block text-gray-600 text-sm mb-1">Client ID</label>
          <div className="flex items-center justify-between bg-gray-200 p-2 rounded-lg">
            <span className="text-gray-800 text-sm min-h-6">
              {clientId || "Generate Client ID"}
            </span>
            {clientId?.length > 0 && (
              <Tooltip title="Copy">
                <Button
                  sx={{ border: "1px solid black" }}
                  onClick={() => copyToClipboard(clientId)}
                >
                  <FaCopy className="w-4 h-4" />
                </Button>
              </Tooltip>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 text-sm mb-1">
            Client Secret
            {clientSecret?.length > 0 && (
              <span> (Client secret disappears on exit. Save it )</span>
            )}
          </label>
          <div className="flex items-center justify-between bg-gray-200 p-2 rounded-lg">
            <span className="text-gray-800 text-sm truncate  break-all cursor-pointer min-h-6">
              {clientSecret?.length === 0
                ? "Generate Client Secret"
                : showSecret
                ? clientSecret
                : "••••••••••••"}
            </span>
            <div className="flex space-x-2">
              {clientSecret?.length > 0 ? (
                <>
                  <Button
                    sx={{ border: "1px solid black" }}
                    onClick={() => setShowSecret(!showSecret)}
                  >
                    {showSecret ? (
                      <FaEyeSlash className="w-4 h-4" />
                    ) : (
                      <FaEye className="w-4 h-4" />
                    )}
                  </Button>
                  <Tooltip title="Copy">
                    <Button
                      sx={{ border: "1px solid black" }}
                      onClick={() => copyToClipboard(clientSecret)}
                    >
                      <FaCopy className="w-4 h-4" />
                    </Button>
                  </Tooltip>

                  <Tooltip title="RegenerateSecret">
                    <Button
                      onClick={handleRegenerateSecret}
                      sx={{ border: "1px solid black" }}
                    >
                      <FaSyncAlt className="w-4 h-4 mr-2" />
                    </Button>
                  </Tooltip>
                </>
              ) : (
                <Button
                  onClick={handleRegenerateSecret}
                  sx={{ border: "1px solid black" }}
                >
                  Generate
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* <div className="mb-4">
          <label className="block text-gray-600 text-sm mb-1">Token</label>
          <div className="flex items-center justify-between bg-gray-200 p-2 rounded-lg">
            <span className="text-gray-800 text-sm">
              {token?.length === 0
                ? "Generate Token"
                : showToken
                ? token
                : "••••••••••••"}
            </span>
            <div className="flex space-x-2">
              {token?.length > 0 ? (
                <>
                  <Button
                    sx={{ border: "1px solid black" }}
                    onClick={() => setShowToken(!showToken)}
                  >
                    {showToken ? (
                      <FaEyeSlash className="w-4 h-4" />
                    ) : (
                      <FaEye className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    sx={{ border: "1px solid black" }}
                    onClick={() => copyToClipboard(token)}
                  >
                    <FaCopy className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleGenerateCredential}
                  sx={{ border: "1px solid black" }}
                >
                  Generate
                </Button>
              )}
            </div>
          </div>
        </div> */}

        <div className="flex justify-between mt-6">
          <Button
            sx={{ border: "1px solid red", color: "red" }}
            onClick={handleRevokeCredentials}
          >
            <FaTimesCircle className="w-4 h-4 mr-2" /> Revoke
          </Button>
          {clientId?.length === 0 && (
            <Button
              sx={{ border: "1px solid black" }}
              onClick={handleGenerateCredential}
            >
              <FaSyncAlt className="w-4 h-4 mr-2" /> Generate
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppCredentials;
