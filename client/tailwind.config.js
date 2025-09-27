module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Add custom gradient properties for different moods
      backgroundImage: {
        'gradient-happy': 'linear-gradient(to top right, #facc15, #fb923c, #f97316)', // Yellow to Orange
        'gradient-relaxed': 'linear-gradient(to top right, #4ade80, #3b82f6, #6366f1)', // Green to Blue to Indigo
        'gradient-energetic': 'linear-gradient(to top right, #f472b6, #ef4444, #f59e0b)', // Pink to Red to Orange
        'gradient-default': 'linear-gradient(to top right, #374151, #111827)', // Default Gray
      }
    },
  },
  plugins: [],
}