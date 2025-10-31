import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import MainHeaderText from "src/components/New components/MainHeaderText";
import ParagraphText from "./ParagraphText";
import { useNavigate } from "react-router-dom";

const SliderSection = ({ data, rightImage, headingTop }) => {
  const navigate = useNavigate();
  // Preload the first image for better LCP performance
  useEffect(() => {
    if (data?.slides.length > 0) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = data?.slides[0].image;
      document.head.appendChild(link);
    }
  }, []);

  return (
    <div className=" relative container  mt-10px ">
      <div className=" py-50px">
        {headingTop && (
          <div className="text-center " data-aos="fade-up">
            <MainHeaderText>{data?.headerText}</MainHeaderText>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-30px">
          {rightImage ? (
            <>
              {/* about left */}
              <div className="flex flex-col justify-center items-center">
                <div data-aos="fade-up" className="">
                  {!headingTop && (
                    <MainHeaderText>{data?.headerText}</MainHeaderText>
                  )}

                  {data?.description?.map((sentence, index) => (
                    <ParagraphText key={index} mainText={sentence} />
                  ))}
                  {data?.points?.length > 0 && (
                    <ul className="space-y-5">
                      {data?.points?.map((item, index) => (
                        <li key={index} className="flex items-center group">
                          <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark" />
                          <ParagraphText
                            mainText={item.description}
                            strong={item.heading}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                  {data?.ctaName?.length && (
                    <div className="mt-30px">
                      {data?.ctaLink ? (
                        <button
                          onClick={() =>
                            data?.ctaLink ? navigate(data?.ctaLink) : null
                          }
                          // to={data?.linkHref}
                          // title={data.linkText}
                          className="text-sm md:text-size-15 text-whiteColor bg-primaryColor border border-primaryColor px-25px py-15px hover:text-primaryColor hover:bg-whiteColor rounded inline-block mr-6px md:mr-30px dark:hover:bg-whiteColor-dark dark:hover:text-whiteColor"
                        >
                          {data.ctaName}{" "}
                          <i className="icofont-long-arrow-right" />
                        </button>
                      ) : (
                        <button
                          id={data?.ctaId || ""}
                          // to={data?.linkHref}
                          // title={data.linkText}
                          className="text-sm md:text-size-15 text-whiteColor bg-primaryColor border border-primaryColor px-25px py-15px hover:text-primaryColor hover:bg-whiteColor rounded inline-block mr-6px md:mr-30px dark:hover:bg-whiteColor-dark dark:hover:text-whiteColor"
                        >
                          {data.ctaName}{" "}
                          <i className="icofont-long-arrow-right" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {/* about right */}
              <div className="flex justify-center items-center  ">
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  navigation
                  // pagination={{ clickable: true }}
                  autoplay={{ delay: 5000, disableOnInteraction: false }}
                  // loop={true}
                  // spaceBetween={30}
                  // slidesPerView={2}
                  breakpoints={{
                    320: { slidesPerView: 1, spaceBetween: 10 },
                    768: { slidesPerView: 1, spaceBetween: 15 },
                    1024: { slidesPerView: 1, spaceBetween: 20 },
                  }}
                >
                  {data?.slides.map((slide, index) => (
                    <SwiperSlide key={slide.id}>
                      <div style={{ textAlign: "center" }}>
                        <img
                          src={slide?.image}
                          alt={slide?.title}
                          title={slide?.title}
                          className="w-full h-full  rounded-lg"
                          fetchpriority={index === 0 ? "high" : "auto"}
                          loading={index === 0 ? "eager" : "lazy"}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </>
          ) : (
            <>
              {/* about right */}
              <div className="flex justify-center items-center  ">
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  navigation
                  // pagination={{ clickable: true }}
                  autoplay={{ delay: 5000, disableOnInteraction: false }}
                  // loop={true}
                  // spaceBetween={30}
                  // slidesPerView={2}
                  breakpoints={{
                    320: { slidesPerView: 1, spaceBetween: 10 },
                    768: { slidesPerView: 1, spaceBetween: 15 },
                    1024: { slidesPerView: 1, spaceBetween: 20 },
                  }}
                >
                  {data?.slides.map((slide, index) => (
                    <SwiperSlide key={slide.id}>
                      <div style={{ textAlign: "center" }}>
                        <img
                          src={slide?.image}
                          alt={slide?.title}
                          title={slide?.title}
                          className="w-full h-full  rounded-lg"
                          fetchpriority={index === 0 ? "high" : "auto"}
                          loading={index === 0 ? "eager" : "lazy"}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
              {/* about left */}
              <div className="flex flex-col justify-center items-center">
                <div data-aos="fade-up" className="">
                  {!headingTop && (
                    <MainHeaderText>{data?.headerText}</MainHeaderText>
                  )}

                  {data?.description?.map((sentence, index) => (
                    <ParagraphText key={index} mainText={sentence} />
                  ))}
                  {data?.points?.length > 0 && (
                    <ul className="space-y-5">
                      {data?.points?.map((item, index) => (
                        <li key={index} className="flex items-center group">
                          <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark" />
                          <ParagraphText
                            mainText={item.description}
                            strong={item.heading}
                          />
                        </li>
                      ))}
                    </ul>
                  )}

                  {data?.ctaName?.length && (
                    <div className="mt-30px">
                      <button
                        // onClick={()=>handleClick(data?.linkHref)}
                        // to={data?.linkHref}
                        // title={data.linkText}
                        className="text-sm md:text-size-15 text-whiteColor bg-primaryColor border border-primaryColor px-25px py-15px hover:text-primaryColor hover:bg-whiteColor rounded inline-block mr-6px md:mr-30px dark:hover:bg-whiteColor-dark dark:hover:text-whiteColor"
                      >
                        {data.ctaName}{" "}
                        <i className="icofont-long-arrow-right" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SliderSection;
