import axios from 'axios';

// OpenWeatherMap API configuration
// You need to replace this with your own API key from https://openweathermap.org/api
const API_KEY = '4f64d0f4f7109f0df5bdf84e403336ae'; // Replace with your actual API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Create axios instance with common configuration
const weatherApi = axios.create({
  baseURL: BASE_URL,
  params: {
    appid: API_KEY,
    units: 'metric', // Use metric units (Celsius)
  },
});

/**
 * Fetch current weather data for a city
 * @param cityName Name of the city to fetch weather for
 * @returns Weather data for the city
 */
export const fetchCityWeather = async (cityName: string) => {
  try {
    const response = await weatherApi.get('/weather', {
      params: {
        q: cityName,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching weather data:', error);

    // Provide more helpful error messages for common API issues
    if (error.response && error.response.status === 401) {
      console.error('API Key Error: Your API key is invalid or missing. Please check your OpenWeatherMap API key in weatherApi.ts');
      throw new Error('Invalid API key. Please add a valid OpenWeatherMap API key in the weatherApi.ts file.');
    }

    throw error;
  }
};

/**
 * Fetch hourly forecast for a city
 * @param cityName Name of the city to fetch forecast for
 * @returns Hourly forecast data for the city
 */
export const fetchCityHourlyForecast = async (cityName: string) => {
  try {
    const response = await weatherApi.get('/forecast', {
      params: {
        q: cityName,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching hourly forecast:', error);

    // Provide more helpful error messages for common API issues
    if (error.response && error.response.status === 401) {
      console.error('API Key Error: Your API key is invalid or missing. Please check your OpenWeatherMap API key in weatherApi.ts');
      throw new Error('Invalid API key. Please add a valid OpenWeatherMap API key in the weatherApi.ts file.');
    }

    throw error;
  }
};

export default weatherApi;
