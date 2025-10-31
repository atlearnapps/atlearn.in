import React from "react";
import { Link } from "react-router-dom";
import { useSocialNavigate } from "src/utils/Navigation/useSocialNavigate";
function HelpButton() {
  const handleSocialNavigate = useSocialNavigate();
  return (
    <div className="relative">
      {/* Main Button */}
      <button title="helpbutton" className="group scroll-up w-14 h-14 leading-[50px] text-center text-primaryColor bg-white hover:text-whiteColor hover:bg-primaryColor rounded-full fixed left-4 bottom-6 shadow-scroll-up z-medium text-[16px] dark:text-whiteColor dark:bg-primaryColor dark:hover:text-whiteColor-dark">
        <i className="icofont-question"></i>
        <ul className=" shadow-dropdown absolute left-0 bottom-16 mt-2 max-w-dropdown2 w-2000  bg-white dark:bg-whiteColor-dark rounded-md shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 dark:bg-whiteColor-dark">
          <li>
            <Link
              to={"/feedback"}
              title="Share Feedback"
              className=" cursor-pointer block text-blackColor hover:bg-primaryColor  dark:text-contentColor-dark hover:text-whiteColor dark:hover:bg-primaryColor dark:hover:text-whiteColor"
            >
              Share Feedback
            </Link>
          </li>
          <li>
            <Link
              to={"/tutorial"}
              title="Tutorial"
              className=" cursor-pointer block text-blackColor hover:bg-primaryColor  dark:text-contentColor-dark hover:text-whiteColor dark:hover:bg-primaryColor dark:hover:text-whiteColor"
            >
              Tutorial
            </Link>
          </li>
          <li>
            <span
              onClick={() =>
                handleSocialNavigate(
                  "https://www.youtube.com/@Atlearn_In/videos"
                )
              }
              className=" cursor-pointer block text-blackColor hover:bg-primaryColor  dark:text-contentColor-dark hover:text-whiteColor dark:hover:bg-primaryColor dark:hover:text-whiteColor"
            >
              Watch our Youtube
            </span>
          </li>
        </ul>
      </button>
    </div>
  );
}

export default HelpButton;
