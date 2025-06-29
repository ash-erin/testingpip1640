import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showNavbar = true, 
  showFooter = true 
}) => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {showNavbar && <Navbar />}
      <main className="relative">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};