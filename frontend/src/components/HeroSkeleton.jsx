export const HeroSkeleton = () => (
  <div className="relative h-[90vh] bg-gray-200 animate-pulse">
    <div className="relative container mx-auto px-4 h-full flex items-center">
      <div className="max-w-2xl">
        <div className="h-12 bg-gray-300 rounded mb-6 w-3/4"></div>
        <div className="h-6 bg-gray-300 rounded mb-4 w-full"></div>
        <div className="h-6 bg-gray-300 rounded mb-8 w-2/3"></div>
        <div className="h-12 bg-gray-300 rounded w-48"></div>
      </div>
    </div>
  </div>
);
