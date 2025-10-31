import React from "react";
import { Link, useNavigate } from "react-router-dom";
// import placeholderUser from "src/assets/images/Kids-platforms/placeholderUser.webp";
import NatashaImage from "src/assets/images/Testimonial/Natasha.png";
import BobImage from "src/assets/images/Testimonial/Bob.png";
function Testimonials() {
  const navigate = useNavigate();
  return (
    <div>
      <section className="bg-lightGrey10 dark:dark:bg-lightGrey10-dark relative">
        <div>
          <img
            src="./assets/images/about/about_6.png"
            alt="icon"
            title="icon"
            className="absolute top-[110px] left-[216px] animate-move-hor z-1"
          />
          <img
            src="./assets/images/about/about_7.png"
            alt="icon"
            title="icon"
            className="absolute top-[360px] left-[162px] md:left-[262px] lg:left-[318px] 2xl:left-[162px] animate-spin-slow z-1"
          />
          {/* <img
            src="./assets/images/about/about_9.png"
            alt="icon"
            title="icon"
            className="absolute top-[430px] left-[156px] md:top-[630px] md:left-[476px] lg:top-[433px] lg:left-[196px] 2xl:top-[430px] 2xl:left-[156px] animate-move-var z-1"
          /> */}
        </div>
        <div className="container pt-20 pb-20 2xl:pt-30 2xl:pb-90px">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-15">
            <div
              className="lg:col-start-1 lg:col-span-1 md:col-start-1 md:col-span-2"
              data-aos="fade-up"
            >
              <div className="relative flex flex-col justify-center h-full w-full">
                <div>
                  <span className="text-sm font-semibold text-primaryColor bg-whitegrey3 px-6 py-5px mb-5 rounded-full inline-block">
                    Testimonials
                  </span>
                </div>
                <h3 className="text-3xl md:text-size-35 2xl:text-size-38 3xl:text-size-42 leading-10 md:leading-45px 2xl:leading-50px 3xl:leading-2xl font-bold text-blackColor pb-25px dark:text-blackColor-dark">
                  What Our Users Love About Us
                </h3>
                <div>
                  <Link
                    className="text-size-15 text-whiteColor bg-secondaryColor px-25px py-10px border border-secondaryColor hover:text-secondaryColor hover:bg-whiteColor inline-block rounded dark:hover:bg-whiteColor-dark dark:hover:text-whiteColor"
                    to="/testimonials"
                    title="Storylane Testimonial"
                  >
                    Read Success Stories{" "}
                    <i className="icofont-long-arrow-right" />
                  </Link>
                </div>
              </div>
            </div>

            {[
              // {
              //   text1:
              //     `"This story-writing program has truly improved her writing skills and boosted her imagination. I'm impressed by her level of involvement. Over the past few days, we've been brainstorming different story ideas, and she has been well-prepared."`,
              //   text2:
              //     `"Manish was one of the developers we worked with as we developed a software for children from the ground up. They helped us build a crucial foundation for our start-up business. Manish was friendly and good to work with. We appreciated his efforts and the rest of the AKRA TECH team's efforts."`,
              //   name: "Sowmya",
              //   role: "Parent of Y. Mokshagna from Mount Litera Zee school",
              // },
              // {
              //   text1:
              //     `"I am thrilled to share my experience with Akra Tech, a company that has been instrumental in my EdTech startup, We Intervene, since July 2020."`,
              //   text2:
              //   `"Working with Ashraf has been a pleasure, as I appreciated not having to spend time finding and vetting designers and developers. This allowed me to focus on self-funding and developing my business. Ashraf’s dedication to understanding my needs and providing valuable insights made him a true partner in the project. His team was also incredibly responsive and proactive in keeping me informed of their progress."`,
              //   name: "Umaeswari",
              //   role: "Parent of Kavimithra from Senthil public school, Salem",
              // },
              {
                name: "Bob Wood",
                designation: "President & CEO",
                message: [
                  "This story-writing program has truly improved her writing skills and boosted her imagination. I'm impressed by her level of involvement. Over the past few days, we've been brainstorming different story ideas, and she has been well-prepared.",
                  "Manish was one of the developers we worked with as we developed a software for children from the ground up. They helped us build a crucial foundation for our start-up business. Manish was friendly and good to work with. We appreciated his efforts and the rest of the AKRA TECH team's efforts.",
                ],
                image: BobImage,
              },
              {
                name: "Natasha Green",
                designation: "Founder | WEIntervene",
                message: [
                  "I am thrilled to share my experience with Akra Tech, a company that has been instrumental in my EdTech startup, We Intervene, since July 2020.",
                  "Working with Ashraf has been a pleasure, as I appreciated not having to spend time finding and vetting designers and developers. This allowed me to focus on self-funding and developing my business. Ashraf’s dedication to understanding my needs and providing valuable insights made him a true partner in the project. His team was also incredibly responsive and proactive in keeping me informed of their progress.",
                ],
                image: NatashaImage,
              },
            ].map((testimonial, index) => (
              <div data-aos="fade-up" key={index}>
                <div className="bg-whiteColor px-25px py-50px mb-22px relative dark:bg-whiteColor-dark flex flex-col  ">
                  {/* <div className="flex-grow">
                    {testimonial.message?.map((item, index) => (
                      <p
                        key={index}
                        className="text-base lg:text-sm 2xl:text-base text-contentColor dark:text-contentColor-dark"
                      >
                        "{item}"
                      </p>
                    ))}
                  </div> */}
                  <div className="flex-grow">
                    <div className="transition-all duration-300 line-clamp-4">
                      {testimonial.message?.map((item, index) => (
                        <p
                          key={index}
                          className="text-base lg:text-sm 2xl:text-base text-contentColor dark:text-contentColor-dark"
                        >
                          {item}
                        </p>
                      ))}
                    </div>

                    {/* View More Button */}
                    {testimonial.message && testimonial.message.length > 0 && (
                      <button
                        // onClick={() => setExpanded(!expanded)}
                        onClick={() => navigate("/testimonials")}
                        className="mt-2 text-sm text-primary   hover:text-secondaryColor font-semibold dark:text-contentColor-dark "
                      >
                        View More
                      </button>
                    )}
                  </div>
                  <div className="text-xl lg:text-3xl text-whiteColor bg-primaryColor w-10 h-10 lg:w-15 lg:h-15 flex items-center justify-center absolute top-0 left-0 md:-translate-y-1/2 md:-translate-x-1/2 z-20">
                    <i className="icofont-quote-left" />
                  </div>
                  <span className="w-0 h-0 border-l-12 border-r-12 border-t-15 border-l-transparent border-r-transparent border-t-whiteColor absolute bottom-[-14px] left-[27px] dark:border-t-whiteColor-dark" />
                </div>

                <div className="flex items-center gap-5 ">
                  <div>
                    <img
                      src={testimonial.image}
                      alt="User profile placeholder"
                      title="Profile image placeholder"
                      className="w-[50px] rounded-full"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div>
                    <h4 className="text-xl lg:text-lg 2xl:text-xl font-semibold text-blackColor dark:text-blackColor-dark">
                      {testimonial.name}
                    </h4>
                    <p className="text-base lg:text-size-15 2xl:text-base text-lightGrey9 dark:text-lightGrey9-dark">
                      {testimonial.designation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Testimonials;
