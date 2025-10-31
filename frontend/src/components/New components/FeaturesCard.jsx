import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";

function FeaturesCard({ data, row }) {
  const navigate = useNavigate();
  // const handleNavigate = (link) => {
  //   if (link.startsWith("http://") || link.startsWith("https://")) {
  //     // Open the link in a new tab or handle external navigation
  //     // window.location.href = link;
  //     window.open(link, "_blank");
  //   } else {
  //     navigate(link);
  //   }
  // };
  const handleNavigate = useCallback(
    (link) => {
      if (!link) return;
      if (/^https?:\/\//.test(link)) {
        window.open(link, "_blank");
      } else {
        navigate(link);
      }
    },
    [navigate]
  );
  return (
    <section className=" pb-10">
      <div className="container">
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 ${
            row === 2
              ? "lg:grid-cols-2"
              : row === 3
              ? "lg:grid-cols-3"
              : "lg:grid-cols-4"
          } gap-8`}
        >
          {data &&
            data.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  handleNavigate(item?.link);
                }}
                data-aos="fade-up"
              >
                <div
                  className={`${
                    item?.link && "cursor-pointer"
                  } p-30px group bg-whiteColor rounded-xl transition-all duration-300 hover:-translate-y-5px shadow-dropdown-secodary hover:bg-primaryColor hover:text-whiteColor dark:bg-whiteColor-dark dark:hover:bg-primaryColor h-full border border-borderColor dark:border-borderColor-dark`}
                >
                  {/* card svg */}
                  <div className="-translate-y-2 flex justify-between overflow-hidden mb-10px">
                    {item?.image ? (
                      <div className="relative  flex justify-between w-full items-center">
                        <img
                          loading="lazy"
                          src={item?.image}
                          alt={item?.title}
                          title={item?.title}
                          className="w-15 h-15"
                        />
                        {item?.step && (
                          <div
                            className={`flex-shrink-0 w-10 h-10 flex items-center justify-center border-2 border-dashed rounded-full  font-bold text-xl dark:text-whiteColor `}
                          >
                            {item?.step}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="relative w-20 h-[60px]">
                        <svg
                          className="absolute inline-block translate-y-3 translate-x-2 w-20 h-[60px]"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            className="group-hover:fill-whiteColor dark:group-hover:fill-whiteColor-dark"
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M6.30281 28.9536H8.45394C9.05625 28.9536 9.48648 29.5426 9.48648 30.2495V36.8465C9.48648 37.6711 9.05625 38.2602 8.45394 38.2602H6.30281C5.78654 38.2602 5.27026 37.6711 5.27026 36.8465V30.2495C5.27026 29.5426 5.78654 28.9536 6.30281 28.9536Z"
                            fill="#5F2DED"
                          />
                          <path
                            className="group-hover:fill-whiteColor dark:group-hover:fill-whiteColor-dark"
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M13.7027 23.7833H15.8987C16.4257 23.7833 16.8649 24.4239 16.8649 25.3207V36.7228C16.8649 37.6196 16.4257 38.2602 15.8987 38.2602H13.7027C13.0879 38.2602 12.6487 37.6196 12.6487 36.7228V25.3207C12.6487 24.4239 13.0879 23.7833 13.7027 23.7833Z"
                            fill="#5F2DED"
                          />
                          <path
                            className="group-hover:fill-whiteColor dark:group-hover:fill-whiteColor-dark"
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M21.0596 19.6471H23.2108C23.727 19.6471 24.2433 20.412 24.2433 21.1769V36.7303C24.2433 37.6227 23.727 38.2602 23.2108 38.2602H21.0596C20.4573 38.2602 20.0271 37.6227 20.0271 36.7303V21.1769C20.0271 20.412 20.4573 19.6471 21.0596 19.6471Z"
                            fill="#5F2DED"
                          />
                          <path
                            className="group-hover:fill-whiteColor dark:group-hover:fill-whiteColor-dark"
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M28.4381 15.5109H30.5892C31.1055 15.5109 31.6217 16.1499 31.6217 17.0445V36.7265C31.6217 37.6212 31.1055 38.2602 30.5892 38.2602H28.4381C27.8357 38.2602 27.4055 37.6212 27.4055 36.7265V17.0445C27.4055 16.1499 27.8357 15.5109 28.4381 15.5109Z"
                            fill="#5F2DED"
                          />
                          <path
                            className="group-hover:fill-whiteColor dark:group-hover:fill-whiteColor-dark"
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M26.9989 7.6293L23.05 18.137L20.3744 15.4678C15.622 19.6266 9.96272 22.5976 3.63238 24.2568C1.36694 24.9297 0.353173 21.6176 2.74495 21.0505C8.47735 19.533 13.5443 16.8156 17.8363 13.1279L15.5453 10.8879L26.9989 7.6293Z"
                            fill="#FFB31F"
                          />
                        </svg>
                        <div className="service__bg__img w-20 h-[60px]">
                          <svg
                            className="w-20 h-[60px]"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              className="group-hover:fill-whiteColor dark:group-hover:fill-whiteColor-dark"
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M63.3775 44.4535C54.8582 58.717 39.1005 53.2202 23.1736 47.5697C7.2467 41.9192 -5.18037 32.7111 3.33895 18.4477C11.8583 4.18418 31.6595 -2.79441 47.5803 2.85105C63.5011 8.49652 71.8609 30.2313 63.3488 44.4865L63.3775 44.4535Z"
                              fill="#5F2DED"
                              fillOpacity="0.05"
                            />
                          </svg>
                        </div>
                      </div>
                    )}

                    <div className="service__small__img w-7 h-[60px]">
                      <svg
                        className="icon__hover__img w-7 h-[60px] opacity-0 group-hover:opacity-100"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16.5961 10.265L19 1.33069L10.0022 3.73285L1 6.1306L7.59393 12.6627L14.1879 19.1992L16.5961 10.265Z"
                          stroke="#FFB31F"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                  {/* card content */}
                  <div>
                    <div
                      className={`${
                        item?.link && "cursor-pointer"
                      } capitalize text-size-22 sm:text-size-17 md:text-size-22 lg:text-size-17 2xl:text-size-22 leading-29px sm:leading-15px md:leading-29px lg:leading-15px 2xl:leading-29px font-semibold mb-5px hover:text-secondaryColor font-hind  dark:text-whiteColor dark:hover:text-secondaryColor  dark:transition-all dark:duration-300`}
                    >
                      {item?.title}
                    </div>
                    <p
                      className="text-contentColor group-hover:text-whiteColor leading-29px"
                      dangerouslySetInnerHTML={{
                        __html: item?.description,
                      }}
                    ></p>

                    {item?.points?.length > 0 && (
                      <ul className="space-y-5 mb-2 mt-2">
                        {item?.points?.map((item, index) => (
                          <li key={index} className="flex items-center group">
                            <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark" />
                            <p className="text-sm md:text-base font-medium text-blackColor dark:text-blackColor-dark group-hover:text-whiteColor">
                              {item.heading && (
                                <strong>{item.heading} - </strong>
                              )}
                              {item.description}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesCard;
