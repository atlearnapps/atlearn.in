import axios from "axios";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useLocation } from "react-router-dom";
import {
  customCourseToken,
  customFeedbackToken,
  customLessonToken,
  customQuizToken,
  // lessonToken,
  // quizToken,
} from "src/apiClients/token";
import { FaShareAlt } from "react-icons/fa";
import DefaultUserImage from "src/assets/images/User/user-profile-icon-vector-avatar-600nw-2247726673.webp";
import {
  FacebookShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  WhatsappIcon,
  FacebookIcon,
  TelegramIcon,
  LinkedinIcon,
  EmailShareButton,
  EmailIcon,
} from "react-share";
import { Menu, MenuItem, useMediaQuery, useTheme } from "@mui/material";
import SkeletonLoader from "src/components/New components/Loader/SkeletonLoader";
import formatDurationFromSeconds from "src/utils/formatDurationFromSeconds";
function CourseDetails() {
  const [course, setCourse] = useState(null);
  const location = useLocation();
  const pageUrl = window.location.href;
  const queryParams = new URLSearchParams(location.search);
  const course_Id = parseInt(queryParams.get("course_id"), 10);
  // const [userData, setUserData] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [popularCourses, setPopularCourses] = useState([]);
  const [activeTab, setActiveTab] = useState("description");
  // const [shareUrl, setShareUrl] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const [isLoading, setIsLoading] = useState(false);
  const [totalDuration, setTotalDuration] = useState(0);

  useEffect(() => {
    if (location.hash) {
      const section = document.querySelector(location.hash);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);
  useEffect(() => {
    const fetchCourseById = async (id) => {
      setIsLoading(true);
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        // url: `https://lms.atlearn.in/webservice/rest/server.php?wstoken=${courseToken}&wsfunction=core_course_get_courses_by_field&moodlewsrestformat=json`,
        // headers: {
        //   Cookie: "MoodleSession=0olf6pmhf7crek67hdfr2b5g9u",
        // },
        url: `https://lms.atlearn.in/webservice/rest/server.php?wstoken=${customCourseToken}&wsfunction=local_courseapi_execute&moodlewsrestformat=json`,
        headers: {},
      };

      try {
        const response = await axios.request(config);
        const fetchedCourses = response.data || [];

        // Find the specific course by course_id
        const specificCourse = fetchedCourses.find(
          (course) => course.id === id
        );

        if (specificCourse) {
          setCourse(specificCourse);
          // fetchData(specificCourse);
          // fetchLessons(specificCourse);
          fetchQuizzes(specificCourse);
          const exceptSepecificCourses = fetchedCourses.filter(
            (course) =>
              course.id !== id &&
              course.categoryname.trim() !== "" &&
              course.categoryname !== "Practical Test"
          );

          setPopularCourses(exceptSepecificCourses || []);
          setIsLoading(false);
        } else {
          console.log(`Course with ID ${id} not found.`);
        }
      } catch (error) {
        setIsLoading(false);
        console.log("Error fetching course:", error);
      }
    };

    fetchCourseById(course_Id);
    fetchReviews(course_Id);
    fetchLessons(course_Id);
  }, [course_Id]);

  useEffect(() => {
    const tabs = document.querySelectorAll(".tab");

    tabs.forEach((tab) => {
      const tabLinks = Array.from(tab.querySelectorAll(".tab-links > *"));
      const tabContents = Array.from(tab.querySelectorAll(".tab-contents > *"));

      tabLinks.forEach((tabLink, index) => {
        tabLink.addEventListener("click", () => {
          // Remove active styles from all tabs
          tabLinks.forEach((link) => {
            link.classList.remove(
              "!bg-primaryColor",
              "!text-white",
              "!shadow-lg"
            );
            link.classList.add(
              "bg-lightGrey7",
              "dark:bg-lightGrey7-dark",
              "inActive"
            );
            const span = link.querySelector("span");
            if (span) span.classList.replace("w-full", "w-0");
            link.disabled = false;
          });

          // Add active styles to the clicked tab
          tabLink.classList.add(
            "!bg-primaryColor",
            "!text-white",
            "!shadow-lg"
          );
          tabLink.disabled = true;
          const span = tabLink.querySelector("span");
          if (span) span.classList.replace("w-0", "w-full");

          // Update tab content visibility
          tabContents.forEach((tabContent, idx) => {
            tabContent.classList.toggle("hidden", idx !== index);
            tabContent.classList.toggle("block", idx === index);
            tabContent.classList.toggle("opacity-100", idx === index);
          });

          // Handle accordion content height (if applicable)
          const accordion = tab.querySelector(".accordion.active");
          if (accordion) {
            const contents = accordion.querySelector(".accordion-content");
            if (contents?.children[index]) {
              contents.style.height = `${contents.children[index].offsetHeight}px`;
            }
          }
        });
      });
    });

    // Cleanup event listeners on unmount
    return () => {
      tabs.forEach((tab) => {
        const tabLinks = Array.from(tab.querySelectorAll(".tab-links > *"));
        tabLinks.forEach((tabLink) => {
          tabLink.removeEventListener("click", () => {});
        });
      });
    };
  }, [isLoading]);

  const handleClick = (event, url) => {
    // setShareUrl("https://staging.atlearn.in/course-details?course_id=14");
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // const fetchLessons = async (specificCourse) => {
  //   try {
  //     const config = {
  //       method: "get",
  //       maxBodyLength: Infinity,
  //       url: `https://lms.atlearn.in/webservice/rest/server.php?wstoken=${lessonToken}&wsfunction=mod_lesson_get_lessons_by_courses&moodlewsrestformat=json`,
  //     };

  //     const response = await axios.request(config);
  //     const fetchedLessons = response.data.lessons || [];
  //     const specificLessons = fetchedLessons.filter(
  //       (lesson) => specificCourse.id === lesson?.course
  //     );
  //     setLessons(specificLessons || []);
  //   } catch (err) {}
  // };

  const fetchLessons = async (id) => {
    try {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `https://lms.atlearn.in/webservice/rest/server.php?wstoken=${customLessonToken}&wsfunction=local_lessonapi_get_course_lessons&moodlewsrestformat=json&courseid=${id}`,
        headers: {},
      };

      const response = await axios.request(config);
      const fetchedLessons = response?.data?.lessons || [];
      const fetchedTotalDuration = response?.data?.totalavailabilityduration;
      setTotalDuration(fetchedTotalDuration || 0);
      setLessons(fetchedLessons || []);
    } catch (err) {}
  };

  const fetchReviews = async (id) => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://lms.atlearn.in/webservice/rest/server.php?wstoken=${customFeedbackToken}&wsfunction=local_feedbackapi_get_course_feedback&moodlewsrestformat=json&courseid=${id}`,
      headers: {},
    };
    const response = await axios.request(config);

    const fetchedReviews = response.data.feedbacks || [];

    // const allAnswers = feedbackData.feedbacks.flatMap((feedback) =>
    //   feedback.responses.flatMap((response) =>
    //     response.answers.map((answer) => answer.value)
    //   )
    // );
    // const responses = feedbackData.feedbacks.flatMap(
    //   (feedback) => feedback.responses
    // );
    const feedbackList = fetchedReviews.flatMap((feedback) =>
      feedback.responses.flatMap((response) =>
        response.answers.map((answer) => ({
          name: response.fullname,
          value: answer.value,
          profileimage: response.profileimage,
          feedbacktime: response.feedbacktime,
        }))
      )
    );
    setReviews(feedbackList || []);
  };

  const fetchQuizzes = async (specificCourse) => {
    try {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        // url: `https://lms.atlearn.in/webservice/rest/server.php?wstoken=${quizToken}&wsfunction=mod_quiz_get_quizzes_by_courses&moodlewsrestformat=json`,
        url: `https://lms.atlearn.in/webservice/rest/server.php?wstoken=${customQuizToken}&wsfunction=local_coursequizzes_get_all_quizzes&moodlewsrestformat=json`,
        headers: {},
      };

      const response = await axios.request(config);
      const fetchedQuiz = response.data || [];
      const specificQuiz = fetchedQuiz.filter(
        (quiz) => specificCourse.id === quiz?.courseid
      );
      setQuizzes(specificQuiz || []);
    } catch (err) {}
  };

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
    const options = { year: "numeric", month: "short", day: "2-digit" };
    return date.toLocaleDateString("en-GB", options);
  }

  // function formatTimeDifference(available, deadline) {
  //   // Calculate the difference in seconds
  //   const diffInSeconds = deadline - available;

  //   // Ensure the difference is positive
  //   if (diffInSeconds < 0) {
  //     return "Invalid time range";
  //   }

  //   // Convert seconds to hours and minutes
  //   const hours = Math.floor(diffInSeconds / 3600);
  //   const minutes = Math.floor((diffInSeconds % 3600) / 60);

  //   // Format the output
  //   if (hours > 0) {
  //     return `${hours} hrs ${minutes} min`;
  //   } else {
  //     return `${minutes} min`;
  //   }
  // }

  // function calculateTimeDifference(startTimestamp, endTimestamp) {
  //   const startDate = new Date(startTimestamp * 1000);
  //   const endDate = new Date(endTimestamp * 1000);

  //   const difference = endDate - startDate;

  //   const days = Math.floor(difference / (1000 * 60 * 60 * 24));

  //   if (days >= 1) {
  //     return `${days} day${days > 1 ? "s" : ""}`;
  //   }

  //   const hours = Math.floor(difference / (1000 * 60 * 60));
  //   const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

  //   return `${hours} hr${hours !== 1 ? "s" : ""} ${minutes} min`;
  // }

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    // If the same index is clicked, close it; otherwise, open it
    setActiveIndex((prev) => (prev === index ? null : index));
  };
  return (
    <div>
      <Helmet>
        <title>Dive Deep into Comprehensive Atlearn Course Details</title>
        <meta
          name="description"
          content="Explore in-depth details about Atlearn's courses. Discover content, structure, and benefits to find the right fit for your learning journey."
        />
        <link rel="canonical" href="https://www.atlearn.in" />
      </Helmet>

      {/* banner section */}
      <section>
        {/* banner section */}
        <div className="bg-darkdeep1 dark:bg-lightGrey10-dark relative z-0 overflow-y-visible py-50px">
          <div>
            <img
              className="absolute left-1/2 bottom-[15%] animate-spin-slow"
              src="./assets/images/register/register__2.png"
              alt=""
            />
            <img
              className="absolute left-[42%] sm:left-[65%] md:left-[42%] lg:left-[5%] top-[4%] sm:top-[1%] md:top-[4%] lg:top-[10%] animate-move-hor"
              src="./assets/images/herobanner/herobanner__6.png"
              alt=""
            />
            <img
              className="absolute right-[5%] bottom-[15%]"
              src="./assets/images/herobanner/herobanner__7.png"
              alt=""
            />
            <img
              className="absolute top-[5%] left-[45%] hidden md:block"
              src="./assets/images/herobanner/herobanner__7.png"
              alt=""
            />
          </div>
          <div className="container">
            <div>
              <ul className="flex gap-1">
                <li>
                  <Link
                    to={"/all-courses"}
                    className="text-lg text-whiteColor dark:text-blackColor2-dark hover:text-secondaryColor"
                  >
                    Home <i className="icofont-simple-right" />
                  </Link>
                </li>
                <li>
                  <span className="text-lg text-whiteColor dark:text-blackColor2-dark">
                    {course?.fullname}
                  </span>
                </li>
              </ul>

              <div
                id="course"
                className="pt-70px flex flex-col lg:flex-row lg-items-center"
              >
                <div className=" w-full  ">
                  {/* titile */}
                  {isLoading ? (
                    <SkeletonLoader
                      width="w-1/4"
                      height="h-10 md:h-12"
                      className="mb-15px"
                    />
                  ) : (
                    <div className="w-full lg:w-2/5">
                      <div
                        className="flex items center gap-6 mb-30px"
                        data-aos="fade-up"
                      >
                        <button className="text-sm text-whiteColor bg-primaryColor border border-primaryColor px-26px py-0.5 leading-23px font-semibold hover:text-primaryColor hover:bg-whiteColor rounded inline-block dark:hover:bg-whiteColor-dark dark:hover:text-whiteColor">
                          Featured
                        </button>
                        <button className="text-sm text-whiteColor bg-secondaryColor border border-secondaryColor px-22px py-0.5 leading-23px font-semibold hover:text-secondaryColor hover:bg-whiteColor rounded inline-block dark:hover:bg-whiteColor-dark dark:hover:text-secondaryColor">
                          Data & Tech
                        </button>
                      </div>
                      <h4
                        className="  text-size-32 md:text-4xl font-bold text-whiteColor dark:text-blackColor-dark mb-15px leading-43px md:leading-14.5"
                        data-aos="fade-up"
                      >
                        {course?.fullname}
                      </h4>
                    </div>
                  )}

                  {/* price and rating */}
                  {isLoading ? (
                    <div
                      className="flex flex-col lg:flex-row lg:items-center gap-5 mb-30px"
                      data-aos="fade-up"
                    >
                      <div className="flex items-center gap-5 lg:w-2/5">
                        <div className="flex items-center gap-2">
                          <SkeletonLoader
                            width="w-5"
                            height="h-5"
                            className="rounded"
                          />
                          <SkeletonLoader width="w-20" height="h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            <SkeletonLoader width="w-24" height="h-5" />
                          </p>
                        </div>
                      </div>
                      <div>
                        <SkeletonLoader
                          width="w-32"
                          height="h-10"
                          className="rounded"
                        />
                      </div>
                    </div>
                  ) : (
                    <div
                      className="flex flex-col lg:flex-row lg-items-center gap-5   mb-30px"
                      data-aos="fade-up"
                    >
                      <div className="flex items-center gap-5 lg:w-2/5">
                        <div className="flex items-center">
                          <div>
                            <i className="icofont-book-alt pr-5px text-whiteColor text-sm" />
                          </div>
                          <div>
                            <span className="text-sm text-whiteColor dark:text-blackColor-dark font medium">
                              {lessons?.length} Lesson
                            </span>
                          </div>
                        </div>
                        <div className="text-start md:text-end">
                          <i className="icofont-star text-size-15 text-yellow" />
                          <i className="icofont-star text-size-15 text-yellow" />
                          <i className="icofont-star text-size-15 text-yellow" />
                          <i className="icofont-star text-size-15 text-yellow" />
                          <i className="icofont-star text-size-15 text-yellow" />
                          <span className="text-xs text-whiteColor dark:text-blackColor-dark">
                            (44)
                          </span>
                        </div>
                        <div>
                          <p className="text-sm text-whiteColor dark:text-contentColor-dark font-medium">
                            Last Update:
                            <span className="text-whiteColor dark:text-blackColor-dark">
                              {formatTimestamp(course?.timemodified)}
                            </span>
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleClick(e)}
                        className="flex items-center gap-2 text-lg font-semibold text-whiteColor hover:text-blue-600 transition"
                      >
                        <FaShareAlt className="text-xl" />
                        <span>Invite Students</span>
                      </button>
                    </div>
                  )}
                </div>
                {/* <div class=" flex-1 ...">share/Invite People</div> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      <>
        {/*course details section */}

        <section>
          <div className="container py-10 md:py-50px lg:py-60px 2xl:py-100px">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-30px">
              <div className="lg:col-start-1 lg:col-span-8 space-y-[35px]">
                {/* course 1 */}
                <div data-aos="fade-up">
                  {/* course content */}
                  <div>
                    {/* course tab */}
                    {isLoading ? (
                      <>
                        <div className="flex  items-center gap-1">
                          {[1, 2, 3, 4].map((_, index) => (
                            // <div
                            //   key={index}
                            //   className="w-32 h-10 bg-gray-200 animate-pulse rounded-lg"
                            // ></div>
                            <SkeletonLoader
                              key={index}
                              height="h-12"
                              width="w-32"
                            />
                          ))}
                        </div>
                        <SkeletonLoader
                          height="h-40"
                          width="w-full"
                          className="mt-2"
                        />
                      </>
                    ) : (
                      <div
                        data-aos="fade-up"
                        className="tab course-details-tab"
                      >
                        <div className="tab-links flex flex-wrap md:flex-nowrap mb-30px rounded gap-0.5">
                          <button
                            onClick={() => setActiveTab("curriculum")}
                            className={`is-checked relative p-10px md:px-25px md:py-15px lg:py-3 2xl:py-15px 2xl:px-45px text-blackColor bg-whiteColor hover:bg-primaryColor hover:text-whiteColor shadow-overview-button dark:bg-whiteColor-dark dark:text-blackColor-dark dark:hover:bg-primaryColor dark:hover:text-whiteColor flex items-center ${
                              activeTab === "curriculum"
                                ? "!bg-primaryColor !text-white !shadow-lg"
                                : ""
                            }`}
                          >
                            <i className="icofont-book-alt mr-2" /> Curriculum
                          </button>
                          <button
                            onClick={() => setActiveTab("description")}
                            className={`is-checked relative p-10px md:px-25px md:py-15px lg:py-3 2xl:py-15px 2xl:px-45px text-blackColor bg-whiteColor hover:bg-primaryColor hover:text-whiteColor shadow-overview-button dark:bg-whiteColor-dark dark:text-blackColor-dark dark:hover:bg-primaryColor dark:hover:text-whiteColor flex items-center ${
                              activeTab === "description"
                                ? "!bg-primaryColor !text-white !shadow-lg"
                                : ""
                            }`}
                          >
                            <i className="icofont-paper mr-2" /> Description
                          </button>
                          <button
                            onClick={() => setActiveTab("reviews")}
                            className={`is-checked relative p-10px md:px-25px md:py-15px lg:py-3 2xl:py-15px 2xl:px-45px text-blackColor bg-whiteColor hover:bg-primaryColor hover:text-whiteColor shadow-overview-button dark:bg-whiteColor-dark dark:text-blackColor-dark dark:hover:bg-primaryColor dark:hover:text-whiteColor flex items-center ${
                              activeTab === "reviews"
                                ? "!bg-primaryColor !text-white !shadow-lg"
                                : ""
                            }`}
                          >
                            <i class="icofont-star mr-2"></i> Reviews
                          </button>
                          <button
                            onClick={() => setActiveTab("instructor")}
                            className={`is-checked relative p-10px md:px-25px md:py-15px lg:py-3 2xl:py-15px 2xl:px-45px text-blackColor bg-whiteColor hover:bg-primaryColor hover:text-whiteColor shadow-overview-button dark:bg-whiteColor-dark dark:text-blackColor-dark dark:hover:bg-primaryColor dark:hover:text-whiteColor flex items-center ${
                              activeTab === "instructor"
                                ? "!bg-primaryColor !text-white !shadow-lg"
                                : ""
                            }`}
                          >
                            <i className="icofont-teacher mr-2" /> Instructor
                          </button>
                        </div>
                        <div className="tab-contents">
                          {/* curriculum */}
                          <div className="hidden">
                            {/* Curriculum */}
                            <div>
                              <ul className="accordion-container curriculum">
                                {/* Lessons */}
                                <li
                                  className={`accordion mb-25px overflow-hidden ${
                                    activeIndex === 0 ? "active" : ""
                                  }`}
                                >
                                  <div className="bg-whiteColor border border-borderColor dark:bg-whiteColor-dark dark:border-borderColor-dark rounded-t-md">
                                    <div
                                      className="cursor-pointer accordion-controller flex justify-between items-center text-xl text-headingColor font-bold w-full px-5 py-18px dark:text-headingColor-dark"
                                      onClick={() => toggleAccordion(0)}
                                    >
                                      <span>Lessons</span>
                                      <svg
                                        className={`transition-all duration-500 ${
                                          activeIndex === 0
                                            ? "rotate-180"
                                            : "rotate-0"
                                        }`}
                                        width={20}
                                        viewBox="0 0 16 16"
                                        fill="#212529"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                                        />
                                      </svg>
                                    </div>
                                    {/* Content */}
                                    <div
                                      className={`accordion-content transition-all duration-500 ${
                                        activeIndex === 0 ? "h-auto" : "h-0"
                                      } overflow-hidden`}
                                    >
                                      <div className="content-wrapper p-10px md:px-30px">
                                        {lessons?.length > 0 ? (
                                          <ul>
                                            {lessons?.map((item, index) => (
                                              <li
                                                key={index}
                                                className="py-4 flex items-center justify-between flex-wrap border-b border-borderColor dark:border-borderColor-dark"
                                              >
                                                <div>
                                                  <h4 className="text-blackColor dark:text-blackColor-dark leading-1 font-light">
                                                    <i className="icofont-file-text mr-10px" />
                                                    <span className="font-medium mr-10px">
                                                      Lesson {index + 1} :
                                                    </span>
                                                    {item?.name}
                                                  </h4>
                                                </div>
                                                {item?.timelimit && (
                                                  <div className="text-blackColor dark:text-blackColor-dark text-sm flex items-center">
                                                    <p>
                                                      <i className="icofont-clock-time mr-[5px]" />
                                                      {/* {formatTimeDifference(
                                                          item?.available,
                                                          item?.deadline
                                                        )} */}
                                                      {formatDurationFromSeconds(
                                                        item?.timelimit
                                                      )}
                                                    </p>
                                                  </div>
                                                )}
                                              </li>
                                            ))}
                                          </ul>
                                        ) : (
                                          <div className="container mt-20 mb-20 text-center p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                                              No lessons available at the
                                              moment. Please check back later.
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </li>

                                {/* Quiz */}
                                <li
                                  className={`accordion mb-25px overflow-hidden ${
                                    activeIndex === 1 ? "active" : ""
                                  }`}
                                >
                                  <div className="bg-whiteColor border border-borderColor dark:bg-whiteColor-dark dark:border-borderColor-dark">
                                    <div
                                      className="cursor-pointer accordion-controller flex justify-between items-center text-xl text-headingColor font-bold w-full px-5 py-18px dark:text-headingColor-dark"
                                      onClick={() => toggleAccordion(1)}
                                    >
                                      <span>Quiz</span>
                                      <svg
                                        className={`transition-all duration-500 ${
                                          activeIndex === 1
                                            ? "rotate-180"
                                            : "rotate-0"
                                        }`}
                                        width={20}
                                        viewBox="0 0 16 16"
                                        fill="#212529"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                                        />
                                      </svg>
                                    </div>
                                    {/* Content */}
                                    <div
                                      className={`accordion-content transition-all duration-500 ${
                                        activeIndex === 1 ? "h-auto" : "h-0"
                                      } overflow-hidden`}
                                    >
                                      <div className="content-wrapper p-10px md:px-30px">
                                        {quizzes?.length > 0 ? (
                                          <ul>
                                            {quizzes?.map((quiz, index) => (
                                              <li
                                                key={index}
                                                className="py-4 flex items-center justify-between flex-wrap border-b border-borderColor dark:border-borderColor-dark"
                                              >
                                                <div>
                                                  <h4 className="text-blackColor dark:text-blackColor-dark leading-1 font-light">
                                                    <i className="icofont-file-text mr-10px" />
                                                    <span className="font-medium mr-10px">
                                                      Quiz {index + 1} :
                                                    </span>
                                                    {quiz?.name}
                                                  </h4>
                                                </div>
                                                <div className="text-contentColor dark:text-contentColor-dark text-sm">
                                                  <p>
                                                    <i className="icofont-lock" />
                                                  </p>
                                                </div>
                                              </li>
                                            ))}
                                          </ul>
                                        ) : (
                                          <div className="container mt-20 mb-20 text-center p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                                              No quizzes available at the
                                              moment. Please check back later.
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </div>
                          {/* description */}
                          <div>
                            <p
                              className="text-lg  mb-25px !leading-30px dark:text-blackColor-dark"
                              data-aos="fade-up"
                              dangerouslySetInnerHTML={{
                                __html: course?.summary,
                              }}
                            />
                          </div>

                          <>
                            {/* reviews  */}
                            <div className="hidden">
                              {/* <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-x-30px gap-y-5">
                                <div className="lg:col-start-1 lg:col-span-4 px-10px py-30px bg-whiteColor dark:bg-whiteColor-dark shadow-review text-center">
                                  <p className="text-7xl font-extrabold text-blackColor dark:text-blackColor-dark leading-90px">
                                    5.0
                                  </p>
                                  <div className="text-secondaryColor">
                                    <i className="icofont-star" />
                                    <i className="icofont-star" />
                                    <i className="icofont-star" />
                                    <i className="icofont-star" />
                                    <i className="icofont-star" />
                                  </div>
                                  <p className="text-blackColor dark:text-blackColor-dark leading-26px font-medium">
                                    (17 Reviews)
                                  </p>
                                </div>
                               
                                <div className="lg:col-start-5 lg:col-span-8 px-15px">
                                  <ul className="flex flex-col gap-y-3">
                                    <li className="flex items-center text-blackColor dark:text-blackColor-dark">
                                      <div>
                                        <span>5</span>
                                        <span>
                                          <i className="icofont-star text-secondaryColor" />
                                        </span>
                                      </div>
                                      <div className="flex-grow relative mx-10px md:mr-10 lg:mr-10px">
                                        <span className="h-10px w-full bg-borderColor dark:bg-borderColor-dark rounded-full block" />
                                        <span className="absolute left-0 top-0 h-10px w-full bg-secondaryColor rounded-full" />
                                      </div>
                                      <div>
                                        <span>10</span>
                                      </div>
                                    </li>
                                    <li className="flex items-center text-blackColor dark:text-blackColor-dark">
                                      <div>
                                        <span>4</span>
                                        <span>
                                          <i className="icofont-star text-secondaryColor" />
                                        </span>
                                      </div>
                                      <div className="flex-grow relative mx-10px md:mr-10 lg:mr-10px">
                                        <span className="h-10px w-full bg-borderColor dark:bg-borderColor-dark rounded-full block" />
                                        <span className="absolute left-0 top-0 h-10px w-4/5 bg-secondaryColor rounded-full" />
                                      </div>
                                      <div>
                                        <span>5</span>
                                      </div>
                                    </li>
                                    <li className="flex items-center text-blackColor dark:text-blackColor-dark">
                                      <div>
                                        <span>3</span>
                                        <span>
                                          <i className="icofont-star text-secondaryColor" />
                                        </span>
                                      </div>
                                      <div className="flex-grow relative mx-10px md:mr-10 lg:mr-10px">
                                        <span className="h-10px w-full bg-borderColor dark:bg-borderColor-dark rounded-full block" />
                                        <span className="absolute left-0 top-0 h-10px w-60% bg-secondaryColor rounded-full" />
                                      </div>
                                      <div>
                                        <span>3</span>
                                      </div>
                                    </li>
                                    <li className="flex items-center text-blackColor dark:text-blackColor-dark">
                                      <div>
                                        <span>2</span>
                                        <span>
                                          <i className="icofont-star text-secondaryColor" />
                                        </span>
                                      </div>
                                      <div className="flex-grow relative mx-10px md:mr-10 lg:mr-10px">
                                        <span className="h-10px w-full bg-borderColor dark:bg-borderColor-dark rounded-full block" />
                                        <span className="absolute left-0 top-0 h-10px w-30% bg-secondaryColor rounded-full" />
                                      </div>
                                      <div>
                                        <span>2</span>
                                      </div>
                                    </li>
                                    <li className="flex items-center text-blackColor dark:text-blackColor-dark">
                                      <div>
                                        <span>1</span>
                                        <span>
                                          <i className="icofont-star text-secondaryColor" />
                                        </span>
                                      </div>
                                      <div className="flex-grow relative mx-10px md:mr-10 lg:mr-10px">
                                        <span className="h-10px w-full bg-borderColor dark:bg-borderColor-dark rounded-full block" />
                                        <span className="absolute left-0 top-0 h-10px w-10% bg-secondaryColor rounded-full" />
                                      </div>
                                      <div>
                                        <span>1</span>
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              </div> */}

                              {/* client reviews */}
                              {reviews && reviews?.length > 0 ? (
                                <div className="mt-60px mb-10">
                                  <h4 className="text-lg text-blackColor dark:text-blackColor-dark font-bold pl-2 before:w-0.5 relative before:h-[21px] before:bg-secondaryColor before:absolute before:bottom-[5px] before:left-0 leading-1.2 mb-25px">
                                    Customer Reviews
                                  </h4>
                                  <ul>
                                    {reviews?.map((review, index) => (
                                      <li
                                        key={index}
                                        className="flex gap-30px pt-35px border-t border-borderColor2 dark:border-borderColor2-dark"
                                      >
                                        <div className="flex-shrink-0">
                                          <div>
                                            <img
                                              // src={DefaultUserImage}
                                              src={
                                                review?.profileimage ||
                                                DefaultUserImage
                                              }
                                              alt=""
                                              className="w-25 h-25 rounded-full"
                                            />
                                          </div>
                                        </div>
                                        <div className="flex-grow">
                                          <div className="flex justify-between">
                                            <div>
                                              <h4>
                                                <span className="text-lg font-semibold text-blackColor  dark:text-blackColor-dark dark:hover:text-condaryColor leading-1.2">
                                                  {review?.name}
                                                </span>
                                              </h4>
                                              <div className="text-secondaryColor leading-1.8">
                                                <i className="icofont-star" />
                                                <i className="icofont-star" />
                                                <i className="icofont-star" />
                                                <i className="icofont-star" />
                                                <i className="icofont-star" />
                                              </div>
                                            </div>
                                            <div className="author__icon">
                                              <p className="text-sm font-bold text-blackColor dark:text-blackColor-dark leading-9 px-25px mb-5px border-2 border-borderColor2 dark:border-borderColo2-dark hover:border-secondaryColor dark:hover:border-secondaryColor rounded-full transition-all duration-300">
                                                {/* September 2, 2024 */}
                                                {formatTimestamp(
                                                  review?.feedbacktime
                                                )}
                                              </p>
                                            </div>
                                          </div>

                                          <p
                                            key={index}
                                            dangerouslySetInnerHTML={{
                                              __html: review.value,
                                            }}
                                            className="text-sm text-contentColor dark:text-contentColor-dark leading-23px mb-15px"
                                          ></p>
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ) : (
                                <div className="container mt-20 mb-20 text-center p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                                    No reviews available at the moment. Please
                                    check back later.
                                  </p>
                                </div>
                              )}
                            </div>
                          </>

                          <div className="hidden">
                            <div
                              className="p-5 md:p-30px lg:p-5 2xl:p-30px mb-30px flex flex-col md:flex-row shadow-autor"
                              data-aos="fade-up"
                            >
                              {/* athor avatar */}
                              <div className="flex mb-30px mr-5 flex-shrink-0">
                                <img
                                  // src="./assets/images/blog/blog_10.png"
                                  src={course?.creatorimage}
                                  alt=""
                                  className="w-24 h-24 rounded-full"
                                />
                              </div>
                              <div>
                                {/* author name */}
                                <div className="mb-3">
                                  <h3 className="mb-7px">
                                    <Link
                                      to={`/tutor-details?tutor_Id=${course?.creatorid}`}
                                      className="text-xl font-bold text-blackColor2 dark:text-blackColor2-dark hover:text-primaryColor dark:hover:text-primaryColor"
                                    >
                                      {course?.creatorname}
                                    </Link>
                                  </h3>
                                  <p className="text-xs text-contentColor2 dark:text-contentColor2-dark">
                                    Teacher
                                  </p>
                                </div>
                                {/* description */}
                                <p
                                  dangerouslySetInnerHTML={{
                                    __html: course?.creatorbio,
                                  }}
                                  className="text-sm  dark:text-contentColor-dark mb-15px leading-26px"
                                />

                                {/* social */}
                                {/* <div>
                                <ul className="flex gap-10px items-center">
                                  <li>
                                    <a
                                      href="/"
                                      className="w-35px h-35px leading-35px text-center border border-borderColor2 text-contentColor hover:text-whiteColor hover:bg-primaryColor dark:text-contentColor-dark dark:hover:text-whiteColor dark:hover:bg-primaryColor dark:border-borderColor2-dark rounded"
                                    >
                                      <i className="icofont-facebook" />
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      href="/"
                                      className="w-35px h-35px leading-35px text-center border border-borderColor2 text-contentColor hover:text-whiteColor hover:bg-primaryColor dark:text-contentColor-dark dark:hover:text-whiteColor dark:hover:bg-primaryColor dark:border-borderColor2-dark rounded"
                                    >
                                      <i className="icofont-youtube-play" />
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      href="/"
                                      className="w-35px h-35px leading-35px text-center border border-borderColor2 text-contentColor hover:text-whiteColor hover:bg-primaryColor dark:text-contentColor-dark dark:hover:text-whiteColor dark:hover:bg-primaryColor dark:border-borderColor2-dark rounded"
                                    >
                                      <i className="icofont-instagram" />
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      href="/"
                                      className="w-35px h-35px leading-35px text-center border border-borderColor2 text-contentColor hover:text-whiteColor hover:bg-primaryColor dark:text-contentColor-dark dark:hover:text-whiteColor dark:hover:bg-primaryColor dark:border-borderColor2-dark rounded"
                                    >
                                      <i className="icofont-twitter" />
                                    </a>
                                  </li>
                                </ul>
                              </div> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* course sidebar */}
              {isLoading ? (
                <div className="lg:col-start-9 lg:col-span-4 relative lg:top-[-340px]">
                  <div className="flex flex-col">
                    {/* enroll section skeleton */}
                    <div
                      className="py-8 px-6 shadow-event mb-8 bg-whiteColor dark:bg-whiteColor-dark rounded-md"
                      data-aos="fade-up"
                    >
                      <div className="overflow-hidden relative mb-5">
                        <SkeletonLoader
                          width="w-full"
                          height="h-48"
                          className="rounded"
                        />
                      </div>
                      <div className="flex justify-between mb-5">
                        <SkeletonLoader width="w-24" height="h-6" />
                      </div>
                      <div className="mb-5" data-aos="fade-up">
                        <SkeletonLoader
                          width="w-full"
                          height="h-10"
                          className="rounded"
                        />
                      </div>
                      <ul>
                        {[...Array(6)].map((_, i) => (
                          <li
                            key={i}
                            className="flex items-center justify-between py-3 border-b border-borderColor dark:border-borderColor-dark"
                          >
                            <SkeletonLoader width="w-20" height="h-4" />
                            <SkeletonLoader
                              width="w-16"
                              height="h-4"
                              className="rounded-full"
                            />
                          </li>
                        ))}
                      </ul>
                      <div className="mt-5" data-aos="fade-up">
                        <SkeletonLoader
                          width="w-full"
                          height="h-10"
                          className="rounded"
                        />
                      </div>
                    </div>

                    {/* popular courses skeleton */}
                    <div
                      className="p-5 md:p-8 lg:p-5 2xl:p-8 mb-8 border border-borderColor2 dark:border-borderColor2-dark"
                      data-aos="fade-up"
                    >
                      <SkeletonLoader
                        width="w-40"
                        height="h-6"
                        className="mb-6"
                      />

                      {[...Array(3)].map((_, i) => (
                        <li key={i} className="flex items-center mb-6">
                          <SkeletonLoader
                            width="w-[91px]"
                            height="h-[57px]"
                            className="mr-5 rounded"
                          />
                          <div className="flex-grow space-y-2">
                            <SkeletonLoader width="w-20" height="h-4" />
                            <SkeletonLoader width="w-32" height="h-5" />
                          </div>
                        </li>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                course && (
                  <div className="lg:col-start-9 lg:col-span-4 relative lg:top-[-340px]">
                    <div className="flex flex-col">
                      {/* enroll section */}
                      <div
                        className="py-33px px-25px shadow-event mb-30px bg-whiteColor dark:bg-whiteColor-dark rounded-md"
                        data-aos="fade-up"
                      >
                        {/* meeting thumbnail */}
                        <div className="overflow-hidden relative mb-5">
                          <img
                            // src="./assets/images/blog/blog_7.png"
                            src={course?.courseimage}
                            alt=""
                            className="w-full"
                          />
                        </div>
                        <div className="flex justify-between mb-5">
                          <div className="text-size-21 font-bold text-primaryColor font-inter leading-25px">
                            {course?.paymentinfo?.type === "fee" ? (
                              <span className="text-xl font-semibold text-primaryColor  dark:text-blackColor-dark px-3 py-1  ">
                                ₹ {course?.paymentinfo?.amount}
                              </span>
                            ) : (
                              <span className=" text-xl font-semibold text-greencolor ">
                                Free
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="mb-5" data-aos="fade-up">
                          <Link
                            // to={"https://lms.atlearn.in/login/signup.php"}
                            to={course?.enrolurl}
                            className="w-full text-center text-size-15 text-whiteColor bg-primaryColor px-25px py-10px border mb-10px leading-1.8 border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
                          >
                            Enroll in Course
                          </Link>
                          {/* 
                    <span className="text-size-13 text-contentColor dark:text-contentColor-dark leading-1.8">
                      <i className="icofont-ui-rotation" /> 45-Days Money-Back
                      Guarantee
                    </span> */}
                        </div>
                        <ul>
                          <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
                            <p className="text-sm font-medium  dark:text-contentColor-dark leading-1.8">
                              Instructor:
                            </p>
                            <p className="text-xs  dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
                              {course?.creatorname}
                            </p>
                          </li>
                          <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
                            <p className="text-sm font-medium  dark:text-contentColor-dark leading-1.8">
                              Start Date
                            </p>
                            <p className="text-xs  dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
                              {formatTimestamp(course?.startdate)}
                            </p>
                          </li>
                          {totalDuration > 0 && (
                            <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
                              <p className="text-sm font-medium  dark:text-contentColor-dark leading-1.8">
                                Total Duration
                              </p>
                              <p className="text-xs  dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
                                {/* 08Hrs 32Min */}
                                {/* {calculateTimeDifference(
                                course?.startdate,
                                course?.enddate
                              )} */}
                                {formatDurationFromSeconds(totalDuration)}
                              </p>
                            </li>
                          )}

                          {/* <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
                          <p className="text-sm font-medium  dark:text-contentColor-dark leading-1.8">
                            Skill Level
                          </p>
                          <p className="text-xs  dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
                            Basic
                          </p>
                        </li> */}
                          <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
                            <p className="text-sm font-medium  dark:text-contentColor-dark leading-1.8">
                              Language
                            </p>
                            <p className="text-xs  dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
                              English
                            </p>
                          </li>
                          <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
                            <p className="text-sm font-medium  dark:text-contentColor-dark leading-1.8">
                              Quiz
                            </p>
                            <p className="text-xs capitalize  dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
                              {course?.hasquiz || "NO"}
                            </p>
                          </li>
                          <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
                            <p className="text-sm font-medium  dark:text-contentColor-dark leading-1.8">
                              Certificate
                            </p>
                            <p className="text-xs capitalize dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
                              {course?.hascertificate || "NO"}
                            </p>
                          </li>
                        </ul>
                        {course?.creatornumber && (
                          <div className="mt-5" data-aos="fade-up">
                            <p className="text-sm  dark:text-contentColor-dark leading-1.8 text-center mb-5px">
                              For more details about this course,call
                            </p>
                            <div className=" text-center w-full text-xl text-primaryColor bg-whiteColor px-25px py-10px mb-10px font-bold leading-1.8 border border-primaryColor  inline-block rounded group dark:bg-whiteColor-dark dark:text-whiteColor dark:hover:bg-primaryColor">
                              <i className="icofont-phone" />{" "}
                              {course?.creatornumber}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* popular course */}
                      <div
                        className="p-5 md:p-30px lg:p-5 2xl:p-30px mb-30px border border-borderColor2 dark:border-borderColor2-dark"
                        data-aos="fade-up"
                      >
                        <h4 className="text-size-22 text-blackColor dark:text-blackColor-dark font-bold pl-2 before:w-0.5 relative before:h-[21px] before:bg-primaryColor before:absolute before:bottom-[5px] before:left-0 leading-30px mb-25px">
                          Popular Course
                        </h4>
                        <ul className="flex flex-col gap-y-25px">
                          {popularCourses?.slice(0, 3)?.map((item, index) => (
                            <li className="flex items-center">
                              <div className="w-[91px] h-auto mr-5 flex-shrink-0">
                                <a href="/" className="w-full">
                                  <img
                                    src={item?.courseimage}
                                    alt=""
                                    className="w-full h-[57px]"
                                  />
                                </a>
                              </div>
                              <div className="flex-grow">
                                {item?.paymentinfo?.type === "fee" ? (
                                  <h3 className="text-sm text-primaryColor font-medium leading-[17px] dark:text-blackColor-dark">
                                    ₹ {item?.paymentinfo?.amount}
                                  </h3>
                                ) : (
                                  <h3 className="text-sm text-green-500 font-medium leading-[17px]">
                                    free
                                  </h3>
                                )}
                                <Link
                                  to={`/course-details?course_id=${item?.id}#course`}
                                  className="text-blackColor dark:text-blackColor-dark hover:text-primaryColor dark:hover:text-primaryColor font-semibold leading-22px"
                                >
                                  {item?.fullname}
                                </Link>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </section>
        {/* <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 4px 10px rgba(0,0,0,0.2))",
            mt: 1.5,
            borderRadius: "10px",
            width: 200,
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 16,
              width: 12,
              height: 12,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem className="flex items-center gap-3 p-3 hover:bg-gray-100 transition">
          <WhatsappShareButton url={shareUrl} quote={""} hashtag={""}>
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
          <span className="text-sm font-medium text-gray-700">WhatsApp</span>
        </MenuItem>

        <MenuItem className="flex items-center gap-3 p-3 hover:bg-gray-100 transition">
          <TelegramShareButton url={shareUrl} quote={""} hashtag={""}>
            <TelegramIcon size={32} round />
          </TelegramShareButton>
          <span className="text-sm font-medium text-gray-700">Telegram</span>
        </MenuItem>
        <MenuItem className="flex items-center gap-3 p-3 hover:bg-gray-100 transition">
          <FacebookShareButton url={shareUrl} quote={""} hashtag={""}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>
          <span className="text-sm font-medium text-gray-700">Facebook</span>
        </MenuItem>

        <MenuItem className="flex items-center gap-3 p-3 hover:bg-gray-100 transition">
          <LinkedinShareButton url={shareUrl} quote={""} hashtag={""}>
            <LinkedinIcon size={32} round />
          </LinkedinShareButton>
          <span className="text-sm font-medium text-gray-700">LinkedIn</span>
        </MenuItem>
      </Menu> */}
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          // anchorOrigin={{ horizontal:"right", vertical: "bottom" }}
          anchorOrigin={
            isLargeScreen
              ? { horizontal: "right", vertical: "bottom" }
              : { horizontal: "left", vertical: "bottom" } // fallback for smaller screens
          }
          // transformOrigin={
          //   isLargeScreen
          //     ? { horizontal: 'right', vertical: 'top' }
          //     : { horizontal: 'center', vertical: 'top' }
          // }
        >
          {/* WhatsApp */}
          <MenuItem className="px-3 py-2">
            <WhatsappShareButton
              url={pageUrl}
              className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-100 transition"
            >
              <WhatsappIcon size={32} round />
              <span className="text-sm font-medium text-gray-700">
                WhatsApp
              </span>
            </WhatsappShareButton>
          </MenuItem>

          {/* Telegram */}
          <MenuItem className="px-3 py-2">
            <TelegramShareButton
              url={pageUrl}
              className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-100 transition"
            >
              <TelegramIcon size={32} round />
              <span className="text-sm font-medium text-gray-700">
                Telegram
              </span>
            </TelegramShareButton>
          </MenuItem>

          {/* Facebook */}
          <MenuItem className="px-3 py-2">
            <FacebookShareButton
              url={pageUrl}
              className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-100 transition"
            >
              <FacebookIcon size={32} round />
              <span className="text-sm font-medium text-gray-700">
                Facebook
              </span>
            </FacebookShareButton>
          </MenuItem>

          {/* LinkedIn */}
          <MenuItem className="px-3 py-2">
            <LinkedinShareButton
              url={pageUrl}
              className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-100 transition"
            >
              <LinkedinIcon size={32} round />
              <span className="text-sm font-medium text-gray-700">
                LinkedIn
              </span>
            </LinkedinShareButton>
          </MenuItem>
          {/* Email */}
          <MenuItem className="px-3 py-2">
            <EmailShareButton
              url={pageUrl}
              className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-100 transition"
            >
              <EmailIcon size={32} round />
              <span className="text-sm font-medium text-gray-700">Email</span>
            </EmailShareButton>
          </MenuItem>
        </Menu>
      </>
    </div>
  );
}

export default CourseDetails;
