import React from "react";
import HeaderText from "./HeaderText";
// import TagLabel from "./TagLabel";
import ParagraphText from "./ParagraphText";

function SectionHeading({ center, data }) {
  return (
    <div className="container md:container-secondary ">
      {/* program Heading */}
      <div
        className={`${center ? "text-center" : ""} mb-5 md:mb-5`}
        data-aos="fade-up"
      >
        {/* <div>{data?.label && <TagLabel text={data?.label}/>}</div> */}
        <span className="text-size-15 font-semibold text-secondaryColor inline-block uppercase mb-[13px]">
        {data?.label}
            </span>
        <HeaderText>{data?.heading}</HeaderText>
        <ParagraphText mainText={data?.paragraph} />
      </div>
    </div>
  );
}

export default SectionHeading;
