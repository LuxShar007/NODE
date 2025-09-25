const router = require('express').Router();
const {spotifyLogin, spotifyCallback, youtubeLogin, youtubeCallback} = require('../controllers/authController');

router.get('/spotify', spotifyLogin);
router.get('/spotify/callback', spotifyCallback);
router.get('/youtube', youtubeLogin);
router.get('/youtube/callback', youtubeCallback);

module.exports = router;