import React from "react";
import { Helmet } from "react-helmet";
import { BASE_URL } from "src/apiClients/config";
import LearningPlatform from "./LearningPlatform";
import FeaturesCard from "src/components/New components/FeaturesCard";
import {
  Courses_Features,
  create_and_teach,
  InviteYourStudents,
} from "src/Page_Content/Courses";
import SplitSection from "src/components/New components/SplitSection";
import Setps from "src/assets/images/LMS/sTEPS (1) (1).webp";
import Steps_Enrollment from "src/assets/images/LMS/Steps_Enrollment.webp";
import LMSCourses from "./LMSCourses";
import VideoSection from "src/components/New components/VideoSection";
import PrimaryButton from "src/components/New components/PrimaryButton";
import { useHandleNavigate } from "src/utils/Navigation/useHandleNavigate";

function Courses() {
  const handleNavigate = useHandleNavigate();
  return (
    <div>
      <Helmet>
        <title>Explore All Learning Paths and Courses at Atlearn</title>
        <meta
          name="description"
          content="Discover diverse learning paths and courses on Atlearn. Find the perfect program tailored to your interests and achieve your educational goals."
        />
        <link rel="canonical" href={`${BASE_URL}/courses`} />
      </Helmet>
      <section id="main">
        {/* bannaer section */}
        <div className="container2-xl bg-darkdeep1 py-50px  rounded-2xl relative overflow-hidden shadow-brand">
          <div className="container">
            <div className="flex flex-col items-center text-center w-full lg:w-83% xl:w-3/4 mx-auto">
              {/* banner Left */}
              <div data-aos="fade-up" className="w-4/5">
                <h3 className="uppercase text-secondaryColor text-size-15 mb-5px md:mb-15px font-inter tracking-5px">
                  EDUCATION SOLUTION
                </h3>
                <h1 className="text-3xl text-whiteColor md:text-6xl lg:text-size-50 2xl:text-6xl leading-10 md:leading-18 lg:leading-62px 2xl:leading-18 md:tracking-half lg:tracking-normal 2xl:tracking-half font-bold ">
                  Online Courses
                  <span className="text-secondaryColor"> . </span>
                </h1>
                {/* <p className="text-size-15 md:text-lg text-white  font-medium">
                  Affordable plans tailored for every learner—find the perfect
                  fit with Atlearn
                </p> */}
              </div>
            </div>
          </div>
          <div>
            <img
              className="absolute left-1/2 bottom-[15%] animate-spin-slow"
              src="./assets/images/register/register__2.png"
              alt="register icon"
              title="register icon"
            />
            <img
              className="absolute left-[42%] sm:left-[65%] md:left-[42%] lg:left-[5%] top-[4%] sm:top-[1%] md:top-[4%] lg:top-[10%] animate-move-hor"
              src="./assets/images/herobanner/herobanner__6.png"
              alt="herobanner icon"
              title="herobanner icon"
            />
            <img
              className="absolute right-[5%] bottom-[15%]"
              src="./assets/images/herobanner/herobanner__7.png"
              alt="herobanner icon"
              title="herobanner icon"
            />
            <img
              className="absolute top-[5%] left-[45%]"
              src="./assets/images/herobanner/herobanner__7.png"
              alt="herobanner icon"
              title="herobanner icon"
            />
          </div>
        </div>
      </section>
      <section>
        <LearningPlatform />
      </section>
      <section>
        <FeaturesCard data={Courses_Features} row={3} />
      </section>
      {/* <section className="bg-gradient-to-r from-blue-50 to-cyan-50 py-10px px-6">
        <div className="container">
          <img
            src={Setps}
            alt="How it works steps"
            className="mx-auto w-full max-w-5xl rounded-lg shadow-lg"
          />
        </div>
      </section> */}
      <section className="bg-gradient-to-r from-blue-50 to-cyan-50 py-10 px-6">
        <div className="container ">
          <div className="rounded-lg shadow-lg bg-white pb-4">
            <img
              src={Setps}
              alt="How it works steps"
              className="mx-auto w-full max-w-5xl "
            />

            <div className=" flex items-center justify-center ">
              <PrimaryButton
                primary={true}
                onClick={() =>
                  handleNavigate(
                    "https://lms.atlearn.in/login/index.php?loginredirect=1"
                  )
                }
              >
                Create Your Free Course
              </PrimaryButton>
            </div>
          </div>
        </div>
      </section>
      <section>
        <LMSCourses />
      </section>
      <section className="text-center">
        <SplitSection data={InviteYourStudents} />
        <div className=" flex items-center justify-center ">
          <PrimaryButton
            primary={true}
            onClick={() => handleNavigate("/tutors")}
          >
            Invite Students Now
          </PrimaryButton>
        </div>
        <section className="bg-gradient-to-r from-blue-50 to-cyan-50 py-10px px-6">
          <div className="container">
            <div className="rounded-lg shadow-lg bg-white pb-4">
              <img
                src={Steps_Enrollment}
                alt="How it works steps"
                className="mx-auto w-full max-w-5xl "
              />
            </div>
          </div>
        </section>
      </section>
      <section>
        <VideoSection data={create_and_teach} headingTop={true} />
      </section>
    </div>
  );
}

export default Courses;
