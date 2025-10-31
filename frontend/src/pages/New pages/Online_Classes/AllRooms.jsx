import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import apiClients from "src/apiClients/apiClients";
import coverImage from "src/assets/images/online-classes/New/Classroom_Content_Online_Courses_Cover.webp";
import { formatDateRange } from "src/utils/formateDateRange";
import { calculateTimeDifference } from "src/utils/FormateDateUtils";
import { useHandleNavigate } from "src/utils/Navigation/useHandleNavigate";
import tutorCoverImage from "src/assets/images/online-classes/New/tutorCoverImage1.jpg";
import { Helmet } from "react-helmet";
import { BASE_URL } from "src/apiClients/config";
const itemsPerPage = 6;

function AllRooms() {
  const navigate = useNavigate();
  const [scheduleRoom, setScheduleRoom] = useState([]);

  const [selectedFilterOption, setSelectedFilterOption] = useState("All");
  const [searchName, setSearchName] = useState("");
  const [selectedDateTag, setSelectedDateTag] = useState("");
  const [selectedRoomTag, setSelectedRoomTag] = useState("");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const roomTage = queryParams.get("tag");
  const handleNavigate = useHandleNavigate();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (location.hash) {
      const section = document.querySelector(location.hash);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
        navigate("/join-meetings", { replace: true });
      }
    }
  }, [location]);

  useEffect(() => {
    if (roomTage) {
      setSelectedRoomTag(roomTage);
    }
  }, [roomTage]);

  useEffect(() => {
    // fetchLiveRooms();

    const fetchScheduleRoom = async () => {
      const data = {
        filter: selectedFilterOption,
        name: searchName ? searchName : "",
        date: selectedDateTag || "",
        tag: selectedRoomTag ? selectedRoomTag : "",
      };
      try {
        const response = await apiClients.sheduledMeetings(data);
        // const response = await apiClients.scheduleCount(true);
        if (response?.data) {
          setScheduleRoom(response.data || []);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchScheduleRoom();
  }, [selectedFilterOption, searchName, selectedDateTag, selectedRoomTag]);

  const handleChange = (event) => {
    setSelectedFilterOption(event.target.value);
  };
  const handleSearchName = (event) => {
    setSearchName(event.target.value);
    console.log("Search Term:", event.target.value);
  };

  const dateTags = ["Today", "This Week", "This Month"];

  const handleCheckboxChange = (tag) => {
    setSelectedDateTag((prev) => (prev === tag ? "" : tag));
  };

  const roomTags = ["Online Class", "Webinar", "Training"];

  const handleRoomTage = (tag) => {
    setSelectedRoomTag((prev) => (prev === tag ? "" : tag));
  };

  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total pages
  const totalPages = Math.ceil(scheduleRoom.length / itemsPerPage);

  // Slice courses based on pagination
  const paginatedscheduleRoom = scheduleRoom.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <Helmet>
        <title>Enroll in Interactive Classes and Learn with Atlearn</title>
        <meta
          name="description"
          content="Dive into interactive classes at Atlearn. Explore engaging content, expert guidance, and flexible learning designed to help you succeed."
        />
        <link rel="canonical" href={`${BASE_URL}/join-meetings`} />
      </Helmet>

      <section id="main">
        {/* bannaer section */}
        <div className="container2-xl bg-darkdeep1 py-50px  rounded-2xl relative overflow-hidden shadow-brand">
          <div className="container relative ">
            <div className="flex flex-col items-center text-center w-full lg:w-83% xl:w-3/4 mx-auto">
              {/* banner Left */}
              <div data-aos="fade-up">
                <h3 className="uppercase text-secondaryColor text-size-15 mb-5px md:mb-15px font-inter tracking-5px">
                  EDUCATION SOLUTION
                </h3>
                <h1 className="text-3xl text-whiteColor md:text-6xl lg:text-size-50 2xl:text-6xl leading-10 md:leading-18 lg:leading-62px 2xl:leading-18 md:tracking-half lg:tracking-normal 2xl:tracking-half font-bold mb-15px sm:mb-30px">
                  Join Our Online Meetings
                  <span className="text-secondaryColor">.</span>
                </h1>
                <p className="text-size-15md:text-lg text-white font-medium mb-45px">
                  Experience hassle-free online meetings with high-quality video
                  and screen sharing.
                </p>
                <div>
                  <button
                    onClick={() => handleNavigate("/room?role=Moderator")}
                    className="text-size-15 text-whiteColor bg-secondaryColor px-25px py-10px border border-secondaryColor hover:text-secondaryColor hover:bg-whiteColor inline-block rounded dark:hover:bg-whiteColor-dark dark:hover:text-whiteColor"
                  >
                    Create {selectedRoomTag || "Online Meeting"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div>
            <img
              className="absolute left-3/2 bottom-[15%] animate-spin-slow "
              src="./assets/images/register/register__2.png"
              alt="register icon"
              title="register icon"
            />
            <img
              className="  absolute left-[42%] sm:left-[65%] md:left-[42%] lg:left-[5%] top-[4%] sm:top-[1%] md:top-[4%] lg:top-[10%] animate-move-hor "
              src="./assets/images/herobanner/herobanner__6.png"
              alt="herobanner icon"
              title="herobanner icon"
            />
            <img
              className="absolute right-[5%] bottom-[15%] hidden md:block"
              src="./assets/images/herobanner/herobanner__7.png"
              alt="herobanner icon"
              title="herobanner icon"
            />
            {/* <img
              className="absolute top-[5%] left-[45%] hidden md:block"
              src="./assets/images/herobanner/herobanner__7.png"
              alt=""
            /> */}
          </div>
        </div>
      </section>
      <>
        {/* courses section */}
        <div id="meetings">
          <div className="container tab py-10 ">
            {/* courses header */}

            <div
              className="courses-header flex justify-between items-center flex-wrap px-13px py-10px border border-borderColor dark:border-borderColor-dark mb-30px gap-y-5 shadow-event"
              data-aos="fade-up"
            >
              <div>
                <h4 className="text-size-22 text-blackColor dark:text-blackColor-dark font-bold leading-30px ">
                  Meetings Scheduled
                </h4>
              </div>
              {/* {scheduleRoom.length > 0} */}
              <div className="flex items-center">
                <div className="pl-10px  pr-10px">
                  <select
                    className="text-blackColor bg-whiteColor py-3px pr-2 pl-3 rounded-md outline-none border-4 border-transparent focus:border-blue-light box-border"
                    value={selectedFilterOption}
                    onChange={handleChange}
                  >
                    <option value="All">All </option>
                    <option value="free">Free </option>
                    <option value="paid">Paid </option>
                    {/* <option value="Three">Three</option> */}
                  </select>
                </div>
                <div className="tab-links flex gap-3">
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
                    <h2 className="text-size-22 text-blackColor dark:text-blackColor-dark font-bold leading-30px mb-25px">
                      Search
                    </h2>
                    <div className="w-full px-4 py-15px text-sm text-contentColor bg-lightGrey10 dark:bg-lightGrey10-dark dark:text-contentColor-dark flex justify-center items-center leading-26px">
                      <input
                        value={searchName}
                        type="text"
                        onChange={handleSearchName}
                        placeholder="Search "
                        className="placeholder:text-placeholder bg-transparent focus:outline-none placeholder:opacity-80 w-full"
                      />
                      <button>
                        <i className="icofont-search-1 text-base" />
                      </button>
                    </div>
                  </div>
                  <div
                    className="pt-30px pr-15px pl-10px pb-23px 2xl:pt-10 2xl:pr-25px 2xl:pl-5 2xl:pb-33px mb-30px border border-borderColor dark:border-borderColor-dark shadow-event"
                    data-aos="fade-up"
                  >
                    <h4 className="text-size-22 text-blackColor dark:text-blackColor-dark font-bold leading-30px mb-25px">
                      Upcoming Meetings
                    </h4>
                    <ul className="flex flex-col gap-y-23px">
                      {dateTags.map((tag) => (
                        <li
                          key={tag}
                          className="text-contentColor text-size-15 font-medium hover:text-primaryColor dark:hover:text-primaryColor dark:text-contentColor-dark flex justify-between leading-26px group"
                        >
                          <label className="w-full flex items-center gap-11px cursor-pointer">
                            <input
                              type="checkbox"
                              name="tag"
                              value={tag}
                              checked={selectedDateTag === tag}
                              onChange={() => handleCheckboxChange(tag)}
                              className="w-14px h-15px border border-darkdeep6  appearance-none checked:bg-primaryColor checked:border-primaryColor"
                            />
                            <span>{tag}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* tags */}

                  <div
                    className="pt-30px pr-15px pl-10px pb-23px 2xl:pt-10 2xl:pr-25px 2xl:pl-5 2xl:pb-33px mb-30px border border-borderColor dark:border-borderColor-dark shadow-event"
                    data-aos="fade-up"
                  >
                    <h4 className="text-size-22 text-blackColor dark:text-blackColor-dark font-bold leading-30px mb-25px">
                      Tag
                    </h4>
                    <ul className="flex flex-col gap-y-23px">
                      {roomTags.map((tag) => (
                        <li
                          key={tag}
                          className="text-contentColor text-size-15 font-medium hover:text-primaryColor dark:hover:text-primaryColor dark:text-contentColor-dark flex justify-between leading-26px group"
                        >
                          <label className="w-full flex items-center gap-11px cursor-pointer">
                            <input
                              type="checkbox"
                              name="tag"
                              value={tag}
                              checked={selectedRoomTag === tag}
                              onChange={() => handleRoomTage(tag)}
                              className="w-14px h-15px border border-darkdeep6  appearance-none checked:bg-primaryColor checked:border-primaryColor"
                            />
                            <span>{tag}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* courses main */}
              <div className="md:col-start-5 md:col-span-8 lg:col-start-4 lg:col-span-9 space-y-[30px]">
                <div className="tab-contents">
                  {/* grid ordered cards */}
                  {activeTab === 0 && (
                    <>
                      {scheduleRoom && scheduleRoom.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-7">
                          {paginatedscheduleRoom?.map((item, index) => (
                            <div key={index} className="group h-full">
                              <div
                                onClick={() =>
                                  navigate(
                                    `/Join-meeting?roomId=${item?.room?.friendly_id}&scheduleId=${item?.id}`
                                  )
                                }
                                className="tab-content-wrapper h-full"
                                data-aos="fade-up"
                              >
                                <div className="flex flex-col h-full cursor-pointer transition-all duration-300 hover:-translate-y-1 p-4 bg-whiteColor shadow-xl dark:bg-darkdeep3-dark dark:shadow-brand-dark border border-borderColor dark:border-borderColor-dark">
                                  {/* Card Image */}
                                  <div className="relative mb-4 overflow-hidden">
                                    <div className="flex justify-center items-center w-full h-[150px] overflow-hidden">
                                      <img
                                        src={
                                          item?.room?.cover_image_url
                                            ? `${process.env.REACT_APP_OVERRIDE_HOST}/api/images/${item?.room?.cover_image_url}`
                                            : coverImage
                                        }
                                        alt={item?.title}
                                        title={item?.title}
                                        className="max-w-full max-h-full object-contain"
                                      />
                                    </div>
                                    <div className="absolute left-0 top-1 flex justify-between w-full items-center px-2">
                                      <p className="text-xs text-whiteColor px-4 py-[3px] bg-secondaryColor rounded font-semibold">
                                        {item?.room?.room_type ===
                                        "online_class"
                                          ? "Online Class"
                                          : item?.room?.room_type === "webinar"
                                          ? "Webinar"
                                          : "Training"}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex-grow">
                                    <div className="flex flex-wrap justify-between items-center mb-4">
                                      <div className="flex items-center">
                                        <i className="icofont-calendar pr-2 text-secondary text-lg dark:text-contentColor-dark" />
                                        <span className="text-sm text-black dark:text-blackColor-dark">
                                          {
                                            formatDateRange(
                                              item?.startDate,
                                              item?.endDate
                                            ).formattedStartDate
                                          }
                                        </span>
                                      </div>
                                      <div className="flex items-center">
                                        <i className="icofont-clock-time pr-2 text-secondary text-lg dark:text-contentColor-dark" />
                                        <span className="text-sm text-black dark:text-blackColor-dark">
                                          {calculateTimeDifference(
                                            item.startDate,
                                            item.endDate
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                    <Link
                                      to={`/Join-meeting?roomId=${item?.room?.friendly_id}&scheduleId=${item?.id}`}
                                      title={item?.title}
                                      className="text-lg md:text-2xl font-semibold text-blackColor mb-4 font-hind dark:text-blackColor-dark hover:text-primaryColor"
                                    >
                                      {item?.title}
                                    </Link>
                                  </div>
                                  {/* Starting Time and Speaker Section */}
                                  <div className="mt-auto">
                                    <p className="text-sm text-contentColor dark:text-contentColor-dark flex items-center">
                                      {item?.price > 0 ? (
                                        <span className="text-xl font-bold text-primaryColor text-contentColor-dark">
                                          ₹ {item?.price}
                                        </span>
                                      ) : (
                                        <span className="text-base font-semibold text-greencolor">
                                          Free
                                        </span>
                                      )}
                                    </p>
                                    <p className="text-sm text-contentColor dark:text-contentColor-dark flex items-center mb-4">
                                      Starting Time:
                                      <span className="text-xl md:text-2xl font-bold text-primaryColor ml-2 text-contentColor-dark">
                                        {
                                          formatDateRange(
                                            item.startDate,
                                            item.endDate
                                          ).formattedStartTime
                                        }
                                      </span>
                                    </p>
                                    <div className="pt-4 border-t border-borderColor">
                                      <div className="text-xs flex items-center text-contentColor hover:text-primaryColor dark:text-contentColor-dark">
                                        <img
                                          loading="lazy"
                                          className="w-12 h-12 rounded-full mr-4"
                                          src={
                                            item?.room?.user?.avatar
                                              ? `${process.env.REACT_APP_OVERRIDE_HOST}/api/images/${item?.room?.user?.avatar}`
                                              : tutorCoverImage
                                          }
                                          alt={
                                            item?.room?.user?.name ||
                                            "instructor"
                                          }
                                          title={
                                            item?.room?.user?.name ||
                                            "instructor"
                                          }
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
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {/* list ordered cards */}
                  {activeTab === 1 && (
                    <>
                      <div className=" transition-all duration-300">
                        {scheduleRoom && scheduleRoom?.length > 0 && (
                          <div className="flex flex-col gap-30px">
                            {/* card 1 */}
                            {paginatedscheduleRoom?.map((item, index) => (
                              <div
                                key={index}
                                className="w-full group grid-item rounded"
                              >
                                <div
                                  className="tab-content-wrapper"
                                  data-aos="fade-up"
                                  onClick={() =>
                                    navigate(
                                      `/Join-meeting?roomId=${item?.room?.friendly_id}&scheduleId=${item?.id}`
                                    )
                                  }
                                >
                                  <div className="cursor-pointer transition-all duration-300 hover:-translate-y-5px p-15px lg:pr-30px bg-whiteColor shadow-xl dark:bg-darkdeep3-dark dark:shadow-brand-dark border border-borderColor dark:border-borderColor-dark flex flex-wrap md:flex-nowrap rounded">
                                    {/* card image */}
                                    <div className="relative overflow-hidden w-full md:w-2/5">
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "center",
                                          alignItems: "center",
                                          width: "100%",
                                          height: "100%",
                                          overflow: "hidden",
                                        }}
                                      >
                                        <img
                                          src={
                                            item?.room?.cover_image_url
                                              ? `${process.env.REACT_APP_OVERRIDE_HOST}/api/images/${item?.room?.cover_image_url}`
                                              : coverImage
                                          }
                                          alt={"alt"}
                                          style={{
                                            maxWidth: "100%",
                                            maxHeight: "100%",
                                            objectFit: "contain",
                                          }}
                                        />
                                      </div>
                                      <div className="absolute left-0 top-1 flex justify-between w-full items-center px-2">
                                        <p className="text-xs text-whiteColor px-4 py-[3px] bg-secondaryColor rounded font-semibold">
                                          {item?.room?.room_type ===
                                          "online_class"
                                            ? "Online Class"
                                            : item?.room?.room_type ===
                                              "webinar"
                                            ? "Webinar"
                                            : "Training"}
                                        </p>
                                      </div>
                                    </div>
                                    {/* card content */}
                                    <div className="w-full md:w-3/5">
                                      <div className="pl-0 lg:pl-30px">
                                        <div className="grid grid-cols-2 mb-15px">
                                          <div className="flex items-center">
                                            <div>
                                              <i className="icofont-calendar pr-5px text-primaryColor text-lg dark:text-contentColor-dark" />
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
                                              <i className="icofont-clock-time pr-5px text-primaryColor text-lg dark:text-contentColor-dark" />
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
                                          className="text-size-26 leading-30px font-semibold text-blackColor mb-10px font-hind dark:text-blackColor-dark hover:text-primaryColor dark:hover:text-primaryColor"
                                        >
                                          {item?.title}
                                        </Link>
                                        <div className="text-lg font-semibold text-black-brerry-light font-inter mb-4 dark:text-contentColor-dark">
                                          Starting Time:
                                          <span className="text-xl md:text-size-26 leading-9 md:leading-12 font-bold text-primaryColor ml-10px dark:text-contentColor-dark">
                                            {
                                              formatDateRange(
                                                item.startDate,
                                                item.endDate
                                              ).formattedStartTime
                                            }
                                          </span>
                                        </div>
                                        {/* price */}
                                        <div className="text-lg font-semibold text-black-brerry-light font-inter mb-4">
                                          {item?.price > 0 ? (
                                            <div className="text-size-21 font-bold text-primaryColor font-inter leading-25px dark:text-contentColor-dark">
                                              ₹ {item?.price}
                                            </div>
                                          ) : (
                                            <span className="">
                                              <span className="text-base font-semibold text-greencolor">
                                                Free
                                              </span>
                                            </span>
                                          )}
                                        </div>
                                        {/* bottom */}
                                        <div className="flex flex-wrap justify-between sm:flex-nowrap items-center gap-y-2 pt-15px border-t border-borderColor">
                                          {/* author and rating*/}
                                          <div className="flex items-center flex-wrap">
                                            <div>
                                              <div className="text-sm font-medium font-hind flex items-center hover:text-primaryColor dark:text-blackColor-dark dark:hover:text-primaryColor">
                                                <img
                                                  className="w-[30px] h-[30px] rounded-full mr-15px"
                                                  src={
                                                    item?.room?.user?.avatar
                                                      ? `${process.env.REACT_APP_OVERRIDE_HOST}/api/images/${item?.room?.user?.avatar}`
                                                      : tutorCoverImage
                                                  }
                                                  alt={
                                                    item?.room?.user?.name ||
                                                    "instructor"
                                                  }
                                                />
                                                <span className="flex">
                                                  {item?.room?.user?.name}
                                                </span>
                                              </div>
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
                        )}
                      </div>
                    </>
                  )}
                </div>
                {/* pagination */}
                {scheduleRoom?.length > 0 ? (
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
                ) : (
                  <div className="col-span-full text-center p-10 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                      No online meetings available at the moment. Please check
                      back later.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
}

export default AllRooms;
