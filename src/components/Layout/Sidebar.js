import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  TruckIcon,
  CurrencyDollarIcon,
  ScaleIcon,
  GlobeAltIcon,
  UserGroupIcon,
  EyeIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  BoltIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Receipts', href: '/receipts', icon: DocumentTextIcon },
  { name: 'IFTA', href: '/ifta', icon: GlobeAltIcon },
  { name: 'Load Oracle', href: '/load-oracle', icon: BoltIcon },
  { name: 'Broker Battler', href: '/broker-battler', icon: ScaleIcon },
  { name: "Mechanic's Eye", href: '/mechanics-eye', icon: EyeIcon },
  { name: 'Trips', href: '/trips', icon: TruckIcon },
  { name: 'Expenses', href: '/expenses', icon: CurrencyDollarIcon },
  { name: 'Documents', href: '/documents', icon: DocumentTextIcon },
  { name: 'Broker', href: '/broker', icon: UserGroupIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Sidebar = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen?.(false);
  }, [location, setMobileMenuOpen]);

  return (
    <>
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile slide-out menu */}
      <div className={classNames(
        'fixed inset-y-0 left-0 z-50 w-72 bg-indigo-700 transform transition-transform duration-300 ease-in-out md:hidden',
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex items-center justify-between h-16 px-4 bg-indigo-800">
          <h1 className="text-white text-xl font-bold">TruckerLog AI</h1>
          <button
            type="button"
            className="text-indigo-200 hover:text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-2 px-3 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                classNames(
                  isActive
                    ? 'bg-indigo-800 text-white'
                    : 'text-indigo-100 hover:bg-indigo-600',
                  'group flex items-center px-3 py-3 text-base font-medium rounded-lg'
                )
              }
            >
              <item.icon
                className="mr-4 flex-shrink-0 h-6 w-6 text-indigo-300"
                aria-hidden="true"
              />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:block md:w-64 md:flex-shrink-0">
        <div className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-indigo-700 flex flex-col">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto scrollbar-hide">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-white text-xl font-bold">TruckerLog AI</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    classNames(
                      isActive
                        ? 'bg-indigo-800 text-white'
                        : 'text-indigo-100 hover:bg-indigo-600',
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md whitespace-nowrap'
                    )
                  }
                >
                  <item.icon
                    className="mr-3 flex-shrink-0 h-6 w-6 text-indigo-300"
                    aria-hidden="true"
                  />
                  <span className="truncate">{item.name}</span>
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-indigo-800 p-4">
            <div className="flex items-center">
              <div>
                <div className="text-base font-medium text-white">Driver</div>
                <div className="text-sm font-medium text-indigo-200">View profile</div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export { navigation };
export default Sidebar;
