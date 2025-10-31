import React, { useEffect, useState } from "react";
import FeaturesCard from "src/components/New components/FeaturesCard";
// import FeatureSlider from "src/components/New components/FeatureSlider";
import tutorCoverImage from "src/assets/images/online-classes/New/tutorCoverImage1.jpg";
import {
  onlineClaasesFeatures,
  OnlineClassroomPlatform,
  SetUpanOnlineClassroom,
  SetUpanOnlineClassroomCards,
  SeamlessVideo,
  Best_Online_Classroom_Software,
  Best_Online_Classroom_Software_Tabs,
  meetingCTAForms,
  MeetingCTA,
  LiveTeaching,
} from "src/Page_Content/OnlineClasses";
import ScheduleRoomSection from "./ScheduleRoomSection";
import BannerImage from "src/assets/images/online-classes/New/Online Classes.svg";
import { Link, useNavigate } from "react-router-dom";
import SplitSection from "src/components/New components/SplitSection";
import SectionHeading from "src/components/New components/SectionHeading";
// import apiClients from "src/apiClients/apiClients";
import { useHandleNavigate } from "src/utils/Navigation/useHandleNavigate";
import { Helmet } from "react-helmet";
import axios from "axios";
import { teacherToken } from "src/apiClients/token";
import ServicesTabs from "src/components/New components/ServicesTabs";
import CTAForms from "src/components/New components/CTAForms";
// import { usersToken } from "src/apiClients/token";
import shareImage from "src/assets/images/home/atlearn_meetings.png";
import VideoSection from "src/components/New components/VideoSection";
// import { useSelector } from "react-redux";
import MeetingDemoModal from "src/components/New components/Modal/MeetingDemoModal";
import CTASection from "src/components/New components/CTASection";
import { BASE_URL } from "src/apiClients/config";
import { UseAuth } from "src/utils/UseAuth/UseAuth";
import { useAuth0 } from "@auth0/auth0-react";
import NotificationPopup from "src/components/Notification/NotificationPopup";

function OnlineClasses() {
  const navigate = useNavigate();
  // const { user } = useSelector((state) => state.user);
  const auth = UseAuth();
  const { user, loginWithRedirect } = useAuth0();
  const searchParams = new URLSearchParams(window.location.search);
  const isDemo = searchParams.get("demo");
  const handleNavigate = useHandleNavigate();
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [tutors, setTutors] = useState([]);
  const [demoPopupOpen, setDemoPopupOpen] = useState(false);
  const [demoErrorPopup, setDemoErrorPopup] = useState(false);
  useEffect(() => {
    if (user) {
      const url = new URL(window.location.href);
      const afterSlash = url.pathname.substring(1);
      // const queryParams = Object.fromEntries(new URLSearchParams(url.search).entries());

      if (afterSlash === "callback") {
        navigate(`/callback?${url.searchParams.toString()}`);
      } else {
        console.log("Path is not 'callback'. No navigation.");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (isDemo === "true") {
      if (auth.user) {
        setDemoErrorPopup(true);
      } else {
        localStorage.removeItem("access_token");
        handleLogin();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDemo, auth.user]);

  useEffect(() => {
    const fetchData = async () => {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `https://lms.atlearn.in/webservice/rest/server.php?wstoken=${teacherToken}&wsfunction=get_teachers&moodlewsrestformat=json`,
        headers: {},
      };

      try {
        const response = await axios.request(config);
        setTutors(response.data); // Store the response data
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handleLogin = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: `/callback`,
      },
      authorizationParams: {
        prompt: "login",
        login_hint: "demo_teacher@atlearn.in",
      },
    });
  };

  const handleFreeDemoOpen = () => {
    // if (auth.user) {
    //   // handleNavigate("/room?role=Moderator");
    //   handleNavigate("/room");
    // } else {
    //   setDemoPopupOpen(true);
    // }
    handleNavigate("/room?role=Moderator");
  };

  const handleFreeDemoClose = () => {
    setDemoPopupOpen(false);
  };
  const handleModalClose = () => {
    setDemoErrorPopup(false);
    // navigate("/settings/mysubscription");
  };

  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const truncateText = (text, wordLimit) => {
    const words = text?.split(" ");
    if (words?.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + " ...";
  };
  return (
    <div>
      <Helmet>
        <title>Secure & Smart Online School Meetings | AtLearn</title>
        <meta
          name="description"
          content="Host secure, high-quality online meetings with AtLearn. Designed for schools and educators, with AI features, attendance, screen sharing & more."
        />
        <link rel="canonical" href={`${BASE_URL}/meetings`} />

        <meta
          property="og:title"
          content="Start Online Classes | Atlearn LMS"
        />
        <meta
          property="og:description"
          content="Begin teaching online classes using Atlearn's platform. Engage learners with virtual classrooms and AI-powered tools for a seamless experience."
        />
        <meta property="og:image" content={shareImage} />
        <meta property="og:url" content={`${BASE_URL}/meetings`} />
        <meta property="og:site_name" content="Atlearn" />
        <meta property="og:type" content="website" />

        <meta
          name="twitter:card"
          content="Begin teaching online classes using Atlearn's platform. Engage learners with virtual classrooms and AI-powered tools for a seamless experience."
        />
        <meta
          name="twitter:title"
          content="Start Online Classes | Atlearn LMS"
        />
        <meta
          name="twitter:description"
          content="Begin teaching online classes using Atlearn's platform. Engage learners with virtual classrooms and AI-powered tools for a seamless experience."
        />
        <meta name="twitter:image" content={shareImage} />
      </Helmet>
      {/* banner section */}
      <section>
        {/* banner section */}
        <div className="hero bg-lightGrey11 dark:bg-lightGrey11-dark relative z-0 overflow-hidden py-50px ">
          {/* animated icons */}
          <div className="container 2xl:container-secondary-md relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-30px">
              {/* banner Left */}
              <div data-aos="fade-up" className="lg:col-start-1 lg:col-span-7">
                <div className="3xl:pr-135px">
                  <h3 className="uppercase text-secondaryColor text-size-15 mb-5px md:mb-15px font-inter tracking-[4px] font-semibold">
                    Online Meetings
                  </h3>

                  <h1 className="text-size-35 md:text-size-65 lg:text-5xl 2xl:text-size-65 leading-42px md:leading-18 lg:leading-15 2xl:leading-18 text-blackColor dark:text-blackColor-dark md:tracking-half lg:tracking-normal 2xl:tracking-half font-bold mb-15px">
                    {/* Best Kindergarten Awesome
                          <span className="text-secondaryColor">Solution</span> */}
                    Enhance Your Virtual Meetings
                  </h1>
                  <p className="text-size-15md:text-lg text-blackColor dark:text-blackColor-dark font-medium">
                    {/* Lorem Ipsum is simply dummy text of the printing typesetting
                <br />
                industry. Lorem Ipsum has been */}
                    Learn Anytime, Anywhere - Host & Join Seamless Virtual
                    Meetings with Atlearn
                  </p>
                  <div className="mt-30px flex flex-col text-center  md:flex-row gap-2 ">
                    <span
                      // to={"/room"}
                      onClick={() => navigate("/join-meetings#meetings")}
                      className="cursor-pointer text-sm md:text-size-15 text-whiteColor bg-secondaryColor border border-secondaryColor px-25px py-15px hover:text-secondaryColor hover:bg-whiteColor rounded inline-block dark:hover:bg-whiteColor-dark dark:hover:text-secondaryColor"
                    >
                      Explore Meetings
                    </span>
                    <span
                      onClick={handleFreeDemoOpen}
                      className=" cursor-pointer lg:ml-2 text-sm md:text-size-15 text-whiteColor bg-primaryColor border border-primaryColor px-25px py-15px hover:text-primaryColor hover:bg-whiteColor rounded inline-block dark:hover:bg-whiteColor-dark dark:hover:text-primaryColor"
                    >
                      Create Meeting Now
                    </span>
                  </div>
                </div>
              </div>
              {/* banner right */}
              <div data-aos="fade-up" className="lg:col-start-8 lg:col-span-5">
                <div className="relative">
                  <img
                    loading="lazy"
                    src={BannerImage}
                    alt="Enhance Your Video Meetings"
                    title="Enhance Your Video Meetings"
                    className="w-full rounded-lg2"
                  />
                  <div className="absolute top-0 bottom-0 right-0 left-0 flex items-center justify-center">
                    <button
                      onClick={() => setIsVideoOpen(true)}
                      className="lvideo relative w-15 h-15 md:h-20 md:w-20 lg:w-15 lg:h-15 2xl:h-70px 2xl:w-70px 3xl:h-20 3xl:w-20 bg-secondaryColor rounded-full flex items-center justify-center"
                    >
                      <span className="animate-buble absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 block w-[180px] h-[180px] border-secondaryColor rounded-full" />
                      <span className="animate-buble2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 block w-[180px] h-[180px] border-secondaryColor rounded-full" />
                      <img
                        loading="lazy"
                        src="./assets/images/icon/video.png"
                        alt="video icon"
                        title="video icon"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="text-center bg-white">
        <SplitSection data={LiveTeaching} />
      </section>

      <div>
        <SectionHeading data={SetUpanOnlineClassroom} center={true} />
        <FeaturesCard data={SetUpanOnlineClassroomCards} row={3} />
      </div>

      <div>
        <SplitSection data={OnlineClassroomPlatform} headingTop={true} />
      </div>

      <div>
        <VideoSection
          data={Best_Online_Classroom_Software}
          rightSideVideo={true}
        />
      </div>
      <div>
        <ServicesTabs tabs={Best_Online_Classroom_Software_Tabs} />
      </div>
      <div>
        <CTAForms data={meetingCTAForms} />
      </div>

      <div>
        <SectionHeading data={SeamlessVideo} center={true} />
        <FeaturesCard data={onlineClaasesFeatures} row={3} />
      </div>
      <div className="mt-10px">
        <ScheduleRoomSection />
      </div>

      {/* <FeatureSlider/> */}
      {tutors?.length > 0 && (
        <section>
          <div className="container py-30px ">
            {/* heading */}
            <div data-aos="fade-up" className="text-center mb-15px">
              <span className="text-size-15 font-semibold text-secondaryColor inline-block uppercase mb-[13px]">
                Our Tutors
              </span>
              <h3 className="text-3xl md:text-size-35 lg:text-size-45 leading-10 md:leading-2xl font-bold text-blackColor dark:text-blackColor-dark">
                Meet Our Experts
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-30px gap-y-15">
              {/* teacher 1 */}
              {tutors?.slice(0, 3)?.map((user, index) => {
                const plainText = stripHtml(user?.description);
                const displayText = truncateText(plainText, 25);

                return (
                  <div
                    onClick={() =>
                      navigate(`/tutor-details?tutor_Id=${user?.id}`)
                    }
                    key={user.id}
                    className="cursor-pointer bg-white dark:bg-whiteColor-dark dark:text-blackColor-dark rounded-2xl p-5 max-w-md w-full shadow-dropdown-secodary hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between h-full border border-borderColor dark:border-borderColor-dark"
                  >
                    <div>
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            user.profile_image
                              ? user.profile_image
                              : tutorCoverImage
                          }
                          alt={`${user.firstname} ${user.lastname}`}
                          className="w-16 h-16 rounded-full object-cover border border-gray-300"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/64";
                          }}
                        />
                        <div>
                          <h2 className="hover:text-secondaryColor text-xl font-semibold text-gray-800 dark:text-blackColor-dark">
                            {user.firstname} {user.lastname}
                          </h2>
                        </div>
                      </div>

                      <p className="mt-4 text-sm text-gray-600 dark:text-blackColor-dark">
                        {displayText}
                      </p>
                    </div>

                    {user.description && (
                      <div className="flex justify-end mt-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent parent click
                            navigate(`/tutor-details?tutor_Id=${user?.id}`);
                          }}
                          className="text-blue-500 text-sm hover:text-primary hover:bg-white border border-primaryColor px-2 py-1 bg-primaryColor text-whiteColor  transition-colors duration-300 rounded"
                        >
                          View More
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {tutors?.length > 3 && (
              <div className="flex justify-center" data-aos="fade-up">
                <Link
                  title="More Teachers"
                  to={"/tutors"}
                  className="text-size-15 px-47px py-15px bg-primaryColor text-whiteColor border border-primaryColor hover:text-primaryColor hover:bg-whiteColor dark:hover:bg-whiteColor-dark dark:hover:text-whiteColor mt-10 md:mt-50px rounded uppercase"
                >
                  View More
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      <section>
        <CTASection data={MeetingCTA} />
      </section>

      {isVideoOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setIsVideoOpen(false)}
        >
          <div
            className="relative bg-white rounded-lg overflow-hidden w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full w-8 h-8 flex items-center justify-center"
              onClick={() => setIsVideoOpen(false)}
            >
              ✕
            </button>
            <iframe
              width="100%"
              height="450"
              src="https://www.youtube.com/embed/S68HSlHiXEc"
              title="YouTube video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            ></iframe>
          </div>
        </div>
      )}
      <MeetingDemoModal
        open={demoPopupOpen}
        handleClose={handleFreeDemoClose}
      />
      <NotificationPopup
        open={demoErrorPopup}
        handleClose={handleModalClose}
        heading={"Welcome back!"}
        message={"You're already logged in to your account"}
      />
    </div>
  );
}

export default OnlineClasses;
