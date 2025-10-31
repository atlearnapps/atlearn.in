import React, { useEffect, useState } from "react";

const Slider = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const images = [
    "./assets/images/program/kids_3.png",
    "./assets/images/about/about_2.png",
    "./assets/images/program/kids_2.png",
    "./assets/images/program/kids_3.png",
    "./assets/images/program/kids_1.png",
  ];

  // Automatically cycle through images
  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedImage((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="flex flex-col items-center">
      {/* Main Display */}
      <div className="relative">
        <img
          src={images[selectedImage]}
          alt="Main Display"
          className="w-full h-full rounded-lg shadow-lg object-cover"
        />
        <div className="absolute top-0 bottom-0 right-0 left-0 flex items-center justify-center">
          <button
            onClick={() => setIsVideoOpen(true)}
            className="lvideo relative w-15 h-15 md:h-20 md:w-20 lg:w-15 lg:h-15 2xl:h-70px 2xl:w-70px 3xl:h-20 3xl:w-20 bg-secondaryColor rounded-full flex items-center justify-center"
          >
            <span className="animate-buble absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 block w-[180px] h-[180px] border-secondaryColor rounded-full" />
            <span className="animate-buble2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 block w-[180px] h-[180px] border-secondaryColor rounded-full" />
            <img src="./assets/images/icon/video.png" alt="" />
          </button>
        </div>
      </div>

      {/* Thumbnail Slider */}
      <div className="flex space-x-4 mt-6">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Thumbnail ${index + 1}`}
            className={`w-[197px] h-[111px] rounded-lg cursor-pointer transition-opacity duration-200 ${
              selectedImage === index
                ? "opacity-100 border-2 border-purple-700"
                : "opacity-70 hover:opacity-100"
            }`}
            onClick={() => setSelectedImage(index)} // Set selected image index
          />
        ))}
      </div>

      {/* YouTube Video Modal */}
      {isVideoOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setIsVideoOpen(false)}
        >
          <div
            className="relative bg-white rounded-lg overflow-hidden w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full p-2"
              onClick={() => setIsVideoOpen(false)}
            >
              ✕
            </button>
            <iframe
              width="100%"
              height="450"
              src="https://www.youtube.com/embed/hZ-yTISUpvk"
              title="YouTube video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default Slider;
