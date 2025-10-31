import React from "react";

const CoursesHeaderSkeleton = () => {
  return (
    <div
      className="courses-header flex justify-between items-center flex-wrap px-13px py-10px border border-borderColor dark:border-borderColor-dark mb-30px gap-y-5 shadow-event animate-pulse"
      data-aos="fade-up"
    >
      <div className="w-full lg:w-2/3">
        <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
      </div>
      <div className="flex gap-3 w-full lg:w-auto">
        <div className="h-9 w-[100px] bg-slate-200 dark:bg-slate-700 rounded" />
        <div className="h-9 w-[100px] bg-slate-200 dark:bg-slate-700 rounded" />
      </div>
    </div>
  );
};

export default CoursesHeaderSkeleton;
