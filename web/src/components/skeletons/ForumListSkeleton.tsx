import React from "react";

const ForumListSkeleton: React.FC = () => {
  // Create an array of 6 items to show 6 skeleton cards
  const skeletonCards = Array(6).fill(0);

  return (
    <div className="h-screen dark:bg-neutral-950">
      <div className="max-w-6xl mx-auto p-6 translate-y-20 h-full">
        {/* Title skeleton */}
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6 animate-pulse"></div>
        
        {/* Search bar skeleton */}
        <div className="w-full h-12 bg-gray-200 dark:bg-gray-700 rounded mb-8 animate-pulse"></div>
        
        {/* Grid of forum cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skeletonCards.map((_, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6 animate-pulse"
            >
              {/* Title skeleton */}
              <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              
              {/* Description skeleton - multiple lines */}
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
              
              {/* Created date skeleton */}
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
              
              {/* Button skeleton */}
              <div className="flex justify-between items-center mt-4">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ForumListSkeleton;