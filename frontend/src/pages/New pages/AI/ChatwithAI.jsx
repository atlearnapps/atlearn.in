import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ProgrammingPrompts,
  SciencePrompts,
  mathsPrompts,
} from "src/Page_Content/AI_Assistance";
import { getAIAssistants } from "src/apiClients/aiAssessmentsApiService";
import PromptLibraryModal from "./PromptLibraryModal";
import PrimaryButton from "src/components/New components/PrimaryButton";
import { Helmet } from "react-helmet";
import { Atbridges_BASE_URL, BASE_URL } from "src/apiClients/config";
import { useSelector } from "react-redux";
import apiClients from "src/apiClients/apiClients";
import {
  format,
  isToday,
  isYesterday,
  parseISO,
  formatDistanceToNow,
} from "date-fns";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import DeleteConfirmation from "src/components/confirmationPopup/confirmationPopup";
import RenamePopup from "./RenamePopup";
import CustomTooltip from "src/components/New components/CustomTooltip/CustomTooltip";
import { useHandleNavigate } from "src/utils/Navigation/useHandleNavigate";
import { UseAuth } from "src/utils/UseAuth/UseAuth";

function ChatwithAI() {
  const navigate = useNavigate();
  const handleNavigate = useHandleNavigate();
  const auth = UseAuth();
  const textareaRef = useRef(null);
  const [selectedAssistant, setSelectedAssistant] = useState(null);
  const chatId = useParams();
  const id = chatId?.id;
  const { user } = useSelector((state) => state.user);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [slectedSessionId, setSlectedSessionId] = useState(null);
  const [renameOpenPopup, setRenameOpenPopup] = useState(false);

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState();
  const [selectedRole, setSelectedRole] = useState(""); // or "science"
  const [selectedOption, setSelectedOption] = useState("");
  const [PromptOpen, setPromptOpen] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  //  else {
  //       handleNavigate(`/ai-chat/${id}`);
  //     }
  useEffect(() => {
    if (id && user?.user?.id) {
      handleGetChatSession(user?.user?.id, id);
    }
  }, [id, user?.user, currentSessionId, messages]);

  useEffect(() => {
    handleGetAissistance(id);
  }, [id, user?.user?.id]);

  useEffect(() => {
    let timeout;

    if (!auth.user) {
      timeout = setTimeout(() => {
        handleNavigate(`/ai-chat/${id}`);
      }, 2000); // ⏳ waits 2 seconds before navigating
    }

    return () => clearTimeout(timeout); // cleanup on unmount
  }, [auth.user, id, handleNavigate]);

  const handleGetChatSession = async (userId, assistantCode) => {
    try {
      const response = await apiClients.getChatSession(userId, assistantCode);
      if (response?.data) {
        setSessions(response?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadChat = async (sessionId) => {
    try {
      setCurrentSessionId(sessionId);
      const res = await apiClients.getMessages(sessionId);
      if (res?.data) {
        setMessages(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetAissistance = async (id) => {
    try {
      const response = await getAIAssistants();
      if (response?.chat_assistant) {
        // setAIAssistants(response?.chat_assistant);
        const allAssistants = [
          ...(response.chat_assistant || []),
          ...(response.custom_chats || []),
        ];

        const selectedProfile = allAssistants.find((p) => p.chat_code === id);
        if (selectedProfile) {
          setSelectedAssistant(selectedProfile);
          setMessages([{ sender: "AI", text: selectedProfile?.description }]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;
    let sessionId = currentSessionId;

    if (!currentSessionId) {
      const data = {
        user_id: user?.user?.id,
        assistant_id: selectedAssistant.id,
        assistant_name: selectedAssistant.name,
        title: "New Conversation",
        assistant_role: selectedAssistant?.sub_name,
        assistant_code: selectedAssistant?.chat_code,
      };
      const response = await apiClients.createChatSession(data);
      if (response?.data) {
        sessionId = response.data.id;
        setCurrentSessionId(sessionId);
      }
    }

    const userMessagedata = {
      session_id: sessionId,
      sender: "You",
      text: inputMessage,
    };

    // Add the user's message
    // setMessages([...messages, { sender: "You", text: inputMessage }]);
    setMessages((prev) => [...prev, userMessagedata]);
    setInputMessage("");
    setLoading(true);
    await apiClients.createMessage(userMessagedata);

    try {
      let aiResponse;

      const aiMessage = {
        session_id: sessionId,
        sender: "AI",
        text: aiResponse,
      };
      await apiClients.createMessage(aiMessage);
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        session_id: sessionId,
        sender: "AI",
        text: "Sorry, something went wrong.",
      };
      await apiClients.createMessage(errorMessage);
      setMessages((prev) => [...prev, errorMessage]);
      // setMessages((prev) => [
      //   ...prev,
      //   {
      //     sender: "AI",
      //     text: "Sorry, I couldn't fetch a response. Please try again.",
      //   },
      // ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChatSession = async () => {
    try {
      const response = await apiClients.deleteChatSession(slectedSessionId);
      if (response?.success === true) {
        setSessions((prev) =>
          prev.filter((session) => session.id !== slectedSessionId)
        );

        setCurrentSessionId(null);
        setMessages([
          { sender: "AI", text: "Hello! How can I assist you today?" },
        ]);
        setDeleteConfirm(false);
      }
    } catch (error) {
      console.error("Error deleting chat session:", error);
    }
  };
  const handleDeleteConirmationOpen = (id) => {
    setSlectedSessionId(id);
    setDeleteConfirm(true);
  };
  const handleDeleteConirmationClose = () => {
    setDeleteConfirm(false);
  };

  const handleRenameOpen = (id) => {
    console.log("rename id", id);

    setSlectedSessionId(id);
    setRenameOpenPopup(true);
  };

  const handleRenameClose = () => {
    setRenameOpenPopup(false);
  };

  const handleRename = async (newTitle) => {
    try {
      const data = {
        title: newTitle,
      };
      const response = await apiClients.renameChatSession(
        slectedSessionId,
        data
      );
      if (response?.success === true) {
        setSessions((prev) =>
          prev.map((session) =>
            session.id === slectedSessionId ? response.data : session
          )
        );
        setCurrentSessionId(slectedSessionId);
      }
    } catch (error) {
      console.error("Error renaming chat session:", error);
    }
  };

  const messageContainerRef = useRef(null); // Ref for the message container

  // Function to scroll the container to the bottom
  const scrollToBottom = () => {
    const container = messageContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight; // Scroll to the bottom
    }
  };

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const codingLanguages = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "csharp", label: "C#" },
    { value: "php", label: "PHP" },
    { value: "ruby", label: "Ruby" },
    { value: "c++", label: "C++" },
    { value: "swift", label: "Swift" },
    { value: "typescript", label: "TypeScript" },
    { value: "kotlin", label: "Kotlin" },
    { value: "go", label: "Go (Golang)" },
    { value: "rust", label: "Rust" },
    { value: "perl", label: "Perl" },
    { value: "r", label: "R" },
    { value: "scala", label: "Scala" },
    { value: "dart", label: "Dart" },
    { value: "bash", label: "Bash" },
    { value: "matlab", label: "MATLAB" },
  ];

  const scienceSubjects = [
    { value: "Physics", label: "Physics" },
    { value: "Chemistry", label: "Chemistry" },
    { value: "Biology", label: "Biology" },
  ];

  const mathsSubjects = [
    { value: "Algebra", label: "Algebra" },
    { value: "Geometry", label: "Geometry" },
    { value: "Arithmetic", label: "Arithmetic" },
    { value: "Calculus", label: "Calculus" },
    { value: "Linear Algebra", label: "Linear Algebra" },
    { value: "Statistics", label: "Statistics" },
    { value: "Trigonometry", label: "Trigonometry" },
    { value: "Differential Equations", label: "Differential Equations" },
    { value: "Number Theory", label: "Number Theory" },
    { value: "Probability", label: "Probability" },
    { value: "Discrete Mathematics", label: "Discrete Mathematics" },
  ];

  const [searchQuery, setSearchQuery] = useState("");

  // Handle input change for search query
  const handleSearchChange = (e) => {
    setCurrentSessionId(null);
    setSearchQuery(e.target.value);
  };

  // Filter the profiles based on search query and ID mismatch

  // Function to auto-adjust the height of the textarea
  const handleInputChange = (e) => {
    setInputMessage(e.target.value);

    // Adjust height dynamically
    const textarea = textareaRef.current;
    textarea.style.height = "auto"; // Reset height
    textarea.style.height = `${textarea.scrollHeight}px`; // Set height to fit content
  };

  const handleOpen = () => {
    setPromptOpen(true);
  };

  const [isListening, setIsListening] = useState(false);

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
  } else {
    alert("Your browser does not support Speech Recognition.");
  }

  const startListening = () => {
    if (!recognition) return;
    setIsListening(true);
    recognition.start();
  };

  const stopListening = () => {
    if (!recognition) return;
    setIsListening(false);
    recognition.stop();
  };

  function groupSessionsByDate(sessions) {
    const grouped = {};

    sessions.forEach((session) => {
      // const date = parseISO(session.created_at);
      const date = parseISO(session.updated_at);
      const updatedDate = parseISO(session.updated_at);

      // Label for grouping
      let label = format(date, "MMMM d, yyyy");
      if (isToday(date)) {
        label = "Today";
      } else if (isYesterday(date)) {
        label = "Yesterday";
      }

      // Add time ago string to session
      const createdAgo = formatDistanceToNow(updatedDate, { addSuffix: true });

      const sessionWithTime = {
        ...session,
        createdAgo,
      };

      if (!grouped[label]) {
        grouped[label] = [];
      }

      grouped[label].push(sessionWithTime);
    });

    return grouped;
  }
  const filteredProfiles = sessions?.filter((item) =>
    item?.title?.toLowerCase()?.includes(searchQuery.toLowerCase())
  );
  const groupedSessions = groupSessionsByDate(filteredProfiles);

  return (
    <div>
      <Helmet>
        <title>AI Assistance Chat | Atlearn LMS</title>
        <meta
          name="description"
          content="Get instant help with Atlearn's AI assistance chat. Solve issues and enhance your learning experience with real-time AI-powered support."
        />
        <link rel="canonical" href={`${BASE_URL}/ai-assistance-chat`} />
      </Helmet>
      <main className="bg-transparent">
        {/* banner section */}
        <section>
          <div className="container-fluid-2">
            <div className="bg-primaryColor p-5 md:p-10 rounded-5 flex justify-center md:justify-between items-center flex-wrap gap-2">
              <div className="flex items-center flex-wrap justify-center sm:justify-start">
                <div className="mr-5">
                  <img
                    src={`${Atbridges_BASE_URL}/${selectedAssistant?.logo}`}
                    alt={selectedAssistant?.name}
                    title={selectedAssistant?.name}
                    className="w-27 h-27 md:w-22 md:h-22 lg:w-27 lg:h-27 rounded-full p-1 border-2 border-darkdeep7 box-content object-cover"
                  />
                </div>
                <div className="text-whiteColor font-bold text-center sm:text-start">
                  <h2 className="text-2xl leading-1.24">
                    {selectedAssistant?.name}
                  </h2>
                  <h5 className="text-lg leading-1.2 mb-5px">
                    {selectedAssistant?.sub_name}
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/*dashbord menu section */}
        <section>
          <div className="container-fluid-2">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-30px pt-30px pb-100px">
              {/* dashboard content */}
              <div className="lg:col-span-12">
                {/* Messages area */}
                <div>
                  <div className="mb-15px">
                    {/* <h2 className="text-2xl font-bold text-blackColor dark:text-blackColor-dark">
                      Messages
                    </h2> */}
                    <PrimaryButton
                      primary={true}
                      onClick={() => navigate("/ai")}
                    >
                      {" "}
                      <i className="icofont-arrow-left"></i> Back
                    </PrimaryButton>
                  </div>
                  {/* <PrimaryButton
                    primary={true}
                    onClick={handleCreateChatSession}
                  >
                    Create New Chat
                  </PrimaryButton> */}
                  {/* message body */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-12 gap-30px">
                    {/* participant */}
                    <div className="xl:col-start-1 xl:col-span-5">
                      <div className="bg-whiteColor dark:bg-whiteColor-dark border border-borderColor dark:border-borderColor-dark rounded-lg2 max-h-150 overflow-auto">
                        {/* heading */}

                        {/* search participant*/}
                        {sessions.length > 0 && (
                          <div className="p-30px">
                            <form>
                              <div className="text-darkdeep4 flex items-center pl-5 border border-borderColor dark:border-borderColor-dark rounded-full">
                                <i className="icofont-search-1 text-lg cursor-pointer" />
                                <input
                                  type="text"
                                  placeholder="Search"
                                  value={searchQuery}
                                  onChange={handleSearchChange}
                                  className="w-full px-5 pl-10px py-10px bg-transparent text-sm focus:outline-none placeholder:text-placeholder placeholder:opacity-80 leading-7 font-medium"
                                />
                              </div>
                            </form>
                          </div>
                        )}

                        {/* participant list */}
                        {/* <ul>
                          {filteredProfiles?.map((item, index) => (
                            <li
                              key={index}
                              className="border-t border-borderColor dark:border-borderColor-dark"
                            >
                              <div
                                onClick={() =>
                                  handleNavigate(
                                    `/ai-assistance-chat?id=${item.id}`
                                  )
                                }
                                className="cursor-pointer flex items-center flex-wrap py-15px px-30px max-w-435px w-full"
                              >

                                <div className="max-w-50px mr-5 relative">
                                  <span className="absolute left-[38px] bottom-0 w-15px h-15px bg-primaryColor border-3px border-whiteColor dark:border-whiteColor-dark rounded-full" />
                                  <img
                                    src={`${Atbridges_BASE_URL}/${item?.logo}`}
                                    alt={item?.name}
                                    title={item?.name}
                                    className="w-[50px] h-[50px] rounded-full object-cover"
                                  />
                                </div>

                                <div className="flex-grow">
                                  <div>
                                    <h5 className="text-lg font-medium text-blackColor dark:text-blackColor-dark flex items-center justify-between">
                                      <span className="leading-6">
                                        {" "}
                                        {item?.name}
                                      </span>
                                      <span className="text-sm text-darkdeep4 font-inter leading-6 font-normal">
                                    12 min
                                  </span>
                                    </h5>
                                    <p className="text-sm text-darkdeep4 text-start leading-6">
                                      {item?.sub_name}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul> */}

                        {Object.keys(groupedSessions).length === 0 ? (
                          <div className="flex flex-col items-center justify-center text-center py-16 px-4 min-h-[345px]">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-10 h-10 text-gray-400 mb-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.84L3 20l1.25-3.75A8.985 8.985 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                              />
                            </svg>
                            <p className="text-base font-semibold text-gray-600">
                              It's quiet here...
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Let's start a conversation.
                            </p>
                          </div>
                        ) : (
                          Object.entries(groupedSessions).map(
                            ([dateLabel, sessionList]) => (
                              <div key={dateLabel} className="mb-6 px-4">
                                <h2 className="text-xs uppercase font-bold tracking-wide mb-2 dark:text-blackColor-dark">
                                  {dateLabel}
                                </h2>
                                <div className="space-y-2">
                                  {sessionList.map((s) => (
                                    <div
                                      key={s.id}
                                      onClick={() => loadChat(s.id)}
                                      className={`group relative flex justify-between items-center px-4 py-3 rounded-lg border shadow-sm transition-all duration-200 ${
                                        currentSessionId === s.id
                                          ? "bg-[#E1F0FF] border-secondaryColor"
                                          : "bg-white hover:bg-gray-100 border-gray-200"
                                      } cursor-pointer`}
                                    >
                                      <div className="flex flex-col">
                                        <p
                                          className={`text-sm font-medium ${
                                            currentSessionId === s.id
                                              ? "text-secondaryColor"
                                              : "text-black"
                                          } truncate`}
                                        >
                                          {s.title}
                                        </p>
                                        <span className="text-xs text-gray-500">
                                          {s.createdAgo}
                                        </span>
                                      </div>

                                      {/* Action icons */}
                                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                        <CustomTooltip
                                          title="Rename"
                                          arrow
                                          placement="top"
                                        >
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleRenameOpen(s.id);
                                            }}
                                            className="text-gray-500 hover:text-secondaryColor"
                                          >
                                            <FiEdit2 size={16} />
                                          </button>
                                        </CustomTooltip>

                                        <CustomTooltip
                                          title="Delete"
                                          arrow
                                          placement="top"
                                        >
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleDeleteConirmationOpen(s.id);
                                            }}
                                            className="text-gray-500 hover:text-red-600"
                                          >
                                            <FiTrash2 size={16} />
                                          </button>
                                        </CustomTooltip>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )
                          )
                        )}
                      </div>
                    </div>
                    {/* conversation */}
                    <div className="xl:col-start-6 xl:col-span-7 ">
                      <div className="p-10px bg-whiteColor dark:bg-whiteColor-dark rounded-lg2 shadow">
                        {/* heading */}
                        <div className="flex justify-between items-center pb-10px border-b border-borderColor dark:border-borderColor-dark">
                          <div className="flex items-center">
                            {/* avatar */}
                            <div className="max-w-50px mr-5">
                              <img
                                src={`${Atbridges_BASE_URL}/${selectedAssistant?.logo}`}
                                alt=""
                                className="w-[50px] h-[50px] rounded-full object-cover"
                              />
                            </div>
                            {/* details */}
                            <div className="flex-grow">
                              <div>
                                <h5 className="text-lg font-medium text-blackColor dark:text-blackColor-dark">
                                  <span className="leading-6">
                                    {selectedAssistant?.name}
                                  </span>
                                </h5>
                                <p className="text-sm text-darkdeep4 text-start leading-22px">
                                  {selectedAssistant?.sub_name}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* conversation body */}
                        {/* <div className="max-h-125 overflow-y-auto mt-10 flex flex-col-reverse"> */}
                        <div
                          ref={messageContainerRef} // Attach the ref here
                          className="max-h-125 overflow-y-auto mt-10 flex flex-col"
                        >
                          {messages.map((message, index) => {
                            const formattedText = message.text
                              .split("\n")
                              .map((line, i) => (
                                <span key={i} className="block leading-26px">
                                  {line}
                                </span>
                              ));

                            return message?.sender === "You" ? (
                              // Outgoing message (right side)
                              <div
                                key={index}
                                className="ml-auto px-[15px] py-2"
                              >
                                <div className="flex justify-end text-end items-start gap-3">
                                  {/* Message Bubble with Right Arrow */}
                                  <div className="relative inline-block">
                                    {/* Arrow */}
                                    <div className="absolute top-3 -right-2 w-0 h-0 border-t-8 border-b-8 border-l-[10px] border-t-transparent border-b-transparent border-l-darkdeep3 dark:border-l-darkdeep3-dark "></div>

                                    {/* Bubble */}
                                    <div className="bg-darkdeep3 dark:bg-darkdeep3-dark rounded-[5px] px-[15px] py-[10px]">
                                      <p className="text-sm text-blackColor dark:text-blackColor-dark break-words">
                                        {formattedText}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Optional Avatar (User) */}
                                  {/* <div className="w-[50px] h-[50px] flex-shrink-0">
                                      <img
                                        src={selectedProfile?.image}
                                        alt=""
                                        className="w-full h-full rounded-full object-cover"
                                      />
                                    </div> */}
                                </div>
                              </div>
                            ) : (
                              // Incoming message (left side)
                              <div
                                key={index}
                                className="max-w-full px-[15px] py-2"
                              >
                                <div className="flex items-start gap-3">
                                  {/* Avatar (Assistant) */}
                                  <div className="w-[50px] h-[50px] flex-shrink-0">
                                    <img
                                      src={`${Atbridges_BASE_URL}/${selectedAssistant?.logo}`}
                                      alt=""
                                      className="w-full h-full rounded-full object-cover"
                                    />
                                  </div>

                                  {/* Message Bubble with Left Arrow */}
                                  <div className="relative inline-block">
                                    {/* Arrow */}
                                    <div className="absolute top-3 -left-2 w-0 h-0 border-t-8 border-b-8 border-r-[10px] border-t-transparent border-b-transparent border-r-[#E1F0FF] dark:border-r-darkdeep3-dark"></div>

                                    {/* Bubble */}
                                    <div className="bg-[#E1F0FF] dark:bg-darkdeep3-dark rounded-[5px] px-[15px] py-[10px]">
                                      <p className="text-sm text-blackColor dark:text-blackColor-dark break-words">
                                        {formattedText}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                          {loading && (
                            <div className="max-w-415px">
                              <div className="flex">
                                {/* Avatar */}
                                <div className="w-15 h-15 mr-5 flex-shrink-0">
                                  <img
                                    src={`${Atbridges_BASE_URL}/${selectedAssistant?.logo}`}
                                    alt=""
                                    className="w-[50px] h-[50px] rounded-full object-cover"
                                  />
                                </div>
                                {/* Details */}

                                <div className="flex justify-start mb-4 mt-3">
                                  <div className="p-3  text-black rounded-lg max-w-xs">
                                    {/* <p className="text-sm">Typing...</p> */}
                                    <div className="flex space-x-1">
                                      <div className="w-2 h-2 bg-[#001B48] rounded-full animate-pulse"></div>
                                      <div className="w-2 h-2 bg-[#001B48] rounded-full animate-pulse delay-150"></div>
                                      <div className="w-2 h-2 bg-[#001B48] rounded-full animate-pulse delay-300"></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="mt-4">
                          {/* Top Section: Input Field */}
                          <form className="bg-whiteColor dark:bg-gray-800 p-4 border-t border-borderColor dark:bg-darkdeep3-dark">
                            <textarea
                              ref={textareaRef}
                              placeholder="Type a message..."
                              value={inputMessage}
                              onChange={handleInputChange}
                              className="w-full resize-none bg-transparent text-sm text-blackColor dark:text-blackColor-dark placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none"
                              rows={1} // Minimum rows
                            />
                          </form>

                          {/* Bottom Section: Left and Right */}
                          <div className="bg-whiteColor dark:bg-gray-800 p-4  flex justify-end items-center dark:bg-darkdeep3-dark">
                            {/* Left Section */}
                            <div className="flex items-center space-x-4">
                              <CustomTooltip
                                title="Select your Image"
                                arrow
                                placement="top"
                              >
                                <div className="h-[150%] block">
                                  <label
                                    htmlFor="attachment"
                                    className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#E1F0FF] hover:bg-primary-light transition"
                                  >
                                    <i
                                      className="icofont-image attachment"
                                      aria-hidden="true"
                                    />
                                  </label>
                                  <input
                                    id="attachment"
                                    type="file"
                                    className="hidden w-full pl-5 py-10px bg-transparent text-sm focus:outline-none placeholder:text-placeholder placeholder:opacity-80 leading-7 font-medium"
                                  />
                                </div>
                              </CustomTooltip>

                              {/* <button
                                className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#E1F0FF] hover:bg-primary-light transition"
                                aria-label="Other Action"
                              >
                                <i class="icofont-record"></i>
                              </button> */}
                              <CustomTooltip
                                title={`Ask ${selectedAssistant?.name}`}
                                arrow
                                placement="top"
                              >
                                <button
                                  onClick={
                                    isListening ? stopListening : startListening
                                  }
                                  className={`relative flex items-center justify-center w-10 h-10 rounded-full bg-[#E1F0FF] hover:bg-primary-light transition  ${
                                    isListening ? "bg-red-400" : ""
                                  }`}
                                  aria-label="Record Voice"
                                >
                                  <i className="icofont-record"></i>
                                </button>
                              </CustomTooltip>
                            </div>

                            {/* Right Section */}
                            <div>
                              {/* <button
                                type="button"
                                onClick={handleSendMessage}
                                disabled={!inputMessage.trim()}
                                className="w-12 h-12 flex justify-center items-center bg-primary text-white rounded-full shadow-lg"
                                aria-label="Send Message"
                              >
                                <i className="icofont-arrow-right text-lg" />
                              </button> */}
                              <button
                                onClick={handleSendMessage}
                                disabled={!inputMessage.trim()}
                                className="ml-4 px-4 py-2 text-white bg-secondary rounded-full hover:bg-blue-600"
                              >
                                Send
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <PromptLibraryModal
            open={PromptOpen}
            setPromptOpen={setPromptOpen}
            setInputMessage={setInputMessage}
            PromptLibrary={
              selectedRole === "Science Tutor"
                ? SciencePrompts
                : selectedRole === "Math Tutor"
                ? mathsPrompts
                : ProgrammingPrompts
            }
          />
          <DeleteConfirmation
            open={deleteConfirm}
            handleClose={handleDeleteConirmationClose}
            handleConfirm={handleDeleteChatSession}
          />
          <RenamePopup
            open={renameOpenPopup}
            handleClose={handleRenameClose}
            handleConfirm={handleRename}
            heading="Rename Chat"
            message="Enter a new name for the chat session"
          />
        </section>
      </main>
    </div>
  );
}

export default ChatwithAI;
