import React, { useEffect, useState } from "react";
import HeaderText from "../HeaderText";
import apiClients from "src/apiClients/apiClients";
import { FaArrowRight } from "react-icons/fa6";
import { FaArrowLeft } from "react-icons/fa6";
import CircleIcon from "@mui/icons-material/Circle";
import videoCallIcon from "src/assets/img/circlevideo.svg";
import Button from "../Button";
import { formatDateRange } from "src/utils/formateDateRange";

const PublicMeetings = () => {
  const [scheduleRoom, setScheduleRoom] = useState([]);
  const [currentScrollPosition, setCurrentScrollPosition] = useState(0);
  const scrollDistance = 240;
  const totalWidth = scheduleRoom.length * 240;

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
  const scrollLeft = () => {
    setCurrentScrollPosition((prev) => Math.max(prev - scrollDistance, 0));
  };

  const scrollRight = () => {
    setCurrentScrollPosition((prev) =>
      Math.min(prev + scrollDistance, totalWidth - 240)
    );
  };

  // function formatDateRange(startDateStr, endDateStr) {
  //   // Parse the input date strings into Date objects
  //   const startDate = new Date(startDateStr);
  //   const endDate = new Date(endDateStr);

  //   // Function to format a single date
  //   function formatDate(date) {
  //     const options = {
  //       weekday: "short",
  //       month: "short",
  //       day: "numeric",
  //       year: "numeric",
  //     };
  //     return date.toLocaleDateString("en-US", options);
  //   }

  //   // Function to format time
  //   function formatTime(date) {
  //     let hours = date.getHours();
  //     const minutes = date.getMinutes();
  //     const ampm = hours >= 12 ? "PM" : "AM";
  //     hours = hours % 12;
  //     hours = hours ? hours : 12; // the hour '0' should be '12'
  //     const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  //     return `${hours}:${formattedMinutes} ${ampm}`;
  //   }

  //   // Format both dates and times
  //   const formattedStartDate = formatDate(startDate);
  //   // const formattedEndDate = formatDate(endDate);
  //   const formattedStartTime = formatTime(startDate);
  //   const formattedEndTime = formatTime(endDate);

  //   // Combine the formatted date and time
  //   return {
  //     formattedStartDate,
  //     formattedStartTime,
  //     formattedEndTime,
  //   };
  // }

  const handleCopy = (id,Sheduled_id) => {
    window.open(
      `${window.location.origin}/room/${id}/join?id=${Sheduled_id}`
    );
  };

  return (
    <>
      {scheduleRoom?.length > 0 && (
        <div className="md:px-24 px-2 mt-10">
          <div className="flex-wrap justify-between flex mt-[calc(15px_*_-1)] mx-[calc(20px/_">
            <div className="px-4 w-full max-w-full mt-3.5 md:w-auto">
              <div className="mb-[calc(60px_-_22px)]">
                <span
                  className="text-secondary font-bold tracking-[0.3em] font-fredoka uppercase -mt-0 mb-6"
                  id="span-1"
                >
                  Come and Be part of the exciting live room listed below
                </span>

                <HeaderText>Join Meetings</HeaderText>
              </div>
            </div>

            <div className="self-end px-4 w-full max-w-full mt-3.5 text-white md:w-auto">
              <div className="mb-[calc(60px_-_9px)]" id="div-5">
                <button
                  onClick={scrollLeft}
                  className="bg-secondary items-center cursor-pointer justify-center inline-flex w-14 h-14 mr-1 rounded-full"
                >
                  <FaArrowLeft />
                </button>

                <button
                  onClick={scrollRight}
                  className="bg-secondary items-center cursor-pointer justify-center inline-flex w-14 h-14 rounded-full"
                >
                  <FaArrowRight />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto no-scrollbar snap-x">
            <div
              className="flex gap-6"
              style={{
                transform: `translateX(-${currentScrollPosition}px)`,
                transition: "transform 0.3s ease",
              }}
            >
              {scheduleRoom.map((item, index) => (
                <div
                  key={index}
                  className="p-8 w-80 group snap-start relative mb-10 rounded-3xl border-t-8 border-primary w-60 flex-shrink-0 hover:bg-primary hover:border-secondary duration-500 flex flex-col"
                  style={{ boxShadow: "0 12px 15px rgba(73, 13, 89, 0.5)" }}
                >
                  <div className="bg-white bottom-0 left-0 absolute top-0 z-[-1] rounded-3xl" />
                  <div className="bg-primary bottom-0 left-0 absolute top-0 z-[-2] rounded-3xl" />
                  <div className="bg-secondary bottom-0 left-0 absolute top-0 z-[-3] rounded-3xl" />
                  {item?.room?.online && (
                    <div className="absolute top-2 right-5">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <CircleIcon
                          sx={{
                            color: "green",
                            fontSize: "0.8rem",
                          }}
                        />
                        <span
                          style={{
                            fontSize: "16px",
                            color: "green",
                          }}
                        >
                          online
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="w-full flex items-center gap-4">
                    <img className="w-24 h-24" src={videoCallIcon} alt="" />
                    <div>
                      <p className="font-large font-fredoka text-[#444444] group-hover:text-white">
                        {
                          formatDateRange(
                            item.startDate,
                            item.endDate
                          ).formattedStartDate
                        }
                      </p>
                      <p className="font-large font-fredoka text-[#444444] group-hover:text-white">
                        {
                          formatDateRange(
                            item.startDate,
                            item.endDate
                          ).formattedStartTime
                        }{" "}
                        -{" "}
                        {
                          formatDateRange(
                            item.startDate,
                            item.endDate
                          ).formattedEndTime
                        }
                      </p>
                    </div>
                  </div>
                  <h3 className="text-center text-black text-3xl font-semibold mb-3 font-fredoka group-hover:text-white">
                    {item?.title}
                  </h3>
                  <div className="flex-grow"></div>
                  <div className="flex items-center justify-center mt-1">
                    <Button
                      onClick={() =>
                        handleCopy(
                          item.room.friendly_id,
                    
                          item?.id
                        )
                      }
                    >
                      Join
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PublicMeetings;
