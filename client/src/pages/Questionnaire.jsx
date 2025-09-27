import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';

const Questionnaire = () => {
  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [mood, setMood] = useState('');
  const navigate = useNavigate();

  const handleMultiSelectChange = (setter) => (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    setter(selectedOptions);
  };

  const handleSubmit = async () => {
    if (!mood || genres.length === 0) {
      alert('Please select a mood and at least one genre.');
      return;
    }
    const res = await api.post('/api/recommend', { genres, languages, mood });
    navigate('/results', { state: { recommendations: res.data, mood: mood } });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center space-y-6 mt-12 text-white px-4"
    >
      <div className="w-full max-w-md">
        <label className="block mb-2 font-semibold">Favorite Genres (hold Ctrl/Cmd to select multiple):</label>
        <select
          multiple
          value={genres}
          onChange={handleMultiSelectChange(setGenres)}
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option>Rock</option>
          <option>Pop</option>
          <option>Jazz</option>
          <option>Electronic</option>
          <option>Hip-Hop</option>
          <option>Classical</option>
          <option>Blues</option>
        </select>
      </div>

      <div className="w-full max-w-md">
        <label className="block mb-2 font-semibold">Languages (optional):</label>
        <select
          multiple
          value={languages}
          onChange={handleMultiSelectChange(setLanguages)}
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option>English</option>
          <option>Spanish</option>
          <option>Hindi</option>
          <option>French</option>
          <option>German</option>
        </select>
      </div>

      <div className="w-full max-w-md">
         <label className="block mb-2 font-semibold">Select your mood:</label>
        <select
          value={mood}
          onChange={e => setMood(e.target.value)}
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Choose a mood</option>
          <option value="happy">Happy</option>
          <option value="relaxed">Relaxed</option>
          <option value="energetic">Energetic</option>
        </select>
      </div>

      <button
        onClick={handleSubmit}
        className="px-10 py-4 bg-purple-700 text-white font-bold rounded-lg hover:bg-purple-800 transition duration-300 shadow-lg"
      >
        Get Recommendations
      </button>
    </motion.div>
  );
};

export default Questionnaire;