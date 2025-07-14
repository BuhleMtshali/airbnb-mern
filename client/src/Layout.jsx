import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategorySelector } from './components/CategorySelector';
import { PropertyGrid } from './components/PropertyGrid';
import { Footer } from './components/Footer';
import React from 'react';

const Layout = () => {
  const location = useLocation();
  const pathname = location.pathname;

  // Check if we're on /account or any of its subpages
  const isAccountPage = pathname.startsWith('/account');

  return (
    <div className="py-4 px-8 flex flex-col min-h-screen">
      <Header />

      {isAccountPage ? (
        // Render account pages
        <Outlet />
      ) : (
        // Render homepage
        <>
          <Hero />
          <CategorySelector />
          <PropertyGrid />
          <Footer />
        </>
      )}
    </div>
  );
};

export default Layout;
