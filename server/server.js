// ✅ CORRECTED AND CLEANED server.js - Use this entire file

require('dotenv').config();
const express = require('express');
const axios = require('axios');
const session = require('express-session');
const app = express();

// --- CONSTANTS ---
// IMPORTANT: Replace these with your actual domains once deployed
const YOUR_RENDER_DOMAIN = 'http://localhost:5000'; // Your backend URL
const YOUR_HOSTINGER_DOMAIN = 'http://localhost:3000'; // Your frontend URL

const SPOTIFY_REDIRECT_URI = `${YOUR_RENDER_DOMAIN}/callback/spotify`;
const GOOGLE_REDIRECT_URI = `${YOUR_RENDER_DOMAIN}/callback/youtube`;
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---
app.use(session({
    secret: 'a_very_secret_key_for_cubet_app', // Use a strong, unique secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: 'auto' }
}));


// ---- LOGIN ROUTES ----
app.get('/login/spotify', (req, res) => {
    const scope = 'user-read-private user-read-email';
    const authUrl = 'https://accounts.spotify.com/authorize?' + new URLSearchParams({
        response_type: 'code',
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope: scope,
        redirect_uri: SPOTIFY_REDIRECT_URI
    }).toString();
    res.redirect(authUrl);
});

app.get('/login/youtube', (req, res) => {
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

        // Set a cookie the frontend can read
        res.cookie('login_source', 'spotify', { httpOnly: false, path: '/' });
        res.redirect(`${YOUR_HOSTINGER_DOMAIN}/home`);

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
        
        // Set a cookie the frontend can read
        res.cookie('login_source', 'youtube', { httpOnly: false, path: '/' });
        res.redirect(`${YOUR_HOSTINGER_DOMAIN}/home`);
    } catch (error) {
        console.error('YouTube Callback Error:', error.response ? error.response.data : error.message);
        res.status(500).send('Error during YouTube authentication.');
    }
});


// ---- API ROUTE FOR FETCHING RECOMMENDATIONS ----
app.get('/api/recommendations', async (req, res) => {
    const { genre, mood } = req.query;
    const accessToken = req.session.spotify_token;

    if (!accessToken) {
        return res.status(401).json({ error: 'User not authenticated. Please log in again.' });
    }

    try {
        let target_valence = 0.5; // Neutral default
        if (mood.toLowerCase().includes('happy')) target_valence = 0.8;
        if (mood.toLowerCase().includes('sad')) target_valence = 0.2;

        const recommendationsResponse = await axios.get('https://api.spotify.com/v1/recommendations', {
            headers: { 'Authorization': `Bearer ${accessToken}` },
            params: {
                limit: 20,
                seed_genres: genre.toLowerCase().replace('&', '').replace(' ', '-'),
                target_valence: target_valence
            }
        });

        res.json(recommendationsResponse.data.tracks);

    } catch (error) {
        console.error('API Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch recommendations from Spotify.' });
    }
});


// ---- START SERVER ----
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});