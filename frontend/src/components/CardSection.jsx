import React from "react";

function CardSection({ cardData }) {
  return (
    <div className=" container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 px-6 max-w-[82.5rem] m-auto justify-center mt-4">
      {cardData?.map((item, index) => (
        // <div key={index} className="w-full px-4 mb-8">
        <div
          className={`  text-center p-6 rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300 h-full`}
        >
          {item.icon && (
            <img
              src={item.icon}
              alt={item.title}
              className="w-20 h-20 mx-auto mb-4"
            />
          )}

          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            {item.heading}
          </h3>
          <p className=" mb-4 leading-relaxed font-fredoka">
            {item.description}
          </p>
        </div>
        // </div>

        //       <div key={index} className=" p-6 rounded-lg  shadow-lg text-center">
        //         {item.icon && (
        //   <img
        //   src={item.icon}
        //   alt={item.title}
        //   className="w-20 h-20 mx-auto mb-4"
        // />
        //         )}

        //               <h3 className="text-xl font-semibold text-gray-900">
        //                 {item.heading}
        //               </h3>
        //               <p className="mt-4 text-gray-600">{item.description}</p>
        //             </div>
      ))}
    </div>
  );
}

export default CardSection;
