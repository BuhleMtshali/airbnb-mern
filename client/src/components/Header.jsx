import { Link, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { Search, Globe, Menu, User } from "lucide-react";
import { UserContext } from "../UserContext";
import axios from "axios";

export const Header = () => {
  const { user, setUser } = useContext(UserContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function logout() {
    await axios.post("/logout");
    setUser(null);
  }

  return (
    <>
      {!isAuthPage && (
        <header
          className={`sticky top-0 z-50 w-full transition-shadow duration-200 bg-white ${
            isScrolled ? "shadow-md" : ""
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              {/* Logo */}
              <Link to="/" className="flex items-center">
                <svg
                  className="h-8 w-auto text-[#FF5A5F]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.371 0 0 5.371 0 12c0 6.628 5.371 12 12 12s12-5.372 12-12c0-6.629-5.371-12-12-12zm0 22c-5.514 0-10-4.486-10-10S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
                </svg>
                <span className="ml-2 text-[#FF5A5F] font-bold text-xl hidden md:block">
                  airbnb
                </span>
              </Link>

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
              <div className="flex items-center space-x-4">
                <button className="hidden md:block px-4 py-2 text-sm font-medium rounded-full hover:bg-gray-100">
                  Become a Host
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Globe size={20} />
                </button>

                {user ? (
                  <>
                    <Link
                      to="/account"
                      className="hidden md:block px-4 py-2 rounded-full hover:bg-gray-100 font-semibold text-sm"
                    >
                      {user.name}
                    </Link>
                    <button
                      onClick={logout}
                      className="hidden md:block px-4 py-2 rounded-full hover:bg-gray-100 text-red-500 font-semibold text-sm"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center border border-gray-300 rounded-full p-1 hover:shadow-md cursor-pointer"
                  >
                    <Menu size={18} className="mx-2" />
                    <div className="bg-gray-500 text-white rounded-full p-1">
                      <User size={18} />
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden flex justify-center pb-4">
            <button className="flex items-center shadow-md border border-gray-200 rounded-full px-4 py-2 w-11/12">
              <Search size={16} className="mr-2" />
              <div className="text-left">
                <div className="font-medium text-sm">Anywhere</div>
                <div className="text-xs text-gray-500">
                  Any week · Add guests
                </div>
              </div>
            </button>
          </div>
        </header>
      )}
    </>
  );
};
