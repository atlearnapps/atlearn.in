import React from "react";

function HeaderTextMedium({ children }) {
  return (
    <h3
      className="text-size-26 font-bold text-blackColor dark:text-blackColor-dark mb-15px !leading-30px"
      data-aos="fade-up"
    >
      {children}
    </h3>
  );
}

export default HeaderTextMedium;
