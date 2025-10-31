import React from "react";
import { Helmet } from "react-helmet";
import { BASE_URL } from "src/apiClients/config";
import CTAForms from "src/components/New components/CTAForms";
import CTASection from "src/components/New components/CTASection";
import FeaturesCard from "src/components/New components/FeaturesCard";
import HeaderText from "src/components/New components/HeaderText";
import HeaderTextMedium from "src/components/New components/HeaderTextMedium";
import SectionHeading from "src/components/New components/SectionHeading";
import SplitSection from "src/components/New components/SplitSection";
import VideoSection from "src/components/New components/VideoSection";

import {
  AI_Powered_Question_Bank,
  Create_Question_Bank_Process,
  CTA,
  QuizCTAForms,
  The_Best_Online_Course_Platform,
  Why_Choose_Atlearn,
  Why_Choose_Atlearn_Features,
} from "src/Page_Content/Question_Bank";
// import { FaCheckCircle } from "react-icons/fa";

function QuestionBank() {
  return (
    <div>
      <Helmet>
        <title>AI-Powered Question Bank | Atlearn LMS</title>
        <meta
          name="description"
          content="Create, manage & automate quizzes with Atlearn's free AI-powered question bank. Perfect for schools to boost engagement & simplify assessments."
        />
        <link rel="canonical" href={`${BASE_URL}/question-bank`} />
      </Helmet>
      <section>
        {/* bannaer section */}
        <div className="container2-xl bg-darkdeep1 py-50px  rounded-2xl relative overflow-hidden shadow-brand">
          <div className="container">
            <div className="flex flex-col items-center text-center w-full lg:w-83% xl:w-3/4 mx-auto">
              {/* banner Left */}
              <div data-aos="fade-up" className="w-4/5">
                <h3 className="uppercase text-secondaryColor text-size-15 mb-5px md:mb-15px font-inter tracking-5px">
                  EDUCATION SOLUTION
                </h3>
                <h1 className="text-3xl text-whiteColor md:text-6xl lg:text-size-50 2xl:text-6xl leading-10 md:leading-18 lg:leading-62px 2xl:leading-18 md:tracking-half lg:tracking-normal 2xl:tracking-half font-bold mb-15px sm:mb-30px">
                  Question Bank
                  <span className="text-secondaryColor">.</span>
                </h1>
              </div>
            </div>
          </div>
          <div>
            <img
              className="absolute left-1/2 bottom-[15%] animate-spin-slow"
              src="./assets/images/register/register__2.png"
              alt="register icon"
              title="register icon"
            />
            <img
              className="absolute left-[42%] sm:left-[65%] md:left-[42%] lg:left-[5%] top-[4%] sm:top-[1%] md:top-[4%] lg:top-[10%] animate-move-hor"
              src="./assets/images/herobanner/herobanner__6.png"
              alt="herobanner icon"
              title="herobanner icon"
            />
            <img
              className="absolute right-[5%] bottom-[15%]"
              src="./assets/images/herobanner/herobanner__7.png"
              alt="herobanner icon"
              title="herobanner icon"
            />
            <img
              className="absolute top-[5%] left-[45%]"
              src="./assets/images/herobanner/herobanner__7.png"
              alt="herobanner icon"
              title="herobanner icon"
            />
          </div>
        </div>
      </section>
      <section>
        <div className="my-10px">
          <VideoSection data={AI_Powered_Question_Bank} rightSideVideo={true} />
        </div>
      </section>
      <section>
        <CTAForms data={QuizCTAForms} />
      </section>
      <section>
        <SectionHeading data={Why_Choose_Atlearn} center={true} />
        <FeaturesCard data={Why_Choose_Atlearn_Features} row={3} />
      </section>
      <section>
        <SplitSection data={The_Best_Online_Course_Platform} />
      </section>
      <section>
        <div className="bg-white ">
          <div className="container py-25px">
            <HeaderText>{Create_Question_Bank_Process?.heading}</HeaderText>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {Create_Question_Bank_Process?.steps.map((step, index) => (
                <div
                  key={index}
                  className=" flex items-center gap-4 p-6 bg-white shadow-lg rounded-xl border-l-4 border-green-500 transition-transform transform hover:scale-105 hover:shadow-xl"
                >
                  {/* <FaCheckCircle className="w-10 h-10 text-green-500 mr-5 mt-1" /> */}
                  <div
                    className={`flex-shrink-0 w-10 h-10 flex items-center justify-center border-2 border-dashed rounded-full  font-bold text-xl `}
                  >
                    {index + 1}
                  </div>
                  <div>
                    {/* <div className="relative  flex justify-between w-full items-center">
                        <img
                          loading="lazy"
                          src={lms_integration_Icon}
                          alt={""}
                          title={""}
                          className="w-15 h-15"
                        />
                        </div> */}
                    <h3 className="text-xl font-semibold text-gray-900 ">
                      {step.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <HeaderTextMedium>
                {Create_Question_Bank_Process?.conclusion}
              </HeaderTextMedium>
            </div>
          </div>
        </div>
      </section>

      <section>
          <CTASection data={CTA} />
        </section>
    </div>
  );
}

export default QuestionBank;
