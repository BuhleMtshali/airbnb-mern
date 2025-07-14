import React, { useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
export const CategorySelector = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const categories = [{
    name: 'Amazing views',
    icon: '🏔️'
  }, {
    name: 'Tiny homes',
    icon: '🏠'
  }, {
    name: 'Cabins',
    icon: '🌲'
  }, {
    name: 'Trending',
    icon: '🔥'
  }, {
    name: 'Beachfront',
    icon: '🏖️'
  }, {
    name: 'Countryside',
    icon: '🌄'
  }, {
    name: 'Mansions',
    icon: '🏰'
  }, {
    name: 'Luxe',
    icon: '✨'
  }, {
    name: 'Amazing pools',
    icon: '🏊'
  }, {
    name: 'Design',
    icon: '🎨'
  }, {
    name: 'Tropical',
    icon: '🌴'
  }, {
    name: 'Lakefront',
    icon: '🏞️'
  }];
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  return <div className="relative pt-8 pb-4">
      <div ref={scrollContainerRef} className="flex overflow-x-auto scrollbar-hide space-x-8 pb-4">
        {categories.map((category, index) => <div key={index} className="flex flex-col items-center space-y-2 min-w-[80px] cursor-pointer">
            <div className="text-2xl">{category.icon}</div>
            <span className="text-xs whitespace-nowrap">{category.name}</span>
          </div>)}
      </div>
      <button onClick={scrollLeft} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hidden md:block hover:scale-110 transition-transform">
        <ChevronLeftIcon size={16} />
      </button>
      <button onClick={scrollRight} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hidden md:block hover:scale-110 transition-transform">
        <ChevronRightIcon size={16} />
      </button>
    </div>;
};