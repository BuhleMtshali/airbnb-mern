import { Link } from "react-router-dom"
import { useContext } from "react";
import React, { useEffect, useState } from 'react';
import { Search, Globe, Menu, User } from 'lucide-react';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full transition-shadow duration-200 bg-white ${isScrolled ? 'shadow-md' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <svg className="h-8 w-auto text-[#FF5A5F]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.0002 1.25C9.96143 1.25 8.13245 1.7793 6.67883 2.72512C5.20228 3.68469 4.06357 5.04174 3.33652 6.62644C2.60655 8.21478 2.25 9.99958 2.25 11.9173C2.25 13.8349 2.60655 15.6197 3.33652 17.2081C4.06357 18.7928 5.20228 20.1498 6.67883 21.1094C8.13245 22.0552 9.96143 22.5845 12.0002 22.5845C14.0389 22.5845 15.8679 22.0552 17.3215 21.1094C18.798 20.1498 19.9367 18.7928 20.6638 17.2081C21.3938 15.6197 21.7503 13.8349 21.7503 11.9173C21.7503 9.99958 21.3938 8.21478 20.6638 6.62644C19.9367 5.04174 18.798 3.68469 17.3215 2.72512C15.8679 1.7793 14.0389 1.25 12.0002 1.25ZM10.4017 8.72728C10.4017 8.14204 10.5824 7.64272 10.9438 7.2293C11.3053 6.81589 11.7764 6.60918 12.3573 6.60918C12.9382 6.60918 13.4094 6.81589 13.7708 7.2293C14.1322 7.64272 14.3129 8.14204 14.3129 8.72728C14.3129 9.31251 14.1322 9.81183 13.7708 10.2253C13.4094 10.6387 12.9382 10.8454 12.3573 10.8454C11.7764 10.8454 11.3053 10.6387 10.9438 10.2253C10.5824 9.81183 10.4017 9.31251 10.4017 8.72728ZM16.1242 13.8349C16.1242 14.2483 16.0338 14.6617 15.853 15.0751C15.6723 15.4885 15.4012 15.8878 15.0398 16.273C14.6783 16.6582 14.2169 17.0153 13.6555 17.3444C13.1136 17.6735 12.5327 17.8802 11.9518 17.9664C11.3709 18.0526 10.8095 18.0095 10.2676 17.8371C9.72576 17.6646 9.24325 17.4067 8.82019 17.0635C8.39713 16.7202 8.06513 16.3068 7.82418 15.8232C7.58323 15.3397 7.46275 14.8131 7.46275 14.2435C7.46275 13.6745 7.58323 13.1479 7.82418 12.6644C8.06513 12.1808 8.39713 11.7674 8.82019 11.4241C9.24325 11.0809 9.72576 10.823 10.2676 10.6506C10.8095 10.4781 11.3709 10.435 11.9518 10.5212C12.5327 10.6074 13.1136 10.8142 13.6555 11.1432C14.2169 11.4723 14.6783 11.8295 15.0398 12.2147C15.4012 12.5999 15.6723 12.9992 15.853 13.4126C16.0338 13.826 16.1242 14.2394 16.1242 14.6528V13.8349Z" />
            </svg>
            <span className="ml-2 text-[#FF5A5F] font-bold text-xl hidden md:block">
              airbnb
            </span>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center justify-center flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <div className="flex items-center border border-gray-300 rounded-full hover:shadow-md transition-shadow duration-200">
                <button className="px-4 py-2 font-medium text-sm">
                  Anywhere
                </button>
                <span className="h-5 border-r border-gray-300"></span>
                <button className="px-4 py-2 font-medium text-sm">
                  Any week
                </button>
                <span className="h-5 border-r border-gray-300"></span>
                <button className="px-4 py-2 text-gray-500 text-sm">
                  Add guests
                </button>
                <button className="bg-[#FF5A5F] p-2 rounded-full text-white ml-2 mr-1">
                  <Search size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center">
            <button className="hidden md:block px-4 py-2 text-sm font-medium rounded-full hover:bg-gray-100">
              Become a Host
            </button>
            <button className="ml-2 p-2 rounded-full hover:bg-gray-100">
              <Globe size={20} />
            </button>
            <div className="ml-2 flex items-center border border-gray-300 rounded-full p-1 hover:shadow-md cursor-pointer">
              <Menu size={18} className="mx-2" />
              <div className="bg-gray-500 text-white rounded-full p-1">
                <User size={18} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Button */}
      <div className="md:hidden flex justify-center pb-4">
        <button className="flex items-center shadow-md border border-gray-200 rounded-full px-4 py-2 w-11/12">
          <Search size={16} className="mr-2" />
          <div className="text-left">
            <div className="font-medium text-sm">Anywhere</div>
            <div className="text-xs text-gray-500">Any week · Add guests</div>
          </div>
        </button>
      </div>
    </header>
  );
};
