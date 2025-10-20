// src/components/Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import MenuLateral from './MenuLateral';
import '../App.css';

export default function Layout() {
  return (
    <div className="AppLayout">
      <MenuLateral />
      <main className="AppContent">
        <Outlet />
      </main>
    </div>
  );
}
