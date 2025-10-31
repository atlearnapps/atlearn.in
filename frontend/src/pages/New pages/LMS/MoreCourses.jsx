import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { customCourseToken } from "src/apiClients/token";
import { setPageLoading } from "src/Redux/loadingSlice";
import { Helmet } from "react-helmet";
import CTASection from "src/components/New components/CTASection";
import CourseCardSkeleton from "src/components/New components/Loader/CourseCardSkeleton";
import CourseSidebarSkeleton from "src/components/New components/Loader/CourseSidebarSkeleton";
import CoursesHeaderSkeleton from "src/components/New components/Loader/CoursesHeaderSkeleton";
import formatDurationFromSeconds from "src/utils/formatDurationFromSeconds";
import { BASE_URL } from "src/apiClients/config";
const itemsPerPage = 6;
function MoreCourses() {
  const CTA = {
    // label: "Transform Learning, Simplify Teaching",
    heading: "Learn Without Limits",
    description:
      "Browse our comprehensive course library, designed for learners of every age and interest.",
    ctaName: "Create Your Course ",
    embedPopupFormId: "mbambgcjdr6kv0zhhvt",
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryCounts, setCategoryCounts] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("All");
  // const [userData, setUserData] = useState([]);
  // const [lessons, setLessons] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (location.hash) {
      const section = document.querySelector(location.hash);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
        navigate("/all-courses", { replace: true });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      dispatch(setPageLoading(true));
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

        // Filter out courses with empty or null categories
        const filteredCourses = fetchedCourses.filter(
          (course) =>
            course.categoryname &&
            course.categoryname.trim() !== "" &&
            course.categoryname !== "Practical Test"
        );

        setCourses(filteredCourses);
        // Calculate category counts
        const counts = filteredCourses.reduce((acc, course) => {
          acc["All"] = (acc["All"] || 0) + 1;
          acc[course.categoryname] = (acc[course.categoryname] || 0) + 1;

          return acc;
        }, {});
        setCategoryCounts(counts);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    };

    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   // fetchData();
  //   // fetchLessons();
  // }, []);

  // const fetchLessons = async () => {
  //   try {
  //     const config = {
  //       method: "get",
  //       maxBodyLength: Infinity,
  //       url: `https://lms.atlearn.in/webservice/rest/server.php?wstoken=${lessonToken}&wsfunction=mod_lesson_get_lessons_by_courses&moodlewsrestformat=json`,
  //     };

  //     const response = await axios.request(config);
  //     setLessons(response.data?.lessons || []); // Assuming the lessons are in a 'lessons' property
  //   } catch (err) {}
  // };

  // Filter courses based on the search term
  const filteredCourses = courses
    .filter((course) =>
      selectedCategory === "All"
        ? true
        : course.categoryname === selectedCategory
    )
    .filter((course) =>
      course.fullname.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Calculate total pages
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

  // Slice courses based on pagination
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // function formatTimestamp(timestamp) {
  //   const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
  //   const options = { year: "numeric", month: "short", day: "2-digit" };
  //   return date.toLocaleDateString("en-GB", options);
  // }

  return (
    <div>
      <Helmet>
        <title>Explore All Learning Paths and Courses at Atlearn</title>
        <meta
          name="description"
          content="Discover diverse learning paths and courses on Atlearn. Find the perfect program tailored to your interests and achieve your educational goals."
        />
        <link rel="canonical" href={`${BASE_URL}/all-courses`} />
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
                  <span className="text-secondaryColor">.</span>
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
      {/* <CoursesSlider /> */}
      {/* courses section */}
      {isLoading ? (
        <div id="courses">
          <div className="container tab py-10 ">
            {/* courses header */}
            <CoursesHeaderSkeleton />
            <div className="grid grid-cols-1 md:grid-cols-12 gap-30px">
              {/* courses sidebar */}
              <div className="md:col-start-1 md:col-span-4 lg:col-span-3">
                <CourseSidebarSkeleton />
              </div>
              {/* courses main */}
              <div className="md:col-start-5 md:col-span-8 lg:col-start-4 lg:col-span-9 space-y-[30px]">
                <div className="tab-contents">
                  {/* grid ordered cards */}

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-30px">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <CourseCardSkeleton key={index} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : courses?.length > 0 ? (
        <div id="courses">
          <div className="container tab py-10 ">
            {/* courses header */}
            <div
              className="courses-header flex justify-between items-center flex-wrap px-13px py-10px border border-borderColor dark:border-borderColor-dark mb-30px gap-y-5 shadow-event "
              data-aos="fade-up"
            >
              <div>
                <h4 className="text-size-22 text-blackColor dark:text-blackColor-dark font-bold leading-30px ">
                  Explore Course Catalog - Find Your Perfect Match
                </h4>
              </div>
              <div className="tab-links  gap-3 hidden sm:flex">
                {["Grid", "List"].map((label, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTab(index)} // Update active tab
                    className={`px-4 py-2 rounded flex items-center gap-2 ${
                      activeTab === index
                        ? "bg-white text-primaryColor shadow"
                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    }`}
                  >
                    {label === "Grid" ? (
                      <i className="icofont-layout" />
                    ) : (
                      <i className="icofont-listine-dots" />
                    )}
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-30px">
              {/* courses sidebar */}
              <div className="md:col-start-1 md:col-span-4 lg:col-span-3">
                <div className="flex flex-col">
                  {/* search input */}
                  <div
                    className="pt-30px pr-15px pl-10px pb-23px 2xl:pt-10 2xl:pr-25px 2xl:pl-5 2xl:pb-33px mb-30px border border-borderColor dark:border-borderColor-dark shadow-event"
                    data-aos="fade-up"
                  >
                    <h4 className="text-size-22 text-blackColor dark:text-blackColor-dark font-bold leading-30px mb-25px">
                      Search here
                    </h4>
                    <form className="w-full px-4 py-15px text-sm text-contentColor bg-lightGrey10 dark:bg-lightGrey10-dark dark:text-contentColor-dark flex justify-center items-center leading-26px">
                      <input
                        type="text"
                        placeholder="Search Course"
                        className="placeholder:text-placeholder bg-transparent focus:outline-none placeholder:opacity-80 w-full"
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setCurrentPage(1);
                        }}
                      />
                      <button type="submit">
                        <i className="icofont-search-1 text-base" />
                      </button>
                    </form>
                  </div>
                  {/* categories */}
                  <div
                    className="pt-30px pr-15px pl-10px pb-23px 2xl:pt-10 2xl:pr-25px 2xl:pl-5 2xl:pb-33px mb-30px border border-borderColor dark:border-borderColor-dark shadow-event"
                    data-aos="fade-up"
                  >
                    <h4 className="text-size-22 text-blackColor dark:text-blackColor-dark font-bold leading-30px mb-25px">
                      Categories
                    </h4>
                    <ul className="flex flex-col gap-y-4 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
                      {Object.entries(categoryCounts).map(
                        ([category, count]) => (
                          <li
                            key={category}
                            onClick={() => {
                              setSelectedCategory(category);
                              setCurrentPage(1);
                            }}
                            className={`cursor-pointer text-contentColor hover:text-contentColor-dark hover:bg-primaryColor text-sm font-medium px-13px py-2 border border-borderColor dark:border-borderColor-dark flex justify-between leading-7 transition-all duration-300 ${
                              selectedCategory === category
                                ? "bg-primaryColor text-white"
                                : ""
                            }`}
                          >
                            <span>{category}</span> <span>{count}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>
              {/* courses main */}
              <div className="md:col-start-5 md:col-span-8 lg:col-start-4 lg:col-span-9 space-y-[30px]">
                {paginatedCourses?.length > 0 ? (
                  <div className="tab-contents">
                    {/* grid ordered cards */}
                    {activeTab === 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-30px">
                        {paginatedCourses.map((item, index) => {
                          return (
                            <div key={index} className="group ">
                              <div
                                onClick={(e) => {
                                  if (e.target.closest("a")) return;
                                  navigate(
                                    `/course-details?course_id=${item?.id}`
                                  );
                                }}
                                className="cursor-pointer tab-content-wrapper h-full flex flex-col"
                                data-aos="fade-up"
                              >
                                <div className="p-15px bg-whiteColor  dark:bg-darkdeep3-dark dark:shadow-brand-dark border border-borderColor dark:border-borderColor-dark flex-grow flex flex-col shadow-xl">
                                  {/* Card Image */}
                                  <div className="relative mb-4">
                                    <div className="w-full overflow-hidden rounded border rounded-lg2">
                                      <img
                                        src={item?.courseimage}
                                        alt={item?.fullname}
                                        title={item?.fullname}
                                        className="w-full transition-all duration-300 group-hover:scale-110 h-[175px] "
                                      />
                                    </div>
                                    <div className="absolute left-0 top-1 flex justify-between w-full items-center px-2">
                                      <div>
                                        <p
                                          className={`text-xs text-whiteColor px-4 py-[3px] ${
                                            index % 2 === 0
                                              ? "bg-primaryColor"
                                              : "bg-secondaryColor"
                                          } rounded font-semibold capitalize`}
                                        >
                                          {item?.tags?.length > 0
                                            ? item?.tags
                                            : `Data & Tech`}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Card Content */}
                                  <div className="flex-grow">
                                    <div className="grid grid-cols-2 mb-2">
                                      <div className="flex items-center">
                                        <i className="icofont-book-alt pr-5px text-secondaryColor text-lg" />
                                        <span className="text-sm text-black dark:text-blackColor-dark">
                                          {/* {lessonCount?.length} Lesson */}
                                          {item?.lessoncount} Lesson
                                        </span>
                                      </div>
                                      <div className="flex items-center">
                                        <i className="icofont-clock-time pr-5px text-secondaryColor text-lg" />
                                        <span className="text-sm text-black dark:text-blackColor-dark">
                                          {formatDurationFromSeconds(
                                            item?.lessonduration
                                          )}
                                        </span>
                                      </div>
                                    </div>

                                    <Link
                                      to={`/course-details?course_id=${item?.id}`}
                                      title={item?.fullname}
                                      className="text-lg font-semibold text-blackColor mb-10px font-hind dark:text-blackColor-dark hover:text-secondaryColor dark:hover:text-primaryColor"
                                    >
                                      {item?.fullname}
                                    </Link>
                                  </div>

                                  {/* Author Section */}
                                  <div className="mt-auto ">
                                    {/* Price */}
                                    <div className="flex items-center   justify-between h-full mb-2">
                                      <div className="text-lg font-semibold text-secondary font-inter flex items-center justify-center h-full">
                                        {/* <span className="text-green-500">Free</span> */}
                                        {item?.paymentinfo?.type === "fee" ? (
                                          // <span className=" text-lg font-semibold text-secondaryColor dark:text-blackColor-dark">
                                          //   ₹ {item?.paymentinfo?.amount}
                                          // </span>
                                          <>
                                            ₹ {item?.paymentinfo?.amount}
                                            {/* <del className="text-sm text-lightGrey4 font-semibold">/ $67.00</del> */}
                                            <span className="ml-6">
                                              <del className="text-base font-semibold text-greencolor">
                                                Free
                                              </del>
                                            </span>
                                          </>
                                        ) : (
                                          <span className=" text-base font-semibold text-greencolor ">
                                            Free
                                          </span>
                                        )}
                                      </div>

                                      {/* <div
                            className="text-lg font-semibold text-primaryColor font-inter mb-4"
                          >
                            $32.00
                            <del className="text-sm text-lightGrey4 font-semibold"
                              >/ $67.00</del
                            >
                            <span className="ml-6"
                              ><del
                                className="text-base font-semibold text-secondaryColor3"
                                >Free</del
                              ></span
                            >
                          </div> */}
                                      <div>
                                        <div
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            window.open(
                                              item.enrolurl,
                                              "_blank"
                                            );
                                          }}
                                          className="text-size-15 text-whiteColor bg-primaryColor px-3 py-2 border  leading-5 border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
                                        >
                                          Enroll
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="pt-15px border-t border-borderColor ">
                                    <div className="text-base font-bold font-hind flex items-center hover:text-primaryColor dark:text-blackColor-dark dark:hover:text-primaryColor">
                                      <div className="flex items-center mb-2">
                                        <img
                                          className="w-[30px] h-[30px] rounded-full mr-15px"
                                          src={item.creatorimage}
                                          alt={
                                            item?.creatorname || "Instructor"
                                          }
                                          title={
                                            item?.creatorname || "Instructor"
                                          }
                                        />
                                        <div>
                                          <Link
                                            to={`/tutor-details?tutor_Id=${item?.creatorid}`}
                                            title={
                                              item?.creatorname || "Instructor"
                                            }
                                          >
                                            <span className="hover:text-secondary">
                                              {item?.creatorname}
                                            </span>
                                          </Link>

                                          <div className="text-start ">
                                            <i className="icofont-star text-size-15 text-yellow"></i>
                                            <i className="icofont-star text-size-15 text-yellow"></i>
                                            <i className="icofont-star text-size-15 text-yellow"></i>
                                            <i className="icofont-star text-size-15 text-yellow"></i>
                                            <i className="icofont-star text-size-15 text-yellow"></i>
                                            <span className="text-xs text-lightGrey6">
                                              (44)
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* list ordered cards */}
                    {activeTab === 1 && (
                      <div className="  transition-all duration-300">
                        <div className="flex flex-col gap-30px">
                          {paginatedCourses?.map((item, index) => {
                            return (
                              <div
                                key={index}
                                className="w-full group grid-item rounded"
                              >
                                <div
                                  className="tab-content-wrapper"
                                  data-aos="fade-up"
                                >
                                  <div className="p-15px lg:pr-30px bg-whiteColor shadow-xl dark:bg-darkdeep3-dark dark:shadow-brand-dark border border-borderColor dark:border-borderColor-dark flex flex-wrap md:flex-nowrap rounded">
                                    {/* card image */}
                                    <div className="relative overflow-hidden w-full md:w-2/5">
                                      <div className="w-full overflow-hidden border rounded-lg2">
                                        <img
                                          src={item?.courseimage}
                                          alt={item?.fullname}
                                          title={item?.fullname}
                                          className="w-full transition-all duration-300 group-hover:scale-110 block h-[200px]"
                                        />
                                      </div>
                                      <div className="absolute left-0 top-1 flex justify-between w-full items-center px-2">
                                        <div>
                                          <p
                                            className={`text-xs text-whiteColor px-4 py-[3px] ${
                                              index % 2 === 0
                                                ? "bg-primaryColor"
                                                : "bg-secondaryColor"
                                            } rounded font-semibold capitalize`}
                                          >
                                            {item?.tags?.length > 0
                                              ? item?.tags
                                              : `Data & Tech`}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    {/* card content */}
                                    <div className="w-full md:w-3/5">
                                      <div className="pl-0 lg:pl-30px">
                                        <div className="grid grid-cols-2 mb-15px">
                                          <div className="flex items-center">
                                            <div>
                                              <i className="icofont-book-alt pr-5px text-secondary text-lg" />
                                            </div>
                                            <div>
                                              <span className="text-sm text-black dark:text-blackColor-dark">
                                                {item?.lessoncount} Lesson
                                              </span>
                                            </div>
                                          </div>
                                          <div className="flex items-center">
                                            <div>
                                              <i className="icofont-clock-time pr-5px text-secondary text-lg" />
                                            </div>
                                            <div>
                                              <span className="text-sm text-black dark:text-blackColor-dark">
                                                {formatDurationFromSeconds(
                                                  item?.lessonduration
                                                )}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                        <Link
                                          to={`/course-details?course_id=${item?.id}`}
                                          title={item?.fullname}
                                          className="text-size-26 leading-30px font-semibold text-blackColor mb-10px font-hind dark:text-blackColor-dark hover:text-secondaryColor dark:hover:text-primaryColor"
                                        >
                                          {item?.fullname}
                                        </Link>
                                        {/* price */}
                                        <div className=" flex items-center   justify-between h-full mb-2 ">
                                          <div className="text-lg font-semibold text-black-brerry-light font-inter flex items-center justify-center h-full">
                                            {item?.paymentinfo?.type ===
                                            "fee" ? (
                                              <span className=" text-lg font-semibold text-secondaryColor dark:text-blackColor-dark">
                                                ₹ {item?.paymentinfo?.amount}
                                              </span>
                                            ) : (
                                              <span className=" text-base font-semibold text-greencolor ">
                                                Free
                                              </span>
                                            )}
                                          </div>
                                          <div>
                                            <div
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                window.open(
                                                  item.enrolurl,
                                                  "_blank"
                                                );
                                              }}
                                              className="text-size-15 text-whiteColor bg-primaryColor px-3 py-2 border  leading-5 border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
                                            >
                                              Enroll
                                            </div>
                                          </div>
                                        </div>

                                        {/* bottom */}
                                        <div className="flex flex-wrap justify-between sm:flex-nowrap items-center gap-y-2 pt-15px border-t border-borderColor">
                                          {/* author and rating*/}
                                          <div className="flex items-center flex-wrap">
                                            <div>
                                              <div className="text-base font-medium font-hind flex items-center hover:text-secondaryColor dark:text-blackColor-dark dark:hover:text-primaryColor">
                                                <div className="flex items-center mb-2">
                                                  <img
                                                    className="w-[30px] h-[30px] rounded-full mr-15px"
                                                    src={item.creatorimage}
                                                    alt={
                                                      item?.creatorname ||
                                                      "Instructor"
                                                    }
                                                    title={
                                                      item?.creatorname ||
                                                      "Instructor"
                                                    }
                                                  />
                                                  <div>
                                                    <Link
                                                      to={`/tutor-details?tutor_Id=${item?.creatorid}`}
                                                      title={
                                                        item?.creatorname ||
                                                        "Instructor"
                                                      }
                                                    >
                                                      <span className="hover:text-secondary">
                                                        {item?.creatorname}
                                                      </span>
                                                    </Link>

                                                    <div className="text-start ">
                                                      <i className="icofont-star text-size-15 text-yellow"></i>
                                                      <i className="icofont-star text-size-15 text-yellow"></i>
                                                      <i className="icofont-star text-size-15 text-yellow"></i>
                                                      <i className="icofont-star text-size-15 text-yellow"></i>
                                                      <i className="icofont-star text-size-15 text-yellow"></i>
                                                      <span className="text-xs text-lightGrey6">
                                                        (44)
                                                      </span>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div>
                                            <Link
                                              className="text-sm lg:text-base text-blackColor hover:text-primaryColor dark:text-blackColor-dark dark:hover:text-primaryColor"
                                              to={`/course-details?course_id=${item?.id}`}
                                              title={item?.fullname}
                                            >
                                              Know Details
                                              <i className="icofont-arrow-right" />
                                            </Link>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* pagination */}
                    <div>
                      <ul className="flex items-center justify-center gap-2 mt-10 mb-6 overflow-x-auto flex-nowrap scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
                        {/* Previous Button */}
                        <li>
                          <button
                            aria-label="Previous Page"
                            className={`min-w-[2rem] w-8 h-8 md:w-12 md:h-12 text-center bg-whitegrey1 dark:bg-whitegrey1-dark ${
                              currentPage === 1
                                ? "cursor-not-allowed opacity-50"
                                : "hover:bg-primaryColor hover:text-whiteColor"
                            }`}
                            onClick={() =>
                              setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            disabled={currentPage === 1}
                          >
                            <i className="icofont-double-left" />
                          </button>
                        </li>

                        {/* Page Numbers with Ellipsis */}
                        {totalPages <= 7 ? (
                          Array.from({ length: totalPages }, (_, i) => (
                            <li key={i}>
                              <button
                                aria-label={`Go to page ${i + 1}`}
                                className={`min-w-[2rem] w-8 h-8 md:w-12 md:h-12 text-center ${
                                  currentPage === i + 1
                                    ? "bg-primaryColor text-whiteColor"
                                    : "bg-whitegrey1 text-blackColor2 hover:bg-primaryColor hover:text-whiteColor"
                                }`}
                                onClick={() => setCurrentPage(i + 1)}
                              >
                                {i + 1}
                              </button>
                            </li>
                          ))
                        ) : (
                          <>
                            {/* First Page */}
                            <li>
                              <button
                                aria-label="Go to page 1"
                                className={`min-w-[2rem] w-8 h-8 md:w-12 md:h-12 text-center ${
                                  currentPage === 1
                                    ? "bg-primaryColor text-whiteColor"
                                    : "bg-whitegrey1 text-blackColor2 hover:bg-primaryColor hover:text-whiteColor"
                                }`}
                                onClick={() => setCurrentPage(1)}
                              >
                                1
                              </button>
                            </li>

                            {/* Left Ellipsis */}
                            {currentPage > 4 && (
                              <li className="min-w-[2rem]">...</li>
                            )}

                            {/* Middle Page Numbers */}
                            {Array.from(
                              { length: 5 },
                              (_, i) => currentPage - 2 + i
                            )
                              .filter((page) => page > 1 && page < totalPages)
                              .map((page) => (
                                <li key={page}>
                                  <button
                                    aria-label={`Go to page ${page}`}
                                    className={`min-w-[2rem] w-8 h-8 md:w-12 md:h-12 text-center ${
                                      currentPage === page
                                        ? "bg-primaryColor text-whiteColor"
                                        : "bg-whitegrey1 text-blackColor2 hover:bg-primaryColor hover:text-whiteColor"
                                    }`}
                                    onClick={() => setCurrentPage(page)}
                                  >
                                    {page}
                                  </button>
                                </li>
                              ))}

                            {/* Right Ellipsis */}
                            {currentPage < totalPages - 3 && (
                              <li className="min-w-[2rem]">...</li>
                            )}

                            {/* Last Page */}
                            <li>
                              <button
                                aria-label={`Go to page ${totalPages}`}
                                className={`min-w-[2rem] w-8 h-8 md:w-12 md:h-12 text-center ${
                                  currentPage === totalPages
                                    ? "bg-primaryColor text-whiteColor"
                                    : "bg-whitegrey1 text-blackColor2 hover:bg-primaryColor hover:text-whiteColor"
                                }`}
                                onClick={() => setCurrentPage(totalPages)}
                              >
                                {totalPages}
                              </button>
                            </li>
                          </>
                        )}

                        {/* Next Button */}
                        <li>
                          <button
                            aria-label="Next Page"
                            className={`min-w-[2rem] w-8 h-8 md:w-12 md:h-12 text-center bg-whitegrey1 dark:bg-whitegrey1-dark ${
                              currentPage === totalPages
                                ? "cursor-not-allowed opacity-50"
                                : "hover:bg-primaryColor hover:text-whiteColor"
                            }`}
                            onClick={() =>
                              setCurrentPage((prev) =>
                                Math.min(prev + 1, totalPages)
                              )
                            }
                            disabled={currentPage === totalPages}
                          >
                            <i className="icofont-double-right" />
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div
                    id="courses"
                    className=" container mt-[100px] mb-[100px] text-center p-10 bg-gray-100 dark:bg-gray-800 rounded-lg"
                  >
                    <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                      Sorry, we couldn't find any course with that title
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* <section>
            <CTASection data={CTA} />
          </section> */}
        </div>
      ) : (
        <div
          id="courses"
          className=" container mt-[100px] mb-[100px] text-center p-10 bg-gray-100 dark:bg-gray-800 rounded-lg"
        >
          <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">
            No courses available at the moment. Please check back later.
          </p>
        </div>
      )}

      <section>
        <CTASection data={CTA} />
      </section>
    </div>
  );
}

export default MoreCourses;
