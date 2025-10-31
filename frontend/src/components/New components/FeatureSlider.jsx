import React, { useEffect, useState } from "react";
import apiClients from "src/apiClients/apiClients";
import Swiper from "swiper"; // Ensure you import Swiper styles and Swiper package
import "swiper/swiper-bundle.css";
function FeatureSlider() {
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
  useEffect(() => {
    const swiperElement = document.querySelector(".swiper");
    if (swiperElement) {
      // Initialize main ecommerce slider
      const swiper = new Swiper(".ecommerce-slider", {
        slidesPerView: 1,
        grabCursor: true,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      });

      // Initialize product details sliders
      const productDetailsSliders =
        document.querySelectorAll(".product-details");
      const productDetailsSliderThumbs = document.querySelectorAll(
        ".product-details-thumb"
      );

      if (productDetailsSliders.length) {
        productDetailsSliders.forEach((productDetailsSlider, idx) => {
          productDetailsSlider.classList.add(`product-details-${idx}`);
          productDetailsSliderThumbs[idx].classList.add(
            `product-details-thumb-${idx}`
          );

          const swiperThumbs = new Swiper(`.product-details-thumb-${idx}`, {
            spaceBetween: 10,
            slidesPerView: 5,
            freeMode: true,
            watchSlidesProgress: true,
          });

          const swiper2 = new Swiper(`.product-details-${idx}`, {
            spaceBetween: 10,
            navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            },
            thumbs: {
              swiper: swiperThumbs,
            },
          });
        });
      }

      // Initialize other sliders
      const swiperThumbs = new Swiper(".university__slider__thumb", {
        spaceBetween: 10,
        slidesPerView: 4,
        freeMode: true,
        watchSlidesProgress: true,
      });

      const swiperEcommerce2 = new Swiper(".ecommerce-slider2", {
        slidesPerView: 1,
        grabCursor: true,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        thumbs: {
          swiper: swiperThumbs,
        },
      });

      new Swiper(".card-slider", {
        effect: "cards",
        grabCursor: true,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
      });

      new Swiper(".featured-courses", {
        slidesPerView: 1,
        grabCursor: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        breakpoints: {
          768: {
            slidesPerView: 2,
          },
          992: {
            slidesPerView: 3,
          },
          1500: {
            slidesPerView: 4,
          },
        },
      });

      new Swiper(".other-courses", {
        slidesPerView: 1,
        spaceBetween: 30,
        grabCursor: true,
        loop: true,
        breakpoints: {
          500: {
            slidesPerView: 2,
          },
          576: {
            slidesPerView: 2,
            spaceBetween: 0,
          },
        },
      });

      new Swiper(".featured-courses1", {
        slidesPerView: 1,
        grabCursor: true,
        loop: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        breakpoints: {
          768: {
            slidesPerView: 2,
          },
          992: {
            slidesPerView: 3,
          },
        },
      });

      new Swiper(".mySwiper", {
        slidesPerView: 1,
        loop: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        breakpoints: {
          768: {
            slidesPerView: 2,
          },
        },
      });

      new Swiper(".testimonial-2", {
        slidesPerView: 1,
        loop: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      });
    }

    // Cleanup function to destroy Swipers on unmount
    return () => {
      if (swiperElement) {
        swiperElement?.swiper?.destroy(true, true);
      }
    };
  }, []);

  return (
    <div>
      {scheduleRoom?.length > 0 && (
        <section>
          <div className="pb-100px">
            <div className="container-fluid-2">
              {/* heading */}
              <div data-aos="fade-up">
                <h3
                  className="text-3xl md:text-[35px] lg:text-size-42 leading-[45px] 2xl:leading-[45px] md:leading-[50px] font-bold mb-5 md:mb-10 text-blackColor dark:text-blackColor-dark"
                  data-aos="fade-up"
                >
                  Join Our Online Classes
                </h3>
              </div>
              {/* featured cards */}
              <div data-aos="fade-up" className="sm:-mx-15px">
                {/* Swiper */}
                <div className="swiper featured-courses">
                  <div className="swiper-wrapper">
                    {/* card 1 */}
                    
                    <div className="swiper-slide">
                      <div className="w-full group grid-item filter1 filter3">
                        <div className="tab-content-wrapper sm:px-15px mb-30px">
                          <div className="p-15px bg-whiteColor shadow-brand dark:bg-darkdeep3-dark dark:shadow-brand-dark">
                            {/* card image */}
                            <div className="relative mb-4 overflow-hidden">
                              <div className="w-full">
                                <img
                                  src="../../assets/images/zoom/2.jpg"
                                  alt=""
                                  className="w-full transition-all duration-300 group-hover:scale-110"
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
                                      Dec 25,2024
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <div>
                                    <i className="icofont-clock-time pr-5px text-primaryColor text-lg" />
                                  </div>
                                  <div>
                                    <span className="text-sm text-black dark:text-blackColor-dark">
                                      2 hr 30 min
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div
                                className="text-lg md:text-size-22 font-semibold text-blackColor mb-10px font-hind dark:text-blackColor-dark hover:text-primaryColor dark:hover:text-primaryColor"
                              >
                                Website Renovation Meeting
                              </div>
                              {/* time */}
                              <p className="text-sm text-contentColor dark:text-contentColor-dark flex items-center">
                                Starting Time:
                                <span className="text-xl md:text-size-26 leading-9 md:leading-12 font-bold text-primaryColor ml-10px">
                                  5.00 PM
                                </span>
                              </p>
                              {/* time */}
                              <p className="text-sm text-contentColor dark:text-contentColor-dark flex items-center mb-15px">
                                Meeting ID :
                                <span className="text-sm md:text-lg leading-9 md:leading-12 font-bold text-secondaryColor ml-10px">
                                  952429936777
                                </span>
                              </p>
                              {/* author and rating*/}
                              <div className="pt-15px border-t border-borderColor">
                                <div>
                                  <div
                                    className="text-xs flex items-center text-contentColor hover:text-primaryColor dark:text-contentColor-dark dark:hover:text-primaryColor"
                                  >
                                    <img
                                      className="w-50px h-50px rounded-full mr-15px"
                                      src="../../assets/images/grid/grid_small_2.jpg"
                                      alt=""
                                    />
                                    <div>
                                      <span>Speaker:</span>
                                      <h3 className="text-lg font-bold text-blackColor dark:text-blackColor-dark">
                                        Mirnsdo .H
                                      </h3>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    

                  </div>
                  {/* <div className="swiper-button-next" />
           <div className="swiper-button-prev" /> */}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default FeatureSlider;
