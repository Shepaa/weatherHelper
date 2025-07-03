import React, { useState } from 'react';

import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchWeatherForCity, selectWeatherStatus } from '../store/weatherSlice';

const AddCityForm: React.FC = () => {
  const [cityName, setCityName] = useState('');
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectWeatherStatus);
  const isLoading = status === 'loading';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cityName.trim()) {
      dispatch(fetchWeatherForCity(cityName.trim()));
      setCityName('');
    }
  };

  return (
    <form className="add-city-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="form-control"
        placeholder="Enter city name (e.g., London, Kyiv, New York)"
        value={cityName}
        onChange={e => setCityName(e.target.value)}
        disabled={isLoading}
      />
      <button type="submit" className="btn" disabled={isLoading || !cityName.trim()}>
        {isLoading ? 'Adding...' : 'Add City'}
      </button>
    </form>
  );
};

export default AddCityForm;
