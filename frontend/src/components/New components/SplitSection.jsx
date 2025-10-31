import React, { useState } from "react";
import TagLabel from "./TagLabel";
import MainHeaderText from "./MainHeaderText";
import Tilt from "../JS/VanillaTilt";
import ParagraphText from "./ParagraphText";
import HeaderTextSmall from "./HeaderTextSmall";
import { useNavigate } from "react-router-dom";
import HeaderTextMedium from "./HeaderTextMedium";
import { useHandleNavigate } from "src/utils/Navigation/useHandleNavigate";
import { InstagramEmbed } from "react-social-media-embed";
import SocialMediaEmbed from "./SocialMediaEmbed";
import LMSDemoModal from "./Modal/LMSDemoModal";
import MeetingDemoModal from "./Modal/MeetingDemoModal";

function SplitSection({ data, rightImage, headingTop, descriptionTop }) {
  const navigate = useNavigate();
  const handleNavigate = useHandleNavigate();
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const [demoLMSPopupOpen, setDemoLMSPopupOpen] = useState(false);
  const [freeMeetingDemoOpen, setFreeMeetingDemo] = useState(false);
  const handleClick = (link) => {
    if (link === "/pricing") {
      navigate(link);
    } else if (link === "request-lms-demo") {
      setDemoLMSPopupOpen(true);
    } else if (link === "request-meeting-demo") {
      setFreeMeetingDemo(true);
    } else {
      handleNavigate(link);
    }
  };
  return (
    <section>
      {rightImage ? (
        <div className="container md:container-secondary  py-50px ">
          <div className="text-center " data-aos="fade-up">
            {headingTop && <MainHeaderText>{data?.headerText}</MainHeaderText>}
            {descriptionTop &&
              data?.description?.map((sentence, index) => (
                <ParagraphText key={index} mainText={sentence} />
              ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-30px place-items-center">
            {/* about left */}
            <div className="flex flex-col justify-center items-center">
              <div data-aos="fade-up">
                {data?.tagLabel?.length && <TagLabel text={data?.tagLabel} />}

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
                        <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark  dark:text-contentColor-dark" />
                        <ParagraphText
                          mainText={item.description || item}
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
                    <HeaderTextSmall> {subSection.subHeading}</HeaderTextSmall>

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
                    {subSection.VideoLink && (
                      <div className="relative overflow-hidden mb-30px border-2 border-secondaryColor shadow-dropdown-secodary">
                        {/* <iframe
                          width="100%"
                          height="315"
                          // src={`https://www.youtube.com/embed/${subSection.VideoLink}`}
                          src={`https://www.youtube.com/embed/${subSection.VideoLink}?autoplay=1&loop=1&playlist=${subSection.VideoLink}`}
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe> */}

                        {!isIframeLoaded ? (
                          <button
                            className="w-full h-[315px] flex items-center justify-center relative group"
                            onClick={() => setIsIframeLoaded(true)}
                          >
                            <img
                              src={`https://img.youtube.com/vi/${subSection.VideoLink}/hqdefault.jpg`}
                              alt="YouTube video thumbnail"
                              title="YouTube video thumbnail"
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/60 transition">
                              <svg
                                className="w-16 h-16 text-white"
                                fill="currentColor"
                                viewBox="0 0 84 84"
                              >
                                <circle
                                  cx="42"
                                  cy="42"
                                  r="42"
                                  fill="currentColor"
                                  opacity="0.8"
                                />
                                <polygon
                                  points="33,24 60,42 33,60"
                                  fill="black"
                                />
                              </svg>
                            </div>
                          </button>
                        ) : (
                          <iframe
                            width="100%"
                            height="315"
                            src={`https://www.youtube.com/embed/${subSection.VideoLink}?autoplay=1&loop=1&playlist=${subSection.VideoLink}&mute=1&rel=0`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {data?.linkText?.length && (
                  <div className="mt-30px">
                    <button
                      // to={data?.linkHref}
                      // title={data?.linkText}
                      onClick={() => handleClick(data?.linkHref)}
                      className="text-sm md:text-size-15 text-whiteColor bg-primaryColor dark:bg-primaryColor border border-primaryColor px-25px py-15px hover:text-primaryColor hover:bg-whiteColor rounded inline-block mr-6px md:mr-30px dark:hover:bg-whiteColor-dark dark:hover:text-whiteColor"
                    >
                      {data.linkText} <i className="icofont-long-arrow-right" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* about right */}
            {data?.imageSrc?.length && (
              <div data-aos="fade-up">
                <div className="tilt">
                  <Tilt>
                    <img
                      // className="w-full   border rounded-lg2 shadow-lg "
                      className="w-full lg:min-h-[300px] "
                      src={data.imageSrc}
                      alt={data?.headerText}
                      title={data?.headerText}
                      loading="lazy"
                      decoding="async"
                    />
                  </Tilt>
                </div>
              </div>
            )}
            {data?.socialMedia && (
              <SocialMediaEmbed
                platform={data?.socialMedia?.platform}
                url={data?.socialMedia?.url}
              />
            )}
          </div>
        </div>
      ) : (
        <div
          className={`container md:container-secondary  ${
            !data?.imageSrc?.length && !data?.socialMedia
              ? " py-25px"
              : " py-50px"
          } `}
        >
          <div className="text-center " data-aos="fade-up">
            {headingTop && <MainHeaderText>{data?.headerText}</MainHeaderText>}
            {descriptionTop &&
              data?.description?.map((sentence, index) => (
                <ParagraphText key={index} mainText={sentence} />
              ))}
          </div>
          {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-30px"> */}
          <div
            className={`grid grid-cols-1 place-items-center ${
              !data?.imageSrc?.length && !data?.socialMedia
                ? "lg:grid-cols-1"
                : "lg:grid-cols-2"
            } gap-30px`}
          >
            {/* about left */}
            <div className=" order-2 lg:order-1" data-aos="fade-up">
              {data?.imageSrc?.length && (
                <div className="tilt ">
                  <Tilt>
                    <img
                      loading="lazy"
                      decoding="async"
                      // className="w-full  border rounded-lg2 shadow-lg "
                      className="w-full "
                      src={data.imageSrc}
                      alt={data?.headerText}
                      title={data?.headerText}
                    />
                  </Tilt>
                </div>
              )}

              {data?.socialMedia && (
                <SocialMediaEmbed
                  platform={data?.socialMedia?.platform}
                  url={data?.socialMedia?.url}
                />
              )}
            </div>
            <div className="order-1 lg:order-2 flex flex-col justify-center lg:items-center">
              {/* about right */}
              <div data-aos="fade-up">
                {data?.tagLabel?.length && <TagLabel text={data?.tagLabel} />}

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
                        <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark  dark:text-contentColor-dark" />
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
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                      <div className="flex-1 w-full">
                        <HeaderTextMedium>
                          {subSection.mainHeading}
                        </HeaderTextMedium>
                        {subSection?.subHeading && (
                          <HeaderTextSmall>
                            {subSection.subHeading}
                          </HeaderTextSmall>
                        )}

                        {subSection?.paragraphs?.map(
                          (subParagraph, spIndex) => (
                            <ParagraphText key={spIndex}>
                              {subParagraph}
                            </ParagraphText>
                          )
                        )}

                        {subSection?.features && (
                          <ul className="space-y-5">
                            {subSection.features.map(
                              (feature, featureIndex) => (
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
                              )
                            )}
                          </ul>
                        )}
                      </div>

                      {subSection?.image && (
                        <div className="flex-1">
                          <img
                            src={subSection.image}
                            alt={subSection.imageAlt || "Section Image"}
                            className="w-full h-auto object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      )}

                      {subSection?.VideoLink && (
                        <div
                          className="w-full flex-1 shadow-xl rounded-lg overflow-hidden border-2 border-secondaryColor shadow-dropdown-secodary"
                          data-aos="fade-up"
                        >
                          {/* <iframe
                            width="100%"
                            height="315"
                            src={`https://www.youtube.com/embed/${subSection.VideoLink}?autoplay=1&loop=1&playlist=${subSection.VideoLink}&mute=1`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe> */}

                          {!isIframeLoaded ? (
                            <button
                              className="w-full h-[315px] flex items-center justify-center relative group"
                              onClick={() => setIsIframeLoaded(true)}
                            >
                              <img
                                src={`https://img.youtube.com/vi/${subSection.VideoLink}/hqdefault.jpg`}
                                alt="YouTube video thumbnail"
                                title="YouTube video thumbnail"
                                className="w-full h-full object-cover rounded-lg"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/60 transition">
                                <svg
                                  className="w-16 h-16 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 84 84"
                                >
                                  <circle
                                    cx="42"
                                    cy="42"
                                    r="42"
                                    fill="currentColor"
                                    opacity="0.8"
                                  />
                                  <polygon
                                    points="33,24 60,42 33,60"
                                    fill="black"
                                  />
                                </svg>
                              </div>
                            </button>
                          ) : (
                            <iframe
                              width="100%"
                              height="315"
                              src={`https://www.youtube.com/embed/${subSection.VideoLink}?autoplay=1&loop=1&playlist=${subSection.VideoLink}&mute=1&rel=0`}
                              title="YouTube video player"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {data?.linkText?.length && (
                  <div className="mt-30px">
                    <button
                      onClick={() => handleClick(data?.linkHref)}
                      // to={data?.linkHref}
                      // title={data.linkText}
                      className="text-sm md:text-size-15 text-whiteColor bg-primaryColor dark:bg-primaryColor border border-primaryColor px-25px py-15px hover:text-primaryColor hover:bg-whiteColor rounded inline-block mr-6px md:mr-30px dark:hover:bg-whiteColor-dark dark:hover:text-whiteColor"
                    >
                      {data.linkText} <i className="icofont-long-arrow-right" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <LMSDemoModal
        open={demoLMSPopupOpen}
        handleClose={() => setDemoLMSPopupOpen(false)}
      />
      <MeetingDemoModal
        open={freeMeetingDemoOpen}
        handleClose={() => setFreeMeetingDemo(false)}
      />
    </section>
  );
}

export default SplitSection;
