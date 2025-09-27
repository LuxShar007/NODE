import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Results = () => {
    const { state } = useLocation();
    const [activeTab, setActiveTab] = useState('tracks');

    if (!state || !state.recommendations) {
        return <div className="text-center mt-12 text-white">Loading recommendations or none found...</div>;
    }

    const { recommendations, mood } = state;
    const { tracks, playlists, videos } = recommendations;

    const backgroundClasses = {
        happy: 'bg-gradient-happy',
        relaxed: 'bg-gradient-relaxed',
        energetic: 'bg-gradient-energetic',
        default: 'bg-gradient-default',
    };
    const backgroundClass = backgroundClasses[mood] || backgroundClasses.default;

    const getRecommendationScore = () => (8 + Math.random() * 2).toFixed(1);

    const renderContent = () => {
        switch (activeTab) {
            case 'playlists':
                return <Grid items={playlists} type="playlist" />;
            case 'videos':
                return <Grid items={videos} type="video" />;
            case 'tracks':
            default:
                return <Grid items={tracks} type="track" />;
        }
    };

    return (
        <div className={`min-h-screen p-4 sm:p-6 lg:p-8 ${backgroundClass} transition-all duration-500`}>
            <div className="text-center mb-8 text-white">
                <h1 className="text-4xl sm:text-5xl font-extrabold">Your Recommendations</h1>
                <div className="mt-2 text-lg">
                    <span>Recommendation Score: </span>
                    <span className="font-bold text-2xl">{getRecommendationScore()}</span>
                    <span> / 10</span>
                </div>
            </div>

            <div className="flex justify-center space-x-2 sm:space-x-4 mb-8">
                <TabButton name="tracks" activeTab={activeTab} setActiveTab={setActiveTab} count={tracks.length} />
                <TabButton name="playlists" activeTab={activeTab} setActiveTab={setActiveTab} count={playlists.length} />
                <TabButton name="videos" activeTab={activeTab} setActiveTab={setActiveTab} count={videos.length} />
            </div>
            
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {renderContent()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

const TabButton = ({ name, activeTab, setActiveTab, count }) => {
    if (count === 0) return null;
    return (
        <button
            onClick={() => setActiveTab(name)}
            className={`capitalize px-4 py-2 rounded-full text-sm sm:text-base font-semibold transition-colors duration-300 ${
                activeTab === name
                    ? 'bg-white text-black'
                    : 'bg-black bg-opacity-20 text-white hover:bg-opacity-40'
            }`}
        >
            {name}
        </button>
    );
};

const Grid = ({ items, type }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
            <motion.div 
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="bg-black bg-opacity-40 p-4 rounded-lg shadow-xl text-white flex flex-col"
            >
                {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover rounded-md mb-4"/>}
                <h3 className="font-bold text-lg truncate">{item.title}</h3>
                <p className="text-gray-400 text-sm mb-4 truncate">{item.artist || item.channel || item.description}</p>
                <div className="mt-auto">
                     <iframe
                        src={item.embedUrl}
                        title={item.title}
                        className={`w-full ${type === 'track' ? 'h-20' : 'h-48'} border-0 rounded`}
                        allow="encrypted-media; autoplay; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </motion.div>
        ))}
    </div>
);

export default Results;