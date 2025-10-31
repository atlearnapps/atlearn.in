import React from "react";
import HeaderText from "src/components/New components/HeaderText";
import ParagraphText from "src/components/New components/ParagraphText";
import ServicesTabs from "src/components/New components/ServicesTabs";
import SplitSection from "src/components/New components/SplitSection";
import VideoSection from "src/components/New components/VideoSection";

import {
  AIGradingCTAForms,
  How_It_Works,
  KeyFeatures,
  KeyFeaturestabs,
  Smart_Grading,
  What_is_AI_grading_Tool,
  why_educators_love,
  Custom_grading,
  CTA,
  // Why_Educators_Love_Sectoion,
} from "src/Page_Content/AI_grading_tool";
import { FaCheckCircle } from "react-icons/fa";
import CTAForms from "src/components/New components/CTAForms";
import { Helmet } from "react-helmet";
import CTASection from "src/components/New components/CTASection";
import { BASE_URL } from "src/apiClients/config";
import StepsGuide from "src/components/New components/StepsGuide/StepsGuide";

function AIGradingTool() {
  return (
    <div>
      <Helmet>
        <title>
          AI Grading Tool | Smart & Scalable Assessment with Atlearn
        </title>
        <meta
          name="description"
          content="Automate grading with Atlearn's AI tool. Reduce costs, ensure accuracy, and integrate seamlessly with your LMS. Scalable and standards-compliant."
        />

        <link rel="canonical" href={`${BASE_URL}/ai-grading-tool`} />
      </Helmet>
      <section>
        {/* bannaer section */}
        <div className="container2-xl bg-darkdeep1 py-50px  rounded-2xl relative overflow-hidden shadow-brand">
          <div className="container">
            <div className="flex flex-col items-center text-center w-full ">
              {/* banner Left */}
              <div data-aos="fade-up" className="w-4/5">
                <h3 className="uppercase text-secondaryColor text-size-15 mb-5px md:mb-15px font-inter tracking-5px">
                  AI Grading Tool
                </h3>
                <h1 className="text-3xl text-whiteColor md:text-6xl lg:text-size-50 2xl:text-6xl leading-10 md:leading-18 lg:leading-62px 2xl:leading-18 md:tracking-half lg:tracking-normal 2xl:tracking-half font-bold mb-15px sm:mb-30px">
                  Grade Smarter. Save Time. Empower Learning
                  <span className="text-secondaryColor">.</span>
                </h1>
                <p className="text-size-15md:text-lg text-white font-medium mb-45px">
                  An intelligent grading assistant, built into Atlearn LMS and
                  fully compatible with Moodle.
                </p>
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
        <VideoSection data={What_is_AI_grading_Tool} rightSideVideo={true} />
      </section>
      <section className="mt-2 mb-4 ">
        <SplitSection data={KeyFeatures} />
        <ServicesTabs tabs={KeyFeaturestabs} />
      </section>
      <section>
        <SplitSection data={why_educators_love} headingTop={true} />
      </section>
      <section className="">
        <SplitSection data={Custom_grading} rightImage={true} />
      </section>
      <section>
        <CTAForms data={AIGradingCTAForms} />
      </section>
      <section>
        <StepsGuide data={How_It_Works} />
      </section>
      <section>
        <SplitSection data={Smart_Grading} />
      </section>

      <section>
        <CTASection data={CTA} />
      </section>
    </div>
  );
}

export default AIGradingTool;
