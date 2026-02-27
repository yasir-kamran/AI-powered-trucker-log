import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Layout/Header';
import Sidebar from './Layout/Sidebar';
import MobileBottomNav from './Layout/MobileBottomNav';

export default function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onMenuClick={() => setMobileMenuOpen(true)} />
      <div className="flex">
        <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
        <main className="flex-1 overflow-y-auto focus:outline-none min-w-0">
          <div className="py-4 sm:py-6 pb-20 md:pb-6">
            <Outlet />
          </div>
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}
