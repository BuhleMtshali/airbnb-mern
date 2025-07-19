import React, { useState } from 'react';
import { StarIcon, HeartIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

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

export const PropertyCard = ({ property }: PropertyCardProps) => {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((currentImage + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImage((currentImage - 1 + property.images.length) % property.images.length);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden relative">
      <div className="relative">
        <img
          src={property.images[currentImage]}
          alt={property.title}
          className="w-full h-60 object-cover transition-all"
        />
        <button
          onClick={prevImage}
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow"
        >
          <ChevronLeftIcon size={18} />
        </button>
        <button
          onClick={nextImage}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow"
        >
          <ChevronRightIcon size={18} />
        </button>
        <HeartIcon className="absolute top-2 right-2 text-black bg-white rounded-full p-1 shadow" size={20} />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg">{property.title}</h3>
          <div className="flex items-center space-x-1">
            <StarIcon size={14} className="text-yellow-500" />
            <span className="text-sm">{property.rating}</span>
          </div>
        </div>
        <p className="text-gray-500 text-sm">{property.location}</p>
        <p className="text-gray-400 text-sm">{property.distance} • {property.dates}</p>
        <p className="text-sm mt-1"><span className="font-medium">${property.price}</span> night</p>
      </div>
    </div>
  );
};
