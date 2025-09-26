import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import Login from './pages/Login';
import Questionnaire from './pages/Questionnaire';
import Results from './pages/Results';
import HomePage from './pages/Home'; // Import the new Home page
import api from './services/api';

const PageWrapper = ({ children }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="px-4 py-6"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <Router>
      <div className="bg-white dark:bg-black text-black dark:text-purple-500 min-h-screen font-sans relative">
        <Header />
        <Routes>
          <Route path="/" element={<PageWrapper><Login /></PageWrapper>} />
          <Route path="/home" element={<PageWrapper><HomePage /></PageWrapper>} />
          <Route path="/questions" element={<PageWrapper><Questionnaire api={api} /></PageWrapper>} />
          <Route path="/results" element={<PageWrapper><Results /></PageWrapper>} />
          {/* Add a dashboard route if you create that page */}
          {/* <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} /> */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;