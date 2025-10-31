import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "src/Redux/userSlice";
import apiClients from "src/apiClients/apiClients";
import { UseAuth } from "src/utils/UseAuth/UseAuth";
import Images1 from "src/assets/images/price/Ready-to-experience-Atlearn_new.gif";
import PrimaryButton from "src/components/New components/PrimaryButton";
import SplitSection from "src/components/New components/SplitSection";
import { useAuth0 } from "@auth0/auth0-react";
import { Helmet } from "react-helmet";
import ParagraphText from "src/components/New components/ParagraphText";
import { toast } from "react-toastify";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import { BASE_URL } from "src/apiClients/config";
const Pricing = () => {
  const { loginWithRedirect } = useAuth0();
  const trialInfo = {
    imageSrc: Images1,
    imageAlt: "",
    headerText: "Try Atlearn Free for 7 Days - No Credit Card Needed",
    linkHref: "/signup",
    linkText: "Start Free Trial",
  };
  const navigate = useNavigate();
  const auth = UseAuth(true);
  const dispatch = useDispatch();
  const [pricing, setPricing] = useState();
  const formdata = {
    firstname: "",
    phone: "",
    email: "",
    message: "",
    subject: "",
    type: "LMS New Inquiry",
  };
  const [formData, setFormData] = useState();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showMeetingFeatures, setShowMeetingFeatures] = useState(false);
  const [showLMSFeatures, setShowLMSFeatures] = useState(false);

  useEffect(() => {
    setFormData(formdata);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (auth.user) {
      dispatch(setUser(auth.user));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  const fetchData = async () => {
    try {
      const response = await await apiClients.pricing();
      if (response.data) {
        setPricing(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleSignUp = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: "/callback",
      },
      authorizationParams: {
        prompt: "login",
        screen_hint: "signup",
      },
    });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();

    try {
      const newErrors = {};
      const requiredFields = ["firstname", "email", "message"];
      requiredFields.forEach((field) => {
        if (
          formData[field] === undefined ||
          formData[field] === null ||
          formData[field] === ""
        ) {
          newErrors[field] = `This ${field} field is required.`;
        }
      });
      if (formData.email && !validateEmail(formData.email)) {
        newErrors.email = "Please enter a valid email address.";
      }
      if (formData.phone && !validatePhone(formData.phone)) {
        newErrors.phone = "Please enter a valid phone number.";
      }
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
      } else {
        setLoading(true);
        setErrors({});
        const response = await apiClients.contact(formData);
        setFormData("");
        if (response) {
          if (response.success === true) {
            toast.success(response.message);
            setLoading(false);
            // navigate("/");
          } else {
            setLoading(false);
            toast.error(response.message);
          }
        }
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };
    if (name === "email" && !validateEmail(value)) {
      toast.error("Please enter a valid email address");
      newErrors.email = "Please enter a valid email address";
    } else {
      delete newErrors.email;
    }
    if (name === "phone" && !validatePhone(value)) {
      toast.error("Please enter a valid phone number");
      newErrors.phone = "Please enter a valid phone number";
    } else {
      delete newErrors.phone;
    }
    setErrors(newErrors);
  };

  return (
    <div>
      <Helmet>
        <title>Atlearn Pricing | Flexible Plans for Students & Teachers</title>
        <meta
          name="description"
          content="Explore Atlearn's affordable pricing plans for AI-powered LMS, online classes, and tools. Sign up today and start your free 7-day trial for learning."
        />
        <link rel="canonical" href={`${BASE_URL}/pricing`} />
      </Helmet>
      <section>
        {/* bannaer section */}
        <div className="container2-xl bg-darkdeep1 py-50px  rounded-2xl relative overflow-hidden shadow-brand">
          <div className="container">
            <div className="flex flex-col items-center text-center ">
              {/* banner Left */}
              <div data-aos="fade-up">
                <h3 className="uppercase text-secondaryColor text-size-15 mb-5px md:mb-15px font-inter tracking-5px">
                  EDUCATION SOLUTION
                </h3>
                <h1 className="text-3xl text-whiteColor md:text-6xl lg:text-size-50 2xl:text-6xl leading-10 md:leading-18 lg:leading-62px 2xl:leading-18 md:tracking-half lg:tracking-normal 2xl:tracking-half font-bold ">
                  Atlearn Plans - Affordable for All
                  <span className="text-secondaryColor">.</span>
                </h1>
                <p className="text-size-15 md:text-lg text-white  font-medium">
                  Flexible plans for all learners—start with a 7-day free trial.
                </p>
                <button
                  onClick={() =>
                    auth.user ? navigate("/room") : handleSignUp()
                  }
                  className=" mt-2 text-size-15 text-whiteColor bg-secondaryColor px-25px py-10px border border-secondaryColor hover:text-secondaryColor hover:bg-whiteColor inline-block rounded dark:hover:bg-whiteColor-dark dark:hover:text-whiteColor"
                >
                  Start Free Trial
                </button>
              </div>
            </div>
          </div>
          <div>
            {/* <img
              className="absolute left-1/2 bottom-[15%] animate-spin-slow"
              src="./assets/images/register/register__2.png"
              alt=""
            /> */}
            <img
              className="absolute left-[42%] sm:left-[65%] md:left-[42%] lg:left-[5%] top-[4%] sm:top-[1%] md:top-[4%] lg:top-[10%] animate-move-hor"
              src="./assets/images/herobanner/herobanner__6.png"
              alt="herobanner icon"
              title="herobanner icon"
            />
            <img
              className="absolute right-[5%] bottom-[15%] hidden md:block"
              src="./assets/images/herobanner/herobanner__7.png"
              alt="herobanner icon"
              title="herobanner icon"
            />
            {/* <img
              className="absolute top-[5%] left-[45%]"
              src="./assets/images/herobanner/herobanner__7.png"
              alt=""
            /> */}
          </div>
        </div>
      </section>
      {/* <Header
        backgroundImage={"/cover_images/pricing.svg"}
        pageTitle={"Pricing"}
        subTitle={
          "Affordable plans tailored for every learner—find the perfect fit with Atlearn"
        }
        cta={"Subscribe now"}
        handleScrollToSection={handleScrollToSection}
      /> */}
      {/* <div ref={sectionRef} className="mt-[50px]  flex flex-wrap"> */}

      <section>
        <div className="px-10 py-10">
          {/* heading */}
          {pricing?.length > 0 && (
            <div className="mb-5 md:mb-10">
              <div className="relative" data-aos="fade-up">
                <div>
                  <div className="text-center">
                    {/* <span className="text-sm font-semibold text-primaryColor bg-whitegrey3 px-6 py-5px mb-5 rounded-full inline-block">
                  Pricing Plan
                </span> */}
                  </div>
                </div>
                <h3 className="text-3xl md:text-size-35 2xl:text-size-38 3xl:text-size-42 md:leading-45px 2xl:leading-50px 3xl:leading-2xl font-bold text-blackColor dark:text-blackColor-dark text-center">
                  Compare Atlearn Plans & Features
                </h3>
              </div>
            </div>
          )}

          {/* plans */}
          <div className=" w-full flex justify-center items-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:xl:grid-cols-4 gap-30px items-center">
              {pricing?.map((item, index) => (
                <div
                  key={index}
                  className=" cursor-pointer   bg-whiteColor hover:bg-whiteColor hover:shadow-lg transition-all duration-300 rounded-lg dark:bg-lightGrey10-dark dark:hover:bg-whiteColor-dark shadow"
                  data-aos="fade-up"
                  onClick={() => {
                    item?.name === "Free"
                      ? handleSignUp()
                      : navigate(`/checkout?id=${item?.id}`);
                  }}
                >
                  {/* plan pricing */}
                  <div className="relative mb-6  bg-secondaryColor w-full px-25px py-30px rounded-t-lg ">
                    <h3 className="text-size-22 font-semibold  leading-45px mb-15px uppercase text-whiteColor dark:bg-secondaryColor-dark">
                      {item?.name}
                    </h3>
                    <h6 className="text-size-28 text-whiteColor font-medium mb-15px dark:text-blackColor-dark">
                      <span className="text-size-28 pr-1">₹</span>
                      {item.price}
                      <span className="text-size-22 text-whiteColor dark:text-contentColor-dark">
                        / {item.Validity}{" "}
                        {item?.period === "day"
                          ? item.Validity > 1
                            ? "days"
                            : "day"
                          : item.Validity > 1
                          ? "months"
                          : "month"}
                      </span>
                    </h6>
                    {/* <p className="text-blackColor dark:text-blackColor-dark">
            Perfect for startup
          </p> */}
                    {/* <img
                    className="absolute top-0 right-0 -translate-y-30px"
                    src="./assets/images/icon/price__1.png"
                    alt=""
                  /> */}
                  </div>
                  {/* plan feature */}
                  <div className="px-4 py-2 ">
                    {/* <div className="border border-secondaryColor rounded-lg  "> */}
                    <div
                      className={`${
                        showMeetingFeatures
                          ? "border border-secondaryColor rounded-lg"
                          : ""
                      }`}
                    >
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowMeetingFeatures((prev) => !prev);
                        }}
                        className=" bg-secondaryColor rounded-t-lg "
                      >
                        <h2 className=" text-size-22 font-semibold text-whiteColor dark:text-deepblue-dark mb-4  pb-2 pt-2   px-2 md:px-8 flex items-center justify-center gap-2">
                          Online Meeting Features
                          {showMeetingFeatures ? (
                            <HiChevronUp className="text-whiteColor" />
                          ) : (
                            <HiChevronDown className="text-whiteColor" />
                          )}
                        </h2>
                      </div>
                      {showMeetingFeatures && (
                        <ul className="flex flex-col gap-y-30px px-4 pb-2">
                          <li className="flex items-center">
                            <i className="icofont-check text-whiteColor bg-secondaryColor px-1 py-3px mr-15px rounded-full text-xs" />
                            <span className="text-md text-deepblue font-medium dark:text-deepblue-dark">
                              {item.participants} participants
                            </span>
                          </li>
                          <li className="flex items-center">
                            <i className="icofont-check text-whiteColor bg-secondaryColor px-1 py-3px mr-15px rounded-full text-xs" />
                            <span className="text-md text-deepblue font-medium dark:text-deepblue-dark">
                              {item.duration}{" "}
                              {item.duration > 1 ? "hours" : "hour"}
                            </span>
                          </li>
                          <li className="flex items-center">
                            {item?.chat === "true" ? (
                              <i className="icofont-check text-whiteColor bg-secondaryColor px-1 py-3px mr-15px rounded-full text-xs" />
                            ) : (
                              <i className="icofont-close text-whiteColor bg-lightGrey6 px-1 py-3px mr-15px rounded-full text-xs" />
                            )}

                            <span className="text-md text-deepblue font-medium dark:text-deepblue-dark">
                              Public / Private Chat
                            </span>
                          </li>
                          <li className="flex items-center">
                            {item?.sharedNotes === "true" ? (
                              <i className="icofont-check text-whiteColor bg-secondaryColor px-1 py-3px mr-15px rounded-full text-xs" />
                            ) : (
                              <i className="icofont-close text-whiteColor bg-lightGrey6 px-1 py-3px mr-15px rounded-full text-xs" />
                            )}

                            <span className="text-md text-deepblue font-medium dark:text-deepblue-dark">
                              Shared Notes
                            </span>
                          </li>
                          <li className="flex items-center">
                            {item?.screenshare === "true" ? (
                              <i className="icofont-check text-whiteColor bg-secondaryColor px-1 py-3px mr-15px rounded-full text-xs" />
                            ) : (
                              <i className="icofont-close text-whiteColor bg-lightGrey6 px-1 py-3px mr-15px rounded-full text-xs" />
                            )}

                            <span className="text-md text-deepblue font-medium dark:text-deepblue-dark">
                              Screen Sharing
                            </span>
                          </li>
                          <li className="flex items-center">
                            {item?.sharedRoomAccess === "true" ? (
                              <i className="icofont-check text-whiteColor bg-secondaryColor px-1 py-3px mr-15px rounded-full text-xs" />
                            ) : (
                              <i className="icofont-close text-whiteColor bg-lightGrey6 px-1 py-3px mr-15px rounded-full text-xs" />
                            )}

                            <span className="text-md text-deepblue font-medium dark:text-deepblue-dark">
                              Share Access
                            </span>
                          </li>
                          <li className="flex items-center">
                            {item?.storage > 0 ? (
                              <i className="icofont-check text-whiteColor bg-secondaryColor px-1 py-3px mr-15px rounded-full text-xs" />
                            ) : (
                              <i className="icofont-close text-whiteColor bg-lightGrey6 px-1 py-3px mr-15px rounded-full text-xs" />
                            )}

                            <span className="text-md text-deepblue font-medium dark:text-deepblue-dark">
                              {item.storage} GB
                            </span>
                          </li>
                          <li className="flex items-center">
                            {item?.recording === "true" ? (
                              <i className="icofont-check text-whiteColor bg-secondaryColor px-1 py-3px mr-15px rounded-full text-xs" />
                            ) : (
                              <i className="icofont-close text-whiteColor bg-lightGrey6 px-1 py-3px mr-15px rounded-full text-xs" />
                            )}

                            <span className="text-md text-deepblue font-medium dark:text-deepblue-dark">
                              {item.recording === "true"
                                ? "Recordings"
                                : "No Recordings"}
                            </span>
                          </li>
                          <li className="flex items-center">
                            {item?.breakout === "true" ? (
                              <i className="icofont-check text-whiteColor bg-secondaryColor px-1 py-3px mr-15px rounded-full text-xs" />
                            ) : (
                              <i className="icofont-close text-whiteColor bg-lightGrey6 px-1 py-3px mr-15px rounded-full text-xs" />
                            )}

                            <span className="text-md text-deepblue font-medium dark:text-deepblue-dark">
                              Breakout Rooms
                            </span>
                          </li>
                          <li className="flex items-center">
                            {item?.multiuserwhiteboard === "true" ? (
                              <i className="icofont-check text-whiteColor bg-secondaryColor px-1 py-3px mr-15px rounded-full text-xs" />
                            ) : (
                              <i className="icofont-close text-whiteColor bg-lightGrey6 px-1 py-3px mr-15px rounded-full text-xs" />
                            )}

                            <span className="text-md text-deepblue font-medium dark:text-deepblue-dark">
                              Multi User Whiteboard
                            </span>
                          </li>
                        </ul>
                      )}
                    </div>
                  </div>
                  <div className="px-4 py-2 ">
                    <div
                      className={`${
                        showLMSFeatures
                          ? "border border-secondaryColor rounded-lg"
                          : ""
                      }`}
                    >
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowLMSFeatures((prev) => !prev);
                        }}
                        className="bg-secondaryColor rounded-t-lg"
                      >
                        <h2 className=" text-2xl font-semibold text-whiteColor dark:text-deepblue-dark mb-4  pb-2 pt-2 px-2 md:px-8 flex items-center justify-center gap-2 ">
                          LMS Features
                          {showLMSFeatures ? (
                            <HiChevronUp className="text-whiteColor" />
                          ) : (
                            <HiChevronDown className="text-whiteColor" />
                          )}
                        </h2>
                      </div>
                      {showLMSFeatures && (
                        <ul className="flex flex-col gap-y-30px px-4 pb-2">
                          <li className="flex items-center">
                            {item?.courseManagement === "true" ? (
                              <i className="icofont-check text-whiteColor bg-secondaryColor px-1 py-3px mr-15px rounded-full text-xs" />
                            ) : (
                              <i className="icofont-close text-whiteColor bg-lightGrey6 px-1 py-3px mr-15px rounded-full text-xs" />
                            )}

                            <span className="text-md text-deepblue font-medium dark:text-deepblue-dark">
                              Course Management
                            </span>
                          </li>
                          <li className="flex items-center">
                            {item?.efficientDigitalBookManagement === "true" ? (
                              <i className="icofont-check text-whiteColor bg-secondaryColor px-1 py-3px mr-15px rounded-full text-xs" />
                            ) : (
                              <i className="icofont-close text-whiteColor bg-lightGrey6 px-1 py-3px mr-15px rounded-full text-xs" />
                            )}

                            <span className="text-md text-deepblue font-medium dark:text-deepblue-dark">
                              Efficient Digital Book Management
                            </span>
                          </li>
                          <li className="flex items-center">
                            {item?.bulkEnrollment === "true" ? (
                              <i className="icofont-check text-whiteColor bg-secondaryColor px-1 py-3px mr-15px rounded-full text-xs" />
                            ) : (
                              <i className="icofont-close text-whiteColor bg-lightGrey6 px-1 py-3px mr-15px rounded-full text-xs" />
                            )}

                            <span className="text-md text-deepblue font-medium dark:text-deepblue-dark">
                              Bulk Enrollment
                            </span>
                          </li>
                          <li className="flex items-center">
                            {item?.communicationTools === "true" ? (
                              <i className="icofont-check text-whiteColor bg-secondaryColor px-1 py-3px mr-15px rounded-full text-xs" />
                            ) : (
                              <i className="icofont-close text-whiteColor bg-lightGrey6 px-1 py-3px mr-15px rounded-full text-xs" />
                            )}

                            <span className="text-md text-deepblue font-medium dark:text-deepblue-dark">
                              Communication Tools
                            </span>
                          </li>
                          <li className="flex items-center">
                            {item?.studentManagement === "true" ? (
                              <i className="icofont-check text-whiteColor bg-secondaryColor px-1 py-3px mr-15px rounded-full text-xs" />
                            ) : (
                              <i className="icofont-close text-whiteColor bg-lightGrey6 px-1 py-3px mr-15px rounded-full text-xs" />
                            )}

                            <span className="text-md text-deepblue font-medium dark:text-deepblue-dark">
                              Student Management
                            </span>
                          </li>
                          <li className="flex items-center">
                            {item?.reportsAndAnalytics === "true" ? (
                              <i className="icofont-check text-whiteColor bg-secondaryColor px-1 py-3px mr-15px rounded-full text-xs" />
                            ) : (
                              <i className="icofont-close text-whiteColor bg-lightGrey6 px-1 py-3px mr-15px rounded-full text-xs" />
                            )}

                            <span className="text-md text-deepblue font-medium dark:text-deepblue-dark">
                              Reports And Analytics
                            </span>
                          </li>
                          <li className="flex items-center">
                            {item?.customizationAndPersonalization ===
                            "true" ? (
                              <i className="icofont-check text-whiteColor bg-secondaryColor px-1 py-3px mr-15px rounded-full text-xs" />
                            ) : (
                              <i className="icofont-close text-whiteColor bg-lightGrey6 px-1 py-3px mr-15px rounded-full text-xs" />
                            )}

                            <span className="text-md text-deepblue font-medium dark:text-deepblue-dark">
                              Customization & Personalization
                            </span>
                          </li>
                          <li className="flex items-center">
                            {item?.assessmentAndGrading === "true" ? (
                              <i className="icofont-check text-whiteColor bg-secondaryColor px-1 py-3px mr-15px rounded-full text-xs" />
                            ) : (
                              <i className="icofont-close text-whiteColor bg-lightGrey6 px-1 py-3px mr-15px rounded-full text-xs" />
                            )}

                            <span className="text-md text-deepblue font-medium dark:text-deepblue-dark">
                              Assessment & Grading
                            </span>
                          </li>
                          <li className="flex items-center">
                            {item?.multipleChoiceQuestions === "true" ? (
                              <i className="icofont-check text-whiteColor bg-secondaryColor px-1 py-3px mr-15px rounded-full text-xs" />
                            ) : (
                              <i className="icofont-close text-whiteColor bg-lightGrey6 px-1 py-3px mr-15px rounded-full text-xs" />
                            )}

                            <span className="text-md text-deepblue font-medium dark:text-deepblue-dark">
                              Multiple Choice Questions
                            </span>
                          </li>
                          <li className="flex items-center">
                            {item?.rubricGenerator === "true" ? (
                              <i className="icofont-check text-whiteColor bg-secondaryColor px-1 py-3px mr-15px rounded-full text-xs" />
                            ) : (
                              <i className="icofont-close text-whiteColor bg-lightGrey6 px-1 py-3px mr-15px rounded-full text-xs" />
                            )}

                            <span className="text-md text-deepblue font-medium dark:text-deepblue-dark">
                              Rubric Generator
                            </span>
                          </li>
                          <li className="flex items-center">
                            {item?.studentWorkFeedback === "true" ? (
                              <i className="icofont-check text-whiteColor bg-secondaryColor px-1 py-3px mr-15px rounded-full text-xs" />
                            ) : (
                              <i className="icofont-close text-whiteColor bg-lightGrey6 px-1 py-3px mr-15px rounded-full text-xs" />
                            )}

                            <span className="text-md text-deepblue font-medium dark:text-deepblue-dark">
                              Student Work Feedback
                            </span>
                          </li>
                          <li className="flex items-center">
                            {item?.professionalEmailCommunication === "true" ? (
                              <i className="icofont-check text-whiteColor bg-secondaryColor px-1 py-3px mr-15px rounded-full text-xs" />
                            ) : (
                              <i className="icofont-close text-whiteColor bg-lightGrey6 px-1 py-3px mr-15px rounded-full text-xs" />
                            )}

                            <span className="text-md text-deepblue font-medium dark:text-deepblue-dark">
                              Professional Email Communication
                            </span>
                          </li>
                          <li className="flex items-center">
                            {item?.depthOfKnowledgeQuizGenerator === "true" ? (
                              <i className="icofont-check text-whiteColor bg-secondaryColor px-1 py-3px mr-15px rounded-full text-xs" />
                            ) : (
                              <i className="icofont-close text-whiteColor bg-lightGrey6 px-1 py-3px mr-15px rounded-full text-xs" />
                            )}

                            <span className="text-md text-deepblue font-medium dark:text-deepblue-dark">
                              Depth of Knowledge Quiz Generator
                            </span>
                          </li>
                          <li className="flex items-center">
                            {item?.careerOrCollegeCounselor === "true" ? (
                              <i className="icofont-check text-whiteColor bg-secondaryColor px-1 py-3px mr-15px rounded-full text-xs" />
                            ) : (
                              <i className="icofont-close text-whiteColor bg-lightGrey6 px-1 py-3px mr-15px rounded-full text-xs" />
                            )}

                            <span className="text-md text-deepblue font-medium dark:text-deepblue-dark">
                              Career or college counselor
                            </span>
                          </li>
                          <li className="flex items-center">
                            {item?.ideaGenerator === "true" ? (
                              <i className="icofont-check text-whiteColor bg-secondaryColor px-1 py-3px mr-15px rounded-full text-xs" />
                            ) : (
                              <i className="icofont-close text-whiteColor bg-lightGrey6 px-1 py-3px mr-15px rounded-full text-xs" />
                            )}

                            <span className="text-md text-deepblue font-medium dark:text-deepblue-dark">
                              Idea Generator
                            </span>
                          </li>
                          <li className="flex items-center">
                            {item?.learnCoding === "true" ? (
                              <i className="icofont-check text-whiteColor bg-secondaryColor px-1 py-3px mr-15px rounded-full text-xs" />
                            ) : (
                              <i className="icofont-close text-whiteColor bg-lightGrey6 px-1 py-3px mr-15px rounded-full text-xs" />
                            )}

                            <span className="text-md text-deepblue font-medium dark:text-deepblue-dark">
                              Learn coding
                            </span>
                          </li>
                          <li className="flex items-center">
                            {item?.syllabus === "true" ? (
                              <i className="icofont-check text-whiteColor bg-secondaryColor px-1 py-3px mr-15px rounded-full text-xs" />
                            ) : (
                              <i className="icofont-close text-whiteColor bg-lightGrey6 px-1 py-3px mr-15px rounded-full text-xs" />
                            )}

                            <span className="text-md text-deepblue font-medium dark:text-deepblue-dark">
                              Syllabus
                            </span>
                          </li>
                          <li className="flex items-center">
                            {item?.assessmentOutline === "true" ? (
                              <i className="icofont-check text-whiteColor bg-secondaryColor px-1 py-3px mr-15px rounded-full text-xs" />
                            ) : (
                              <i className="icofont-close text-whiteColor bg-lightGrey6 px-1 py-3px mr-15px rounded-full text-xs" />
                            )}

                            <span className="text-md text-deepblue font-medium dark:text-deepblue-dark">
                              Assessment Outline
                            </span>
                          </li>
                          <li className="flex items-center">
                            {item?.lessonPlan5Es === "true" ? (
                              <i className="icofont-check text-whiteColor bg-secondaryColor px-1 py-3px mr-15px rounded-full text-xs" />
                            ) : (
                              <i className="icofont-close text-whiteColor bg-lightGrey6 px-1 py-3px mr-15px rounded-full text-xs" />
                            )}

                            <span className="text-md text-deepblue font-medium dark:text-deepblue-dark">
                              Lesson Plan - 5 E's
                            </span>
                          </li>
                          <li className="flex items-center">
                            {item?.claimEvidenceReasoning === "true" ? (
                              <i className="icofont-check text-whiteColor bg-secondaryColor px-1 py-3px mr-15px rounded-full text-xs" />
                            ) : (
                              <i className="icofont-close text-whiteColor bg-lightGrey6 px-1 py-3px mr-15px rounded-full text-xs" />
                            )}

                            <span className="text-md text-deepblue font-medium dark:text-deepblue-dark">
                              Claim-Evidence-Reasoning
                            </span>
                          </li>
                          <li className="flex items-center">
                            {item?.debate === "true" ? (
                              <i className="icofont-check text-whiteColor bg-secondaryColor px-1 py-3px mr-15px rounded-full text-xs" />
                            ) : (
                              <i className="icofont-close text-whiteColor bg-lightGrey6 px-1 py-3px mr-15px rounded-full text-xs" />
                            )}

                            <span className="text-md text-deepblue font-medium dark:text-deepblue-dark">
                              Debate
                            </span>
                          </li>
                          <li className="flex items-center">
                            {item?.mockInterview === "true" ? (
                              <i className="icofont-check text-whiteColor bg-secondaryColor px-1 py-3px mr-15px rounded-full text-xs" />
                            ) : (
                              <i className="icofont-close text-whiteColor bg-lightGrey6 px-1 py-3px mr-15px rounded-full text-xs" />
                            )}

                            <span className="text-md text-deepblue font-medium dark:text-deepblue-dark">
                              Mock Interview
                            </span>
                          </li>
                          <li className="flex items-center">
                            {item?.projectBasedLearning === "true" ? (
                              <i className="icofont-check text-whiteColor bg-secondaryColor px-1 py-3px mr-15px rounded-full text-xs" />
                            ) : (
                              <i className="icofont-close text-whiteColor bg-lightGrey6 px-1 py-3px mr-15px rounded-full text-xs" />
                            )}

                            <span className="text-md text-deepblue font-medium dark:text-deepblue-dark">
                              Project Based Learning
                            </span>
                          </li>
                          <li className="flex items-center">
                            {item?.teamBasedActivity === "true" ? (
                              <i className="icofont-check text-whiteColor bg-secondaryColor px-1 py-3px mr-15px rounded-full text-xs" />
                            ) : (
                              <i className="icofont-close text-whiteColor bg-lightGrey6 px-1 py-3px mr-15px rounded-full text-xs" />
                            )}

                            <span className="text-md text-deepblue font-medium dark:text-deepblue-dark">
                              Team Based Activity
                            </span>
                          </li>
                          <li className="flex items-center">
                            {item?.teamBasedActivity === "true" ? (
                              <i className="icofont-check text-whiteColor bg-secondaryColor px-1 py-3px mr-15px rounded-full text-xs" />
                            ) : (
                              <i className="icofont-close text-whiteColor bg-lightGrey6 px-1 py-3px mr-15px rounded-full text-xs" />
                            )}

                            <span className="text-md text-deepblue font-medium dark:text-deepblue-dark">
                              Battleship Style
                            </span>
                          </li>
                          <li className="flex items-center">
                            {item?.fillInTheBlankQuestions === "true" ? (
                              <i className="icofont-check text-whiteColor bg-secondaryColor px-1 py-3px mr-15px rounded-full text-xs" />
                            ) : (
                              <i className="icofont-close text-whiteColor bg-lightGrey6 px-1 py-3px mr-15px rounded-full text-xs" />
                            )}

                            <span className="text-md text-deepblue font-medium dark:text-deepblue-dark">
                              Fill In The Blank Questions
                            </span>
                          </li>
                          <li className="flex items-center">
                            {item?.scenarioBasedQuestions === "true" ? (
                              <i className="icofont-check text-whiteColor bg-secondaryColor px-1 py-3px mr-15px rounded-full text-xs" />
                            ) : (
                              <i className="icofont-close text-whiteColor bg-lightGrey6 px-1 py-3px mr-15px rounded-full text-xs" />
                            )}

                            <span className="text-md text-deepblue font-medium dark:text-deepblue-dark">
                              Scenario-Based Questions
                            </span>
                          </li>
                          <li className="flex items-center">
                            {item?.trueFalseQuestions === "true" ? (
                              <i className="icofont-check text-whiteColor bg-secondaryColor px-1 py-3px mr-15px rounded-full text-xs" />
                            ) : (
                              <i className="icofont-close text-whiteColor bg-lightGrey6 px-1 py-3px mr-15px rounded-full text-xs" />
                            )}

                            <span className="text-md text-deepblue font-medium dark:text-deepblue-dark">
                              True/False Questions
                            </span>
                          </li>
                          <li className="flex items-center">
                            {item?.timelyRelevantActionableFeedback ===
                            "true" ? (
                              <i className="icofont-check text-whiteColor bg-secondaryColor px-1 py-3px mr-15px rounded-full text-xs" />
                            ) : (
                              <i className="icofont-close text-whiteColor bg-lightGrey6 px-1 py-3px mr-15px rounded-full text-xs" />
                            )}

                            <span className="text-md text-deepblue font-medium dark:text-deepblue-dark">
                              Timely, relevant, and actionable feedback
                            </span>
                          </li>
                        </ul>
                      )}
                    </div>
                  </div>
                  {/* plan bottom */}
                  <div className="w-full mt-2 text-center">
                    {/* <a
                    href="/"
                    className="w-full py-10px px-25px text-size-15 text-center text-whiteColor bg-primaryColor border border-primaryColor hover:bg-whiteColor hover:text-primaryColor mb-25px mt-30px rounded dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
                  >
                    Get Started
                  </a> */}
                    <PrimaryButton
                      style={{ width: "100%" }}
                      primary={true}
                      disabled={auth?.user && item?.name === "Free"}
                      onClick={() => {
                        item?.name === "Free"
                          ? handleSignUp()
                          : navigate(`/checkout?id=${item?.id}`);
                      }}
                    >
                      {item?.name === "Free" ? "Free Trial" : "Subscribe"}
                    </PrimaryButton>
                    {/* <p className="text-size-15 text-contentColor dark:text-contentColor-dark">
                    No creadit card required
                  </p> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-whiteColor dark:bg-lightGrey10-dark">
        <div className="container pb-100px pt-50px">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-30px ">
            <div
              // id="contact-form"
              // action="mail.php"
              // method="post"
              className=" contact-form p-5  border border-borderColor2 dark:border-transparent dark:shadow-container shadow-container rounded-lg bg-whiteColor dark:bg-lightGrey10-dark"
              data-aos="fade-up"
            >
              {/* heading */}
              <div className="mb-0 text-center ">
                <h4
                  className="  text-size-23 md:text-size-44 font-bold leading-10 md:leading-70px text-blackColor dark:text-blackColor-dark"
                  data-aos="fade-up"
                >
                  Need a Custom LMS Solution? <br /> We Build Tailored Learning
                  Platforms!
                </h4>
                <ParagraphText>
                  Struggling to find an LMS that fits your unique training or
                  e-learning needs? Atlearn LMS develops fully customized
                  learning management systems designed for your organization's
                  goals.
                </ParagraphText>
                {/* <p
                  data-aos="fade-up"
                  className="text-size-13 md:text-base leading-5  text-contentColor dark:text-contentColor-dark"
                >
                  Book a FREE consultation today! Get a personalized demo and
                  all your questions answered.
                </p> */}
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 mb-10px gap-15px">
                <div data-aos="fade-up" className="relative">
                  <input
                    value={formData?.firstname || ""}
                    onChange={handleChange}
                    type="text"
                    id="first_name"
                    name="firstname"
                    placeholder="Enter your name*"
                    className={`w-full pl-26px bg-transparent focus:outline-none 
              text-contentColor dark:text-contentColor-dark 
              placeholder:text-placeholder placeholder:opacity-80 
              h-15 leading-15 font-medium rounded border
              ${
                errors.firstname
                  ? "border-red-500"
                  : " border-borderColor2 dark:border-borderColor2-dark"
              }`}
                    required
                  />

                  <div className="text-xl leading-23px text-primaryColor absolute right-6 top-1/2 -translate-y-1/2">
                    <i className="icofont-businessman" />
                  </div>
                </div>
                <div data-aos="fade-up" className="relative">
                  <input
                    value={formData?.email || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="email"
                    name="email"
                    placeholder="Enter Email Address*"
                    className={`w-full pl-26px bg-transparent focus:outline-none 
                      text-contentColor dark:text-contentColor-dark 
                      placeholder:text-placeholder placeholder:opacity-80 
                      h-15 leading-15 font-medium rounded border
                      ${
                        errors.email
                          ? "border-red-500"
                          : " border-borderColor2 dark:border-borderColor2-dark"
                      }`}
                    required
                  />
                  <div className="text-xl leading-23px text-primaryColor absolute right-6 top-1/2 -translate-y-1/2">
                    <i className="icofont-envelope" />
                  </div>
                </div>

                <div data-aos="fade-up" className="relative">
                  <input
                    value={formData?.phone || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="number"
                    id="phone"
                    name="phone"
                    placeholder="Enter Your Phone"
                    className={`w-full pl-26px bg-transparent focus:outline-none 
                      text-contentColor dark:text-contentColor-dark 
                      placeholder:text-placeholder placeholder:opacity-80 
                      h-15 leading-15 font-medium rounded border
                      ${
                        errors.phone
                          ? "border-red-500"
                          : " border-borderColor2 dark:border-borderColor2-dark"
                      }`}
                    required
                  />
                  <div className="text-xl leading-23px text-primaryColor absolute right-6 top-1/2 -translate-y-1/2">
                    <i className="icofont-ui-call" />
                  </div>
                </div>
                <div data-aos="fade-up" className="relative">
                  <input
                    value={formData?.subject || ""}
                    onChange={handleChange}
                    type="text"
                    id="subject"
                    name="subject"
                    placeholder="Enter Your Subject"
                    className={`w-full pl-26px bg-transparent focus:outline-none 
                      text-contentColor dark:text-contentColor-dark 
                      placeholder:text-placeholder placeholder:opacity-80 
                      h-15 leading-15 font-medium rounded border
                      ${
                        errors.subject
                          ? "border-red-500"
                          : " border-borderColor2 dark:border-borderColor2-dark"
                      }`}
                    required
                  />
                  <div className="text-xl leading-23px text-primaryColor absolute right-6 top-1/2 -translate-y-1/2">
                    <i className="icofont-ui-chat" />
                  </div>
                </div>
              </div>
              <div className="relative" data-aos="fade-up">
                <textarea
                  value={formData?.message || ""}
                  onChange={handleChange}
                  id="website"
                  name="message"
                  placeholder="Enter your Message here"
                  className={`${
                    !!errors.message ? "border-red-500" : "border-gray-300"
                  } w-full pl-26px bg-transparent text-contentColor dark:text-contentColor-dark border placeholder:text-placeholder placeholder:opacity-80 rounded`}
                  cols={30}
                  rows={5}
                  defaultValue={""}
                />
                <div className="text-xl leading-23px text-primaryColor absolute right-6 top-[17px]">
                  <i className="icofont-pen-alt-2" />
                </div>
              </div>
              <div className="flex justify-end" data-aos="fade-up">
                <PrimaryButton
                  primary={true}
                  onClick={handleSubmit}
                  loading={loading}
                >
                  Submit
                </PrimaryButton>
                {/* <button
                  
                  value="submit"
                  name="submit"
                  className="text-size-15 text-whiteColor bg-primaryColor px-25px py-10px border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
                >
                  
                </button> */}
                <p className="form-messege" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="">
        <SplitSection data={trialInfo} />
      </div>
    </div>
  );
};

export default Pricing;
