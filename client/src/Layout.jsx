// src/Layout.jsx
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategorySelector } from './components/CategorySelector';
import { PropertyGrid } from './components/PropertyGrid';
import { Footer } from './components/Footer';
import React from 'react';

const Layout = () => {
  const { pathname } = useLocation();

  const isAuthPage = pathname === '/login' || pathname === '/register';
  const isAccountPage = pathname.startsWith('/account');

  return (
    <div className="py-4 px-8 flex flex-col min-h-screen">
      {/* Only hide header on login/register */}
      {!isAuthPage && <Header />}

      {isAuthPage || isAccountPage ? (
        <Outlet />
      ) : (
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
