const querystring = require('querystring');
const axios = require('axios');

exports.spotifyLogin = (req, res) => {
  const params = querystring.stringify({
    client_id: process.env.SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    scope: 'user-read-private user-read-email',
  });
  res.redirect(`https://accounts.spotify.com/authorize?${params}`);
};

exports.spotifyCallback = async (req, res) => {
  const code = req.query.code || null;
  const creds = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');
  const data = querystring.stringify({grant_type: 'authorization_code', code, redirect_uri: process.env.SPOTIFY_REDIRECT_URI});
  const {data: tokens} = await axios.post('https://accounts.spotify.com/api/token', data, {
    headers: {Authorization: `Basic ${creds}`, 'Content-Type': 'application/x-www-form-urlencoded'},
  });
  res.cookie('spotify_token', tokens.access_token, {httpOnly: true}).redirect('http://localhost:3000/questions');
};

exports.youtubeLogin = (req, res) => {
  const params = querystring.stringify({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/youtube.readonly',
    access_type: 'offline',
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
};

exports.youtubeCallback = async (req, res) => {
  const code = req.query.code;
  const {data} = await axios.post('https://oauth2.googleapis.com/token', {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    grant_type: 'authorization_code',
  });
  res.cookie('youtube_token', data.access_token, {httpOnly: true}).redirect('http://localhost:3000/questions');
};