import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/redux';
import { WeatherData, updateCityWeather, removeCity } from '../store/weatherSlice';

interface CityCardProps {
  city: WeatherData;
}

const CityCard: React.FC<CityCardProps> = ({ city }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/city/${city.id}`);
  };

  const handleUpdateClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    dispatch(updateCityWeather(city.id));
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    dispatch(removeCity(city.id));
  };

  // Get weather icon URL
  const weatherIcon = city.weather[0]?.icon;
  const iconUrl = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;

  // Format date
  const lastUpdated = new Date(city.lastUpdated).toLocaleTimeString();

  return (
    <div className="city-card card" onClick={handleCardClick}>
      <div className="card-header">
        <h3>{city.name}, {city.sys.country}</h3>
      </div>
      <div className="card-body">
        <div className="d-flex align-items-center">
          <img src={iconUrl} alt={city.weather[0]?.description} className="weather-icon" />
          <div className="temperature">{Math.round(city.main.temp)}°C</div>
        </div>
        <div className="weather-description">{city.weather[0]?.description}</div>
        
        <div className="weather-details">
          <div className="detail-item">
            <span className="label">Feels like:</span>
            <span className="value">{Math.round(city.main.feels_like)}°C</span>
          </div>
          <div className="detail-item">
            <span className="label">Humidity:</span>
            <span className="value">{city.main.humidity}%</span>
          </div>
          <div className="detail-item">
            <span className="label">Wind:</span>
            <span className="value">{city.wind.speed} m/s</span>
          </div>
          <div className="detail-item">
            <span className="label">Pressure:</span>
            <span className="value">{city.main.pressure} hPa</span>
          </div>
        </div>
      </div>
      <div className="card-footer">
        <small>Last updated: {lastUpdated}</small>
        <div>
          <button className="btn btn-secondary mr-1" onClick={handleUpdateClick}>
            Update
          </button>
          <button className="btn btn-error" onClick={handleRemoveClick}>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CityCard;