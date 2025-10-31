import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { BASE_URL } from "src/apiClients/config";

const Survey = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//embed.typeform.com/next/embed.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  return (
    <>
      <Helmet>
        <title>Share Feedback Through Atlearn's Insightful Surveys</title>
        <meta
          name="description"
          content="Help improve Atlearn by sharing feedback via surveys. Your insights contribute to creating better experiences and impactful learning solutions."
        />
        <link rel="canonical" href={`${BASE_URL}/survey`} />
      </Helmet>
      <div className="mb-16">
        <div data-tf-live="01JBXMXJQYEZ5PW4EBZF05RCXD"></div>
      </div>
    </>

    //   <div className="flex justify-center items-center py-12">
    //   <div
    //     data-tf-live="01JBXMXJQYEZ5PW4EBZF05RCXD"
    //     className="w-full max-w-lg shadow-lg rounded-lg overflow-hidden p-6 bg-white"
    //   ></div>
    // </div>
  );
};

export default Survey;
