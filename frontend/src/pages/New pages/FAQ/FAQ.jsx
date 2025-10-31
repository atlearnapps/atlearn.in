import React, { useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { BASE_URL } from "src/apiClients/config";

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);
  const contentRef = useRef(null);

  const accordionData = [
    {
      question: "What is an LMS?",
      answer:
        "An LMS, or Learning Management System, is a software application for the administration, documentation, tracking, reporting, automation, and delivery of educational courses, training programs, or learning and development programs.",
    },
    {
      question: "What is a virtual classroom?",
      answer:
        "A virtual classroom is an online learning environment that allows teachers and students to communicate, interact, collaborate, and discuss learning materials and activities in real-time.",
    },
    {
      question: "How do I sign up?",
      answer:
        "You can sign up by clicking the Sing Up button on the homepage and filling out the registration form with your details.",
    },
    {
      question:
        "What are the system requirements for using the LMS and virtual classroom?",
      answer:
        "You need a modern web browser (like Chrome, Firefox, or Safari), a stable internet connection, and a device with audio and video capabilities for virtual classrooms.",
    },
    {
      question: "How do I enroll in a course?",
      answer:
        "Browse the course catalog, select the course you are interested in, and click the 'Enroll' button. Follow the on-screen instructions to complete your enrollment.",
    },
    {
      question: "How do I access my courses?",
      answer:
        "After logging in, navigate to the 'My Courses' section from your dashboard to see and access all the courses you are enrolled in.",
    },
    {
      question: "How do I join a virtual classroom session?",
      answer:
        "Go to the course page and click on the link for the virtual classroom session at the scheduled time. Ensure your microphone and camera are working correctly before joining.",
    },
    {
      question: "What payment methods are accepted?",
      answer:
        "We accept major credit/debit cards, PayPal, and other secure payment gateways.",
    },
    {
      question: "Can I access the LMS and virtual classroom on mobile devices?",
      answer:
        " Yes, our LMS and virtual classroom are mobile-friendly and can be accessed on smartphones and tablets through a web browser or dedicated app.",
    },
    {
      question: "How do I update my profile information?",
      answer:
        "Log in to your account, go to the 'Profile' section, and edit your information as needed.",
    },
  ];

  const handleAccordionClick = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  return (
    <div>
      <Helmet>
      <title>Atlearn FAQ: Clear Answers to Common Questions</title>
        <meta
          name="description"
          content="Get quick answers to common questions with Atlearn's FAQ. Find the information you need to navigate our platform with ease."
        />
        <link rel="canonical" href={`${BASE_URL}/faq`} />
      </Helmet>
      {/* banner section */}
      <section>
        {/* banner section */}
        <div className="bg-lightGrey10 dark:bg-lightGrey10-dark relative z-0 overflow-y-visible py-50px md:py-20 lg:py-100px 2xl:pb-150px 2xl:pt-40.5">
          {/* animated icons */}
          <div>
            <img
              className="absolute left-0 bottom-0 md:left-[14px] lg:left-[50px] lg:bottom-[21px] 2xl:left-[165px] 2xl:bottom-[60px] animate-move-var z-10"
              src="./assets/images/herobanner/herobanner__1.png"
              alt=""
            />
            <img
              className="absolute left-0 top-0 lg:left-[50px] lg:top-[100px] animate-spin-slow"
              src="./assets/images/herobanner/herobanner__2.png"
              alt=""
            />
            <img
              className="absolute right-[30px] top-0 md:right-10 lg:right-[575px] 2xl:top-20 animate-move-var2 opacity-50 hidden md:block"
              src="./assets/images/herobanner/herobanner__3.png"
              alt=""
            />
            <img
              className="absolute right-[30px] top-[212px] md:right-10 md:top-[157px] lg:right-[45px] lg:top-[100px] animate-move-hor"
              src="./assets/images/herobanner/herobanner__5.png"
              alt=""
            />
          </div>
          <div className="container">
            <div className="text-center">
              <h1 className="text-3xl md:text-size-40 2xl:text-size-55 font-bold text-blackColor dark:text-blackColor-dark mb-7 md:mb-6 pt-3">
                FAQ
              </h1>
              {/* <p className="text-size-15md:text-lg text-blackColor dark:text-blackColor-dark font-medium">
                Get in touch with us for any questions or support—we're here to
                help
              </p> */}
            </div>
          </div>
        </div>
      </section>
      <>
        {/*faq section */}
        <section className="container pb-100px mt-16 mb-16">
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
                {accordionData.map((item, index) => {
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
      </>
    </div>
  );
}

export default FAQ;
