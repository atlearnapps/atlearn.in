import React from "react";
import { Helmet } from "react-helmet";
import { BASE_URL } from "src/apiClients/config";
import shareImage from "src/assets/images/home/atlearn_meetings.png";
import BannerImage from "src/assets/images/online-classes/New/Online Classes.svg";
import SplitSection from "src/components/New components/SplitSection";
import { InviteStudents, keyFeatures, mainheading } from "src/Page_Content/Assessments";
import HowitsworkImage from "src/assets/images/Assessments/how it works.webp";
import OnlineTestView from "./OnlineTestView";
import banner_image from "src/assets/images/Assessments/AssessmentBanner.webp"
import VideoSection from "src/components/New components/VideoSection";
import { useNavigate } from "react-router-dom";
import { useHandleNavigate } from "src/utils/Navigation/useHandleNavigate";

function Assessments() {
    const navigate = useNavigate();
      const handleNavigate = useHandleNavigate();
  return (
    <div>
      <Helmet>
        <title>
          AI Quiz Generator | Online Quiz Maker for Educators & Students
        </title>
        <meta
          name="description"
          content="Create quizzes in minutes with ATLearn’s AI-powered quiz LMS. Build, customize, and share interactive online quizzes for students, schools, and businesses."
        />
        <link rel="canonical" href={`${BASE_URL}/assessments`} />

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
                    AI-Powered Online Quiz - Build Smarter Tests in Minutes
                  </h1>

                  <p className="text-size-15md:text-lg text-blackColor dark:text-blackColor-dark font-medium mt-2">
                    Start free, invite your students, and watch them engage with
                    interactive quizzes that adapt to their skills.
                  </p>
                                    <div className="mt-30px flex flex-col text-center  md:flex-row gap-2 ">
                    <button
                      // to={"/room"}
                      onClick={() => navigate("/online-test")}
                      className="cursor-pointer text-sm md:text-size-15 text-whiteColor bg-secondaryColor border border-secondaryColor px-25px py-15px hover:text-secondaryColor hover:bg-whiteColor rounded inline-block dark:hover:bg-whiteColor-dark dark:hover:text-secondaryColor"
                    >
                      Explore Assessments
                    </button>
                    <button
                      onClick={()=> handleNavigate("https://lms.atlearn.in/course/edit.php?category=2")}
                      className=" cursor-pointer lg:ml-2 text-sm md:text-size-15 text-whiteColor bg-primaryColor border border-primaryColor px-25px py-15px hover:text-primaryColor hover:bg-whiteColor rounded inline-block dark:hover:bg-whiteColor-dark dark:hover:text-primaryColor"
                    >
                      Create Assessments
                    </button>
                  </div>
                </div>
              </div>
              {/* banner right */}
              <div data-aos="fade-up" className="lg:col-start-10 lg:col-span-3">
                <div className="relative">
                  <img
                    loading="lazy"
                    src={banner_image}
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
      {/* <section>
        <SplitSection data={mainheading}/>
      </section> */}
      <section>
        <SplitSection
          data={keyFeatures}
          headingTop={true}
          descriptionTop={true}
        />
      </section>
      <section className="bg-gradient-to-r from-blue-50 to-cyan-50 py-10px px-6 mb-10">
        <div className="container">
          <img
            src={HowitsworkImage}
            alt="How it works steps"
            className="mx-auto w-full max-w-5xl rounded-lg shadow-lg"
          />
        </div>
      </section>
      <section>
        <VideoSection data={InviteStudents} rightSideVideo={true} headingTop={true}/>
      </section>
      <section>
        <OnlineTestView/>
      </section>
    </div>
  );
}

export default Assessments;
