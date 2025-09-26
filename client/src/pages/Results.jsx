import React from 'react';
import {useLocation} from 'react-router-dom';

const Results = () => {
  const {state} = useLocation();
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
      {state.tracks.map(track => (
        <div key={track.id} className="bg-gray-900 p-4 rounded">
          <h2 className="text-lg mb-2">{track.name}</h2>
          <iframe
  src="https://open.spotify.com/embed/track/yourTrackId"
  title="Music Preview"
  className="w-full h-64"
  allow="autoplay"
></iframe>
        </div>
      ))}
    </div>
  );
};

export default Results;