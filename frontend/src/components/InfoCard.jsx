import React from "react";

function InfoCard({ cardData, cardCount }) {
  return (
    <div>
      {/*       
      <section className="text-neutral-700 relative w-full">
        <div className="relative flex max-w-[82.50rem] m-auto" id="div-1">
          <div className="relative flex min-h-[0.06rem] md:w-full" id="div-2">
            <div className="content-start flex-wrap px-4 relative flex w-full">
              <div
                className="flex-col justify-center relative w-full"
                style={{
                  alignItems: "initial",
                }}
              >
                <div className="container mx-auto">
                  <div className="flex flex-wrap justify-center gap-4 mt-3.5">
                    {cardData.map((card, index) => (
                      <div key={index} className="relative sm:w-full md:w-[45%] lg:w-[30%]">
                        <div className="pb-28 relative text-center">
                          <div className="rounded-tl-3xl rounded-tr-3xl overflow-hidden text-lime-600">
                            <img
                              alt=""
                              className="cursor-pointer align-middle object-cover h-[400px] w-full"
                              src={card.imageSrc}
                            />
                          </div>
                          <div
                            style={{
                              borderRadius: "150px 150px 30px 30px",
                              backgroundColor: card.color,
                            }}
                            className={`h-72  rounded-bl-3xl rounded-br-3xl rounded-tl-full rounded-tr-full bottom-0 left-0 pb-5 px-5 pt-1 absolute right-0 z-[1] -mt-36`}
                          >
                            <div className="bg-white rounded-bl-xl rounded-br-xl rounded-tl-xl rounded-tr-3xl inline-block -mt-9 mb-7">
                              <img
                                alt=""
                                className="align-middle inline-block w-24 h-auto max-w-full"
                                src={card.iconSrc}
                              />
                            </div>
                            <h3 className="text-white text-[1.63rem] leading-8 font-semibold mb-3">
                              {card.heading}
                            </h3>
                            <p className="text-white mb-4">
                              {card.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      <div className="container flex flex-col  px-6   lg:flex-row  max-w-[82.5rem] m-auto justify-center mt-4 gap-x-0 gap-y-7">
        {cardData?.map((item, index) => (
          <div key={index} className="w-full lg:w-1/2 px-4 mb-8 ">
            <div
              className={`${item.color}  text-center p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300 h-full`}
            >
              <div className="bg-white p-4 rounded-full inline-block mb-6 shadow-md -mt-14">
                <img alt="" className="w-16 h-16 " src={item.iconSrc} />
              </div>
              <h3 className="text-white text-[28px] font-bold mb-3 tracking-wide font-fredoka ">
                {item.heading}
              </h3>
              <p className="text-white mb-4 leading-relaxed font-fredoka">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InfoCard;
