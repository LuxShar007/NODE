import React from 'react';
import { motion } from 'framer-motion';
import Profile from './Profile';

const Header = () => {
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between px-6 py-4 bg-white dark:bg-black shadow-md"
    >
      <div className="flex items-center">
        {/* CORRECTED LINE: Use a string for the src path */}
        <img src="/logo.jpeg" alt="Cubet Logo" className="h-10 mr-3" />
        <h1 className="text-xl font-bold text-purple-600 dark:text-purple-400">Cubet</h1>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={toggleDarkMode}
          className="px-3 py-2 bg-gray-800 text-white rounded"
        >
          Toggle Dark Mode
        </button>
        <Profile />
      </div>
    </motion.header>
  );
};

export default Header;