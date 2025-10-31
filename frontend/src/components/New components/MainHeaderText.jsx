import React from "react";

function MainHeaderText({ children }) {
  return (
    <h2
      className="text-3xl md:text-size-35 2xl:text-size-38 3xl:text-size-42 leading-10 md:leading-2xl font-bold text-blackColor dark:text-blackColor-dark pb-25px"
      dangerouslySetInnerHTML={{__html: children }}
    />
  );
}

export default MainHeaderText;
