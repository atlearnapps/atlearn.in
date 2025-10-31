import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import MainHeaderText from "src/components/New components/MainHeaderText";
import ParagraphText from "src/components/New components/ParagraphText";

const StepsGuide = ({ data }) => {
  if (!data) return null;

  const { heading, description, steps } = data;

  return (
    <div className="py-4">
      <div className="max-w-5xl mx-auto p-8">
        {/* Header */}
        <div className="text-center mb-4">
          <MainHeaderText>{heading}</MainHeaderText>
          <ParagraphText>{description}</ParagraphText>
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {steps?.map((step, index) => (
            <div
              key={index}
              className="flex items-start p-6 bg-white dark:bg-darkBg shadow-lg rounded-xl border-l-4 border-green-500 transition-transform transform hover:scale-105 hover:shadow-xl"
            >
              <FaCheckCircle className="w-7 h-7 text-green-500 mr-5 flex-shrink-0" />
              <div>
                <h3 className="capitalize text-lg sm:text-xl md:text-2xl font-semibold mb-2 font-hind dark:text-white transition-all duration-300">
                  {`Step ${index + 1}: ${step.title}`}
                </h3>
                {step.description && (
                  <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepsGuide;
