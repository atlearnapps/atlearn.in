import React, { useState, useRef, useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";

import digital_book_icon from "src/assets/images/Integration/digital-book.svg";
import multi_user_dashboard from "src/assets/images/Integration/multi-user-dashboard.svg";
import automatedIcon from "src/assets/images/LMS/automated-grading---feedback.svg";
import Live_Streaming_image from "src/assets/images/LMS/Integrate With Popular Live Streaming.svg";
import Mobile_Learning_Gamification_Solutions_icon from "src/assets/images/HireDeveloper/mobile-learning---gamification-solutions-icon---mo.svg"


// import { FiUnlock } from "react-icons/fi";
import { validateEmail } from "src/utils/validateFields/ValidateEmail";
import validatePhoneNumber from "src/utils/validateFields/validatePhoneNumber";
import apiClients from "src/apiClients/apiClients";
import { toast } from "react-toastify";
export default function LMSDemoModal({ open, handleClose }) {
  const formdata = {
    firstname: "",
    email: "",
    phone: "",
    message: "",
    type: "Request LMS Demo",
  };
  const [form, setForm] = useState(formdata);
  const [errors, setErrors] = useState({});
  const modalRef = useRef();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.name]: "",
    }));
  };

  const handleSubmit = async () => {
    try {
      const newErrors = {};
      const requiredFields = ["firstname", "email"];
      requiredFields.forEach((field) => {
        if (
          form[field] === undefined ||
          form[field] === null ||
          form[field] === ""
        ) {
          newErrors[field] = `This ${field} field is required.`;
        }
      });
      if (form.email && !validateEmail(form.email)) {
        newErrors.email = "Please enter a valid email address.";
      }
      if (form.phone && !validatePhoneNumber(form.phone)) {
        newErrors.phone = "Please enter a valid phone number.";
      }
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
      } else {
        setLoading(true);
        setErrors({});
        const response = await apiClients.contact(form);
        if (response.success === true) {
          setLoading(false);
          setSuccess(true);
        } else {
          toast.error(response.message);
          setLoading(false);
        }
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // Close modal on click outside
  useEffect(() => {
    const handler = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setSuccess(false);
        setForm(formdata);
        setErrors({});
        handleClose();
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const countryCodes = [
    { name: "India", code: "+91", flag: "🇮🇳" },
    { name: "United States", code: "+1", flag: "🇺🇸" },
    { name: "United Kingdom", code: "+44", flag: "🇬🇧" },
    { name: "Australia", code: "+61", flag: "🇦🇺" },
    { name: "United Arab Emirates", code: "+971", flag: "🇦🇪" },
    { name: "Canada", code: "+1", flag: "🇨🇦" },
    { name: "Germany", code: "+49", flag: "🇩🇪" },
    { name: "France", code: "+33", flag: "🇫🇷" },
    { name: "Japan", code: "+81", flag: "🇯🇵" },
    { name: "China", code: "+86", flag: "🇨🇳" },
    { name: "Brazil", code: "+55", flag: "🇧🇷" },
    { name: "South Africa", code: "+27", flag: "🇿🇦" },
    { name: "Nigeria", code: "+234", flag: "🇳🇬" },
    { name: "Russia", code: "+7", flag: "🇷🇺" },
    { name: "Mexico", code: "+52", flag: "🇲🇽" },
    { name: "Spain", code: "+34", flag: "🇪🇸" },
    { name: "Italy", code: "+39", flag: "🇮🇹" },
    { name: "Bangladesh", code: "+880", flag: "🇧🇩" },
    { name: "Pakistan", code: "+92", flag: "🇵🇰" },
    { name: "Indonesia", code: "+62", flag: "🇮🇩" },
    // Add more countries as needed
  ];

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };
    if (name === "email" && !validateEmail(value)) {
      newErrors.email = "Please enter a valid email address";
    } else {
      delete newErrors.email;
    }
    if (name === "phone" && !validatePhoneNumber(value)) {
      newErrors.phone = "Please enter a valid phone number";
    } else {
      delete newErrors.phone;
    }
    setErrors(newErrors);
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm overflow-auto">
          <div
            ref={modalRef}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 my-4 p-4 md:p-10 animate-fade-in max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <div className="absolute top-2 right-4">
              <button
                onClick={() => {
                  setForm(formdata);
                  setSuccess(false);
                  setErrors({});
                  handleClose();
                }}
                className="text-gray-500 text-3xl hover:text-red-600"
              >
                &times;
              </button>
            </div>

            {/* Main Content */}
            <div className="flex flex-col md:flex-row gap-8 items-start ">
              {/* Left Info Section */}
              <div className="md:w-1/2 space-y-4 text-sm text-gray-700">
                <h2 className="text-2xl md:text-3xl font-bold text-primary">
                  Test Drive Our LMS
                  <br />
                  <span className="text-secondary">
                    Full Access, Zero Risk
                  </span>
                </h2>
                <p>Enter your details to receive demo credentials</p>

                {/* Features */}
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <li className="flex items-center gap-1">
                    <img
                      loading="lazy"
                      src={digital_book_icon}
                      alt={"Chat feature"}
                      title={"Chat feature"}
                      className="w-8 h-8"
                    />
                    <strong>Course Builder</strong>
                  </li>
                  <li className="flex items-center gap-1">
                    <img
                      loading="lazy"
                      src={automatedIcon}
                      alt={"Recordings"}
                      title={"Recordings"}
                      className="w-8 h-8"
                    />
                    <strong>AI Grading Tools</strong>
                  </li>
                  <li className="flex items-center gap-1">
                    <img
                      loading="lazy"
                      src={multi_user_dashboard}
                      alt={"Screen Sharing"}
                      title={"Screen Sharing"}
                      className="w-8 h-8"
                    />
                    <strong>Progress Analytics</strong>
                  </li>
                  <li className="flex items-center gap-1">
                    <img
                      loading="lazy"
                      src={Live_Streaming_image}
                      alt={"Screen Sharing"}
                      title={"Screen Sharing"}
                      className="w-8 h-8"
                    />
                    <strong>Virtual Classroom</strong>
                  </li>
                  <li className="flex items-center gap-1">
                    <img
                      loading="lazy"
                      src={Mobile_Learning_Gamification_Solutions_icon}
                      alt={"Multi-user dashboard"}
                      title={"Multi-user dashboard"}
                      className="w-8 h-8"
                    />
                    <strong>Mobile Learning</strong>
                  </li>
                  {/* <li className="flex items-center gap-1">
                    <img
                      loading="lazy"
                      src={breakout_rooms_icon}
                      alt={"Breakout Rooms"}
                      title={"Breakout Rooms"}
                      className="w-8 h-8"
                    />
                    <strong>Breakout Rooms</strong>
                  </li> */}
                </ul>

                <p className="text-xs italic text-gray-500">
                  We value your privacy and will never send irrelevant info.
                </p>
              </div>

              {/* Right Form Section */}
              {success ? (
                <div className="flex flex-col items-center justify-center text-center h-full space-y-4  md:w-1/2">
                  <FaCheckCircle className="text-green-500 text-5xl" />
                  <h3 className="text-xl font-semibold text-gray-800">
                    Thank you!
                  </h3>
                  <p className="text-sm text-gray-600">
                    We’ve sent your demo login credentials. <br /> Check your
                    email and give it a try!
                  </p>
                </div>
              ) : (
                <div className="md:w-1/2 space-y-4 text-black ">
                  <div>
                    <label className="mb-1 block font-semibold ">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstname"
                      placeholder="Your name*"
                      value={form.firstname}
                      onChange={handleChange}
                      className={`w-full pl-26px bg-transparent focus:outline-none 
                            text-contentColor 
                            placeholder:text-placeholder placeholder:opacity-80 
                            h-12 leading-15 font-medium rounded  bg-whiteColor  border
                            ${
                              errors.firstname
                                ? "border-red-500"
                                : " border-borderColor2 "
                            }`}
                    />
                    {errors.firstname && (
                      <p className="text-red-500 text-xs">{errors.firstname}</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block font-semibold ">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com*"
                      value={form.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full pl-26px bg-transparent focus:outline-none 
                            text-contentColor  
                            placeholder:text-placeholder placeholder:opacity-80 
                            h-12 leading-15 font-medium rounded  bg-whiteColor  border
                            ${
                              errors.email
                                ? "border-red-500"
                                : " border-borderColor2 "
                            }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block font-semibold ">
                      Phone Number
                    </label>
                    <div
                      className={`flex items-center h-12 rounded border bg-whiteColor dark:bg-transparent 
                            ${
                              errors.phone
                                ? "border-red-500"
                                : "border-borderColor2 "
                            }`}
                    >
                      <select
                        name="countryCode"
                        value={form?.countryCode || "+91"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="bg-transparent px-3 py-2 text-sm font-medium text-contentColor dark:text-contentColor-dark focus:outline-none"
                      >
                        {countryCodes.map((country) => (
                          <option
                            key={country.code + country.name}
                            value={country.code}
                          >
                            {country.flag} {country.code}
                          </option>
                        ))}
                      </select>

                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={form?.phone || ""}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        className=" w-full bg-transparent h-12 pl-2 pr-4 focus:outline-none font-medium 
                              text-contentColor  placeholder:text-placeholder placeholder:opacity-80"
                        required
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    className="w-full h-10 bg-primary text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center hover:scale-105 transition-transform"
                  >
                    Submit
                    {loading && <div className="spinnerButton"></div>}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
