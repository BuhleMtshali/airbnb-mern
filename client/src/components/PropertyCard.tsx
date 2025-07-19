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

export const PropertyCard = ({ property }: PropertyCardProps) => {
  // your component code here
};
