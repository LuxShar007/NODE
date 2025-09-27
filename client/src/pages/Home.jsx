import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="text-center px-4 py-16"
    >
      <h1 className="text-5xl font-extrabold text-purple-400 mb-4">
        Welcome to Cubet
      </h1>
      <p className="text-lg text-gray-300 mb-8">
        Your personalized music recommendation engine.
      </p>
      <div>
        <Link
          to="/questions"
          className="px-8 py-4 bg-purple-700 text-white rounded-lg shadow-lg hover:bg-purple-800 transition duration-300"
        >
          Get Started
        </Link>
      </div>
    </motion.div>
  );
};

export default HomePage;