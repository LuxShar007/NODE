require('dotenv').config();
const express = require('express');
const axios = require('axios');
const session = require('express-session');
const spotifyService = require('./server/services/spotifyService'); // Corrected path
const youtubeService = require('./server/services/youtubeService'); // Corrected path

const app = express();

// ✅ ADD THIS LINE to parse JSON bodies
app.use(express.json());

// --- CONSTANTS ---
const YOUR_RENDER_DOMAIN = 'https://cubet.space';
const YOUR_HOSTINGER_DOMAIN = 'https://cubet.space';

const SPOTIFY_REDIRECT_URI = `${YOUR_RENDER_DOMAIN}/callback/spotify`;
const GOOGLE_REDIRECT_URI = `${YOUR_RENDER_DOMAIN}/callback/youtube`;
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---
app.use(session({
    secret: 'a_very_secret_key_for_cubet_app',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: 'auto' }
}));


// ---- LOGIN ROUTES ----
app.get('/auth/spotify', (req, res) => {
    const scope = 'user-read-private user-read-email';
    const authUrl = 'https://accounts.spotify.com/authorize?' + new URLSearchParams({
        response_type: 'code',
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope: scope,
        redirect_uri: SPOTIFY_REDIRECT_URI
    }).toString();
    res.redirect(authUrl);
});

app.get('/auth/youtube', (req, res) => {
    const scope = 'https://www.googleapis.com/auth/youtube.readonly';
    const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' + new URLSearchParams({
        scope: scope,
        access_type: 'offline',
        include_granted_scopes: 'true',
        response_type: 'code',
        redirect_uri: GOOGLE_REDIRECT_URI,
        client_id: process.env.GOOGLE_CLIENT_ID
    }).toString();
    res.redirect(authUrl);
});


// ---- CALLBACK ROUTES ----
app.get('/callback/spotify', async (req, res) => {
    const code = req.query.code || null;
    try {
        const response = await axios({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            data: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: SPOTIFY_REDIRECT_URI
            }),
            headers: {
                'Authorization': 'Basic ' + (Buffer.from(
                    process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
                ).toString('base64')),
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        
        const accessToken = response.data.access_token;
        req.session.spotify_token = accessToken;

        res.cookie('login_source', 'spotify', { httpOnly: false, path: '/' });
        res.redirect(`${YOUR_HOSTINGER_DOMAIN}/questions`);

    } catch (error) {
        console.error('Spotify Callback Error:', error.response ? error.response.data : error.message);
        res.status(500).send('Error during Spotify authentication.');
    }
});

app.get('/callback/youtube', async (req, res) => {
    const code = req.query.code;
    try {
        const response = await axios({
            method: 'post',
            url: 'https://oauth2.googleapis.com/token',
            data: new URLSearchParams({
                code: code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: GOOGLE_REDIRECT_URI,
                grant_type: 'authorization_code'
            })
        });

        const accessToken = response.data.access_token;
        req.session.youtube_token = accessToken;
        
        res.cookie('login_source', 'youtube', { httpOnly: false, path: '/' });
        res.redirect(`${YOUR_HOSTINGER_DOMAIN}/questions`);
    } catch (error) {
        console.error('YouTube Callback Error:', error.response ? error.response.data : error.message);
        res.status(500).send('Error during YouTube authentication.');
    }
});


// ---- API ROUTE FOR FETCHING RECOMMENDATIONS ----
app.post('/api/recommend', async (req, res) => {
    const { genres, languages, mood } = req.body;
    const spotifyToken = req.session.spotify_token;
    const youtubeToken = req.session.youtube_token;

    if (!spotifyToken && !youtubeToken) {
        return res.status(401).json({ error: 'User not authenticated.' });
    }

    const service = spotifyToken ? 'spotify' : 'youtube';
    const token = spotifyToken || youtubeToken;

    const seed_genres = Array.isArray(genres) ? genres.join(',') : genres;
    const query = `${mood} ${genres.join(' ')} ${languages ? languages.join(' ') : ''} music`;

    try {
        let recommendations = {
            tracks: [], playlists: [], videos: [],
        };

        if (service === 'spotify') {
            recommendations = await spotifyService.getSpotifyRecommendations({ token, seed_genres, mood });
        } else {
            recommendations = await youtubeService.getYoutubeRecommendations({ token, query });
        }

        res.json(recommendations);
    } catch (error) {
        console.error('API Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch recommendations.' });
    }
});


// ---- START SERVER ----
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});