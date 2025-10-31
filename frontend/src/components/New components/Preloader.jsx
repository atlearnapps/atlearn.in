import React, { useEffect } from "react";
import AtlearnIcon from "src/assets/images/Logo/atlearn-favicon.png";

const Preloader = () => {
  useEffect(() => {
    const preloaderElement = document.querySelector(".preloader");

    // Set a delay to hide the preloader after 1 second
    setTimeout(() => {
      preloaderElement.style.opacity = "0";
      preloaderElement.style.visibility = "hidden";

      // Remove the preloader from display after transition ends
      setTimeout(() => {
        preloaderElement.style.display = "none";
      }, 400);
    }, 1000);
  }, []);

  return (
    <div>
      {/* Preloader */}
      <div className="preloader flex fixed top-0 left-0 h-screen w-full items-center justify-center z-xxl bg-whiteColor opacity-100 visible transition-all duration-700">
        {/* Spinner */}
        <div className="w-[90px] h-[90px] border-[5px] border-t-blue border-r-blue border-b-blue-light border-l-blue-light rounded-full animate-spin-infinit"></div>
        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
          <img src={AtlearnIcon} alt="Preloader" title="Preloader" className="h-15 w-15 block" />
        </div>
      </div>
    </div>
  );
};

export default Preloader;
