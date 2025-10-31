import React from "react";
import { Helmet } from "react-helmet";
import { BASE_URL } from "src/apiClients/config";
import { userTestimonials } from "src/Page_Content/Testimonials";
// ./assets/images/testimonial/testi_2.png
function Testimonial() {
  return (
    <div>
      <Helmet>
        <title>Hear from Our Users | Atlearn Testimonials</title>
        <meta
          name="description"
          content="See how schools & professionals succeed with Atlearn! Real success stories from educators using our AI-powered LMS and virtual classroom tools."
        />
        <link rel="canonical" href={`$${BASE_URL}/testimonials`} />
      </Helmet>
      {/* banner section */}
      <section>
        {/* banner section */}
        <div className="bg-lightGrey10 dark:bg-lightGrey10-dark relative z-0 overflow-y-visible py-50px ">
          {/* animated icons */}
          {/* <div>
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
          </div> */}
          <div className="container">
            <div className="text-center">
              <h1 className="text-3xl md:text-size-40 2xl:text-size-55 font-bold text-blackColor dark:text-blackColor-dark mb-7 md:mb-6 pt-3">
                Testimonials
              </h1>
              <p className="text-size-15md:text-lg text-blackColor dark:text-blackColor-dark font-medium">
                Discover how our clients have experienced our services and the
                impact we've made. Hear directly from those who trust us to
                deliver quality, reliability, and exceptional results. Their
                stories inspire us to keep pushing boundaries and set new
                standards in our industry.
              </p>
            </div>
          </div>
        </div>
      </section>
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
          {userTestimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-30px group bg-whiteColor rounded-xl transition-all duration-300 hover:-translate-y-5px shadow-dropdown-secodary hover:bg-primaryColor hover:text-whiteColor dark:bg-whiteColor-dark dark:hover:bg-primaryColor h-full"
            >
              <div className="text-blue-500 text-2xl">❝</div>
              <div>
                {testimonial.message?.map((item, index) => (
                  <p
                    key={index}
                    className="text-gray-700 italic mb-4  group-hover:text-whiteColor"
                  >
                    "{item}"
                  </p>
                ))}

                <div className="flex items-center space-x-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold group-hover:text-whiteColor text-contentColor leading-29px">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-500 group-hover:text-whiteColor">
                      {testimonial.designation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Testimonial;
