const axios = require('axios');

exports.getYoutubeRecommendations = async ({ token, query }) => {
    // Fetch music videos
    const videosResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: { q: `${query} official video`, part: 'snippet', maxResults: 12, type: 'video', videoCategoryId: '10' },
        headers: { Authorization: `Bearer ${token}` },
    });
    const videos = videosResponse.data.items.map(i => ({
        id: i.id.videoId,
        title: i.snippet.title,
        channel: i.snippet.channelTitle,
        imageUrl: i.snippet.thumbnails.high.url,
        embedUrl: `https://www.youtube.com/embed/${i.id.videoId}`
    }));

    // Fetch playlists
    const playlistsResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: { q: `${query} playlist`, part: 'snippet', maxResults: 6, type: 'playlist' },
        headers: { Authorization: `Bearer ${token}` },
    });
    const playlists = playlistsResponse.data.items.map(i => ({
        id: i.id.playlistId,
        title: i.snippet.title,
        description: i.snippet.description,
        imageUrl: i.snippet.thumbnails.high.url,
        embedUrl: `https://www.youtube.com/embed/videoseries?list=${i.id.playlistId}`
    }));

    return { tracks: [], videos, playlists }; // YouTube search is video/playlist focused
};