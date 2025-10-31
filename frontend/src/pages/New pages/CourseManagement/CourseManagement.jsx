import React from "react";
import { Helmet } from "react-helmet";
import { BASE_URL } from "src/apiClients/config";
import CTASection from "src/components/New components/CTASection";
import FeaturesCard from "src/components/New components/FeaturesCard";
import SplitSection from "src/components/New components/SplitSection";
import StepsGuide from "src/components/New components/StepsGuide/StepsGuide";
import {
  AI_Generated_Quizzes_and_Question_Banks,
  AI_Generated_Quizzes_and_Question_Banks_Features,
  AI_Powered_CTA,
  Create_Engaging_Online_Courses,
  Create_Engaging_Online_Courses_Features,
  Exam_Preparation_and_Certification,
  Exam_Preparation_and_Certification_Features,
  How_It_Works,
  Key_Features_of_Our_AI_Powered,
  SCORM_LMS_Integration,
  SCORM_LMS_Integration_Features,
  Why_Choose_Our_Services,
} from "src/Page_Content/CourseManagement";

function CourseManagement() {
  return (
    <div>
      <Helmet>
        <title>
          {" "}
          AI-Powered Course Creation & Exam Prep Services | SCORM & LMS Training
          Solutions
        </title>
        <meta
          name="description"
          content="We create structured online courses, quizzes, and question banks from your videos, PDFs, and docs. Our team builds SCORM and LMS-ready training content to help your learners prepare for exams and certifications."
        />

        <link rel="canonical" href={`${BASE_URL}/course-management`} />
      </Helmet>
      {/* banner section */}
      <section>
        {/* bannaer section */}
        <div className="container2-xl bg-darkdeep1 py-50px  rounded-2xl relative overflow-hidden shadow-brand">
          <div className="container">
            <div className="flex flex-col items-center text-center w-full mx-auto">
              {/* banner Left */}
              <div data-aos="fade-up" className="">
                <h3 className="uppercase text-secondaryColor text-size-15 mb-5px md:mb-15px font-inter tracking-5px">
                  EDUCATION SOLUTION
                </h3>
                <h1 className="text-3xl text-whiteColor md:text-6xl lg:text-size-50 2xl:text-6xl leading-10 md:leading-18 lg:leading-62px 2xl:leading-18 md:tracking-half lg:tracking-normal 2xl:tracking-half font-bold ">
                  AI-Powered Course Creation & Exam Prep Services | SCORM & LMS
                  Ready
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
      {/* <section className="container">
        <div className=" text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            Create Engaging Online Courses from Your Videos, PDFs, and Docs
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            You provide the raw materials—videos, presentations, or PDFs—
            <span className="font-semibold text-gray-900">
              {" "}
              our team does the work.
            </span>
            We’ll structure them into engaging, LMS-ready courses with
            narration, chapters, and interactivity.
          </p>
        </div>
      </section> */}
      <section>
        <div className="text-center">
          <SplitSection data={Create_Engaging_Online_Courses} />
        </div>
        <FeaturesCard data={Create_Engaging_Online_Courses_Features} row={2} />
      </section>
      <section>
        <div className="text-center">
          <SplitSection data={AI_Generated_Quizzes_and_Question_Banks} />
        </div>
        <FeaturesCard
          data={AI_Generated_Quizzes_and_Question_Banks_Features}
          row={2}
        />
      </section>
      <section>
        <div className="text-center">
          <SplitSection data={SCORM_LMS_Integration} />
        </div>
        <FeaturesCard data={SCORM_LMS_Integration_Features} row={2} />
      </section>
      <section>
        <div className="text-center">
          <SplitSection data={Exam_Preparation_and_Certification} />
        </div>
        <FeaturesCard
          data={Exam_Preparation_and_Certification_Features}
          row={2}
        />
      </section>
      <section>
        <StepsGuide data={How_It_Works} />
      </section>
      <section>
        <SplitSection data={Key_Features_of_Our_AI_Powered} />
      </section>
      <section className="text-center bg-white">
        <SplitSection data={Why_Choose_Our_Services} />
      </section>
      <section>
        <CTASection data={AI_Powered_CTA} />
      </section>
    </div>
  );
}

export default CourseManagement;
