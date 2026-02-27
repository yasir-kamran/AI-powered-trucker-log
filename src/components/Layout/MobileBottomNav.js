import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  BoltIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  GlobeAltIcon as GlobeAltIconSolid,
  BoltIcon as BoltIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
} from '@heroicons/react/24/solid';

const bottomNavItems = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon, activeIcon: HomeIconSolid },
  { name: 'Receipts', href: '/receipts', icon: DocumentTextIcon, activeIcon: DocumentTextIconSolid },
  { name: 'IFTA', href: '/ifta', icon: GlobeAltIcon, activeIcon: GlobeAltIconSolid },
  { name: 'Oracle', href: '/load-oracle', icon: BoltIcon, activeIcon: BoltIconSolid },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon, activeIcon: Cog6ToothIconSolid },
];

const MobileBottomNav = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 safe-area-bottom">
      <div className="flex justify-around items-center h-16 px-2">
        {bottomNavItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 py-2 px-1 ${
                isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive ? (
                  <item.activeIcon className="h-6 w-6" />
                ) : (
                  <item.icon className="h-6 w-6" />
                )}
                <span className="text-xs mt-1 font-medium">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
