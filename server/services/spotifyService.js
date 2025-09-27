const axios = require('axios');

exports.getSpotifyRecommendations = async ({ token, seed_genres, mood }) => {
    let target_valence = 0.5;
    if (mood === 'happy') target_valence = 0.8;
    if (mood === 'relaxed') target_valence = 0.3;
    if (mood === 'energetic') target_valence = 0.9;

    // Fetch recommended tracks
    const tracksResponse = await axios.get('https://api.spotify.com/v1/recommendations', {
        headers: { 'Authorization': `Bearer ${token}` },
        params: { limit: 12, seed_genres, target_valence }
    });
    const tracks = tracksResponse.data.tracks.map(t => ({
        id: t.id,
        title: t.name,
        artist: t.artists.map(a => a.name).join(', '),
        imageUrl: t.album.images[0]?.url,
        embedUrl: `https://open.spotify.com/embed/track/$${t.id}`
    }));

    // Fetch related playlists
    const playlistsResponse = await axios.get(`http://googleusercontent.com/spotify.com/7{seed_genres.split(',')[0]}`, {
         headers: { 'Authorization': `Bearer ${token}` },
         params: { limit: 6 }
    });
    const playlists = playlistsResponse.data.playlists.items.map(p => ({
        id: p.id,
        title: p.name,
        description: p.description,
        imageUrl: p.images[0]?.url,
        embedUrl: `http://googleusercontent.com/spotify.com/8{p.id}`
    }));

    return { tracks, playlists, videos: [] }; // Spotify doesn't have videos in this context
};