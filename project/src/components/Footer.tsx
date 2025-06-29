import React from 'react';
import { Lightbulb, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">SnackHack</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Discover, create, and share amazing recipes with food lovers around the world. 
              Your culinary journey starts here.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-200">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-200">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-200">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-200">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-200">Browse Recipes</a></li>
              <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-200">Categories</a></li>
              <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-200">Popular</a></li>
              <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-200">New Recipes</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-200">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-200">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-200">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-200">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 SnackHack. All rights reserved. Made with ❤️ for food lovers everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
};