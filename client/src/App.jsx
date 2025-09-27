import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Header from './components/Header';
function App() {
  return (
    <div className="bg-black min-h-screen text-purple-500">
      <Header />
      {/* Other components */}
    </div>
  );
}
import Login from './pages/Login';
import Questionnaire from './pages/Questionnaire';
import Results from './pages/Results';

const App = () => (
  <Router>
    <div className="bg-black min-h-screen text-purple-500">
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/questions" element={<Questionnaire />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </div>
  </Router>
);

export default App;