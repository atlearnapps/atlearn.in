import React, { useEffect, useRef, useState } from "react";
import { AtlearnAIAssistant } from "src/apiClients/aiAssessmentsApiService";
import chatboat from "src/assets/images/AIAssistance/male-28.png";
import { Tooltip } from "@mui/material";
import { styled } from "@mui/system";
import logo from "src/assets/images/Logo/atlearn-favicon.png";
import { questionOptions } from "src/Page_Content/AI_Assistance";
import { toast } from "react-toastify";

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "AI",
      text: "Welcome to Atlearn! We're glad you're here. How can we assist you today?",
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState();
  const messageContainerRef = useRef(null); // Ref for the message container
  const textareaRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [selectedHeading, setSelectedHeading] = useState(null);
  // Scroll to the bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#chatbot") {
        setIsOpen(true);
      }
    };

    window.addEventListener("hashchange", handleHashChange);

    // Check on first load
    handleHashChange();

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const handleHeadingClick = (heading) => {
    setSelectedHeading((prev) => (prev === heading ? null : heading));
  };

  // Function to scroll the container to the bottom
  const scrollToBottom = () => {
    const container = messageContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight; // Scroll to the bottom
    }
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);

    const textarea = textareaRef.current;
    textarea.style.height = "auto"; // Reset height to calculate new height
    textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`; // Limit the height to 150px (or your preferred value)
  };
  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;
    setMessages([...messages, { sender: "You", text: inputMessage }]);
    const userMessage = inputMessage;
    setInputMessage("");
    setLoading(true);

    try {
      let aiResponse;
      aiResponse = await AtlearnAIAssistant(userMessage);
      setMessages((prev) => [
        ...prev,
        {
          sender: "AI",
          text: sanitizeLink(aiResponse) || "Sample AI response from API",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "AI",
          text: "Sorry, I couldn't fetch a response. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };
  let recognition;

  if ("webkitSpeechRecognition" in window) {
    const SpeechRecognition = window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
      setIsListening(false);
    };

    recognition.onerror = (error) => {
      console.error("Speech recognition error:", error);
      setIsListening(false);
    };
  }

  // const startListening = () => {
  //   if (!recognition) return;
  //   setIsListening(true);
  //   recognition.start();
  // };
  const startListening = () => {
    if (!recognition) {
      toast.error("Your browser does not support Speech Recognition.");
      return;
    }

    setIsListening(true);
    recognition.start();
  };

  const stopListening = () => {
    if (!recognition) return;
    setIsListening(false);
    recognition.stop();
  };

  const CustomTooltip = styled(Tooltip)(({ theme }) => ({
    tooltip: {
      backgroundColor: "#333", // Tooltip background color
      color: "#fff", // Text color
      fontSize: 12, // Font size
      borderRadius: 4, // Rounded corners
      padding: "8px 10px", // Padding around text
    },
    arrow: {
      color: "#333", // Arrow color
    },
  }));

  const linkRegex = /(https?:\/\/[^\s.()]+(?:\.[^\s.()]+)*)(\.)?/g;
  const sanitizeLink = (text) => {
    // Remove parentheses if URLs are inside them and also remove trailing dots.
    return text
      ?.replace(/\((https?:\/\/[^\s]+)\)/g, "$1") // Remove parentheses
      ?.replace(linkRegex, (url) => url?.replace(/\.$/, "")); // Remove trailing dots
  };

  const parseTextWithLinks = (text) => {
    // Match links using regex
    const linkRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(linkRegex);

    return parts.map((part, index) => {
      if (linkRegex.test(part)) {
        const url = new URL(part);
        const pathSegments = url.pathname.split("/").filter(Boolean); // Get non-empty path segments
        const displayText =
          pathSegments.length > 0
            ? pathSegments[pathSegments.length - 1]
            : url.hostname; // Show last path segment

        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            {displayText}
          </a>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-high">
      {/* Chat Icon */}
      <button
        title="chatboat"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#001B48] text-white p-4 rounded-full shadow-lg hover:bg-[#00296B] focus:outline-none transition-transform transform hover:scale-105 fixed bottom-4 right-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 3.866-3.582 7-8 7-1.35 0-2.63-.305-3.716-.851L4 19l1.851-5.284C5.305 12.63 5 11.35 5 10c0-3.866 3.582-7 8-7s8 3.134 8 7z"
          />
        </svg>
      </button>

      {/* Chat Box */}
      {isOpen && (
        // <div className="fixed bottom-20 right-4 w-96 h-[70vh] max-h-[30rem] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden border">
        <div className="fixed bottom-20 right-4 w-full max-w-md h-[70vh] max-h-[30rem] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden border sm:w-[28rem] sm:right-8">
          {/* Header */}
          <div className="bg-white  p-4 flex items-center justify-between border-b">
            <div className="flex items-center space-x-3">
              <img
                // src="https://via.placeholder.com/40"
                src={logo}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              <span className="font-bold text-lg">Atlearn Support</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className=" hover:text-gray-500 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Chat Content */}
          <div
            ref={messageContainerRef}
            className="flex-1 p-4 overflow-y-auto bg-[white]"
          >
            <div className="space-y-4">
              <div>
                <div className="flex flex-wrap gap-4 mb-4">
                  {questionOptions.map((menu, index) => (
                    <div
                      key={index}
                      onClick={() => handleHeadingClick(menu.heading)}
                      className={`cursor-pointer text-[#001B48] px-2 py-2 rounded-xl shadow text-[12px] font-bold transition duration-200 ease-in-out transform hover:text-secondary hover:scale-105 ${
                        selectedHeading === menu.heading
                          ? "bg-primary text-white"
                          : ""
                      }`}
                    >
                      {menu.heading}
                    </div>
                  ))}
                </div>
                {selectedHeading && (
                  <div className="mt-2">
                    {questionOptions
                      .find((menu) => menu.heading === selectedHeading)
                      ?.options.map((option, i) => (
                        <div
                          key={i}
                          onClick={() => setInputMessage(option)}
                          className="cursor-pointer text-[#001B48] px-4 py-3 rounded-xl shadow text-[12px] transition duration-200 ease-in-out transform hover:text-[#000E24] hover:scale-105"
                        >
                          {option}
                        </div>
                      ))}
                  </div>
                )}
              </div>
              {messages.map((message, index) => {
                return message?.sender === "You" ? (
                  <div
                    key={index}
                    className="flex items-end justify-end space-x-3"
                  >
                    <div className="bg-[#CCE5FF] text-gray-800 px-4 py-3 rounded-lg shadow text-[12px]">
                      {parseTextWithLinks(message.text)}
                    </div>
                  </div>
                ) : (
                  <div key={index} className="flex items-start space-x-3">
                    <img
                      src={chatboat}
                      alt="Bot"
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="bg-gray-100 text-[#001B48] px-4 py-3 rounded-lg shadow text-[12px]">
                      {parseTextWithLinks(message.text)}
                    </div>
                  </div>
                );
              })}

              {/* Typing animation */}
              {loading && (
                <div className="flex items-center space-x-3">
                  <img
                    src={chatboat}
                    alt="Bot"
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="bg-[#CCE5FF] text-[#001B48] px-4 py-2 rounded-lg shadow">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-[#001B48] rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-[#001B48] rounded-full animate-pulse delay-150"></div>
                      <div className="w-2 h-2 bg-[#001B48] rounded-full animate-pulse delay-300"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="relative p-4 border-t flex items-center">
            {/* Fixed Record Button (Left) */}
            <CustomTooltip title="Record Voice" arrow placement="top">
              <button
                onClick={isListening ? stopListening : startListening}
                className={`absolute bottom-0 left-0 flex items-center justify-center w-12 h-12 rounded-full   transition duration-300 ease-in-out  cursor-pointer ${
                  isListening ? "" : ""
                }`}
                aria-label="Record Voice"
              >
                <i
                  className={`icofont-record text-xl ${
                    isListening ? "text-red-500" : "text-[#2C5F8A]"
                  } `}
                />
              </button>
            </CustomTooltip>

            {/* Expanding Textarea (Middle) */}
            <textarea
              ref={textareaRef}
              placeholder="Type a message..."
              value={inputMessage}
              onChange={handleInputChange}
              className="w-full resize-none bg-transparent text-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none overflow-auto mx-6"
              rows={1}
            />

            {/* Fixed Send Button (Right) */}
            <button
              onClick={handleSendMessage}
              className="absolute bottom-0 right-0 flex items-center justify-center w-12 h-12 rounded-full  transition duration-300 ease-in-out  cursor-pointer"
              aria-label="Send Message"
            >
              <i className="icofont-paper-plane text-xl text-[#2C5F8A]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
