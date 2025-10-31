import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { customCourseToken } from "src/apiClients/token";
import formatDurationFromSeconds from "src/utils/formatDurationFromSeconds";
function LMSCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  // const [lessons, setLessons] = useState([]);
  // const [userData, setUserData] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
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
        // const fetchedCourses = response.data.courses || [];
        const fetchedCourses = response.data || [];

        // Filter out courses with empty or null categories
        const filteredCourses = fetchedCourses.filter(
          (course) =>
            course.categoryname &&
            course.categoryname.trim() !== "" &&
            course.categoryname !== "Practical Test"
        );

        setCourses(filteredCourses);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCourses();
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

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const config = {
  //       method: "get",
  //       maxBodyLength: Infinity,
  //       url: `https://lms.atlearn.in/webservice/rest/server.php?wstoken=${usersToken}&wsfunction=core_user_get_users&moodlewsrestformat=json&criteria[0][key]=admin&criteria[0][value]=admin`,
  //       headers: {},
  //     };

  //     try {
  //       const response = await axios.request(config);
  //       // setUserData(response.data.users);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   fetchData(); // Call the fetchData function when the component mounts
  // }, []);

  // function formatTimestamp(timestamp) {
  //   const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
  //   const options = { year: "numeric", month: "short", day: "2-digit" };
  //   return date.toLocaleDateString("en-GB", options);
  // }

  return (
    <div>
      {courses?.length > 0 && (
        <section>
          <div className="container-fluid-2 ">
            {/* program Heading */}
            <div className="mb-5 md:mb-10 mt-5" data-aos="fade-up">
              <h3 className="text-3xl md:text-[35px] lg:text-size-38 3xl:text-size-42 leading-10 mf:leading-45px 2xl:leading-50px 3xl:leading-2xl font-bold text-blackColor dark:text-blackColor-dark text-center">
                Explore Our Courses
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-30px ">
              {courses?.slice(0, 4)?.map((item, index) => {
                return (
                  <div key={index} className="group ">
                    <div
                      onClick={(e) => {
                        if (e.target.closest("a")) return;
                        navigate(`/course-details?course_id=${item?.id}`);
                      }}
                      className="shadow-dropdown-secodary transition-transform transform hover:scale-105 hover:shadow-lg cursor-pointer tab-content-wrapper h-full flex flex-col"
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
                          <div className="grid grid-cols-2 mb-2 ">
                            <div className="flex items-center">
                              <i className="icofont-book-alt pr-5px text-secondaryColor text-lg" />
                              <span className="text-sm text-black dark:text-blackColor-dark">
                                {item?.lessoncount} Lesson
                              </span>
                            </div>
                            <div className="flex items-center justify-end">
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
                                  window.open(item.enrolurl, "_blank");
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
                                src={item?.creatorimage}
                                alt={item?.creatorname || "Instructor"}
                                title={item?.creatorname || "Instructor"}
                              />
                              <div>
                                <Link
                                  to={`/tutor-details?tutor_Id=${item?.creatorid}`}
                                  title={item?.creatorname || "Instructor"}
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
            <div className="flex justify-center" data-aos="fade-up">
              <Link
                to={"/all-courses"}
                title="More Courses"
                className="text-size-15 px-47px py-15px bg-primaryColor text-whiteColor border border-primaryColor hover:text-primaryColor hover:bg-whiteColor dark:hover:bg-whiteColor-dark dark:hover:text-whiteColor mt-10 md:mt-50px rounded uppercase"
              >
                More Courses
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default LMSCourses;
