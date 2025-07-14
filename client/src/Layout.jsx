import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategorySelector } from './components/CategorySelector';
import { PropertyGrid } from './components/PropertyGrid';
import { Footer } from './components/Footer';

const Layout = () => {
  const location = useLocation();

  return (
    <div className="py-4 px-8 flex flex-col min-h-screen">
      <Header />
      <Hero />
      <CategorySelector />

      {/* Show PropertyGrid only on home */}
      {location.pathname === '/' && <PropertyGrid />}

      <Footer />
      <Outlet />
    </div>
  );
};

export default Layout;
