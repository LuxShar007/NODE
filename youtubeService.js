const axios = require('axios');

exports.search = async ({genre, lang, mood, token}) => {
  const q = `${genre} ${mood} music ${lang}`;
  const {data} = await axios.get('https://www.googleapis.com/youtube/v3/search', {
    params: {q, part: 'snippet', maxResults: 10},
    headers: {Authorization: `Bearer ${token}`},
  });
  return data.items.map(i => ({
    id: i.id.videoId,
    name: i.snippet.title,
    embedUrl: `https://www.youtube.com/embed/${i.id.videoId}`,
  }));
};