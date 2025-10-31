import { useState } from "react";
import ParagraphText from "./ParagraphText";

export default function ServicesTabs({ tabs }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex flex-col md:flex-row container py-10px border rounded-lg shadow-lg ">
      {/* Left Side Tabs */}
      <div className="w-full md:w-1/3 border-b md:border-r p-4  rounded-t-lg md:rounded-l-lg md:rounded-t-none">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`block w-full text-left p-3 rounded-lg mb-2 transition-all dark:text-blackColor-dark ${
              activeTab === index
                ? "bg-primaryColor text-white font-bold"
                : "hover:bg-primaryColor hover:text-white"
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {/* Right Side Content */}
      <div className="w-full md:w-2/3 p-6">
        {/* <HeaderTextSmall>{tabs[activeTab].title}</HeaderTextSmall> */}

        {tabs[activeTab]?.paragraphs?.map((subParagraph, spIndex) => (
          <ParagraphText key={spIndex}>{subParagraph}</ParagraphText>
        ))}
        <div data-aos="fade-up">
          {tabs[activeTab]?.features && (
            <ul
              className="space-y-5"
              // style={{
              //   listStyleType: "disc",
              //   paddingLeft: "20px",
              //   lineHeight: "1.8em",
              //   marginBottom: "20px",
              // }}
              // data-aos="fade-up"
            >
              {tabs[activeTab].features.map((feature, featureIndex) => (
                <li
                  key={featureIndex}
                  className="text-sm md:text-base text-blackColor dark:text-blackColor-dark mb-15px flex items-center"
                >
                  <i className="  icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor  group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark dark:text-contentColor-dark" />

                  {/* <ParagraphText>
                    {feature.heading && <strong>{feature.heading} </strong>}
                    {feature.description && feature.heading && ` - `}
                    {feature?.description}
                  </ParagraphText> */}
                  <ParagraphText
                    mainText={feature?.description|| feature}
                    strong={feature.heading}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        {tabs[activeTab]?.end_paragraphs?.map((subParagraph, spIndex) => (
          <ParagraphText key={spIndex}>{subParagraph}</ParagraphText>
        ))}
      </div>
    </div>
  );
}
