import React from 'react';

import AddCityForm from '../components/AddCityForm';
import CityCard from '../components/CityCard';
import { useAppSelector } from '../hooks/redux';
import { selectAllCities, selectWeatherStatus, selectWeatherError } from '../store/weatherSlice';

const HomePage: React.FC = () => {
  const cities = useAppSelector(selectAllCities);
  const status = useAppSelector(selectWeatherStatus);
  const error = useAppSelector(selectWeatherError);

  return (
    <div className="home-page">
      <div className="container">
        <h1 className="mt-3 mb-4">Weather Dashboard</h1>

        <AddCityForm />

        {error && (
          <div className="alert alert-error mb-3">
            We cannot find this city, please double check the name of the city!
          </div>
        )}

        {status === 'loading' && cities.length === 0 && (
          <div className="text-center mt-4">
            <p className="loading">Loading</p>
          </div>
        )}

        {cities.length === 0 && status !== 'loading' ? (
          <div className="text-center mt-4">
            <p>No cities added yet. Add a city to see the weather.</p>
          </div>
        ) : (
          <div className="cities-grid">
            {cities.map(city => (
              <CityCard key={city.id} city={city} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
