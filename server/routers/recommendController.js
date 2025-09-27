const spotify = require('../services/spotifyService');
const youtube = require('../services/youtubeService');

exports.getRecommendations = async (req, res) => {
  const {genre, lang, mood} = req.body;
  const token = req.cookies.spotify_token || req.cookies.youtube_token;
  const source = req.cookies.spotify_token ? 'spotify' : 'youtube';

  if (source === 'spotify') {
    const tracks = await spotify.search({genre, lang, mood, token});
    return res.json({tracks});
  } else {
    const tracks = await youtube.search({genre, lang, mood, token});
    return res.json({tracks});
  }
};