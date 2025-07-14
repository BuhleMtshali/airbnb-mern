import React, { useState } from 'react';
import { StarIcon, HeartIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { PropertyGrid } from './PropertyGrid';
interface PropertyCardProps {
  property: {
    id: number;
    title: string;
    location: string;
    distance: string;
    dates: string;
    price: number;
    rating: number;
    images: string[];
  };
}
export const PropertyCard = ({
  property
}: PropertyCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(prev => (prev + 1) % property.images.length);
  };
  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(prev => (prev - 1 + property.images.length) % property.images.length);
  };
  return <div className="group cursor-pointer">
      <div className="relative aspect-square overflow-hidden rounded-xl">
        <img src={property.images[currentImageIndex]} alt={property.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <button onClick={e => prevImage(e)} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity" style={{
        display: currentImageIndex === 0 ? 'none' : 'block'
      }}>
          <ChevronLeftIcon size={16} />
        </button>
        <button onClick={e => nextImage(e)} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity" style={{
        display: currentImageIndex === property.images.length - 1 ? 'none' : 'block'
      }}>
          <ChevronRightIcon size={16} />
        </button>
        <button className="absolute top-2 right-2 text-white hover:text-[#FF5A5F]">
          <HeartIcon size={24} className="stroke-[1.5] fill-transparent hover:fill-white" />
        </button>
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {property.images.map((_, index) => <div key={index} className={`h-1.5 w-1.5 rounded-full ${currentImageIndex === index ? 'bg-white' : 'bg-white/50'}`} />)}
        </div>
      </div>
      <div className="mt-3">
        <div className="flex justify-between">
          <h3 className="font-medium">{property.title}</h3>
          <div className="flex items-center">
            <StarIcon size={14} className="fill-current" />
            <span className="ml-1 text-sm">{property.rating}</span>
          </div>
        </div>
        <p className="text-gray-500 text-sm">{property.location}</p>
        <p className="text-gray-500 text-sm">{property.distance}</p>
        <p className="text-gray-500 text-sm">{property.dates}</p>
        <p className="mt-1">
          <span className="font-semibold">${property.price}</span>
          <span className="text-sm"> night</span>
        </p>
      </div>
    </div>;
};