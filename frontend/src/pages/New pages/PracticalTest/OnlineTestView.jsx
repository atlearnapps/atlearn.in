import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { customCourseToken } from "src/apiClients/token";
import CourseCardSkeleton from "src/components/New components/Loader/CourseCardSkeleton";
import formatDurationFromSeconds from "src/utils/formatDurationFromSeconds";

function OnlineTestView() {
  const navigate = useNavigate();

  const [praticalTestData, setPraticalTestData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      //   dispatch(setPageLoading(true));
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
        const fetchedPraticalTest = response.data || [];

        // Filter out courses with empty or null categories
        const filteredPraticalTest = fetchedPraticalTest.filter(
          (course) =>
            course.categoryname &&
            course.categoryname.trim() !== "" &&
            course.categoryname === "Practical Test"
        );
        setPraticalTestData(filteredPraticalTest);

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    };

    fetchCourses();
  }, []);
  return (
    <div className="container-secondary pb-100px px-10px ">
      {isLoading ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-30px ">
            {Array.from({ length: 4 }).map((_, index) => (
              <CourseCardSkeleton key={index} />
            ))}
          </div>
        </>
      ) : (
        praticalTestData?.length > 0 && (
          <>
            <div className="mb-5 md:mb-10 mt-5" data-aos="fade-up">
              <h3 className="text-3xl md:text-[35px] lg:text-size-38 3xl:text-size-42 leading-10 mf:leading-45px 2xl:leading-50px 3xl:leading-2xl font-bold text-blackColor dark:text-blackColor-dark text-center">
                Explore Online Tests
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-30px ">
              {praticalTestData?.slice(0, 4)?.map((item, index) => {
                // const matchedUser = userData?.find(
                //   (userItem) => userItem.id === item?.contacts?.[0]?.id
                // );

                return (
                  <div
                    onClick={() =>
                      navigate(`/online-test-details?course_id=${item?.id}`)
                    }
                    key={index}
                    className="group cursor-pointer"
                  >
                    <div
                      // onClick={(e) => {
                      //   // Prevent the click event from firing when a child Link is clicked
                      //   if (e.target.closest("a")) return;
                      //   navigate(`/course-details?course_id=${item?.id}`);
                      // }}
                      className=" cursor-pointer tab-content-wrapper h-full flex flex-col"
                      data-aos="fade-up"
                    >
                      <div className="p-15px bg-whiteColor shadow-xl dark:bg-darkdeep3-dark dark:shadow-brand-dark border border-borderColor dark:border-borderColor-dark flex-grow flex flex-col">
                        {/* Card Image */}
                        <div className="relative mb-4">
                          <div className="w-full overflow-hidden border rounded-lg2">
                            <img
                              loading="lazy"
                              src={item?.courseimage}
                              alt={item?.fullname}
                              title={item?.fullname}
                              className="w-full transition-all duration-300 group-hover:scale-110 h-[175px]"
                            />
                          </div>
                          {/* <div className="absolute left-0 top-1 flex justify-between w-full items-center px-2">
                                    <div>
                                      <p className="text-xs text-whiteColor px-4 py-[3px] bg-secondaryColor rounded font-semibold">
                                        Data &amp; Tech
                                      </p>
                                    </div>
                                  </div> */}
                        </div>

                        {/* Card Content */}
                        <div className="flex-grow">
                          <div className="grid grid-cols-1 mb-15px">
                            <div className="flex items-center">
                              <i className="icofont-clock-time pr-5px text-secondary text-lg" />
                              <span className="text-sm text-black dark:text-blackColor-dark">
                                {formatDurationFromSeconds(item?.quiztimelimit)}
                              </span>
                            </div>
                          </div>

                          <div
                            // to={`https://lms.atlearn.in/`}
                            // onClick={() =>
                            //   fetchCourseContents(item?.id, matchQuiz?.id)
                            // }
                            onClick={() =>
                              navigate(
                                `/online-test-details?course_id=${item?.id}`
                              )
                            }
                            className="text-lg font-semibold text-blackColor mb-10px font-hind dark:text-blackColor-dark hover:text-secondaryColor dark:hover:text-primaryColor"
                          >
                            {item?.fullname}
                          </div>
                        </div>

                        {/* Author Section */}
                        <div className="mt-auto flex items-center   justify-between h-full  ">
                          {/* Price */}
                          <div className="text-lg font-semibold text-primaryColor font-inter  flex items-center justify-center h-full">
                            {/* <span className="text-green-500">Free</span> */}
                            {item?.paymentinfo?.type === "fee" ? (
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
                                window.open(item.enrolurl, "_blank");
                              }}
                              className="text-size-15 text-whiteColor bg-primaryColor px-3 py-2 border  leading-5 border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
                            >
                              Start
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
                to={"/online-test"}
                title="More online Tests"
                className="text-size-15 px-47px py-15px bg-primaryColor text-whiteColor border border-primaryColor hover:text-primaryColor hover:bg-whiteColor dark:hover:bg-whiteColor-dark dark:hover:text-whiteColor mt-10 md:mt-50px rounded uppercase"
              >
                More online Tests
              </Link>
            </div>
          </>
        )
      )}
    </div>
  );
}

export default OnlineTestView;
