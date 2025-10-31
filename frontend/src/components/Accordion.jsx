import React, { useState } from "react";
import Button from "./Button";

const Accordion = ({ items }) => {
  const [openItemId, setOpenItemId] = useState(null);

  const toggleItem = (id) => {
    setOpenItemId(openItemId === id ? null : id);
  };

  return (
    // <div id="accordion-collapse" data-accordion="collapse">
    //   {items.map((item) => (
    //     <div key={item.id}>
    //       <h2 id={`accordion-collapse-heading-${item.id}`} className="group">
    //         <button
    //           type="button"
    //           className="flex items-center justify-between w-full p-5 font-medium rtl:text-right border border-b-0 border-gray-200 rounded-t-xl dark:focus:bg-primary hover:bg-primary dark:hover:bg-primary gap-3 duration-300"
    //           onClick={() => toggleItem(item.id)}
    //           aria-expanded={openItemId === item.id}
    //           aria-controls={`accordion-collapse-body-${item.id}`}
    //         >
    //           <span className=" text-[22px] text-[#292C30] font-fredoka group-hover:text-white text-start duration-300 focus:text-white">
    //             {item.title}
    //           </span>
    //           <svg
    //             data-accordion-icon
    //             className={`w-3 h-3 shrink-0 group-hover:text-white ${openItemId === item.id ? 'rotate-180' : ''}`}
    //             aria-hidden="true"
    //             xmlns="http://www.w3.org/2000/svg"
    //             fill="none"
    //             viewBox="0 0 10 6"
    //           >
    //             <path stroke="currentColor" d="M9 5 5 1 1 5" />
    //           </svg>
    //         </button>
    //       </h2>
    //       <div
    //         id={`accordion-collapse-body-${item.id}`}
    //         className={`p-5 border border-b-0 rounded-xl border-gray-200 dark:border-gray-700 ${openItemId === item.id ? 'block' : 'hidden'}`}
    //         aria-labelledby={`accordion-collapse-heading-${item.id}`}
    //       >
    //         <p className="mb-2 font-fredoka">{item.description}</p>
    //       </div>
    //     </div>
    //   ))}
    // </div>

    <div id="accordion-collapse" data-accordion="collapse" className="w-full">
      <div className="relative flex justify-center max-w-[82.50rem] m-auto">
        <div className="relative flex w-full px-4">
          <div className="flex flex-col items-center w-full">
            {items.map((item) => (
              <div key={item.id} className="w-full  px-4 ">
                <h2
                  id={`accordion-collapse-heading-${item.id}`}
                  className="group"
                >
                  <button
                    type="button"
                    className="flex items-center justify-between w-full p-5 font-medium border border-b-0 border-gray-200 rounded-t-xl dark:focus:bg-primary hover:bg-primary dark:hover:bg-primary gap-3 duration-300"
                    onClick={() => toggleItem(item.id)}
                    aria-expanded={openItemId === item.id}
                    aria-controls={`accordion-collapse-body-${item.id}`}
                  >
                    <span className="text-[22px] text-[#292C30] font-fredoka group-hover:text-white text-start duration-300 focus:text-white">
                      {item.title}
                    </span>
                    <svg
                      data-accordion-icon
                      className={`w-3 h-3 shrink-0 group-hover:text-white ${
                        openItemId === item.id ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path stroke="currentColor" d="M9 5 5 1 1 5" />
                    </svg>
                  </button>
                </h2>
                <div
                  id={`accordion-collapse-body-${item.id}`}
                  className={`p-5 border border-b-0 rounded-xl border-gray-200 dark:border-gray-700 ${
                    openItemId === item.id ? "block" : "hidden"
                  }`}
                  aria-labelledby={`accordion-collapse-heading-${item.id}`}
                >
                  <p className="mb-2 font-fredoka">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
     
    </div>
  );
};

export default Accordion;
