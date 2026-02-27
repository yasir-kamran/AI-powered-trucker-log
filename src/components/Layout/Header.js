import React from 'react';
import { Link } from 'react-router-dom';
import { BellIcon, MagnifyingGlassIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../../auth/AuthContext';

const Header = ({ onMenuClick }) => {
  const { me, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Mobile menu button */}
          <div className="flex items-center">
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={onMenuClick}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex-shrink-0 ml-2 md:ml-0">
              <h1 className="text-lg sm:text-xl font-bold text-indigo-600">TruckerLog AI</h1>
            </div>
          </div>

          {/* Search - hidden on mobile */}
          <div className="hidden sm:block flex-1 max-w-lg mx-4 lg:max-w-xs">
            <label htmlFor="search" className="sr-only">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="search"
                name="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Search"
                type="search"
              />
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              type="button"
              className="bg-white p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
            </button>

            <div className="flex items-center">
              <UserCircleIcon className="h-7 w-7 sm:h-8 sm:w-8 text-gray-400" />
              {me?.user?.email ? (
                <div className="hidden sm:flex items-center">
                  <Link to="/settings" className="ml-2 text-sm font-medium text-gray-700 hover:text-gray-900 truncate max-w-[150px]">
                    {me.user.email}
                  </Link>
                  <button
                    type="button"
                    className="ml-3 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                    onClick={() => logout()}
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <Link to="/login" className="ml-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
