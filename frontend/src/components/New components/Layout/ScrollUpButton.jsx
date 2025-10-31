import { useEffect, useState } from "react";

const ScrollUpButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  return (
    <div>
      <button
        className={`scroll-up w-12 h-12 leading-[50px] text-center text-primaryColor bg-white hover:text-whiteColor hover:bg-primaryColor rounded-full fixed right-5 bottom-24 shadow-scroll-up z-medium text-xl dark:text-whiteColor dark:bg-primaryColor dark:hover:text-whiteColor-dark ${isVisible ? 'block' : 'hidden'}`}
        onClick={scrollToTop}
      >
        <i className="icofont-rounded-up" />
      </button>
    </div>
  );
};

export default ScrollUpButton;
