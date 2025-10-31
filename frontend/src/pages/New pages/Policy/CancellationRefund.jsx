import React from "react";
import { Helmet } from "react-helmet";
import { BASE_URL } from "src/apiClients/config";

import { CancellationRefundPolicyData } from "src/Page_Content/CancellationRefundData";
function CancellationRefund() {
  return (
    <div>
        <Helmet>
        <title>Understand Atlearn's Transparent Cancellation Policy</title>
        <meta
          name="description"
          content="Learn about Atlearn's clear and simple cancellation policy. Enjoy hassle-free enrollment changes with complete transparency and support."
        />
        <link rel="canonical" href={`${BASE_URL}/cancellation-refund-policy`} />
        </Helmet>
      {/* banner section */}
      <section>
        {/* banner section */}
        <div className="bg-lightGrey10 dark:bg-lightGrey10-dark relative z-0 overflow-y-visible py-50px md:py-20 lg:py-100px ">
          {/* animated icons */}
          <div>
            {/* <img
              className="absolute left-0 bottom-0 md:left-[14px] lg:left-[50px] lg:bottom-[21px] 2xl:left-[165px] 2xl:bottom-[60px] animate-move-var z-10"
              src="./assets/images/herobanner/herobanner__1.png"
              alt=""
            /> */}
            <img
              className="absolute left-0 top-0 lg:left-[50px] lg:top-[100px] animate-spin-slow "
              src="./assets/images/herobanner/herobanner__2.png"
              alt=""
            />
            <img
              className="absolute right-[30px] top-0 md:right-10 lg:right-[575px] 2xl:top-20 animate-move-var2 opacity-50 hidden md:block"
              src="./assets/images/herobanner/herobanner__3.png"
              alt=""
            />
            <img
              className="absolute right-[30px] top-[212px] md:right-10 md:top-[157px] lg:right-[45px] lg:top-[100px] animate-move-hor hidden md:block"
              src="./assets/images/herobanner/herobanner__5.png"
              alt=""
            />
          </div>
          <div className="container relative">
            <div className="text-center">
              <h1 className="text-3xl md:text-size-40 2xl:text-size-55 font-bold text-blackColor dark:text-blackColor-dark mb-7 md:mb-6 pt-3">
                Cancellation / Refund Policy
              </h1>
              <p className="text-size-15md:text-lg text-blackColor dark:text-blackColor-dark font-medium">
                Understand your options for cancellation and refunds with our
                detailed policy.
              </p>
            </div>
          </div>
        </div>
      </section>
      <div className="max-w-7xl mx-auto  p-4">
        <div
          className="flex-col justify-center w-full mb-5 text-6xl text-black font-semibold capitalize"
          style={{
            alignItems: "initial",
          }}
        >
          {/* <div className="-mb-5">
            <div className="mb-[calc(60px_-_22px)]" id="div-22">
              <h3 className="-mt-1 mb-3">Privacy Policy for Atlearn</h3>
            </div>
          </div> */}
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 max-w-8xl w-full mb-8">
          <div className="space-y-4">
            {CancellationRefundPolicyData?.map((section, index) => (
              <div data-aos="fade-up" key={index} className="mb-4">
                <h2 className="text-2xl font-semibold">{section.title}</h2>
                {Array.isArray(section.content) ? (
                  <ul className="list-disc list-inside ml-5">
                    {section.content.map((item, subIndex) => (
                      <li
                        key={subIndex}
                        className="mt-2"
                        dangerouslySetInnerHTML={{ __html: item }}
                      />
                    ))}
                  </ul>
                ) : (
                  <p
                    className="mt-2"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CancellationRefund;
