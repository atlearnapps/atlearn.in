import { useState } from "react";
import Button from "./Button";
import { PopupModal } from "react-calendly";
import { useNavigate } from "react-router-dom";
import { useHandleNavigate } from "src/utils/Navigation/useHandleNavigate";
const Header = ({
  backgroundImage,
  pageTitle,
  showBreadcumb = true,
  subTitle,
  cta,
  handleScrollToSection,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const handleNavigate = useHandleNavigate();
  const handleClick = (page) => {
    const actions = {
      "Contact": () => setIsOpen(true),
      "Online Classes": () => handleNavigate("/room"),
      "Pricing Policy": () => navigate("/pricing"),
      "Cancellation / Refund Policy": () => handleNavigate("/settings/mytransaction") ,
      "About": ()=>handleNavigate("https://lms.atlearn.in"),
      "Pricing": ()=>handleNavigate("/settings/mysubscription"),
      "Features":()=>handleNavigate("/room"),
      "Blogs":()=>navigate("/blog#blogs"),
      "AI Learning":()=>handleNavigate("https://lms.atlearn.in/"),
      "LMS AI":()=>handleNavigate("https://lms.atlearn.in/"),
      "School":()=>handleNavigate("https://lms.atlearn.in/login/signup.php?"),
      "Teachers":()=>handleNavigate("https://lms.atlearn.in/login/index.php"),
      "Students":()=>handleNavigate("https://atlearnlms.com/")
      
    };
  
    if (actions[page]) {
      actions[page]();
    }
  };

  return (
    <div>
      <PopupModal
        url="https://calendly.com/atlearn-lms/30min"
        onModalClose={() => setIsOpen(false)}
        open={isOpen}
        rootElement={document.getElementById("root")}
      />
      {showBreadcumb ? (
        <>
          <div
            style={{
              // backgroundImage: `url(/cover_images/bannerBg.webp)`,
              backgroundImage: `url(/cover_images/newBg.png`,

              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
            className=" relative  h-full lg:h-[375px] w-full flex flex-col lg:flex-row  justify-between items-center  p-4 gap-2"
          >
            <div className="lg:pl-8 w-full  lg:w-1/2  h-full flex flex-col md:flex-row  justify-center items-center ">
              <div className="relative flex flex-col items-center justify-center   rounded-lg lg:rounded-tl-[165px] lg:rounded-tr-[171px] lg:rounded-bl-[171px] lg:rounded-br-[40px] text-[1rem] sm:text-[1.63rem] sm:leading-8    lg:w-[80%] sm:w-[80%] bg-primary  bg-opacity-100 p-4">
                <h1 className=" text-center font-fredoka font-semibold text-[28px] sm:text-[2rem] md:text-[2.5rem] leading-tight text-white pl-6 pr-6">
                  {pageTitle}
                </h1>
                <p className="text-white text-center font-fredoka leading-7  mt-2 mb-2">
                  {subTitle ? subTitle : ""}
                </p>
                {cta && (
                  <div className="text-center mt-2   flex justify-center">
                    <Button onClick={() => handleClick(pageTitle)}>
                      {cta ? cta : "Login"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div
              className=" w-full lg:w-1/2 flex flex-col items-center justify-center  h-full "
              style={{
                backgroundImage: `url(/cover_images/Group24-1.png)`,
                // backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                // width:"550px"
              }}
            >
              <div className="lg:pr-8  ">
                <img
                  className="h-auto md:h-[250px]"
                  // w-full lg:w-[550px]
                  src={`${backgroundImage}`}
                  alt=""
                  style={{ objectFit: "cover", width: "100%" }}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Header;
