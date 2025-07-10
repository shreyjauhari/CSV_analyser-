import React from 'react';
import imageLogo from './pics/image.png'; // Adjust the path if needed
import { Info, Upload, TrendingUp, Database } from 'lucide-react'; // Removed Home

const navigationTabs = [
  
  { id: 'upload', name: 'Upload CSV', icon: Upload },
  { id: 'saved', name: 'Saved Files', icon: Database },
  { id: 'progress', name: 'Saved patients', icon: TrendingUp }
];

export const Header = ({ activeTab, onTabChange }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-30">
          
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img src={imageLogo} alt="Logo" className="w-15 h-20 rounded-lg object-contain" />
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <select
              value={activeTab}
              onChange={(e) => onTabChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium bg-white"
            >
              {navigationTabs.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
