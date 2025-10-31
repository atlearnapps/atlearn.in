import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClients from "src/apiClients/apiClients";
import { formatDateRange } from "src/utils/formateDateRange";
import { calculateTimeDifference } from "src/utils/FormateDateUtils";
import coverImage from "src/assets/images/online-classes/New/Classroom_Content_Online_Courses_Cover.webp"

function JoinClasses() {
  const [scheduleRoom, setScheduleRoom] = useState([]);
  useEffect(() => {
    // fetchLiveRooms();
    fetchScheduleRoom();
  }, []);

  const fetchScheduleRoom = async () => {
    try {
      const response = await apiClients.sheduledMeetings();
      // const response = await apiClients.scheduleCount(true);
      if (response?.data) {
        setScheduleRoom(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <>
        {/* banner section */}
        <section>
          {/* banner section */}
          <div className="bg-lightGrey10 dark:bg-lightGrey10-dark relative z-0 overflow-y-visible py-50px md:py-20 lg:py-100px 2xl:pb-150px 2xl:pt-40.5">
            {/* animated icons */}
            <div>
              <img
                className="absolute left-0 bottom-0 md:left-[14px] lg:left-[50px] lg:bottom-[21px] 2xl:left-[165px] 2xl:bottom-[60px] animate-move-var z-10"
                src="../../assets/images/herobanner/herobanner__1.png"
                alt=""
              />
              <img
                className="absolute left-0 top-0 lg:left-[50px] lg:top-[100px] animate-spin-slow"
                src="../../assets/images/herobanner/herobanner__2.png"
                alt=""
              />
              <img
                className="absolute right-[30px] top-0 md:right-10 lg:right-[575px] 2xl:top-20 animate-move-var2 opacity-50 hidden md:block"
                src="../../assets/images/herobanner/herobanner__3.png"
                alt=""
              />
              <img
                className="absolute right-[30px] top-[212px] md:right-10 md:top-[157px] lg:right-[45px] lg:top-[100px] animate-move-hor"
                src="../../assets/images/herobanner/herobanner__5.png"
                alt=""
              />
            </div>
            <div className="container">
              <div className="text-center">
                <h1 className="text-3xl md:text-size-40 2xl:text-size-55 font-bold text-blackColor dark:text-blackColor-dark mb-7 md:mb-6 pt-3">
                  Join Our Online Classes
                </h1>
              </div>
            </div>
          </div>
        </section>
      </>
      {scheduleRoom?.length > 0 ? (
        <>
          {/*meeting cards section */}
          <section>
            <div
              className="container-fluid-2 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-30px pt-100px pb-100px"
              data-aos="fade-up"
            >
              {/* card 1 */}
              {scheduleRoom?.map((item, index) => (
                <div key={index} className="group" data-aos="fade-up">
                  <div>
                    <div className="p-15px bg-whiteColor shadow-brand dark:bg-darkdeep3-dark dark:shadow-brand-dark">
                      {/* card image */}
                      <div className="relative mb-4 overflow-hidden">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                            height: "150px",
                            overflow: "hidden",
                          }}
                        >
                          <img
                                 src={item?.room?.cover_image_url 
                                  ? `${process.env.REACT_APP_OVERRIDE_HOST}/api/images/${item?.room?.cover_image_url}` 
                                  : coverImage}
                            alt={"alt"}
                            style={{
                              maxWidth: "100%",
                              maxHeight: "100%",
                              objectFit: "contain",
                            }}
                          />
                        </div>
                      </div>
                      {/* card content */}
                      <div>
                        <div className="flex flex-wrap justify-between items-center mb-15px">
                          <div className="flex items-center">
                            <div>
                              <i className="icofont-calendar pr-5px text-primaryColor text-lg" />
                            </div>
                            <div>
                              <span className="text-sm text-black dark:text-blackColor-dark">
                                {
                                  formatDateRange(
                                    item?.startDate,
                                    item?.endDate
                                  ).formattedStartDate
                                }
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div>
                              <i className="icofont-clock-time pr-5px text-primaryColor text-lg" />
                            </div>
                            <div>
                              <span className="text-sm text-black dark:text-blackColor-dark">
                                {calculateTimeDifference(
                                  item.startDate,
                                  item.endDate
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Link
                          to={`/Join-meeting?roomId=${item?.room?.friendly_id}&scheduleId=${item?.id}`}
                          className="text-lg md:text-size-22 font-semibold text-blackColor mb-10px font-hind dark:text-blackColor-dark hover:text-primaryColor dark:hover:text-primaryColor"
                        >
                          {item?.title}
                        </Link>
                        {/* time */}
                        <p className="text-sm text-contentColor dark:text-contentColor-dark flex items-center">
                          Starting Time:
                          <span className="text-xl md:text-size-26 leading-9 md:leading-12 font-bold text-primaryColor ml-10px">
                            {
                              formatDateRange(item.startDate, item.endDate)
                                .formattedStartTime
                            }
                          </span>
                        </p>
                        {/* time */}
                        {/* <p className="text-sm text-contentColor dark:text-contentColor-dark flex items-center mb-15px">
                              Meeting ID :
                              <span className="text-sm md:text-lg leading-9 md:leading-12 font-bold text-secondaryColor ml-10px">
                                952428993999
                              </span>
                            </p> */}
                        {/* author and rating*/}
                        <div className="pt-15px border-t border-borderColor">
                          <div>
                            <div
                              className="text-xs flex items-center text-contentColor hover:text-primaryColor dark:text-contentColor-dark dark:hover:text-primaryColor"
                            >
                              <img
                                className="w-50px h-50px rounded-full mr-15px"
                                src="../../assets/images/grid/grid_small_1.jpg"
                                alt=""
                              />
                              <div>
                                <span>Speaker:</span>
                                <h3 className="text-lg font-bold text-blackColor dark:text-blackColor-dark">
                                  {item?.room?.user?.name}
                                </h3>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        <div
          className="container-fluid-2  pt-100px pb-100px text-center"
          data-aos="fade-up"
        >
          <p className="text-size-22 font-bold">No scheduled classes at the moment. Please check back later!</p>
        </div>
      )}
    </div>
  );
}

export default JoinClasses;
