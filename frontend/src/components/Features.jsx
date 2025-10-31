import { useHandleNavigate } from "src/utils/Navigation/useHandleNavigate";

const Features = ({ features }) => {
  const handleNavigate = useHandleNavigate();

  return (
    <section className="relative w-full ">
      <div className="relative flex justify-center max-w-[82.50rem] m-auto">
        <div className="relative flex min-h-[0.06rem] md:w-full pt-10">
          <div className="flex-wrap px-4 w-full">
            <div className="flex flex-col items-center w-full">
              <div className="flex flex-wrap  mx-auto justify-center">
                <div className="h-full">
                  <div className="flex flex-wrap  justify-center lg:flex-row md:flex-row   ">
                    <svg
                      className="bottom-[27.38rem] left-[-2.50rem] mt-8 max-w-full px-10 absolute right-[80.00rem] top-[-1.38rem] w-20 overflow-hidden"
                      fill="rgb(0, 0, 0)"
                      style={{
                        flexShrink: "0",
                      }}
                    >
                      <clipPath
                        clipPathUnits="objectBoundingBox"
                        id="service-clip1"
                      >
                        <path
                          d="M0.379,0.037 C0.459,-0.006,0.558,-0.006,0.638,0.037 L0.879,0.167 C0.959,0.21,1,0.289,1,0.375 V0.635 C1,0.721,0.959,0.8,0.879,0.843 L0.638,0.973 C0.558,1,0.459,1,0.379,0.973 L0.138,0.843 C0.058,0.8,0.008,0.721,0.008,0.635 V0.375 C0.008,0.289,0.058,0.21,0.138,0.167 L0.379,0.037"
                          fill="rgb(0, 0, 0)"
                        />
                      </clipPath>
                    </svg>

                    {features.map((item) => (
                      <div
                        key={item.title}
                        className="px-4 min-[1200px]:w-[33%] md:w-[50%] w-full mb-8"
                        style={{
                          flexShrink: "0",
                          backgroundColor: "",
                        }}
                      >
                        <div className="flex flex-col items-center h-full space-y-4  ">
                          <div className="h-20 leading-[4.75rem] relative text-center w-20 inline-block rounded-full">
                            <div
                              className="bg-tertiary h-20 w-20 absolute"
                              style={{
                                clipPath: 'url("#service-clip1")',
                              }}
                            >
                              <div
                                className="bottom-[0.13rem] bg-white left-[0.13rem] absolute right-[0.13rem] top-[1px]"
                                style={{
                                  clipPath: 'url("#service-clip1")',
                                }}
                              >
                                <div
                                  className=" cursor-pointer bg-primary hover:bg-secondary bottom-[0.38rem] h-[71px] left-[0.19rem] absolute right-[0.38rem] top-[0.19rem] w-[71px]"
                                  style={{
                                    clipPath: 'url("#service-clip1")',
                                  }}
                                  onClick={() =>
                                    item.link && handleNavigate(item.link)
                                  }
                                >
                                  <img
                                    src={item.icon}
                                    alt={item.title}
                                    className="h-full w-full object-contain"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex-grow w-full text-center">
                            <h3 className="text-xl font-semibold mb-2">
                              <div className=" font-fredoka text-[26px] text-black">
                                {item.title}
                              </div>
                            </h3>
                            <p className="font-fredoka text-lg">
                              {item.description}
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
      </div>
    </section>
  );
};

export default Features;
