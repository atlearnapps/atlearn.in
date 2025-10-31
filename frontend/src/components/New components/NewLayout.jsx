import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Navbar from "src/pages/New pages/navbar/Navbar";
import atlearn_logo from "src/assets/images/Logo/atlearnSecondLogo.svg";
import ThemeController from "./Layout/Theme/ThemeController";
import ScrollUpButton from "./Layout/ScrollUpButton";
import HelpButton from "./Layout/HelpButton";
import { useSocialNavigate } from "src/utils/Navigation/useSocialNavigate";
import { useSelector } from "react-redux";
import MeetingDemoModal from "./Modal/MeetingDemoModal";
import WhatsAppButton from "./Layout/WhatsAppButton";
import { useHandleNavigate } from "src/utils/Navigation/useHandleNavigate";
function NewLayout() {
  const handleSocialNavigate = useSocialNavigate();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [demoPopupOpen, setDemoPopupOpen] = useState(false);
  const handleNavigate = useHandleNavigate();
  const handleFreeDemoOpen = () => {
    if (user) {
      navigate("/room");
    } else {
      setDemoPopupOpen(true);
    }
  };
  const handleFreeDemoClose = () => {
    setDemoPopupOpen(false);
  };
  return (
    <div className="relative font-inter font-normal text-base leading-[1.8] bg-bodyBg dark:bg-bodyBg-dark z-0">
      {/* <Preloader /> */}

      <div>
        <div className="fixed-shadow left-[-250px]"></div>
        <div className="fixed-shadow right-[-250px]"></div>
      </div>

      <ThemeController />

      {/* <ChatBox /> */}

      <HelpButton />

      <WhatsAppButton />

      <ScrollUpButton />

      <Navbar />

      <Outlet />

      <footer className="bg-darkblack">
        <div className="container-fluid-2  pb-5 lg:pb-10">
          {/* footer main */}

          <section>
            <div className="grid grid-cols-12 gap-30px md:gap-y-5 lg:gap-y-0 pt-60px pb-50px md:pt-30px md:pb-30px lg:pt-50px lg:pb-20">
              {/* left */}
              <div
                className="col-start-1 col-span-12 md:col-span-6 lg:col-span-3 mr-30px"
                data-aos="fade-up"
              >
                <a href="/" title="atlearn">
                  <img src={atlearn_logo} alt="logo" title="logo" />
                </a>
                <p className="text-base lg:text-sm 2xl:text-base text-darkgray mb-10px leading-1.8 2xl:leading-1.8">
                  At Atlearn, we're transforming education with an all-in-one
                  online classroom platform that integrates essential tools for
                  students and educators, delivering an immersive and intuitive
                  learning experience.
                </p>
                <ul className="flex gap-3 lg:gap-2 2xl:gap-3 mb-10px">
                  <li>
                    <button
                      onClick={() => {
                        handleSocialNavigate(
                          "https://www.facebook.com/Atlearn.in"
                        );
                      }}
                      className=" cursor-pointer w-[40.19px] lg:w-[35px] 2xl:w-[40.19px] h-[37px] lg:h-[35px] 2xl:h-[37px] flex items-center justify-center text-whiteColor bg-[#3b5998] hover:bg-[#2d4373] text-center rounded-full transition"
                    >
                      <i className="icofont-facebook" />
                    </button>
                  </li>

                  <li>
                    <button
                      onClick={() =>
                        handleSocialNavigate(
                          "https://www.linkedin.com/company/atlearn"
                        )
                      }
                      className="cursor-pointer w-[40.19px] lg:w-[35px] 2xl:w-[40.19px] h-[37px] lg:h-[35px] 2xl:h-[37px] flex items-center justify-center text-whiteColor bg-[#0077b5] hover:bg-[#005582] text-center rounded-full transition"
                    >
                      <i className="icofont-linkedin" />
                    </button>
                  </li>

                  <li>
                    <button
                      onClick={() =>
                        handleSocialNavigate(
                          "https://www.instagram.com/atlearn_in/"
                        )
                      }
                      className="cursor-pointer w-[40.19px] lg:w-[35px] 2xl:w-[40.19px] h-[37px] lg:h-[35px] 2xl:h-[37px] flex items-center justify-center text-whiteColor bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] hover:opacity-90 text-center rounded-full transition"
                    >
                      <i className="icofont-instagram" />
                    </button>
                  </li>

                  <li>
                    <button
                      onClick={() =>
                        handleSocialNavigate(
                          "https://www.youtube.com/@Atlearn_In/featured"
                        )
                      }
                      className="cursor-pointer w-[40.19px] lg:w-[35px] 2xl:w-[40.19px] h-[37px] lg:h-[35px] 2xl:h-[37px] flex items-center justify-center text-whiteColor bg-[#FF0000] hover:bg-[#cc0000] text-center rounded-full transition"
                    >
                      <i className="icofont-youtube-play" />
                    </button>
                  </li>

                  <li>
                    <button
                      onClick={() =>
                        handleSocialNavigate(
                          "https://in.pinterest.com/atlearnlms/"
                        )
                      }
                      className="cursor-pointer w-[40.19px] lg:w-[35px] 2xl:w-[40.19px] h-[37px] lg:h-[35px] 2xl:h-[37px] flex items-center justify-center text-whiteColor bg-[#E60023] hover:bg-[#b7001c] text-center rounded-full transition"
                    >
                      <i className="icofont-pinterest" />
                    </button>
                  </li>
                </ul>
              </div>

              {/* Policy */}
              <div
                className="col-start-1 col-span-12 md:col-start-7 lg:col-start-4 md:col-span-6 lg:col-span-2"
                data-aos="fade-up"
              >
                <h4 className="text-size-22 font-bold text-whiteColor mb-3">
                  Courses
                </h4>
                <ul className="flex flex-col gap-y-3">
                  <li>
                    <Link
                      to="/all-courses#main"
                      title="Atlearn courses "
                      className="text-darkgray relative hover:text-secondaryColor after:transition-all after:duration-300 after:w-0 after:h-2px after:absolute after:bg-secondaryColor hover:after:w-full after:bottom-0 after:left-0"
                    >
                      Enroll Course
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/tutors"
                      title="Tutors"
                      className="text-darkgray relative hover:text-secondaryColor after:transition-all after:duration-300 after:w-0 after:h-2px after:absolute after:bg-secondaryColor hover:after:w-full after:bottom-0 after:left-0"
                    >
                      Tutors
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/course-management"
                      title="Course Management"
                      className="text-darkgray relative hover:text-secondaryColor after:transition-all after:w-0 after:h-2px after:absolute after:bg-secondaryColor hover:after:w-full after:bottom-0 after:left-0"
                    >
                      Course Management
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/become-a-course-creator"
                      title="Become a Course Creator"
                      className="text-darkgray relative hover:text-secondaryColor after:transition-all after:duration-300 after:w-0 after:h-2px after:absolute after:bg-secondaryColor hover:after:w-full after:bottom-0 after:left-0"
                    >
                      Become a Course Creator
                    </Link>
                  </li>

                  {/* <li>
                    <Link
                      to="/"
                      className="text-darkgray relative hover:text-secondaryColor after:transition-all after:duration-300 after:w-0 after:h-2px after:absolute after:bg-secondaryColor hover:after:w-full after:bottom-0 after:left-0"
                    >
                      Register
                    </Link>
                  </li> */}
                </ul>
              </div>

              {/* Usefull Links */}
              <div
                className="col-start-1 col-span-12 md:col-start-1 lg:col-start-6 md:col-span-6 lg:col-span-2 "
                data-aos="fade-up"
              >
                <h4 className="text-size-22 font-bold text-whiteColor mb-3">
                  Meetings
                </h4>
                <ul className="flex flex-col gap-y-3">
                  <li>
                    <button
                      // onClick={() => handleNavigate("/room?role=Moderator")}
                      onClick={handleFreeDemoOpen}
                      className=" cursor-pointer text-darkgray relative hover:text-secondaryColor after:transition-all after:w-0 after:h-2px after:absolute after:bg-secondaryColor hover:after:w-full after:bottom-0 after:left-0"
                    >
                      Create Meeting
                    </button>
                  </li>

                  <li>
                    <Link
                      to="/join-meetings#main"
                      title="Join Meetings"
                      className="text-darkgray relative hover:text-secondaryColor after:transition-all after:duration-300 after:w-0 after:h-2px after:absolute after:bg-secondaryColor hover:after:w-full after:bottom-0 after:left-0"
                    >
                      Join Meetings
                    </Link>
                  </li>

                  <li>
                    <button
                      onClick={() => handleNavigate("/room?role=Moderator")}
                      className="cursor-pointer text-darkgray relative hover:text-secondaryColor after:transition-all after:duration-300 after:w-0 after:h-2px after:absolute after:bg-secondaryColor hover:after:w-full after:bottom-0 after:left-0"
                    >
                      Invite Students
                    </button>
                  </li>
                </ul>
              </div>

              {/* Quick Links */}
              <div
                className="col-start-1 col-span-12 md:col-start-7 lg:col-start-8 md:col-span-6 lg:col-span-2"
                data-aos="fade-up"
              >
                <h4 className="text-size-22 font-bold text-whiteColor mb-3">
                  Assessments
                </h4>
                <ul className="flex flex-col gap-y-3">
                  <li>
                    <Link
                      to="https://lms.atlearn.in/course/edit.php?category=2"
                      title="Create Quiz"
                      className="text-darkgray relative hover:text-secondaryColor after:transition-all after:duration-300 after:w-0 after:h-2px after:absolute after:bg-secondaryColor hover:after:w-full after:bottom-0 after:left-0"
                    >
                      Create Quiz
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/online-test#main"
                      title="Online Quizzes"
                      className="text-darkgray relative hover:text-secondaryColor after:transition-all after:duration-300 after:w-0 after:h-2px after:absolute after:bg-secondaryColor hover:after:w-full after:bottom-0 after:left-0"
                    >
                      Online Quizzes
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/question-bank"
                      title="Question Bank"
                      className="text-darkgray relative hover:text-secondaryColor after:transition-all after:w-0 after:h-2px after:absolute after:bg-secondaryColor hover:after:w-full after:bottom-0 after:left-0"
                    >
                      Question Bank
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/ai-grading-tool"
                      title="grading tool"
                      className="text-darkgray relative hover:text-secondaryColor after:transition-all after:duration-300 after:w-0 after:h-2px after:absolute after:bg-secondaryColor hover:after:w-full after:bottom-0 after:left-0"
                    >
                      Grading tool
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Recent Post */}
              <div
                className="col-start-1 col-span-12 md:col-start-1 lg:col-start-10 md:col-span-6 lg:col-span-3 pl-0 2xl:pl-50px"
                data-aos="fade-up"
              >
                <h4 className="text-size-22 font-bold text-whiteColor mb-3">
                  Quick Links
                </h4>
                <ul className="flex flex-col gap-y-3">
                  <li>
                    <button
                      // onClick={() =>
                      //   handleNavigate("/room?open=true&type=training")
                      // }
                      onClick={() => {
                        navigate("/tutorial");
                      }}
                      className=" cursor-pointer text-darkgray relative hover:text-secondaryColor after:transition-all after:duration-300 after:w-0 after:h-2px after:absolute after:bg-secondaryColor hover:after:w-full after:bottom-0 after:left-0"
                    >
                      How to Guide
                    </button>
                  </li>
                  <li>
                    <Link
                      to="/pricing"
                      title="Pricing"
                      className="text-darkgray relative hover:text-secondaryColor after:transition-all after:duration-300 after:w-0 after:h-2px after:absolute after:bg-secondaryColor hover:after:w-full after:bottom-0 after:left-0"
                    >
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact"
                      title="Contact Us"
                      className="text-darkgray relative hover:text-secondaryColor after:transition-all after:duration-300 after:w-0 after:h-2px after:absolute after:bg-secondaryColor hover:after:w-full after:bottom-0 after:left-0"
                    >
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </section>
          <div>
            <div className="flex justify-start lg:justify-center items-center">
              <div>
                <ul className=" text-sm flex flex-col lg:flex-row gap-3 lg:items-center">
                  <li>
                    <Link
                      to="/terms-and-conditions"
                      title="Terms & Conditions"
                      className="text-sm text-darkgray relative hover:text-secondaryColor after:transition-all after:duration-300 after:w-0 after:h-2px after:absolute after:bg-secondaryColor hover:after:w-full after:bottom-0 after:left-0"
                    >
                      Terms & Conditions
                    </Link>
                  </li>
                  <div className="hidden lg:block border-l-2 border-black-500 h-4"></div>
                  <li>
                    <Link
                      to="/privacy-policy"
                      title="Privacy"
                      className="text-sm text-darkgray relative hover:text-secondaryColor after:transition-all after:duration-300 after:w-0 after:h-2px after:absolute after:bg-secondaryColor hover:after:w-full after:bottom-0 after:left-0"
                    >
                      Privacy
                    </Link>
                  </li>
                  <div className="hidden lg:block border-l-2 border-black-500 h-4"></div>
                  <li>
                    <Link
                      to="/pricing-policy"
                      title="Pricing Policy"
                      className="text-sm text-darkgray relative hover:text-secondaryColor after:transition-all after:duration-300 after:w-0 after:h-2px after:absolute after:bg-secondaryColor hover:after:w-full after:bottom-0 after:left-0"
                    >
                      Pricing Policy
                    </Link>
                  </li>
                  <div className="hidden lg:block border-l-2 border-black-500 h-4"></div>
                  <li>
                    <Link
                      to="/cancellation-refund-policy"
                      title="Cancellation/Refund"
                      className="text-sm text-darkgray relative hover:text-secondaryColor after:transition-all after:duration-300 after:w-0 after:h-2px after:absolute after:bg-secondaryColor hover:after:w-full after:bottom-0 after:left-0"
                    >
                      Cancellation/Refund
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Full-Width Line */}
            <div className="border-t border-darkcolor my-4"></div>

            <div>
              <p className=" text-sm text-whiteColor text-center mt-2">
                Copyright © 2025 Akratech Pvt. Ltd. All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
      <MeetingDemoModal
        open={demoPopupOpen}
        handleClose={handleFreeDemoClose}
      />
    </div>
  );
}

export default NewLayout;
