import React, { useState } from "react";
import MainHeaderText from "src/components/New components/MainHeaderText";
import ParagraphText from "./ParagraphText";
import { useNavigate } from "react-router-dom";
import { useHandleNavigate } from "src/utils/Navigation/useHandleNavigate";
import MeetingDemoModal from "./Modal/MeetingDemoModal";
import LazyYoutubeEmbed from "./LazyYoutubeEmbed";
import HeaderTextMedium from "./HeaderTextMedium";
import HeaderTextSmall from "./HeaderTextSmall";

const VideoSection = ({ data, rightSideVideo, headingTop, descriptionTop }) => {
  const navigate = useNavigate();
  const handleNavigate = useHandleNavigate();
  const [freeMeetingDemoOpen, setFreeMeetingDemo] = useState(false);
  const handleClick = (link) => {
    if (link === "/blog" || link === "/ai") {
      navigate(link);
    } else {
      handleNavigate(link);
    }
  };

  return (
    <div>
      <div className=" relative container md:container-secondary  mt-10px ">
        <div className="text-center " data-aos="fade-up">
          {headingTop && <MainHeaderText>{data?.headerText}</MainHeaderText>}
          {descriptionTop &&
            data?.description?.map((sentence, index) => (
              <ParagraphText key={index} mainText={sentence} />
            ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-30px py-4">
          {rightSideVideo ? (
            <>
              {/* about left */}
              <div className="flex flex-col justify-center items-center">
                <div data-aos="fade-up" className="">
                  {!headingTop && (
                    <MainHeaderText>{data?.headerText}</MainHeaderText>
                  )}

                  {!descriptionTop &&
                    data?.description?.map((sentence, index) => (
                      <ParagraphText key={index} mainText={sentence} />
                    ))}
                  {data?.points?.length > 0 && (
                    <ul className="space-y-5">
                      {data?.points?.map((item, index) => (
                        <li key={index} className="flex items-center group">
                          <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark" />
                          <ParagraphText
                            mainText={item?.description || item}
                            strong={item.heading}
                          />
                        </li>
                      ))}
                    </ul>
                  )}

                  {data.subSections?.map((subSection, subIndex) => (
                    <div key={subIndex}>
                      <HeaderTextMedium>
                        {subSection?.mainHeading}
                      </HeaderTextMedium>
                      <HeaderTextSmall>
                        {" "}
                        {subSection.subHeading}
                      </HeaderTextSmall>

                      {subSection.paragraphs?.map((subParagraph, spIndex) => (
                        <ParagraphText key={spIndex}>
                          {subParagraph}
                        </ParagraphText>
                      ))}
                      {subSection?.image && (
                        <div className="overflow-hidden relative mb-30px">
                          <img
                            src={subSection?.image}
                            alt={subSection?.mainHeading || "Atlearn"}
                            title={subSection?.mainHeading || "Atlearn"}
                            className="w-full"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      )}
                      {subSection?.features && (
                        <ul className="space-y-5">
                          {subSection.features.map((feature, featureIndex) => (
                            <li
                              key={featureIndex}
                              className="flex items-center group"
                            >
                              <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark  dark:text-contentColor-dark" />
                              <ParagraphText
                                mainText={feature?.description || feature}
                                strong={feature.heading}
                              />
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                  {data?.linkText?.length && (
                    <div className="mt-30px">
                      <button
                        // to={data?.linkHref}
                        // title={data?.linkText}
                        onClick={() => {
                          if (data?.linkHref === "request-meeting-demo") {
                            setFreeMeetingDemo(true);
                          } else {
                            handleClick(data?.linkHref);
                          }
                        }}
                        className="text-sm md:text-size-15 text-whiteColor bg-primaryColor dark:bg-primaryColor border border-primaryColor px-25px py-15px hover:text-primaryColor hover:bg-whiteColor rounded inline-block mr-6px md:mr-30px dark:hover:bg-whiteColor-dark dark:hover:text-whiteColor"
                      >
                        {data.linkText}{" "}
                        <i className="icofont-long-arrow-right" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {/* about right */}
              <div className="flex justify-center items-center w-full  ">
                {data.VideoLink && (
                  <LazyYoutubeEmbed videoId={data.VideoLink} />
                )}
              </div>
            </>
          ) : (
            <>
              {/* about right */}
              <div className="flex justify-center items-center w-full  ">
                {data.VideoLink && (
                  <LazyYoutubeEmbed videoId={data.VideoLink} />
                )}
              </div>
              {/* about left */}
              <div className="flex flex-col justify-center items-center">
                <div data-aos="fade-up" className="">
                  {!headingTop && (
                    <MainHeaderText>{data?.headerText}</MainHeaderText>
                  )}
                  {!descriptionTop &&
                    data?.description?.map((sentence, index) => (
                      <ParagraphText key={index} mainText={sentence} />
                    ))}
                  {data?.points?.length > 0 && (
                    <ul className="space-y-5">
                      {data?.points?.map((item, index) => (
                        <li key={index} className="flex items-center group">
                          <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark" />
                          <ParagraphText
                            mainText={item?.description || item}
                            strong={item.heading}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                                    {data.subSections?.map((subSection, subIndex) => (
                    <div key={subIndex}>
                      <HeaderTextMedium>
                        {subSection?.mainHeading}
                      </HeaderTextMedium>
                      <HeaderTextSmall>
                        {" "}
                        {subSection.subHeading}
                      </HeaderTextSmall>

                      {subSection.paragraphs?.map((subParagraph, spIndex) => (
                        <ParagraphText key={spIndex}>
                          {subParagraph}
                        </ParagraphText>
                      ))}
                      {subSection?.image && (
                        <div className="overflow-hidden relative mb-30px">
                          <img
                            src={subSection?.image}
                            alt={subSection?.mainHeading || "Atlearn"}
                            title={subSection?.mainHeading || "Atlearn"}
                            className="w-full"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      )}
                      {subSection?.features && (
                        <ul className="space-y-5">
                          {subSection.features.map((feature, featureIndex) => (
                            <li
                              key={featureIndex}
                              className="flex items-center group"
                            >
                              <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark  dark:text-contentColor-dark" />
                              <ParagraphText
                                mainText={feature?.description || feature}
                                strong={feature.heading}
                              />
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                  {data?.linkText?.length && (
                    <div className="mt-30px">
                      <button
                        // to={data?.linkHref}
                        // title={data?.linkText}
                        onClick={() => {
                          if (data?.linkHref === "request-meeting-demo") {
                            setFreeMeetingDemo(true); // assuming setModalOpen is your modal trigger
                          } else {
                            handleClick(data?.linkHref);
                          }
                        }}
                        className="text-sm md:text-size-15 text-whiteColor bg-primaryColor dark:bg-primaryColor border border-primaryColor px-25px py-15px hover:text-primaryColor hover:bg-whiteColor rounded inline-block mr-6px md:mr-30px dark:hover:bg-whiteColor-dark dark:hover:text-whiteColor"
                      >
                        {data.linkText}{" "}
                        <i className="icofont-long-arrow-right" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <MeetingDemoModal
        open={freeMeetingDemoOpen}
        handleClose={() => setFreeMeetingDemo(false)}
      />
    </div>
  );
};

export default VideoSection;
