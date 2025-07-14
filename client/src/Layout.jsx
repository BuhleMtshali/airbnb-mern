import { Outlet } from 'react-router-dom';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategorySelector } from './components/CategorySelector';
import { PropertyCard } from './components/PropertyCard';
import { PropertyGrid } from './components/PropertyGrid';
import React from 'react';

const propertyData = {
  id: 1,
  title: 'Charming Beach Cottage',
  location: 'Cape Town, South Africa',
  distance: '500m from the beach',
  dates: '12–18 Aug',
  price: 120,
  rating: 4.8,
  images: [
    'https://placehold.co/300x300?text=Image+1',
    'https://placehold.co/300x300?text=Image+2',
    'https://placehold.co/300x300?text=Image+3',
  ],
};

const Layout = () => {
  return (
    <div className="py-4 px-8 flex flex-col min-h-screen">
      <Header />
      <Hero />
      <CategorySelector />
     <PropertyGrid />
      <Outlet />
    </div>
  );
};

export default Layout;
