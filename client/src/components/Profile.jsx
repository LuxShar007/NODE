import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Helper to read cookies from the browser
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loginSource, setLoginSource] = useState(null);

  useEffect(() => {
    const source = getCookie('login_source');
    if (source) {
      setLoginSource(source);
    }
  }, []);

  const handleLogout = () => {
    // A proper logout should also call a backend endpoint to invalidate the httpOnly cookie
    console.log("Logging out...");
    document.cookie = "login_source=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = '/';
  };

  // Don't render the component if the user is not logged in
  if (!loginSource) {
    return null;
  }
  
  // Define SVG icons for each service
  const icons = {
    spotify: (
      <svg fill="currentColor" viewBox="0 0 16 16" height="1.5em" width="1.5em">
        <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm3.669 11.538a.498.498 0 01-.686.165c-1.879-1.147-4.243-1.407-7.028-.77a.499.499 0 01-.222-.973c3.048-.696 5.662-.397 7.77.892a.5.5 0 01.166.686zm.979-2.178a.624.624 0 01-.858.205c-2.15-1.321-5.428-1.704-7.972-.932a.625.625 0 01-.362-1.194c2.905-.881 6.517-.454 8.986 1.063a.624.624 0 01.206.858zm.084-2.268C10.154 5.56 5.9 5.419 3.438 6.166a.748.748 0 11-.434-1.432c2.825-.857 7.523-.692 9.942 1.385a.748.748 0 01-.595 1.222z" />
      </svg>
    ),
    youtube: (
      <svg fill="currentColor" viewBox="0 0 16 16" height="1.5em" width="1.5em">
        <path d="M8.051 1.999l.04.001a7.5 7.5 0 00-7.5 7.5c0 3.314 2.135 6.166 5.197 7.095A7.5 7.5 0 008 15.5a7.5 7.5 0 007.5-7.5c0-1.29-.312-2.486-.84-3.544l.04-.001a7.5 7.5 0 00-7.5-7.5zM6.425 10.42L9.25 8 6.425 5.58v4.84z" />
      </svg>
    ),
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        {icons[loginSource]}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50"
          >
            <a href="/dashboard" className="block px-4 py-2 text-sm text-gray-300 hover:bg-purple-700">
              Dashboard
            </a>
            <button
              onClick={handleLogout}
              className="w-full text-left block px-4 py-2 text-sm text-gray-300 hover:bg-purple-700"
            >
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;