import React from "react";

function ParagraphText({ children, mainText, highlightedText,strong }) {
  return (
    <div>
      <p
        data-aos="fade-up"
        className="text-sm md:text-base text-blackColor dark:text-blackColor-dark mb-10px "
        // dangerouslySetInnerHTML={{
        //   __html: mainText || children,
        // }}
        dangerouslySetInnerHTML={{
          __html: strong
            ? `<strong>${strong} - </strong>${mainText || children}`
            : mainText || children,
        }}
      />

      {highlightedText && (
        <p className="text-sm md:text-base leading-7 text-contentColor dark:text-contentColor-dark mb-10 pl-3 border-l-[3px] border-secondaryColor">
          {highlightedText}
        </p>
      )}
    </div>
  );
}

export default ParagraphText;
