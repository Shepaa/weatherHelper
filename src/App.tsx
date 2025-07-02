import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './styles/App.scss';
import HomePage from './pages/HomePage';
import CityDetailPage from './pages/CityDetailPage';
import Header from './components/Header';

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