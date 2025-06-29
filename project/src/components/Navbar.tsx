import React, { useState, useRef, useEffect } from 'react';
import { Search, User, ChevronDown, Lightbulb, Heart, BookOpen, LogOut } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Mock user - replace with actual auth
  const user = {
    name: 'John Doe',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
  };

  const mockSuggestions = [
    'Pasta recipes', 'Quick dinner ideas', 'Vegetarian meals', 'Desserts', 'Breakfast recipes'
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.length > 0) {
      const filtered = mockSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setSearchSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">SnackHack</span>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-2xl mx-8 relative" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search recipes, ingredients, cuisines..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            
            {/* Search Suggestions */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg"
                    onClick={() => {
                      setSearchQuery(suggestion);
                      setShowSuggestions(false);
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <Search className="w-4 h-4 text-slate-400" />
                      <span className="text-white">{suggestion}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 hover:bg-slate-800 rounded-lg px-3 py-2 transition-colors duration-200"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="hidden sm:block text-white font-medium">{user.name}</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
                <div className="py-2">
                  <div className="px-4 py-3 border-b border-slate-700">
                    <p className="text-white font-medium">{user.name}</p>
                    <p className="text-slate-400 text-sm">john.doe@example.com</p>
                  </div>
                  
                  <button className="w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors duration-150 flex items-center space-x-3">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="text-white">Profile</span>
                  </button>
                  
                  <button className="w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors duration-150 flex items-center space-x-3">
                    <Heart className="w-4 h-4 text-slate-400" />
                    <span className="text-white">Saved Recipes</span>
                  </button>
                  
                  <button className="w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors duration-150 flex items-center space-x-3">
                    <BookOpen className="w-4 h-4 text-slate-400" />
                    <span className="text-white">My Recipes</span>
                  </button>
                  
                  <div className="border-t border-slate-700 mt-2 pt-2">
                    <button className="w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors duration-150 flex items-center space-x-3 text-red-400">
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};