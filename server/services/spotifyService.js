const axios = require('axios');

exports.search = async ({genre, lang, mood, token}) => {
  const {data} = await axios.get('https://api.spotify.com/v1/recommendations', {
    headers: {Authorization: `Bearer ${token}`},
    params: {seed_genres: genre.toLowerCase(), limit: 10},
  });
  return data.tracks.map(t => ({
    id: t.id,
    name: t.name,
    embedUrl: `https://open.spotify.com/embed/track/${t.id}`,
  }));
};