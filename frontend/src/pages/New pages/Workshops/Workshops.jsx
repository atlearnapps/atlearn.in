import React from "react";
import HowItWorks from "../Online_Classes/HowItWorks";
import { Helmet } from "react-helmet";
import CourseGuide from "./CourseGuide";
import ZoomonAtlearnGuide from "./ZoomonAtlearnGuide";
import StorylaneGuide from "./StorylaneGuide";
import CTASection from "src/components/New components/CTASection";
import { BASE_URL } from "src/apiClients/config";

function Workshops() {
  const CTA = {
    // label: "Transform Learning, Simplify Teaching",
    heading: "Master the Platform with Ease",
    description:
      "Step-by-step tutorials to help educators and admins get the most out of Atlearn.",
    ctaName: "View Tutorials",
    embedPopupFormId: "mbambgcjdr6kv0zhhvt",
  };
  return (
    <div>
      <Helmet>
        <title>Free Virtual Classroom Platforms for Online Learning</title>
        <meta
          name="description"
          content="Join the Online Learning Consortium with Atlearn. Access free virtual classroom platforms and interactive virtual classes with kits."
        />
        <link rel="canonical" href={`${BASE_URL}/tutorial`} />
      </Helmet>
      <section>
        {/* bannaer section */}
        <div className="container2-xl bg-darkdeep1 py-50px  rounded-2xl relative overflow-hidden shadow-brand">
          <div className="container">
            <div className="flex flex-col items-center text-center w-full lg:w-83% xl:w-3/4 mx-auto">
              {/* banner Left */}
              <div data-aos="fade-up" className="w-4/5">
                {/* <h3 className="uppercase text-secondaryColor text-size-15 mb-5px md:mb-15px font-inter tracking-5px">
                  EDUCATION SOLUTION
                </h3> */}
                <h1 className="text-3xl text-whiteColor md:text-6xl lg:text-size-50 2xl:text-6xl leading-10 md:leading-18 lg:leading-62px 2xl:leading-18 md:tracking-half lg:tracking-normal 2xl:tracking-half font-bold ">
                  Tutorial
                  <span className="text-secondaryColor">.</span>
                </h1>
                {/* <p className="text-size-15 md:text-lg text-white  font-medium">
                  Discover Insights and Trends Shaping the Future of Learning
                  and Education
                </p> */}
                {/* <div>
                  <button
                    // onClick={() => handleNavigate("/room")}
                    className=" mt-2 text-size-15 text-whiteColor bg-secondaryColor px-25px py-10px border border-secondaryColor hover:text-secondaryColor hover:bg-whiteColor inline-block rounded dark:hover:bg-whiteColor-dark dark:hover:text-whiteColor"
                  >
                    Watch Our Youtube
                  </button>
                </div> */}
              </div>
            </div>
          </div>
          <div>
            {/* <img
              className="absolute left-1/2 bottom-[15%] animate-spin-slow hidden md:block"
              src="./assets/images/register/register__2.png"
              alt=""
            /> */}
            <img
              className="absolute left-[42%] sm:left-[65%] md:left-[42%] lg:left-[5%] top-[4%] sm:top-[1%] md:top-[4%] lg:top-[10%] animate-move-hor"
              src="./assets/images/herobanner/herobanner__6.png"
              alt="herobanner icon"
              title="herobanner icon"
            />
            <img
              className="absolute right-[5%] bottom-[15%] hidden md:block"
              src="./assets/images/herobanner/herobanner__7.png"
              alt="herobanner icon"
              title="herobanner icon"
            />
            {/* <img
              className="absolute top-[5%] left-[45%] hidden md:block"
              src="./assets/images/herobanner/herobanner__7.png"
              alt=""
            /> */}
          </div>
        </div>
      </section>
      <HowItWorks />
      <section>
        <CourseGuide />
      </section>
      <section>
        <ZoomonAtlearnGuide />
      </section>
      <section>
        <StorylaneGuide />
      </section>
      <section>
        <CTASection data={CTA} />
      </section>
    </div>
  );
}

export default Workshops;
