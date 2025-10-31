const SkeletonLoader = ({ width = "w-full", height = "h-6", className = "" }) => {
    return (
      <div
        className={`bg-gray-200 dark:bg-gray-700 animate-pulse rounded ${width} ${height} ${className}`}
      ></div>
    );
  };
  
  export default SkeletonLoader;
  
  