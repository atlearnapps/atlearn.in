import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { BASE_URL } from "src/apiClients/config";
import BannerImage from "src/assets/images/home/homebanner.webp";
import shareImage from "src/assets/images/home/atlearn_meetings.png";
import SplitSection from "src/components/New components/SplitSection";
import {
  Atlearn_Revolution,
  Build_for_Educators,
  SmartLearningTools,
  SmartLearningToolsHeading,
  Start_Teaching_CTA,
  StartTeaching,
  whyChooseAtlearn,
} from "src/Page_Content/Home";
import FeaturesCard from "src/components/New components/FeaturesCard";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { UseAuth } from "src/utils/UseAuth/UseAuth";
import NotificationPopup from "src/components/Notification/NotificationPopup";
import VideoSection from "src/components/New components/VideoSection";
import CTASection from "src/components/New components/CTASection";
import PrimaryButton from "src/components/New components/PrimaryButton";
import { useHandleNavigate } from "src/utils/Navigation/useHandleNavigate";


function Home() {
  const auth = UseAuth();
  const { user, loginWithRedirect } = useAuth0();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const isDemo = searchParams.get("demo");
  const [demoErrorPopup, setDemoErrorPopup] = useState(false);
  const handleNavigate = useHandleNavigate();
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
    // getToken()
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
  const handleModalClose = () => {
    setDemoErrorPopup(false);
    // navigate("/settings/mysubscription");
  };



  async function getToken() {
  // try {
  //   const response = await axios.post(
  //     "https://dev-yqj2guchohe24jhn.us.auth0.com/oauth/token",
  //     {
  //       client_id: "b8J2V8zENcfQOZZLQ4plLXGPhZ5rVvPK",
  //       client_secret: "lmlUaVThNZGYpHRKIq8eIH0kU_hmkqTv78437T5XrspCGiB7BUwUxFA3tp5qt972",
  //       audience: "https://www.atlearn.in/api",
  //       grant_type: "client_credentials",
  //     },
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );

  //   console.log(response.data); // access_token will be here
  //   return response.data;
  // } catch (error) {
  //   console.error("Error fetching token:", error);
  // }
    try {
      const response = await fetch('https://dev-yqj2guchohe24jhn.us.auth0.com/oauth/token', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          "client_id":"b8J2V8zENcfQOZZLQ4plLXGPhZ5rVvPK",
          "client_secret":"lmlUaVThNZGYpHRKIq8eIH0kU_hmkqTv78437T5XrspCGiB7BUwUxFA3tp5qt972",
          "audience":"https://www.atlearn.in/api",
          "grant_type":"client_credentials"
        }),
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data);
  } catch (error) {
      console.error('Error fetching token:', error);
  }
}

  return (
    <div>
      <Helmet>
        <title>AI-Powered Learning Platform | Courses, Tests & Classes</title>
        <meta
          name="description"
          content="Atlearn offers AI-powered tools to create courses, host classes, and build quizzes. Perfect for tutors, students, and online course creators."
        />
        <link rel="canonical" href={`${BASE_URL}`} />

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
        <div className="hero bg-lightGrey11 dark:bg-lightGrey11-dark relative z-0 overflow-hidden py-10px ">
          {/* animated icons */}
          <div></div>
          <div className="container 2xl:container-secondary-md relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-30px">
              {/* banner Left */}
              <div data-aos="fade-up" className="lg:col-start-1 lg:col-span-9">
                <div className="3xl:pr-135px">
                  <h3 className="uppercase text-secondaryColor text-size-15 mb-5px md:mb-15px font-inter tracking-[4px] font-semibold">
                    Education Solution
                  </h3>

                  <h1 className="text-3xl md:text-6xl lg:text-size-50 2xl:text-6xl leading-42px md:leading-18 lg:leading-15 2xl:leading-18 text-blackColor dark:text-blackColor-dark md:tracking-half lg:tracking-normal 2xl:tracking-half font-bold mb-15px">
                    Create,Teach & Earn Online-Your Free LMS & Virtual Classroom
                    Platform
                  </h1>
                  <p className="text-size-15md:text-lg text-blackColor dark:text-blackColor-dark font-medium">
                    Create courses, host live classes, and engage students
                    online. Perfect for trainers, schools, academies, and
                    educators.
                  </p>
                  <div className="mt-30px flex flex-col text-center  md:flex-row gap-2 ">
                    <span
                      // onClick={() => navigate("/join-meetings#meetings")}
                      className="cursor-pointer text-sm md:text-size-15 text-whiteColor bg-secondaryColor border border-secondaryColor px-25px py-15px hover:text-secondaryColor hover:bg-whiteColor rounded inline-block dark:hover:bg-whiteColor-dark dark:hover:text-secondaryColor"
                    >
                      Start Teaching Free
                    </span>
                    <span
                      //   onClick={handleFreeDemoOpen}
                      className=" cursor-pointer lg:ml-2 text-sm md:text-size-15 text-whiteColor bg-primaryColor border border-primaryColor px-25px py-15px hover:text-primaryColor hover:bg-whiteColor rounded inline-block dark:hover:bg-whiteColor-dark dark:hover:text-primaryColor"
                    >
                      Book a Live Demo
                    </span>
                  </div>
                </div>
              </div>
              {/* banner right */}
              <div data-aos="fade-up" className="lg:col-start-10 lg:col-span-3">
                <div className="relative">
                  <img
                    loading="lazy"
                    src={BannerImage}
                    alt="Enhance Your Video Meetings"
                    title="Enhance Your Video Meetings"
                    className="w-full rounded-lg2"
                  />
                  {/* <div className="absolute top-0 bottom-0 right-0 left-0 flex items-center justify-center">
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
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-4" >
        <VideoSection
          data={Atlearn_Revolution}
          headingTop={true}
          descriptionTop={true}
        />
      </section>
      <section>
        <SplitSection data={SmartLearningToolsHeading} center={true} />
        <FeaturesCard data={SmartLearningTools} row={3} />
        <div className="container flex itmes-center justify-center w-full" >
          <PrimaryButton primary={true} onClick={()=>handleNavigate("https://lms.atlearn.in/course/edit.php?category=0")}>
           Create your free course
          </PrimaryButton>
        </div>
      </section>
      <section>
        <SplitSection data={Build_for_Educators} />
      </section>
      <section>
        <VideoSection data={whyChooseAtlearn} rightSideVideo={true} />
      </section>

            <section>
              <CTASection data={Start_Teaching_CTA} />
            </section>
      <section>
        <SplitSection data={StartTeaching} headingTop={true} />
      </section>
      <NotificationPopup
        open={demoErrorPopup}
        handleClose={handleModalClose}
        heading={"Welcome back!"}
        message={"You're already logged in to your account"}
      />
    </div>
  );
}

export default Home;
