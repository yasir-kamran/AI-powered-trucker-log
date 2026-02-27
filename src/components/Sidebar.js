import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  CurrencyDollarIcon, 
  TruckIcon, 
  WrenchScrewdriverIcon,
  ScaleIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Trips', href: '/trips', icon: TruckIcon },
  { name: 'Expenses', href: '/expenses', icon: CurrencyDollarIcon },
  { name: 'Broker Battler', href: '/broker-battler', icon: ScaleIcon },
  { name: "Mechanic's Eye", href: '/mechanics-eye', icon: WrenchScrewdriverIcon },
  { name: 'Documents', href: '/documents', icon: DocumentTextIcon },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 border-r border-cyber-green/20 bg-cyber-dark">
        <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-cyber-green/20">
          <div className="flex items-center">
            <TruckIcon className="h-8 w-8 text-cyber-green" />
            <span className="ml-2 text-xl font-bold text-cyber-green">TruckerLog AI</span>
          </div>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                    isActive 
                      ? 'bg-cyber-green/10 text-cyber-green border-l-4 border-cyber-green' 
                      : 'text-gray-300 hover:bg-cyber-green/5 hover:text-white'
                  }`}
                >
                  <item.icon 
                    className={`mr-3 h-6 w-6 flex-shrink-0 ${
                      isActive ? 'text-cyber-green' : 'text-gray-400 group-hover:text-cyber-green'
                    }`} 
                    aria-hidden="true" 
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-cyber-green/20">
          <Link
            to="/settings"
            className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
              location.pathname === '/settings' 
                ? 'bg-cyber-green/10 text-cyber-green' 
                : 'text-gray-300 hover:bg-cyber-green/5 hover:text-white'
            }`}
          >
            <Cog6ToothIcon 
              className={`mr-3 h-6 w-6 ${
                location.pathname === '/settings' ? 'text-cyber-green' : 'text-gray-400 group-hover:text-cyber-green'
              }`} 
              aria-hidden="true" 
            />
            Settings
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
