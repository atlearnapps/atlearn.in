import React, { useRef, useState } from 'react'

function FAQSection({data}) {
      const [activeIndex, setActiveIndex] = useState(null);
      const contentRef = useRef(null);
      const handleAccordionClick = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
      };
  return (
    <div>
            <section className="container pb-100px mt-16 ">
              <div className="fees faq grid grid-cols-1 lg:grid-cols-12 gap-30px">
                <div className="lg:col-start-1 lg:col-span-3" data-aos="fade-up">
                  <div className="lg:-rotate-90 lg:translate-y-3/4 relative">
                    <h4 className="text-size-150 lg:text-size-140 2xl:text-size-200 text-lightGrey dark:text-blackColor-dark opacity-50 uppercase font-bold leading-[1]">
                      FAQ
                    </h4>
                  </div>
                </div>
                {/* Accordion Container */}
                <div className="lg:col-start-4 lg:col-span-9" data-aos="fade-up">
                  <ul className="accordion-container rounded-md">
                    {data.map((item, index) => {
                      const isActive = activeIndex === index;
                      const contentHeight = isActive
                        ? `${contentRef.current.scrollHeight}px`
                        : "0px";
      
                      return (
                        <li
                          key={index}
                          className={`accordion ${isActive ? "active" : ""}`}
                        >
                          <div className="bg-whiteColor border border-borderColor dark:bg-whiteColor-dark dark:border-borderColor-dark">
                            {/* Accordion Controller */}
                            <button
                              className="accordion-controller flex justify-between items-center text-xl text-headingColor font-bold w-full px-10px pt-14px pb-15px md:px-25px md:pt-6 md:pb-25px dark:text-headingColor-dark font-hind leading-[20px] outline-4 outline-transparent transition-none border-b border-transparent"
                              onClick={() => handleAccordionClick(index)}
                            >
                              <span>{item.question}</span>
                              <svg
                                className={`transition-all duration-500 ${
                                  isActive ? "rotate-90" : "rotate-0"
                                }`}
                                width={20}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="#212529"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                                />
                              </svg>
                            </button>
                            {/* Accordion Content */}
                            <div
                              ref={contentRef}
                              className="accordion-content transition-all duration-500 overflow-hidden"
                              style={{ height: contentHeight }}
                            >
                              <div className="content-wrapper py-4 px-5">
                                <p className="leading-7 text-contentColor dark:text-contentColor-dark mb-15px">
                                  {item.answer}
                                </p>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </section>
    </div>
  )
}

export default FAQSection
