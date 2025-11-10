import { Calendar, Home, LogOut, User, Menu, X, Users, MessageCircle, UserCheck } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  // Add a small delay before closing menu to prevent flickering
  const handleMobileNavClick = (callback) => {
    setTimeout(() => {
      closeMenu();
      if (callback) callback();
    }, 100);
  }

  // Common NavLink styling function
  const getNavLinkClass = (isActive, baseClasses, activeClasses) => {
    return isActive ? `${baseClasses} ${activeClasses}` : baseClasses;
  }

  return (
    <div className="bg-gray-50 sticky top-0 z-40">
      <header className="bg-white shadow-sm border-b border-gray-200 relative ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <NavLink to="/" className="text-2xl font-bold text-green-500 hover:text-green-600 transition-colors">
                GreenLeaf
              </NavLink>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
              <NavLink 
                to="/" 
                className={({ isActive }) => getNavLinkClass(
                  isActive,
                  "flex items-center px-2 py-1 rounded-md transition-colors duration-200",
                  "text-green-600 bg-green-50",
                  "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                )}
              >
                <Home className="w-4 h-4 mr-1" />
                <span className="hidden xl:inline">Home</span>
              </NavLink>
              
              <NavLink 
                to="/event" 
                className={({ isActive }) => getNavLinkClass(
                  isActive,
                  "flex items-center px-2 py-1 rounded-md transition-colors duration-200",
                  "text-green-600 bg-green-50",
                  "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                )}
              >
                <Calendar className="w-4 h-4 mr-1" />
                <span className="hidden xl:inline">Events</span>
              </NavLink>
              
              <NavLink 
                to="/feed" 
                className={({ isActive }) => getNavLinkClass(
                  isActive,
                  "flex items-center px-2 py-1 rounded-md transition-colors duration-200",
                  "text-green-600 bg-green-50",
                  "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                )}
              >
                <Users className="w-4 h-4 mr-1" />
                <span className="hidden xl:inline">Feed</span>
              </NavLink>
              
              <NavLink 
                to="/register" 
                className={({ isActive }) => getNavLinkClass(
                  isActive,
                  "flex items-center px-2 py-1 rounded-md transition-colors duration-200",
                  "text-green-600 bg-green-50",
                  "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                )}
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                <span className="hidden xl:inline">Messages</span>
              </NavLink>
              
              <NavLink 
                to="/profile" 
                className={({ isActive }) => getNavLinkClass(
                  isActive,
                  "flex items-center px-2 py-1 rounded-md transition-colors duration-200",
                  "text-green-600 bg-green-50",
                  "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                )}
              >
                <User className="w-4 h-4 mr-1" />
                <span className="hidden xl:inline">Profile</span>
              </NavLink>

               <NavLink 
                to="/newprofile" 
                className={({ isActive }) => getNavLinkClass(
                  isActive,
                  "flex items-center px-2 py-1 rounded-md transition-colors duration-200",
                  "text-green-600 bg-green-50",
                  "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                )}
              >
                <User className="w-4 h-4 mr-1" />
                <span className="hidden xl:inline">NewProfile</span>
              </NavLink>

              <NavLink 
                to="/connect" 
                className={({ isActive }) => getNavLinkClass(
                  isActive,
                  "flex items-center px-2 py-1 rounded-md transition-colors duration-200",
                  "text-green-600 bg-green-50",
                  "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                )}
              >
                <User className="w-4 h-4 mr-1" />
                <span className="hidden xl:inline">Connect</span>
              </NavLink>
              
              <NavLink 
                to="/signup" 
                className="flex items-center px-3 py-2 rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors duration-200 font-medium"
              >
                <UserCheck className="w-4 h-4 mr-1" />
                <span className="hidden xl:inline">Sign Up</span>
              </NavLink>
            </nav>

            {/* Tablet Navigation (md to lg) */}
            <nav className="hidden md:flex lg:hidden items-center space-x-3">
              <NavLink 
                to="/" 
                className={({ isActive }) => getNavLinkClass(
                  isActive,
                  "flex items-center p-2 rounded-md transition-colors duration-200",
                  "text-green-600 bg-green-50",
                  "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                )}
                title="Home"
              >
                <Home className="w-5 h-5" />
              </NavLink>
              
              <NavLink 
                to="/event" 
                className={({ isActive }) => getNavLinkClass(
                  isActive,
                  "flex items-center p-2 rounded-md transition-colors duration-200",
                  "text-green-600 bg-green-50",
                  "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                )}
                title="Events"
              >
                <Calendar className="w-5 h-5" />
              </NavLink>
              
              <NavLink 
                to="/feed" 
                className={({ isActive }) => getNavLinkClass(
                  isActive,
                  "flex items-center p-2 rounded-md transition-colors duration-200",
                  "text-green-600 bg-green-50",
                  "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                )}
                title="Feed"
              >
                <Users className="w-5 h-5" />
              </NavLink>
              
              <NavLink 
                to="/register" 
                className={({ isActive }) => getNavLinkClass(
                  isActive,
                  "flex items-center p-2 rounded-md transition-colors duration-200",
                  "text-green-600 bg-green-50",
                  "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                )}
                title="Messages"
              >
                <MessageCircle className="w-5 h-5" />
              </NavLink>
              
              <NavLink 
                to="/profile" 
                className={({ isActive }) => getNavLinkClass(
                  isActive,
                  "flex items-center p-2 rounded-md transition-colors duration-200",
                  "text-green-600 bg-green-50",
                  "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                )}
                title="Profile"
              >
                <User className="w-5 h-5" />
              </NavLink>

              
              
              <NavLink 
                to="/signup" 
                className="flex items-center p-2 rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors duration-200" 
                title="Sign Up"
              >
                <UserCheck className="w-5 h-5" />
              </NavLink>
              
            </nav>

            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        <div className={`md:hidden fixed inset-0 z-50 bg-white transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          {/* Header with close button */}
          <div className="flex justify-between items-center h-16 px-4 border-b border-gray-200">
            <NavLink 
              to="/" 
              className="text-2xl font-bold text-green-500"
              onClick={() => handleMobileNavClick()}
            >
              GreenLeaf
            </NavLink>
            <button 
              onClick={closeMenu}
              className="p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors duration-200"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Navigation Links */}
          <nav className="flex flex-col p-4 space-y-2">
            <NavLink 
              to="/" 
              onClick={() => handleMobileNavClick()}
              className={({ isActive }) => getNavLinkClass(
                isActive,
                "flex items-center text-xl py-4 px-2 rounded-lg transition-colors duration-200",
                "text-green-600 bg-green-50",
                "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              )}
            >
              <Home className="w-6 h-6 mr-3" />
              Home
            </NavLink>
            
            <NavLink 
              to="/event" 
              onClick={() => handleMobileNavClick()}
              className={({ isActive }) => getNavLinkClass(
                isActive,
                "flex items-center text-xl py-4 px-2 rounded-lg transition-colors duration-200",
                "text-green-600 bg-green-50",
                "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              )}
            >
              <Calendar className="w-6 h-6 mr-3" />
              Events
            </NavLink>
            
            <NavLink 
              to="/feed" 
              onClick={() => handleMobileNavClick()}
              className={({ isActive }) => getNavLinkClass(
                isActive,
                "flex items-center text-xl py-4 px-2 rounded-lg transition-colors duration-200",
                "text-green-600 bg-green-50",
                "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              )}
            >
              <Users className="w-6 h-6 mr-3" />
              Feed
            </NavLink>

            <NavLink 
              to="/connect" 
              onClick={() => handleMobileNavClick()}
              className={({ isActive }) => getNavLinkClass(
                isActive,
                "flex items-center text-xl py-4 px-2 rounded-lg transition-colors duration-200",
                "text-green-600 bg-green-50",
                "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              )}
            >
              <Users className="w-6 h-6 mr-3" />
              Connect
            </NavLink>
            
            <NavLink 
              to="/register" 
              onClick={() => handleMobileNavClick()}
              className={({ isActive }) => getNavLinkClass(
                isActive,
                "flex items-center text-xl py-4 px-2 rounded-lg transition-colors duration-200",
                "text-green-600 bg-green-50",
                "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              )}
            >
              <MessageCircle className="w-6 h-6 mr-3" />
              Messages
            </NavLink>
            
            <NavLink
              to="/profile" 
              onClick={() => handleMobileNavClick()}
              className={({ isActive }) => getNavLinkClass(
                isActive,
                "flex items-center text-xl py-4 px-2 rounded-lg transition-colors duration-200",
                "text-green-600 bg-green-50",
                "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              )}
            >
              <User className="w-6 h-6 mr-3" />
              Profile
            </NavLink>

            <NavLink
              to="/newprofile" 
              onClick={() => handleMobileNavClick()}
              className={({ isActive }) => getNavLinkClass(
                isActive,
                "flex items-center text-xl py-4 px-2 rounded-lg transition-colors duration-200",
                "text-green-600 bg-green-50",
                "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              )}
            >
              <User className="w-6 h-6 mr-3" />
              New Profile
            </NavLink>
            
            <NavLink 
              to="/signup" 
              onClick={() => handleMobileNavClick()}
              className="flex items-center text-xl text-white bg-green-600 hover:bg-green-700 py-4 px-2 rounded-lg transition-colors duration-200 mt-4"
            >
              <UserCheck className="w-6 h-6 mr-3" />
              Sign Up
            </NavLink>
          </nav>
        </div>
      </header>
    </div>
  )
}

export default Header