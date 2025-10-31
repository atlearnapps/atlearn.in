import RightIcon from "src/assets/icons/RightIcon";
import HeaderText from "./HeaderText";
import Paragraph from "./Paragraph";
import Button from "./Button";
import { useHandleNavigate } from "src/utils/Navigation/useHandleNavigate";

function InfoSection({
  info,
  rounded = false,
  imageSide = "right",
  imageSize = "39.38rem",
  text_center = false,
}) {
  const handleNavigate = useHandleNavigate();

  return imageSide === "right" ? (
    <div className="text-neutral-700 w-full mt-0   " id="section-1">
      <div
        className="flex flex-col lg:flex-row justify-center items-center max-w-[82.5rem] m-auto "
        id="div-1"
      >
        <div
          className={`flex min-h-[0.06rem] w-full ${
            info?.image ? "md:w-full" : ""
          }`}
          id="div-2"
        >
          <div className="flex items-center px-6 w-full" id="div-3">
            <div className={`w-full mb-5 ${text_center && "text-center"}`}>
              <HeaderText>{info.title}</HeaderText>
              <Paragraph>{info.description}</Paragraph>
              {info?.points?.length &&
                info?.pointsHeading?.length &&
                info?.pointsHeading.map((heading, index) => (
                  <div key={index} className="mb-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <RightIcon />
                      {heading}
                    </h3>
                    <p className="text-gray-600 flex items-start mt-1">
                      {info.points[index]}
                    </p>
                  </div>
                ))}

              {info?.points?.length > 0 &&
                (!info?.pointsHeading || info?.pointsHeading?.length === 0) && (
                  <ul className="list-none mb-8 font-fredoka">
                    {info.points.map((point, index) => (
                      <li key={index} className="flex mb-4 gap-3">
                        <RightIcon /> {point}
                      </li>
                    ))}
                  </ul>
                )}

              {info.cta && info.url && (
                <Button onClick={() => handleNavigate(info.url)}>
                  {info.cta ? info.cta : ""}
                </Button>
              )}
            </div>
          </div>
        </div>

        {info?.image && (
          <div className="flex w-full lg:w-full p-2">
            <div className="flex justify-center w-full">
              <img
                className={`w-[${imageSize}]  h-auto  max-w-full ${
                  rounded ? "rounded-full  md:h-[500px]" : ""
                }`}
                src={info.image}
                alt="info_image"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="text-neutral-700 w-full mt-0 " id="section-1">
      <div
        className="flex flex-col lg:flex-row justify-center items-center max-w-[82.5rem] m-auto "
        id="div-1"
      >
        {info?.image && (
          <div className="flex w-full lg:w-full p-2">
            <div className="flex justify-center w-full">
              {/* <img
                className={`w-[${imageSize}] h-auto ${
                  rounded ? "rounded-full" : ""
                }`}
                src={info.image}
                alt="info_image"
              /> */}
              <img
                className={`w-[${imageSize}]  h-auto  max-w-full ${
                  rounded ? "rounded-full  md:h-[500px]" : ""
                }`}
                src={info.image}
                alt="info_image"
              />
            </div>
          </div>
        )}
        <div
          className={`flex min-h-[0.06rem] w-full ${
            info?.image ? "md:w-full" : ""
          }`}
          id="div-2"
        >
          <div className="flex items-center px-6 w-full" id="div-3">
            <div className={`w-full mb-5 ${text_center && "text-center"}`}>
              <HeaderText>{info.title}</HeaderText>
              <Paragraph>{info.description}</Paragraph>
              {/* {info?.points?.length && (
                <ul className="list-none mb-8 font-fredoka">
                  {info.points.map((point, index) => (
                    <li key={index} className="flex mb-4 gap-3">
                      <RightIcon /> {point}
                    </li>
                  ))}
                </ul>
              )} */}

              {info?.points?.length &&
                info?.pointsHeading?.length &&
                info?.pointsHeading.map((heading, index) => (
                  <div key={index} className="mb-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <RightIcon />
                      {heading}
                    </h3>
                    <p className="text-gray-600 flex items-start mt-1">
                      {info.points[index]}
                    </p>
                  </div>
                ))}

              {info?.points?.length > 0 &&
                (!info?.pointsHeading || info?.pointsHeading?.length === 0) && (
                  <ul className="list-none mb-8 font-fredoka">
                    {info.points.map((point, index) => (
                      <li key={index} className="flex mb-4 gap-3">
                        <RightIcon /> {point}
                      </li>
                    ))}
                  </ul>
                )}

              {info.cta && info.url && (
                <Button onClick={() => handleNavigate(info.url)}>
                  {info.cta ? info.cta : ""}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoSection;
