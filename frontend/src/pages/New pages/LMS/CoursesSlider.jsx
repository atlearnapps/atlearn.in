import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import slider1 from "src/assets/images/LMS/Slider/CourseSlider/1.webp";
import slider2 from "src/assets/images/LMS/Slider/CourseSlider/2.webp";
import slider3 from "src/assets/images/LMS/Slider/CourseSlider/3.webp";
import slider4 from "src/assets/images/LMS/Slider/CourseSlider/4.webp";
import slider5 from "src/assets/images/LMS/Slider/CourseSlider/5.webp";
import slider6 from "src/assets/images/LMS/Slider/CourseSlider/6.webp";
import slider7 from "src/assets/images/LMS/Slider/CourseSlider/7.webp";
import slider8 from "src/assets/images/LMS/Slider/CourseSlider/8.webp";
import slider9 from "src/assets/images/LMS/Slider/CourseSlider/9.webp";
import slider10 from "src/assets/images/LMS/Slider/CourseSlider/10.webp";
import slider11 from "src/assets/images/LMS/Slider/CourseSlider/11.webp";
import slider12 from "src/assets/images/LMS/Slider/CourseSlider/12.webp";
import slider13 from "src/assets/images/LMS/Slider/CourseSlider/13.webp";
import slider14 from "src/assets/images/LMS/Slider/CourseSlider/14.webp";

// import SectionHeading from "src/components/New components/SectionHeading";
// import { courseSliderContent } from "src/Page_Content/LMS";
import MainHeaderText from "src/components/New components/MainHeaderText";
import ParagraphText from "src/components/New components/ParagraphText";
const CoursesSlider = () => {
  const slides = [
    { id: 1, title: "Slider1", image: slider1 },
    { id: 2, title: "Slider2", image: slider2 },
    { id: 3, title: "Slider3", image: slider3 },
    { id: 4, title: "Slider4", image: slider4 },
    { id: 5, title: "Slider5", image: slider5 },
    { id: 6, title: "Slider6", image: slider6 },
    { id: 7, title: "Slider7", image: slider7 },
    { id: 8, title: "Slider8", image: slider8 },
    { id: 9, title: "Slider9", image: slider9 },
    { id: 10, title: "Slider10", image: slider10 },
    { id: 11, title: "Slider11", image: slider11 },
    { id: 12, title: "Slider12", image: slider12 },
    { id: 13, title: "Slider13", image: slider13 },
    { id: 14, title: "Slider14", image: slider14 },
  ];

  return (
    <div className=" relative container border rounded-lg shadow-lg mt-10px">
      {/* <SectionHeading data={courseSliderContent} center={true}/> */}

      <div className="container py-50px">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-30px">
          {/* about left */}
          <div className="flex flex-col justify-center items-center">
            <div data-aos="fade-up" className="">
              <MainHeaderText>
                Online Course Guidelines - Best Practices for Success
              </MainHeaderText>

              <ParagraphText
                mainText={
                  "This is a comprehensive guide designed to promote effective and respectful online learning. It outlines key expectations for both teachers and students, covering areas such as communication, participation, assignment submission, and maintaining a <b>positive learning environment</b>. Adhering to these rules helps ensure a productive and respectful online classroom experience for everyone involved."
                }
              />
            </div>
          </div>

          {/* about right */}
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
            {slides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div style={{ textAlign: "center" }}>
                  <img
                    src={slide.image}
                    alt={slide.title}
                    title={slide.title}
                    // style={{ width: "100%", height: "auto", borderRadius: "10px" }}
                    className="w-full h-auto  rounded-lg"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default CoursesSlider;
