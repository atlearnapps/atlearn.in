import React from "react";

const CourseSidebarSkeleton = () => {
  return (
    <div className="flex flex-col animate-pulse">
      {/* Search Skeleton */}
      <div className="pt-30px pr-15px pl-10px pb-23px mb-30px border border-borderColor dark:border-borderColor-dark shadow-event">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 w-1/2 mb-25px rounded" />
        <div className="flex items-center gap-2 px-4 py-15px bg-lightGrey10 dark:bg-lightGrey10-dark rounded">
          <div className="flex-1 h-4 bg-gray-300 dark:bg-gray-600 rounded" />
          <div className="w-4 h-4 bg-gray-400 dark:bg-gray-500 rounded-full" />
        </div>
      </div>

      {/* Categories Skeleton */}
      <div className="pt-30px pr-15px pl-10px pb-23px mb-30px border border-borderColor dark:border-borderColor-dark shadow-event">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 w-1/2 mb-25px rounded" />
        <ul className="flex flex-col gap-y-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <li
              key={idx}
              className="flex justify-between px-13px py-2 border border-borderColor dark:border-borderColor-dark rounded"
            >
              <div className="w-24 h-3 bg-gray-300 dark:bg-gray-600 rounded" />
              <div className="w-6 h-3 bg-gray-300 dark:bg-gray-600 rounded" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CourseSidebarSkeleton;
