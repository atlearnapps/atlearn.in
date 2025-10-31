import React, { useState } from "react";
import MainHeaderText from "src/components/New components/MainHeaderText";
import LMSDemoModal from "src/components/New components/Modal/LMSDemoModal";
import ParagraphText from "src/components/New components/ParagraphText";
import PrimaryButton from "src/components/New components/PrimaryButton";
import TagLabel from "src/components/New components/TagLabel";
// import { useHandleNavigate } from "src/utils/Navigation/useHandleNavigate";

const LearningPlatform = () => {
  // const handleNavigate = useHandleNavigate();
  const [demoPopupOpen, setDemoPopupOpen] = useState(false);
  const handleFreeDemoClose = () => {
    setDemoPopupOpen(false);
  };
  return (
    <div>
      <div className="container md:container-secondary py-50px">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
          {/* Left Side - Embedded YouTube Video */}
          <div>
            <iframe
              className="w-full h-64 md:h-80 rounded-lg shadow-lg"
              src="https://www.youtube.com/embed/GJl4r7P6so4" // Replace with your video URL
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          {/* Right Side - Text Content */}
          <div>
            {/* <h4 className="text-sm font-semibold uppercase text-gray-600">
    
        </h4> */}
            <TagLabel text={"Smart Learning Space"} />
            {/* <h2 className="text-3xl font-bold  mt-2">
          Atlearn Course Management - AI-Powered Teaching Simplified
        </h2> */}
            <MainHeaderText>
              Create, Manage, and Monetize Your Online Courses
            </MainHeaderText>
            <ParagraphText>
              {`Empower educators and trainers to design engaging courses, upload videos, and reach learners worldwide - all from one easy-to-use platform.`}
            </ParagraphText>

            <PrimaryButton
              onClick={
                () => setDemoPopupOpen(true)
                // handleNavigate(
                //   "https://lms.atlearn.in/course/edit.php?category=4&amp;returnto=topcat"
                // )
              }
            >
              Create Your Free Course
              <span className="ml-2">→</span>
            </PrimaryButton>
          </div>
        </div>
      </div>
      <LMSDemoModal open={demoPopupOpen} handleClose={handleFreeDemoClose} />
    </div>
  );
};

export default LearningPlatform;
