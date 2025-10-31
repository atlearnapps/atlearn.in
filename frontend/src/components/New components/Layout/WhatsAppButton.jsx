import React from "react";
// import { Link } from "react-router-dom";
// import { useSocialNavigate } from "src/utils/Navigation/useSocialNavigate";
import CustomTooltip from "../CustomTooltip/CustomTooltip";
function WhatsAppButton() {
  //   const handleSocialNavigate = useSocialNavigate();
  return (
    <div className="relative">
      {/* Main Button */}
      <CustomTooltip title="Chat With Us!" arrow placement="right">
        <button
          onClick={() =>window.open("https://wa.me/918015801639", "_blank")}
          className="group scroll-up w-14 h-14 leading-[50px] text-center hover:scale-105 transition-transform bg-green-500   rounded-full fixed left-24 bottom-6 shadow-scroll-up z-medium text-[16px]   flex items-center justify-center"
        >
          {/* <i className="icofont-question"></i> */}
          <svg
            width="38"
            height="38"
            viewBox="0 0 24 24"
            fill="#ffffff"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 0C5.37 0 0 5.37 0 12c0 2.13.56 4.2 1.62 6.02L0 24l6.27-1.58C8.06 23.44 10.02 24 12 24c6.63 0 12-5.37 12-12S18.63 0 12 0zm0 22c-1.86 0-3.68-.5-5.27-1.43l-.38-.22-3.72.94.99-3.61-.25-.4C2.49 15.24 2 13.64 2 12 2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zm5.38-7.44c-.28-.14-1.64-.81-1.89-.9-.25-.09-.44-.14-.63.14-.19.28-.72.9-.88 1.09-.16.19-.33.21-.61.07-.28-.14-1.18-.44-2.24-1.41-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.44.12-.6.13-.13.28-.33.42-.49.14-.16.19-.28.28-.47.09-.19.05-.35-.02-.49-.07-.14-.63-1.52-.86-2.08-.22-.53-.44-.46-.61-.47-.16 0-.35-.02-.54-.02-.19 0-.49.07-.75.35-.26.28-1 1.01-1 2.44s1.02 2.83 1.16 3.02c.14.19 2 3.04 4.85 4.14.68.29 1.21.47 1.63.6.68.21 1.3.18 1.79.11.55-.08 1.64-.67 1.87-1.32.23-.65.23-1.21.16-1.32-.07-.11-.26-.18-.54-.32z" />
          </svg>
        </button>
      </CustomTooltip>
    </div>
  );
}

export default WhatsAppButton;
