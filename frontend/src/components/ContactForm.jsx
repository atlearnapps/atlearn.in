import React, { useEffect, useState } from "react";
import Button from "./Button";
import formpicture from "src/assets/images/contact/contact.gif";
import HeaderText from "./HeaderText";
import { toast } from "react-toastify";
import apiClients from "src/apiClients/apiClients";
function ContactForm() {
  const formdata = {
    firstname: "",
    phone: "",
    email: "",
    message: "",
  };
  const [formData, setFormData] = useState();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setFormData(formdata);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    e.preventDefault();

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
      <div className=" mb-[100px] p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 justify-items-center items-center">
        <div className=" w-full flex justify-end">
          <form className="w-full max-w-lg ">
            <div>
              <span
                className="text-secondary font-bold tracking-[0.3em] font-fredoka uppercase -mt-0 mb-6"
                id="span-1"
              >
                HAVE ANY QUESTIONS? 
              </span>
              <HeaderText>Feel Free To Contact!</HeaderText>
            </div>
            <div className="md:grid gap-6 mb-6 grid-cols-2">
              <div className="mb-4 md:mb-0">
                <label className="block mb-2 text-base text-gray-900 font-fredoka">
                  Name
                  <span className="text-red-500 text-sm"> * </span>
                </label>
                <input
                  value={formData?.firstname || ""}
                  onChange={handleChange}
                  type="text"
                  id="first_name"
                  name="firstname"
                  className={`border ${
                    !!errors.firstname ? "border-red-500" : "border-gray-300"
                  } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
                  aria-invalid={!!errors.firstname}
                  required
                />
              </div>
              {/* <div className="mb-4 md:mb-0">
                <label className="block mb-2 text-base text-gray-900 font-fredoka">
                  Last name{" "}
                  <span className="text-red-500 text-sm">(Required)</span>
                </label>
                <input
                  value={formData?.lastname || ""}
                  onChange={handleChange}
                  type="text"
                  id="last_name"
                  name="lastname"
                  className={`border ${
                    !!errors.lastname ? "border-red-500" : "border-gray-300"
                  } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
                  required
                />
              </div> */}
              <div className="mb-4 md:mb-0">
                <label className="block mb-2 text-base text-gray-900 font-fredoka">
                  Email <span className="text-red-500 text-sm"> * </span>
                </label>
                <input
                  value={formData?.email || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type="text"
                  id="company"
                  name="email"
                  className={`border ${
                    !!errors.email ? "border-red-500" : "border-gray-300"
                  } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
                  required
                />
              </div>
              <div className="mb-4 md:mb-0">
                <label className="block mb-2 text-base text-gray-900 font-fredoka">
                  Phone number
                  {/* <span className="text-red-500 text-sm">(Required)</span> */}
                </label>
                <input
                  value={formData?.phone || ""}
                  onChange={handleChange}
                  // onBlur={handleBlur}
                  type="tel"
                  id="phone"
                  name="phone"
                  className={`border ${
                    !!errors.phone ? "border-red-500" : "border-gray-300"
                  } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
                  //   pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block mb-2 text-base text-gray-900 font-fredoka">
                  Message
                  <span className="text-red-500 text-sm"> * </span>
                </label>
                <textarea
                  value={formData?.message || ""}
                  onChange={handleChange}
                  id="website"
                  name="message"
                  placeholder="Type your message"
                  className={`border ${
                    !!errors.message ? "border-red-500" : "border-gray-300"
                  } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
                  required
                ></textarea>
              </div>
            </div>
            <Button
              loading={loading}
              onClick={handleSubmit}
              text={"Send Message"}
            ></Button>
          </form>
        </div>

        <div className="flex justify-start items-center w-full max-w-lg">
          <img
            className="   max-w-full h-auto"
            src={formpicture}
            alt="formpicture"
          />
        </div>
      </div>
    </div>
  );
}

export default ContactForm;
