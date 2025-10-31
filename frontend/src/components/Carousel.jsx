import { useState, Fragment } from "react";
import Button from "./Button";
import { useHandleNavigate } from "src/utils/Navigation/useHandleNavigate";

const Carousel = ({ slides, active }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };
  const handleNavigate = useHandleNavigate();
  return (
    <div className="relative w-full mx-auto p-4">
      {/* Slide Images */}
      <div className="relative w-full h-96 sm:h-96 md:h-[500px] ">
        <img
          loading="lazy"
          src={slides[currentIndex].image}
          alt={`Slide ${currentIndex}`}
          className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
        />

        {/* Overlay */}
        {/* <div className="leading-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 md:top-1/4 md:left-4 sm:left-10 p-4 md:rounded-tl-[165px] md:rounded-tr-[171px] md:rounded-bl-[171px] md:rounded-br-[40px] rounded-lg text-[1rem] sm:text-[1.63rem] leading-6 sm:leading-8 h-auto sm:h-72 w-[90%] sm:w-[70%] max-w-[31.00rem] bg-fuchsia-950 bg-opacity-75 md:bg-opacity-100"> */}

        <div className=" leading-8 absolute top-4 md:top-1/4 left-4 sm:left-10 p-4 md:rounded-tl-[165px] md:rounded-tr-[171px] md:rounded-bl-[171px] md:rounded-br-[40px]  rounded-lg text-[1rem] sm:text-[1.63rem] leading-6 sm:leading-8 h-auto sm:h-72 w-[90%] sm:w-[70%] max-w-[31.00rem] bg-primary bg-opacity-75 md:bg-opacity-100">
          <h1
            className=" leading-8 text-white font-semibold font-fredoka text-center mt-4 sm:mt-10"
            style={{ fontSize: slides[currentIndex].title.fontSize }}
          >
            {slides[currentIndex].title.text}
          </h1>
          <h1
            className=" leading-8 text-white font-semibold font-fredoka text-center mt-2 sm:mt-6"
            style={{ fontSize: slides[currentIndex].title2.fontSize }}
          >
            {slides[currentIndex].title2.text}
          </h1>
          <p
            className="text-white text-center font-fredoka leading-5 mt-2 sm:mt-5"
            style={{ fontSize: slides[currentIndex].description.fontSize }}
          >
            {slides[currentIndex].description.text
              .split("\n")
              .map((line, index) => (
                <Fragment key={index}>
                  {line}
                  <br />
                </Fragment>
              ))}
          </p>
          <div className="text-center mt-2 flex justify-center">
            <Button
              onClick={() => {
                handleNavigate(slides[currentIndex].ctaLink)
              }}
              text={slides[currentIndex].ctaText}
            />
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      {/* Uncomment if needed */}
      {/* <button
        onClick={() => goToSlide(currentIndex === 0 ? slides.length - 1 : currentIndex - 1)}
        className="absolute top-1/2 left-5 transform -translate-y-1/2 bg-white bg-opacity-80 text-black p-2 rounded-full hover:bg-opacity-100 transition duration-300"
      >
        ❮
      </button>
      <button
        onClick={() => goToSlide(currentIndex === slides.length - 1 ? 0 : currentIndex + 1)}
        className="absolute top-1/2 right-5 transform -translate-y-1/2 bg-white bg-opacity-80 text-black p-2 rounded-full hover:bg-opacity-100 transition duration-300"
      >
        ❯
      </button> */}

      {/* Dot Indicators */}
      <div className="absolute right-4 bottom-10 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-2 sm:h-3 w-2 sm:w-3 rounded-full ${
              index === currentIndex ? "bg-secondary" : "bg-gray-300"
            } transition duration-300`}
            onClick={() => goToSlide(index)}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
