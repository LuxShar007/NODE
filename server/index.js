const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const recRoutes = require('./routes/recommend');

const app = express();
app.use(cors({origin: 'https://cubet.space', credentials: true}));
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/recommend', recRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on ${PORT}`));