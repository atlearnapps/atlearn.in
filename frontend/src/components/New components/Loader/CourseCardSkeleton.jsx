import React from "react";

const CourseCardSkeleton = () => {
  return (
    <div className="group">
      <div className="tab-content-wrapper h-full flex flex-col animate-pulse">
        <div className="p-15px bg-whiteColor dark:bg-darkdeep3-dark border border-borderColor dark:border-borderColor-dark shadow-xl flex-grow flex flex-col">
          {/* Image Placeholder */}
          <div className="relative mb-4">
            <div className="w-full h-[175px] bg-slate-200 dark:bg-slate-700 rounded-lg2" />
          </div>

          {/* Content Placeholders */}
          <div className="flex-grow space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
            <div className="h-5 w-full bg-slate-200 dark:bg-slate-700 rounded" />
          </div>

          {/* Price & Enroll Button */}
          <div className="mt-auto">
            <div className="flex justify-between items-center mt-4">
              <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-8 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
          </div>

          {/* Instructor */}
          <div className="pt-15px border-t border-borderColor mt-4 flex items-center">
            <div className="w-[30px] h-[30px] bg-slate-200 dark:bg-slate-700 rounded-full mr-15px" />
            <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCardSkeleton;
