import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiClients from "src/apiClients/apiClients";
import { setUser } from "src/Redux/userSlice";
import { formatDateRange } from "src/utils/formateDateRange";
import coverImage from "src/assets/images/online-classes/New/Classroom_Content_Online_Courses_Cover.webp";
import { useAuth0 } from "@auth0/auth0-react";
import { setPageLoading } from "src/Redux/loadingSlice";
import { Helmet } from "react-helmet";
import { calculateTimeDifference } from "src/utils/FormateDateUtils";
import { BASE_URL } from "src/apiClients/config";
// import { FaUsers } from "react-icons/fa";
// import { BsCircleFill } from "react-icons/bs";

function JoinRoom() {
  const { loginWithRedirect } = useAuth0();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.user);
  const queryParams = new URLSearchParams(location.search);
  const Room_id = queryParams.get("roomId");
  const Sheduled_id = queryParams.get("scheduleId");
  const [room, setRoom] = useState();
  const [profile, setProfile] = useState("");
  const [scheduleMeetingData, setScheduleMeetingData] = useState();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [access_Code, setAccess_Code] = useState("");
  const [accessCode, setAccessCode] = useState(false);
  const [moderator_AccessCode, setModerator_AccessCode] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [accessCodeError, setAccessCodeError] = useState(false);
  const [verifyPayment, setVerifyPayment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    // Create the script element
    const script = document.createElement("script");
    script.id = "mcjs";
    script.src =
      "https://chimpstatic.com/mcjs-connected/js/users/0b9d78a369b65e0b7eb4c3ef2/e15b232d9e87d7873e8cf2f1c.js";
    script.async = true;

    // Append the script to the body
    document.body.appendChild(script);

    // Cleanup function to remove the script when the popup is closed
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    dispatch(setPageLoading(true));
    // if (user?.user?.id && room?.room?.user?.id) {
    //   if (user?.user?.id === room?.room?.user?.id) {
    //     navigate(`/room/${room?.room?.friendly_id}`);
    //   }
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room, user]);

  useEffect(() => {
    if (Room_id) {
      fetchRoom(Room_id);
      if (Room_id && Sheduled_id) {
        getSheduledMeetingDetails(Room_id, Sheduled_id);
      }
    }
  }, []);

  useEffect(() => {
    if (scheduleMeetingData?.id && user?.user?.id)
      checkPayment(user?.user?.id, scheduleMeetingData?.id);
  }, [user?.user?.id, scheduleMeetingData?.id]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiClients.sessionData();
        if (response?.success === true) {
          if (response?.data) {
            setName(response.data.user.name);
            dispatch(setUser(response.data));
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRoom = async (id) => {
    try {
      setIsLoading(true);
      const response = await apiClients.getroomUser(id);
      if (response.data) {
        setRoom(response.data);
        if (response.data?.room?.user?.avatar) {
          const newUrl = `${process.env.REACT_APP_OVERRIDE_HOST}/api/images/${response.data?.room?.user?.avatar}`;
          setProfile(newUrl);
        }
        // setProfileName(response.data?.room?.user?.name);
        // setProfileEmail(response.data?.room?.user?.email);
        if (response.data.settings.glRequireAuthentication === "true") {
        }

        if (response.data.settings) {
          if (response.data.settings.glViewerAccessCode !== "false") {
            setAccessCode(true);
          }
          if (response.data.settings.glModeratorAccessCode !== "false") {
            setModerator_AccessCode(true);
          }
        }
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const getSheduledMeetingDetails = async (room_id, SheduledId) => {
    try {
      const data = {
        roomId: room_id,
        scheduleMeeting_Id: SheduledId || null,
      };
      setIsLoading(true);
      const response = await apiClients.SheduledMeetingDetails(data);
      if (response?.currentMeeting || response?.nextMeeting) {
        setScheduleMeetingData(
          response?.currentMeeting || response?.nextMeeting
        );
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const checkFeild = () => {
    let error = false;
    if (!name) {
      error = true;
      setNameError(true);
    } else {
      setNameError(false);
    }
    if (
      (moderator_AccessCode &&
        room?.settings?.glAnyoneJoinAsModerator === "false" &&
        !accessCode) ||
      (!moderator_AccessCode && !accessCode)
    ) {
      setAccessCodeError(false);
    } else {
      if (!access_Code) {
        error = true;
        setAccessCodeError(true);
      } else {
        setAccessCodeError(false);
      }
    }
    if (room?.settings?.glModeratorAccessCode !== "false") {
      if (access_Code) {
        if (access_Code === room?.settings?.glModeratorAccessCode) {
          setAccessCodeError(false);
        } else if (access_Code === room?.settings?.glViewerAccessCode) {
          setAccessCodeError(false);
        } else {
          error = true;
          setAccessCodeError(true);
          return {
            error: error,
            message: "access code invalid",
          };
        }
      }
    }

    return error;
  };

  const handleJoinMeeting = async () => {
    try {
      let checkfield = checkFeild();

      if (checkfield === false) {
        setLoading(true);
        let data = {
          name,
          access_code: access_Code,
        };
        const friendly_id = room.room.friendly_id;
        const response = await apiClients.joinMeeting(friendly_id, data);
        if (response.success === true) {
          if (response.data) {
            setLoading(false);
            window.location.href = response.data.joinAttendeeUrl;
          }
        } else {
          toast.error(response.message);
          setLoading(false);
        }
      } else {
        toast.error(
          checkfield.message ? `${checkfield.message}` : "All fields required "
        );
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleJoinZoomMeeting = async () => {
    try {
      if (
        room?.settings?.glRequireAuthentication === "true" &&
        !user?.user?.email
      ) {
        handleLogin();
      } else {
        // const response = await apiClients.joinZoomMeeting();
        let checkfield = checkFeild();

        if (checkfield === false) {
          setLoading(true);
          let data = {
            name,
            access_code: access_Code,
          };
          const friendly_id = room.room.friendly_id;
          // const response = await apiClients.joinMeeting(friendly_id, data);
          const response = await apiClients.joinZoomMeeting(friendly_id, data);
          if (response?.url) {
            window.location.href = response?.url;
          } else if (response.success === false) {
            toast.error(response.message);
            setLoading(false);
          }
        } else {
          toast.error(
            checkfield.message
              ? `${checkfield.message}`
              : "All fields required "
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkPayment = async (userId, scheduleId) => {
    try {
      const data = {
        user_id: userId,
        schedule_id: scheduleId,
      };
      const response = await apiClients.checkMeetingPayment(data);
      if (response?.paymentStatus === true) {
        setVerifyPayment(true);
      } else {
        setVerifyPayment(false);
      }
    } catch (error) {
      console.log();
    }
  };

  const Payment = async () => {
    try {
      if (user?.user?.email) {
        const data = {
          amount: scheduleMeetingData?.price,
          roomId: Room_id,
        };
        const response = await apiClients.checkout(data);
        if (response.success === true) {
          initPayment(response.data);
        } else {
          toast.error(response.message);
        }
      } else {
        // navigate(`/login?roomId=${Room_id}`)
        handleLogin();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const initPayment = (data) => {
    var options = {
      key: process.env.REACT_APP_RAZORPAY_ID,
      amount: data.amount,
      currency: data.currency,
      name: "Atlearn",
      description: "Test Transaction",
      image: "/assets/atlearnlogo.svg",
      order_id: data.id,
      handler: async function (response) {
        const body = {
          ...response,
          planName: "ScheduleMeetingPayment",
          userEmail: user?.user?.email,
          scheduleId: scheduleMeetingData?.id,
          roomId: scheduleMeetingData?.room_id,
          totalPrice: scheduleMeetingData?.price,
        };
        const validateRes = await fetch(
          `${process.env.REACT_APP_OVERRIDE_HOST}/api/checkout/roomPayment`,
          {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const jsonRes = await validateRes.json();
        if (jsonRes.success) {
          // handlenext();
          checkPayment(user?.user?.id, scheduleMeetingData?.id);
        }
      },
      prefill: {
        name: user?.user?.name,
        email: user?.user?.email,
        // contact: phone,
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };
    var rzp1 = new window.Razorpay(options);
    rzp1.on("payment.failed", async function (response) {
      const data = {
        razorpay_order_id: response.error.metadata.order_id,
        razorpay_payment_id: response.error.metadata.payment_id,
        planName: "addon",
        userEmail: user?.user?.email,
        totalPrice: scheduleMeetingData?.price,
      };
      // eslint-disable-next-line no-unused-vars
      const faildPayment = await apiClients.failedTransaction(data);
    });
    rzp1.open();
  };

  const handleLogin = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: `/callback?roomId=${Room_id}&scheduleId=${Sheduled_id}`,
      },
      authorizationParams: {
        prompt: "login",
      },
    });
  };

  const handleStartMeeting = async (id) => {
    try {
      setLoading(true);
      const { data, success, message, duration } =
        await apiClients.startMeeting(id);

      if (data?.joinModeratorUrl) {
        window.location.href = data.joinModeratorUrl;
      } else if (!success && message) {
        toast.error(message);
      }
      // if (duration) {
      //   setAddonDuration(true);
      // }
    } catch (error) {
      setLoading(false);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartZoomMeeting = async (id) => {
    try {
      setLoading(true);
      const response = await apiClients.startZoomMeeting(id);
      if (response?.url) {
        window.location.href = response?.url;
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div>
      <Helmet>
        <title>Seamlessly Join Live Learning Sessions on Atlearn</title>
        <meta
          name="description"
          content="Participate in live learning sessions with Atlearn. Join real-time classes, interact with instructors, and enhance your learning experience."
        />
        <link rel="canonical" href={`${BASE_URL}/Join-meeting`} />
      </Helmet>
      <>
        {/*meeting details section */}
        <section>
          <div className="container py-10  ">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-30px">
              <div className="lg:col-start-1 lg:col-span-8 space-y-[35px]">
                <div data-aos="fade-up">
                  {/* meeting thumbnail */}
                  <div className="overflow-hidden relative ">
                    {/* <img
          // src="../../assets/images/zoom/details.jpg"
          src='http://localhost:7000/api/images/image-1731313129616.png'
   
          alt=""
          className="w-full h"
        /> */}
                    <div
                      // style={{
                      //   display: "flex",
                      //   justifyContent: "center",
                      //   alignItems: "center",
                      //   width: "100%",
                      //   // height: "400px",
                      //   marginBottom: "0.5rem",
                      //   overflow: "hidden",
                      //   // border: "1px solid #d1d5db",
                      //   // borderRadius: "0.375rem"
                      // }}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        maxHeight: "452px",
                        marginBottom: "0.5rem",
                        overflow: "hidden",
                      }}
                    >
                      {isLoading ? (
                        <div className="w-full h-full bg-gray-200 animate-pulse" />
                      ) : (
                        <img
                          src={
                            room?.room?.cover_image_url
                              ? `${process.env.REACT_APP_OVERRIDE_HOST}/api/images/${room?.room?.cover_image_url}`
                              : coverImage
                          }
                          alt={room?.room?.name}
                          title={room?.room?.name}
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                          }}
                        />
                      )}
                    </div>
                  </div>
                  {/*meeting content */}
                  <div className="space-y-5">
                    <h3
                      data-aos="fade-up"
                      className="text-2xl md:text-size-32 lg:text-size-28 2xl:text-size-34 leading-34px md:leading-10 2xl:leading-13.5 font-bold text-blackColor2 hover:text-primaryColor dark:text-blackColor2-dark dark:hover:text-primaryColor"
                    >
                      {room?.room?.name}
                    </h3>
                    {scheduleMeetingData && (
                      // <p
                      //   className="text-sm 2xl:text-lg text-darkdeep4 !leading-30px"
                      //   data-aos="fade-up"
                      // >
                      //   {scheduleMeetingData
                      //     ? scheduleMeetingData?.description
                      //     : ""}
                      // </p>
                      <div
                        className="quill-preview"
                        dangerouslySetInnerHTML={{
                          __html: scheduleMeetingData?.description,
                        }}
                      />
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-1 mb-30px gap-30px">
                  <div data-aos="fade-up" className="relative">
                    <input
                      name="con_name"
                      id="con_name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name*"
                      className={`w-full pl-26px bg-transparent focus:outline-none 
                        text-contentColor dark:text-contentColor-dark 
                        placeholder:text-placeholder placeholder:opacity-80 
                        h-15 leading-15 font-medium rounded border
                        ${
                          nameError
                            ? "border-red-500"
                            : " border-borderColor2 dark:border-borderColor2-dark"
                        }`}
                    />
                    <div className="text-xl leading-23px text-primaryColor absolute right-6 top-1/2 -translate-y-1/2">
                      <i className="icofont-businessman" />
                    </div>
                  </div>
                  {user?.user?.id !== room?.room?.user?.id && (
                    <>
                      {moderator_AccessCode || accessCode ? (
                        <div data-aos="fade-up" className="relative">
                          <label
                            htmlFor="con_name"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            {moderator_AccessCode &&
                            room?.settings?.glAnyoneJoinAsModerator ===
                              "false" &&
                            !accessCode
                              ? "Moderator Access Code (optional)"
                              : moderator_AccessCode &&
                                room?.settings?.glAnyoneJoinAsModerator ===
                                  "true" &&
                                !accessCode
                              ? "Moderator Access Code"
                              : "Access Code"}
                          </label>
                          <input
                            name="con_name"
                            id="con_name"
                            type="text"
                            value={access_Code}
                            onChange={(e) => {
                              setAccess_Code(e.target.value);
                              setAccessCodeError(false);
                            }}
                            placeholder="Enter the access code"
                            className={`w-full pl-26px bg-transparent focus:outline-none 
                          text-contentColor dark:text-contentColor-dark 
                          placeholder:text-placeholder placeholder:opacity-80 
                          h-15 leading-15 font-medium rounded border
                          ${
                            accessCodeError
                              ? "border-red-500"
                              : " border-borderColor2 dark:border-borderColor2-dark"
                          }`}
                          />
                          <div className="text-xl leading-23px text-primaryColor absolute right-6 top-1/2 -translate-y-1/2">
                            <i className="icofont-ui-password" />
                          </div>
                        </div>
                      ) : null}
                    </>
                  )}

                  <div className=" flex gap-x-4 gap-y-4 flex-col md:flex-row ">
                    {user?.user?.id === room?.room?.user?.id ? (
                      <button
                        onClick={() => {
                          if (room?.room?.provider === "zoom") {
                            handleStartZoomMeeting(room?.room?.friendly_id);
                          } else {
                            // room?.room?.online === true
                            //   ? handleJoinMeeting()
                            //   : handleStartMeeting(room?.room?.friendly_id);
                            handleStartMeeting(room?.room?.friendly_id);
                          }
                        }}
                        type="submit"
                        className="text-size-15 text-whiteColor bg-primaryColor px-14 py-10px border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
                      >
                        {loading && (
                          <span className="spinner-border animate-spin inline-block w-4 h-4 border-2 rounded-full border-t-transparent mr-2"></span>
                        )}
                        {room?.room?.online === true
                          ? "Join Meeting"
                          : "Start Meeting"}
                      </button>
                    ) : verifyPayment || !scheduleMeetingData?.price ? (
                      <button
                        // onClick={handleJoinMeeting}
                        onClick={
                          room?.room?.provider === "zoom"
                            ? handleJoinZoomMeeting
                            : handleJoinMeeting
                        }
                        type="submit"
                        className="text-size-15 text-whiteColor bg-primaryColor px-14 py-10px border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
                      >
                        {loading && (
                          <span className="spinner-border animate-spin inline-block w-4 h-4 border-2 rounded-full border-t-transparent mr-2"></span>
                        )}
                        Join Meeting
                      </button>
                    ) : (
                      <button
                        onClick={Payment}
                        type="submit"
                        className="text-size-15 text-whiteColor bg-primaryColor px-14 py-10px border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
                      >
                        {loading && (
                          <span className="spinner-border animate-spin inline-block w-4 h-4 border-2 rounded-full border-t-transparent mr-2"></span>
                        )}
                        Pay For Meeting
                      </button>
                    )}
                    <button
                      onClick={() => navigate(-1)}
                      type="submit"
                      className="text-size-15 text-primaryColor bg-whiteColor px-14 py-10px border border-primaryColor hover:text-whiteColor hover:bg-primaryColor inline-block rounded group dark:text-whiteColor dark:bg-whiteColor-dark dark:hover:text-primaryColor dark:hover:bg-primaryColor-dark"
                    >
                      Back
                    </button>
                  </div>
                </div>
              </div>
              {/* blog sidebar */}
              <div className="lg:col-start-9 lg:col-span-4">
                <div>
                  {/* enroll section */}
                  <div
                    className="py-33px px-25px shadow-event mb-30px bg-whiteColor dark:bg-whiteColor-dark"
                    data-aos="fade-up"
                  >
                    <div className="flex justify-between mb-50px">
                      {scheduleMeetingData?.price > 0 ? (
                        <div className="text-size-21 font-bold text-primaryColor font-inter leading-25px dark:text-blackColor2-dark">
                          ₹ {scheduleMeetingData?.price}
                        </div>
                      ) : (
                        <span className="">
                          <span className="text-base font-semibold text-greencolor ">
                            Free
                          </span>
                        </span>
                      )}
                    </div>
                    <ul>
                      <li className="flex items-center mb-4.5 pb-4.5 border-b border-borderColor dark:border-borderColor-dark">
                        <div>
                          <i className="icofont-teacher text-size-22 mr-10px text-blackColor dark:text-blackColor-dark" />
                        </div>
                        <div className="flex-grow flex justify-between items-center text-blackColor dark:text-blackColor-dark">
                          <p>Instructor:</p>
                          <div className="font-bold text-contentColor hover:text-secondaryColor dark:text-contentColor-dark dark:hover:text-secondaryColor">
                            {room?.room?.user?.name}
                          </div>
                        </div>
                      </li>

                      <>
                        <li className="flex items-center mb-4.5 pb-4.5 border-b border-borderColor dark:border-borderColor-dark">
                          <div>
                            <i className="icofont-calendar text-size-22 mr-10px text-blackColor dark:text-blackColor-dark" />
                          </div>
                          <div className="flex-grow flex justify-between items-center text-blackColor dark:text-blackColor-dark">
                            <p>Date:</p>
                            {scheduleMeetingData ? (
                              <p>
                                {
                                  formatDateRange(
                                    scheduleMeetingData?.startDate,
                                    scheduleMeetingData?.endDate
                                  ).formattedStartDate
                                }
                              </p>
                            ) : (
                              <p>Today</p>
                            )}
                          </div>
                        </li>

                        <li className="flex items-center mb-4.5 pb-4.5 border-b border-borderColor dark:border-borderColor-dark">
                          <div>
                            <i className="icofont-clock-time text-size-22 mr-10px text-blackColor dark:text-blackColor-dark" />
                          </div>
                          <div className="flex-grow flex justify-between items-center text-blackColor dark:text-blackColor-dark">
                            <p>Time:</p>

                            {scheduleMeetingData ? (
                              <p>
                                {
                                  formatDateRange(
                                    scheduleMeetingData?.startDate,
                                    scheduleMeetingData?.endDate
                                  ).formattedStartTime
                                }{" "}
                                -{" "}
                                {
                                  formatDateRange(
                                    scheduleMeetingData?.startDate,
                                    scheduleMeetingData?.endDate
                                  ).formattedEndTime
                                }
                              </p>
                            ) : (
                              <p>Now</p>
                            )}
                          </div>
                        </li>

                        <li className="flex items-center mb-4.5 pb-4.5 border-b border-borderColor dark:border-borderColor-dark">
                          <div>
                            <i className="icofont-hour-glass text-size-22 mr-10px text-blackColor dark:text-blackColor-dark" />
                          </div>
                          <div className="flex-grow flex justify-between items-center text-blackColor dark:text-blackColor-dark">
                            <p>Duration:</p>
                            {scheduleMeetingData ? (
                              <p>
                                {calculateTimeDifference(
                                  scheduleMeetingData?.startDate,
                                  scheduleMeetingData?.endDate
                                )}
                              </p>
                            ) : (
                              <p>30 min</p>
                            )}
                          </div>
                        </li>
                        <li>
                          <button
                            onClick={() =>
                              navigate(`/public-records?roomId=${Room_id}`)
                            }
                            type="submit"
                            className=" w-full text-size-15 text-whiteColor bg-primaryColor px-14 py-10px border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
                          >
                            View Recordings
                          </button>
                        </li>
                      </>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    </div>
  );
}

export default JoinRoom;
