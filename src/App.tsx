import React from 'react';
import { Routes, Route } from 'react-router-dom';

import './styles/App.scss';
import Header from './components/Header';
import CityDetailPage from './pages/CityDetailPage';
import HomePage from './pages/HomePage';

const App: React.FC = () => {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/city/:cityId" element={<CityDetailPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
