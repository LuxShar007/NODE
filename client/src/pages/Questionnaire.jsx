import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.4 }}
  className="p-4 bg-gray-900 rounded"
>
  <select className="w-full p-2 bg-black text-white rounded">
    {/* Options */}
  </select>
</motion.div>


const Questionnaire = () => {
  const [genre, setGenre] = useState('');
  const [lang, setLang] = useState('');
  const [mood, setMood] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const res = await api.post('/recommend', {genre, lang, mood});
    navigate('/results', {state: res.data});
  };

  return (
    <div className="flex flex-col items-center space-y-4 mt-12">
      <select onChange={e => setGenre(e.target.value)} className="p-2 bg-gray-900 rounded">
        <option value="">Favorite Genre</option>
        <option>Rock</option><option>Pop</option><option>Jazz</option>
      </select>
      <select onChange={e => setLang(e.target.value)} className="p-2 bg-gray-900 rounded">
        <option value="">Language</option>
        <option>English</option><option>Spanish</option><option>Hindi</option>
      </select>
      <select onChange={e => setMood(e.target.value)} className="p-2 bg-gray-900 rounded">
        <option value="">Mood</option>
        <option>Happy</option><option>Relaxed</option><option>Energetic</option>
      </select>
      <button
        onClick={handleSubmit}
        className="px-6 py-3 bg-purple-700 rounded hover:bg-purple-800 transition"
      >
        Get Recommendations
      </button>
    </div>
  );
};

export default Questionnaire;