// src/components/Layout.js
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import MenuLateral from './MenuLateral';
import UserProfile from './UserProfile';
import '../App.css';

export default function Layout() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleToggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <div className="AppLayout">
      <MenuLateral onProfileClick={handleToggleProfile} />
      <main className="AppContent">
        <Outlet />
      </main>
      <UserProfile isOpen={isProfileOpen} onToggle={handleToggleProfile} />
    </div>
  );
}
