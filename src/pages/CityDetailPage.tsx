import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useAppSelector, useAppDispatch } from '../hooks/redux';
import {
  selectCityById,
  selectHourlyForecastById,
  selectWeatherStatus,
  selectWeatherError,
  fetchHourlyForecast,
  updateCityWeather,
} from '../store/weatherSlice';

const CityDetailPage: React.FC = () => {
  const { cityId } = useParams<{ cityId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const numericCityId = cityId ? parseInt(cityId, 10) : 0;
  const city = useAppSelector(state => selectCityById(state, numericCityId));
  const hourlyForecast = useAppSelector(state => selectHourlyForecastById(state, numericCityId));
  const status = useAppSelector(selectWeatherStatus);
  const error = useAppSelector(selectWeatherError);

  useEffect(() => {
    if (city && !hourlyForecast) {
      dispatch(fetchHourlyForecast(city.id));
    }
  }, [city, hourlyForecast, dispatch]);

  useEffect(() => {
    if (!city && status !== 'loading') {
      navigate('/');
    }
  }, [city, status, navigate]);

  const handleUpdateClick = () => {
    if (city) {
      dispatch(updateCityWeather(city.id));
      // Also update hourly forecast
      dispatch(fetchHourlyForecast(city.id));
    }
  };

  if (!city) {
    return (
      <div className="container">
        <div className="text-center mt-4">
          {error ? (
            <div className="alert alert-error mb-3">
              Error loading city data. Please try again later.
            </div>
          ) : (
            <p className="loading">Loading city data</p>
          )}
        </div>
      </div>
    );
  }

  // Get weather icon URL
  const weatherIcon = city.weather[0]?.icon;
  const iconUrl = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;

  // Format date and time
  const lastUpdated = new Date(city.lastUpdated).toLocaleString();
  const sunrise = new Date(city.sys.sunrise * 1000).toLocaleTimeString();
  const sunset = new Date(city.sys.sunset * 1000).toLocaleTimeString();

  return (
    <div className="city-detail">
      <div className="city-header">
        <div className="container">
          <h1>
            {city.name}, {city.sys.country}
          </h1>
          <div className="city-meta">
            <span>Last updated: {lastUpdated}</span>
            <button className="btn ml-2" onClick={handleUpdateClick}>
              Update Weather
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="weather-overview">
          <img src={iconUrl} alt={city.weather[0]?.description} className="weather-icon" />
          <div>
            <div className="temperature">{Math.round(city.main.temp)}°C</div>
            <div className="weather-description">{city.weather[0]?.description}</div>
          </div>
        </div>

        <div className="weather-details">
          <div className="detail-card">
            <div className="label">Feels Like</div>
            <div className="value">{Math.round(city.main.feels_like)}°C</div>
          </div>
          <div className="detail-card">
            <div className="label">Humidity</div>
            <div className="value">{city.main.humidity}%</div>
          </div>
          <div className="detail-card">
            <div className="label">Wind</div>
            <div className="value">{city.wind.speed} m/s</div>
          </div>
          <div className="detail-card">
            <div className="label">Pressure</div>
            <div className="value">{city.main.pressure} hPa</div>
          </div>
          <div className="detail-card">
            <div className="label">Min Temperature</div>
            <div className="value">{Math.round(city.main.temp_min)}°C</div>
          </div>
          <div className="detail-card">
            <div className="label">Max Temperature</div>
            <div className="value">{Math.round(city.main.temp_max)}°C</div>
          </div>
          <div className="detail-card">
            <div className="label">Sunrise</div>
            <div className="value">{sunrise}</div>
          </div>
          <div className="detail-card">
            <div className="label">Sunset</div>
            <div className="value">{sunset}</div>
          </div>
        </div>

        {hourlyForecast ? (
          <div className="hourly-forecast">
            <h2>Hourly Forecast</h2>
            <div className="forecast-container">
              <div className="forecast-items">
                {hourlyForecast.list.slice(0, 8).map((item, index) => {
                  const time = new Date(item.dt * 1000).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0]?.icon}.png`;

                  return (
                    <div key={index} className="forecast-item">
                      <div className="time">{time}</div>
                      <img
                        src={iconUrl}
                        alt={item.weather[0]?.description}
                        className="weather-icon"
                      />
                      <div className="temperature">{Math.round(item.main.temp)}°C</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : status === 'loading' ? (
          <div className="text-center mt-4">
            <p className="loading">Loading forecast data</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CityDetailPage;
