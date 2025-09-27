import React from 'react';

const Login = () => (
  <div className="flex flex-col items-center mt-20 space-y-6">
    <a
      href="https://cubet.space/auth/spotify"
      className="px-6 py-3 bg-purple-700 text-white rounded shadow-md hover:shadow-purple-500/50 hover:bg-purple-800 transition duration-300"
    >
      Login with Spotify
    </a>
    <a
      href="https://cubet.space/auth/youtube"
      className="px-6 py-3 bg-purple-700 text-white rounded shadow-md hover:shadow-purple-500/50 hover:bg-purple-800 transition duration-300"
    >
      Login with YouTube Music
    </a>
  </div>
);

export default Login;