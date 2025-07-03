import axios from 'axios';

const API_KEY = '4f64d0f4f7109f0df5bdf84e403336ae';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const weatherApi = axios.create({
  baseURL: BASE_URL,
  params: {
    appid: API_KEY,
    units: 'metric',
  },
});

export const fetchCityWeather = async (cityName: string) => {
  try {
    const response = await weatherApi.get('/weather', {
      params: {
        q: cityName,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);

    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.error(
        'API Key Error: Your API key is invalid or missing. Please check your OpenWeatherMap API key in weatherApi.ts'
      );
      throw new Error(
        'Invalid API key. Please add a valid OpenWeatherMap API key in the weatherApi.ts file.'
      );
    }

    throw error;
  }
};

export const fetchCityHourlyForecast = async (cityName: string) => {
  try {
    const response = await weatherApi.get('/forecast', {
      params: {
        q: cityName,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching hourly forecast:', error);

    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.error(
        'API Key Error: Your API key is invalid or missing. Please check your OpenWeatherMap API key in weatherApi.ts'
      );
      throw new Error(
        'Invalid API key. Please add a valid OpenWeatherMap API key in the weatherApi.ts file.'
      );
    }

    throw error;
  }
};

export default weatherApi;
