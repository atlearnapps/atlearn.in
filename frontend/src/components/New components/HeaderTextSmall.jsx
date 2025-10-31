import React from "react";

function HeaderTextSmall({ children }) {
  return (
    <h4 className=" mb-25px text-xl font-medium text-blackColor dark:text-blackCol font-thinor-dark dark:text-blackColor-dark">
      {children}
    </h4>
  );
}

export default HeaderTextSmall;
