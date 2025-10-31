import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FacebookShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  WhatsappIcon,
  FacebookIcon,
  TelegramIcon,
  LinkedinIcon,
} from "react-share";
import {
  customCourseToken,
  quizAttemptToken,
  quizToken,
} from "src/apiClients/token";
import { Menu, MenuItem } from "@mui/material";
import { Helmet } from "react-helmet";
import SkeletonLoader from "src/components/New components/Loader/SkeletonLoader";
import { BASE_URL } from "src/apiClients/config";

function PracticalTestDetails() {
  const [course, setCourse] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const course_Id = parseInt(queryParams.get("course_id"), 10);
  // const [userData, setUserData] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [quizList, setQuizList] = useState([]);
  const [popularCourses, setPopularCourses] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const toggleAccordion = (index) => {
    // If the same index is clicked, close it; otherwise, open it
    setActiveIndex((prev) => (prev === index ? null : index));
  };
  const [activeTab, setActiveTab] = useState("curriculum");
  const [shareUrl, setShareUrl] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = (event, url) => {
    setShareUrl(url);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
          const exceptSpecificCourses = fetchedCourses.filter(
            (course) =>
              course.id !== id &&
              course.categoryname.trim() !== "" &&
              course.categoryname === "Practical Test"
          );

          setPopularCourses(exceptSpecificCourses || []);
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
    fetchAllQuiz(course_Id);
    fetchQuizzes(course_Id);
  }, [course_Id]);

  useEffect(() => {
    const tabs = document.querySelectorAll(".tab");

    tabs.forEach((tab) => {
      const tabLinks = Array.from(tab.querySelector(".tab-links").children);
      const tabContents = Array.from(
        tab.querySelector(".tab-contents").children
      );

      // Set up event listeners for each tab link
      tabLinks.forEach((tabLink, index) => {
        tabLink.addEventListener("click", () => {
          // Update tab link styles
          tabLinks.forEach((link, idx) => {
            link.classList.remove("bg-white", "shadow-bottom");
            link.classList.add(
              "bg-lightGrey7",
              "dark:bg-lightGrey7-dark",
              "inActive"
            );

            const span = link.querySelector("span");
            if (span) span.classList.replace("w-full", "w-0");
            link.disabled = false;

            if (idx === index) {
              link.disabled = true;
              link.classList.add(
                "bg-white",
                "dark:bg-whiteColor-dark",
                "shadow-bottom"
              );
              if (span) span.classList.replace("w-0", "w-full");
            }
          });

          // Update tab content styles
          tabContents.forEach((tabContent, idx) => {
            tabContent.classList.add("hidden");
            tabContent.classList.remove("block", "opacity-100");

            if (idx === index) {
              tabContent.classList.add("block", "opacity-0");
              tabContent.classList.remove("hidden");

              setTimeout(() => {
                tabContent.classList.replace("opacity-0", "opacity-100");
              }, 150);
            }
          });

          // Accordion content height adjustment (if any)
          const accordion = tab.querySelector(".accordion.active");
          if (accordion) {
            const contents = accordion.querySelector(".accordion-content");
            const contentHeight = contents.children[index]?.offsetHeight;
            if (contentHeight) {
              contents.style.height = `${contentHeight}px`;
            }
          }
        });
      });
    });
  }, [isLoading]);

  const fetchAllQuiz = async (id) => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://lms.atlearn.in/webservice/rest/server.php?wstoken=${quizAttemptToken}&wsfunction=core_course_get_contents&moodlewsrestformat=json&courseid=${id}`,
      headers: {},
    };

    try {
      const response = await axios.request(config);
      const quizmodule = response.data[0].modules || [];
      const quizlist = quizmodule.filter((quiz) => quiz.modname === "quiz");
      setQuizzes(quizlist || []);
      if (quizlist?.length > 0) {
        setActiveIndex(1);
      }
      // You can handle the response data here, e.g., update state
    } catch (error) {
      console.error("Error fetching course contents:", error);
    }
  };

  const fetchQuizzes = async (id) => {
    try {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `https://lms.atlearn.in/webservice/rest/server.php?wstoken=${quizToken}&wsfunction=mod_quiz_get_quizzes_by_courses&moodlewsrestformat=json`,
      };

      const response = await axios.request(config);
      const fetchedQuiz = response.data.quizzes || [];
      const specificQuiz = fetchedQuiz.filter((quiz) => id === quiz?.course);
      setQuizList(specificQuiz || []);
    } catch (err) {}
  };

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
    const options = { year: "numeric", month: "short", day: "2-digit" };
    return date.toLocaleDateString("en-GB", options);
  }

  // function calculateTimeDifference(startTimestamp, endTimestamp) {
  //   // Convert the timestamps to milliseconds
  //   const startDate = new Date(startTimestamp * 1000);
  //   const endDate = new Date(endTimestamp * 1000);

  //   // Calculate the difference in milliseconds
  //   const difference = endDate - startDate;

  //   // Convert milliseconds to hours and minutes
  //   const hours = Math.floor(difference / (1000 * 60 * 60)); // 1 hour = 3600000 ms
  //   const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)); // 1 minute = 60000 ms

  //   // Return the formatted string
  //   return `${hours} hrs ${minutes} min`;
  // }

  const handleCopy = (url) => {
    // navigator.clipboard.writeText(`${window.location}/${id}/join`);
    navigator.clipboard.writeText(`${url}`);

    toast.success("Link copied ");
  };

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

  function formatDynamicTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    // Build the time string dynamically
    const parts = [];
    if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
    if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);
    if (remainingSeconds > 0)
      parts.push(
        `${remainingSeconds} second${remainingSeconds !== 1 ? "s" : ""}`
      );

    return parts.join(" ");
  }

  return (
    <div>
      <Helmet>
        <title>Explore the Best Free Online eLearning Platform</title>
        <meta
          name="description"
          content="Explore free online courses with Atlearn's eLearning platform. Access interactive learning tools on one of the best free online course websites."
        />
        <link
          rel="canonical"
          href={`${BASE_URL}/online-test-details`}
        />
      </Helmet>
      <>
        {/* banner section */}
        <section>
          {/* banner section */}
          <div className="bg-darkdeep1 dark:bg-lightGrey10-dark relative z-0 overflow-y-visible py-50px">
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
                className="absolute top-[5%] left-[45%] hidden md:block"
                src="./assets/images/herobanner/herobanner__7.png"
                alt="herobanner icon"
                title="herobanner icon"
              />
            </div>
            <div className="container">
              <div>
                <ul className="flex gap-1">
                  <li>
                    <Link
                      to={"/online-test"}
                      className="text-lg text-whiteColor dark:text-blackColor2-dark"
                    >
                      Home <i className="icofont-simple-right" />
                    </Link>
                  </li>

                  <li>
                    {isLoading ? (
                      <SkeletonLoader width="w-40" height="h-8 " />
                    ) : (
                      <span className="text-lg text-whiteColor dark:text-blackColor2-dark">
                        {course?.fullname}
                      </span>
                    )}
                  </li>
                </ul>
                <div id="course" className="pt-70px">
                  {/* titile */}
                  {isLoading ? (
                    <SkeletonLoader
                      width="w-1/4"
                      height="h-10 md:h-12"
                      className="mb-15px"
                    />
                  ) : (
                    <h1
                      className="text-size-32 md:text-4xl font-bold text-whiteColor dark:text-blackColor-dark mb-15px leading-43px md:leading-14.5"
                      data-aos="fade-up"
                    >
                      {course?.fullname}
                    </h1>
                  )}

                  {/* price and rating */}
                  <div
                    className="flex gap-5 flex-wrap items-center mb-30px"
                    data-aos="fade-up"
                  >
                    <div>
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <SkeletonLoader
                            width="w-5"
                            height="h-5"
                            className="rounded"
                          />
                          <SkeletonLoader width="w-20" height="h-5" />
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <div>
                            <i className="icofont-book-alt pr-5px text-whiteColor text-sm" />
                          </div>
                          <span className="text-sm text-whiteColor dark:text-blackColor-dark font medium">
                            {quizzes?.length} Test
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>

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
                          {[1, 2].map((_, index) => (
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
                              activeTab === "curriculum" ? "active" : ""
                            }`}
                          >
                            <i className="icofont-book-alt mr-2" /> Test List
                          </button>
                          <button
                            onClick={() => setActiveTab("description")}
                            className={`is-checked relative p-10px md:px-25px md:py-15px lg:py-3 2xl:py-15px 2xl:px-45px text-blackColor bg-whiteColor hover:bg-primaryColor hover:text-whiteColor shadow-overview-button dark:bg-whiteColor-dark dark:text-blackColor-dark dark:hover:bg-primaryColor dark:hover:text-whiteColor flex items-center ${
                              activeTab === "description" ? "active" : ""
                            }`}
                          >
                            <i className="icofont-paper mr-2" /> Description
                          </button>

                          {/* <button className="is-checked relative p-10px md:px-25px md:py-15px lg:py-3 2xl:py-15px 2xl:px-45px text-blackColor bg-whiteColor hover:bg-primaryColor hover:text-whiteColor shadow-overview-button dark:bg-whiteColor-dark dark:text-blackColor-dark dark:hover:bg-primaryColor dark:hover:text-whiteColor flex items-center">
                          <i className="icofont-teacher mr-2" /> Instructor
                        </button> */}
                        </div>
                        <div className="tab-contents">
                          {/* curriculum */}
                          <div className="">
                            {/* Curriculum */}
                            <div>
                              <ul className="accordion-container curriculum">
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
                                      <span>Test</span>
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
                                            {quizzes?.map((quiz, index) => {
                                              const matchquizList =
                                                quizList?.find(
                                                  (item) =>
                                                    item.id === quiz.instance
                                                );

                                              return (
                                                <li
                                                  key={index}
                                                  className="py-4 flex items-center justify-between flex-wrap border-b border-borderColor dark:border-borderColor-dark"
                                                >
                                                  <div className="w-[50%]">
                                                    <h4 className="text-blackColor dark:text-blackColor-dark leading-1 font-light">
                                                      <i className="icofont-file-text mr-10px" />
                                                      <span className="font-medium mr-10px">
                                                        Test {index + 1} :
                                                      </span>
                                                      {quiz?.name}
                                                    </h4>
                                                  </div>
                                                  {/* {quiz?.dates[0]?.timestamp &&
                                                quiz?.dates[1]?.timestamp && (
                                                  <div>
                                                    {formatTimeDifference(
                                                      quiz?.dates[0]?.timestamp,
                                                      quiz?.dates[1]?.timestamp
                                                    )}
                                                  </div>
                                                )} */}
                                                  {matchquizList?.timelimit >
                                                    0 && (
                                                    <div className="flex items-center gap-1">
                                                      <i className="icofont-clock-time"></i>
                                                      <span className="text-primary ">
                                                        {formatDynamicTime(
                                                          matchquizList.timelimit
                                                        )}
                                                      </span>
                                                    </div>
                                                  )}

                                                  <div className="text-contentColor dark:text-contentColor-dark text-sm flex justify-center items-center  gap-2  ">
                                                    {/* Share Button */}
                                                    <button
                                                      className="flex items-center gap-1 text-size-15 text-primaryColor border border-primaryColor px-2 py-1 rounded hover:bg-primaryColor hover:text-whiteColor dark:hover:text-whiteColor"
                                                      onClick={(e) =>
                                                        // alert(
                                                        //   "Share functionality coming soon!"
                                                        // )
                                                        handleClick(
                                                          e,
                                                          quiz?.url || ""
                                                        )
                                                      }
                                                    >
                                                      <i className="icofont-share" />
                                                    </button>

                                                    {/* Copy Button */}
                                                    <button
                                                      className="flex items-center gap-1 text-size-15 text-primaryColor border border-primaryColor px-2 py-1 rounded hover:bg-primaryColor hover:text-whiteColor dark:hover:text-whiteColor"
                                                      onClick={() => {
                                                        handleCopy(
                                                          quiz?.url || ""
                                                        );
                                                      }}
                                                    >
                                                      <i className="icofont-copy" />
                                                    </button>

                                                    {/* Start Quiz Link */}
                                                    <Link
                                                      to={quiz?.url}
                                                      title="Start Test"
                                                      className="flex items-center justify-center gap-2 text-size-15 text-whiteColor bg-primaryColor px-3 py-2 border mb-2 leading-5 border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
                                                    >
                                                      Start Test
                                                    </Link>
                                                  </div>
                                                </li>
                                              );
                                            })}
                                          </ul>
                                        ) : (
                                          <div className="container mt-20 mb-20 text-center p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                                              No tests available at the moment.
                                              Please check back later.
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
                          <div className="hidden">
                            <p
                              className="text-lg text-darkdeep4 mb-25px !leading-30px"
                              data-aos="fade-up"
                              dangerouslySetInnerHTML={{
                                __html: course?.summary,
                              }}
                            />
                          </div>

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
                                  alt={course?.creatorname}
                                  title={course?.creatorname}
                                  className="w-24 h-24 rounded-full"
                                />
                              </div>
                              <div>
                                {/* author name */}
                                <div className="mb-3">
                                  <h3 className="mb-7px">
                                    <Link
                                      to={`/tutor-details?tutor_Id=${course?.creatorid}`}
                                      title={course?.creatorname}
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
                                  className="text-sm text-contentColor dark:text-contentColor-dark mb-15px leading-26px"
                                />
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
                            src={course?.courseimage}
                            alt={course?.fullname}
                            title={course?.fullname}
                            className="w-full"
                          />
                        </div>
                        <div className="flex justify-between mb-50px">
                          <div className="text-size-21 font-bold text-primaryColor font-inter leading-25px">
                            {course?.paymentinfo?.type === "fee" ? (
                              <span className=" text-lg text-primaryColor dark:text-gray-300  font-bold dark:text-blackColor-dark">
                                ₹ {course?.paymentinfo?.amount}
                              </span>
                            ) : (
                              <span className=" font-semibold text-green-600 bg-green-100 dark:bg-green-900 px-3 py-1 rounded-lg shadow-sm">
                                Free
                              </span>
                            )}
                          </div>
                          <div></div>
                        </div>

                        <ul>
                          {/* <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
                      <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark leading-1.8">
                        Instructor:
                      </p>
                      <p className="text-xs text-contentColor dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
                        {course?.contacts?.[0]?.fullname}
                      </p>
                    </li> */}
                          <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
                            <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark leading-1.8">
                              Start Date
                            </p>
                            <p className="text-xs text-contentColor dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
                              {formatTimestamp(course?.startdate)}
                            </p>
                          </li>
                          <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
                            <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark leading-1.8">
                              End Date
                            </p>
                            <p className="text-xs text-contentColor dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
                              {/* 08Hrs 32Min */}
                              {/* {calculateTimeDifference(
                          course?.startdate,
                          course?.enddate
                        )} */}
                              {formatTimestamp(course?.enddate)}
                            </p>
                          </li>

                          {/* <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
                      <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark leading-1.8">
                        Skill Level
                      </p>
                      <p className="text-xs text-contentColor dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
                        Basic
                      </p>
                    </li> */}
                          <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
                            <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark leading-1.8">
                              Language
                            </p>
                            <p className="text-xs text-contentColor dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
                              English
                            </p>
                          </li>
                          <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
                            <p className="text-sm font-medium  dark:text-contentColor-dark leading-1.8">
                              Certificate
                            </p>
                            <p className="text-xs capitalize dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
                              {course?.hascertificate || "No"}
                            </p>
                          </li>
                          {/* <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
                      <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark leading-1.8">
                        Quiz
                      </p>
                      <p className="text-xs text-contentColor dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
                        {quizzes?.length > 0 ? "Yes" : "No"}
                      </p>
                    </li> */}
                          {/* <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
                      <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark leading-1.8">
                        Certificate
                      </p>
                      <p className="text-xs text-contentColor dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
                        Yes
                      </p>
                    </li> */}
                        </ul>
                        {/* <div className="mt-5" data-aos="fade-up">
                    <p className="text-sm text-contentColor dark:text-contentColor-dark leading-1.8 text-center mb-5px">
                      For more details about this course,call
                    </p>
                    <button
                      type="submit"
                      className="w-full text-xl text-primaryColor bg-whiteColor px-25px py-10px mb-10px font-bold leading-1.8 border border-primaryColor hover:text-whiteColor hover:bg-primaryColor inline-block rounded group dark:bg-whiteColor-dark dark:text-whiteColor dark:hover:bg-primaryColor"
                    >
                      <i className="icofont-phone" /> {userData?.phone1}
                    </button>
                  </div> */}
                      </div>

                      {/* popular course */}
                      <div
                        className="p-5 md:p-30px lg:p-5 2xl:p-30px mb-30px border border-borderColor2 dark:border-borderColor2-dark"
                        data-aos="fade-up"
                      >
                        <h2 className="text-size-22 text-blackColor dark:text-blackColor-dark font-bold pl-2 before:w-0.5 relative before:h-[21px] before:bg-primaryColor before:absolute before:bottom-[5px] before:left-0 leading-30px mb-25px">
                          Popular Practical Test
                        </h2>
                        <ul className="flex flex-col gap-y-25px">
                          {popularCourses?.slice(0, 3)?.map((item, index) => (
                            <li key={index} className="flex items-center">
                              <div className="w-[91px] h-auto mr-5 flex-shrink-0">
                                <a href="/" className="w-full">
                                  <img
                                    src={item?.courseimage}
                                    alt={item?.fullname}
                                    title={item?.fullname}
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
                                  to={`/online-test-details?course_id=${item?.id}#course`}
                                  title={item?.fullname}
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
      </>
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
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem>
          {/* <WhatsappShareButton /> Profile */}
          <WhatsappShareButton url={shareUrl} quote={""} hashtag={""}>
            <WhatsappIcon size={30} round={true} />
          </WhatsappShareButton>{" "}
        </MenuItem>
        <MenuItem>
          <TelegramShareButton url={shareUrl} quote={""} hashtag={""}>
            <TelegramIcon size={30} round={true} />
          </TelegramShareButton>{" "}
        </MenuItem>
        <MenuItem>
          <FacebookShareButton url={shareUrl} quote={""} hashtag={""}>
            <FacebookIcon size={30} round={true} />
          </FacebookShareButton>{" "}
        </MenuItem>
        <MenuItem>
          <LinkedinShareButton url={shareUrl} quote={""} hashtag={""}>
            <LinkedinIcon size={30} round={true} />
          </LinkedinShareButton>{" "}
        </MenuItem>
      </Menu>
    </div>
  );
}

export default PracticalTestDetails;
