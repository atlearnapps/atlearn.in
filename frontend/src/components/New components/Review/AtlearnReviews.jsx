import React from "react";
import TagLabel from "../TagLabel";
import MainHeaderText from "../MainHeaderText";
import ParagraphText from "../ParagraphText";

function AtlearnReviews() {
  return (
    <div>
      <div className="bg-white dark:bg-borderColor-dark dark:text-white py-10">
        <div className="text-center">
          <TagLabel text={"Trusted by Professionals"} />

          <MainHeaderText>
            Atlearn Featured on Top EdTech Platforms - Trusted by Educators
          </MainHeaderText>

          <ParagraphText>
            Simplify your learning and development with Atlearn's cutting-edge
            AI-powered tools. Experience the transformation for yourself—try it
            today!
          </ParagraphText>
        </div>

        <section>
          <div className="container mt-8">
            <div className="flex flex-wrap justify-center gap-6  ">
              {/* <div
                 
                  className="w-full sm:w-[48%] lg:w-[30%] pt-5 pb-4 px-2 rounded-lg bg-white text-center hover:bg-primaryColor dark:bg-borderColor-dark dark:hover:bg-secondaryColor group shadow-dropdown-secodary"
                  data-aos="fade-up"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <img
                      src={item?.icon}
                      alt={item?.title}
                      title={item?.title}
                      className="w-12 h-12 group-hover:opacity-80 transition-opacity duration-200"
                    />
                    <h4 className="text-blackColor text-lg font-medium group-hover:text-blackColor-dark dark:text-blackColor-dark">
                      {item?.title}
                    </h4>
                  </div>
                </div>
             */}
              <div>
                <a
                  href="https://www.saashub.com/atlearn?utm_source=badge&utm_campaign=badge&utm_content=atlearn&badge_variant=color&badge_kind=approved"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Atlearn badge"
                >
                  <img
                    loading="lazy"
                    decoding="async"
                    src="https://cdn-b.saashub.com/img/badges/approved-color.png?v=1"
                    alt="Atlearn badge"
                    title="Atlearn badge"
                    style={{
                      maxWidth: "250px",
                      height: "auto",
                      display: "block",
                    }}
                  />
                </a>
              </div>
              <div>
                <a
                  href="https://www.softwaresuggest.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="SoftwareSuggest Award 2020"
                >
  <img
    src="https://www.softwaresuggest.com/award_logo/2020/dark/3.png"
    alt="SoftwareSuggest Award 2020"
    title="SoftwareSuggest Award 2020"
    loading="lazy"
    decoding="async"
    style={{ maxWidth: "250px", maxHeight: "90px", display: "block", height: "auto" }}
  />
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AtlearnReviews;
