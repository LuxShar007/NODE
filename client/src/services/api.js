import axios from 'axios';

const api = axios.create({
  baseURL: 'https://cubet.space', // This will be your backend server URL
  withCredentials: true,
});

export default api;