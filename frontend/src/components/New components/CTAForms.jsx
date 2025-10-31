import React, { useEffect, useState } from "react";
import { PopupModal } from "react-calendly";
import { useHandleNavigate } from "src/utils/Navigation/useHandleNavigate";
import SendeFormModal from "./Modal/SendeFormModal";
import { useNavigate } from "react-router-dom";

function CTAForms({ data }) {
  const [isOpen, setIsOpen] = useState(false);
  const handleNavigate = useHandleNavigate();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const navigate = useNavigate();
  const handleClick = (link) => {
    if (link === "/pricing" || link === "/contact") {
      navigate(link);
    } else {
      handleNavigate(link);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if (typeof window.senderForms !== "undefined") {
        window.senderForms.render();
      } else {
        window.addEventListener("SenderLoaded", () => {
          if (typeof window.senderForms !== "undefined") {
            window.senderForms.render();
          } else {
            console.error("senderForms is still not defined");
          }
        });
      }
    }, 0);
  }, [isOpenModal]);

  return (
    <div>
      <section className="bg-cover bg-center bg-no-repeat  register-section">
        <div className=" bg-secondaryColor bg-opacity-90   lg:pb-0 relative z-0 ">
          <div className="container md:container-secondary ">
            <div className="grid grid-cols-1 lg:grid-cols-12 pt-30px pb-30px gap-x-30px ">
              <div
                className="mb-30px lg:mb-0 pb-0 md:pb-30px xl:pb-0 lg:col-start-1 lg:col-span-12"
                data-aos="fade-up"
              >
                <div className="relative flex items-center w-full flex-col lg:flex-row justify-center  ">
                  {/* <div style="text-align: left" class="sender-form-field" data-sender-form-id="m86ybxeiepyrgnzdaiu"></div> */}
                  <div
                    className="sender-form-field w-full lg:w-1/2"
                    data-sender-form-id="85ffe46ff627c1a6fT4"
                    style={{ textAlign: "center" }}
                  ></div>
                  <div className="lg:w-1/2 flex flex-col items-center">
                    <span className=" text-center text-sm font-semibold text-primaryColor bg-whitegrey3 px-6 py-5px mb-5 rounded-full inline-block">
                      {data?.label}
                    </span>
                    <h3 className=" text-center text-3xl md:text-[35px] 2xl:text-size-42 leading-[45px] 2xl:leading-2xl font-bold text-whiteColor pb-25px">
                      {data?.heading}
                    </h3>
                    <div className=" text-center flex gap-x-5 items-center w-full flex-col">
                      <p className="text-size-15 md:text-[22px] lg:text-lg 2xl:text-[22px] leading-6 md:leading-9 lg:leading-8 2xl:leading-9 font-semibold text-white">
                        {data?.description}
                      </p>
                      {data?.points?.length > 0 && (
                        <ul className="space-y-5">
                          {data?.points?.map((item, index) => (
                            <li key={index} className="flex items-center group">
                              <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark" />
                              <p
                                className="text-size-15 md:text-[18px] lg:text-lg 2xl:text-[18px] leading-6 md:leading-9 lg:leading-8 2xl:leading-9 font-semibold text-white"
                                dangerouslySetInnerHTML={{
                                  __html: item.heading
                                    ? `<strong>${item.heading} - </strong>${
                                        item?.description || item
                                      }`
                                    : item?.description || item,
                                }}
                              />
                            </li>
                          ))}
                        </ul>
                      )}
                      {data?.ctaName && (
                        <>
                          {data?.ctaLink ? (
                            <div
                              onClick={() => handleClick(data?.ctaLink)}
                              className=" cursor-pointer mt-5 text-sm md:text-size-15 font-semibold text-darkdeep2 bg-whiteColor border border-whiteColor px-5 md:px-30px py-3 md:py-4 hover:text-whiteColor hover:bg-darkblack rounded inline-block mr-6px md:mr-30px shadow-hero-action dark:bg-whiteColor-dark dark:hover:bg-whiteColor dark:text-whiteColor dark:hover:text-whiteColor-dark dark:border-none mb-8"
                            >
                              {data?.ctaName}
                            </div>
                          ) : data?.ctaId === "calendly" ? (
                            <div
                              onClick={() => setIsOpen(true)}
                              className=" cursor-pointer mt-5 text-sm md:text-size-15 font-semibold text-darkdeep2 bg-whiteColor border border-whiteColor px-5 md:px-30px py-3 md:py-4 hover:text-whiteColor hover:bg-darkblack rounded inline-block mr-6px md:mr-30px shadow-hero-action dark:bg-whiteColor-dark dark:hover:bg-whiteColor dark:text-whiteColor dark:hover:text-whiteColor-dark dark:border-none mb-8"
                            >
                              {data?.ctaName}
                            </div>
                          ) : data?.embedPopupFormId ? (
                            <div
                              onClick={() => setIsOpenModal(true)}
                              className=" cursor-pointer mt-5 text-sm md:text-size-15 font-semibold text-darkdeep2 bg-whiteColor border border-whiteColor px-5 md:px-30px py-3 md:py-4 hover:text-whiteColor hover:bg-darkblack rounded inline-block mr-6px md:mr-30px shadow-hero-action dark:bg-whiteColor-dark dark:hover:bg-whiteColor dark:text-whiteColor dark:hover:text-whiteColor-dark dark:border-none mb-8"
                            >
                              {data?.ctaName}
                            </div>
                          ) : (
                            <div
                              id={data?.ctaId ? data.ctaId : ""}
                              className=" cursor-pointer mt-5 text-sm md:text-size-15 font-semibold text-darkdeep2 bg-whiteColor border border-whiteColor px-5 md:px-30px py-3 md:py-4 hover:text-whiteColor hover:bg-darkblack rounded inline-block mr-6px md:mr-30px shadow-hero-action dark:bg-whiteColor-dark dark:hover:bg-whiteColor dark:text-whiteColor dark:hover:text-whiteColor-dark dark:border-none mb-8"
                            >
                              {data?.ctaName}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <PopupModal
        // url="https://calendly.com/atlearn-lms/30min"
        url="https://calendly.com/atlearn-lms/atlearn-demo"
        onModalClose={() => setIsOpen(false)}
        open={isOpen}
        rootElement={document.getElementById("root")}
      />
      <SendeFormModal
        open={isOpenModal}
        handleClose={setIsOpenModal}
        formId={data?.embedPopupFormId ? data?.embedPopupFormId : ""}
      />
    </div>
  );
}

export default CTAForms;
