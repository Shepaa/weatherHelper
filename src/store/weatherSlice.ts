import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';
import { fetchCityWeather, fetchCityHourlyForecast } from '../api/weatherApi';

// Types
export interface WeatherData {
  id: number;
  name: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  dt: number; // Time of data calculation
  lastUpdated: number; // Timestamp when we last updated this data
}

export interface HourlyForecast {
  cityId: number;
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      humidity: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
      deg: number;
    };
  }>;
}

interface WeatherState {
  cities: WeatherData[];
  hourlyForecasts: Record<number, HourlyForecast>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: WeatherState = {
  cities: [],
  hourlyForecasts: {},
  status: 'idle',
  error: null,
};

// Load cities from localStorage on initialization
const savedCities = localStorage.getItem('weatherCities');
if (savedCities) {
  try {
    initialState.cities = JSON.parse(savedCities);
  } catch (e) {
    console.error('Failed to parse saved cities from localStorage', e);
  }
}

// Async thunks
export const fetchWeatherForCity = createAsyncThunk(
  'weather/fetchWeatherForCity',
  async (cityName: string) => {
    const response = await fetchCityWeather(cityName);
    return {
      ...response,
      lastUpdated: Date.now(),
    };
  }
);

export const updateCityWeather = createAsyncThunk(
  'weather/updateCityWeather',
  async (cityId: number, { getState }) => {
    const state = getState() as RootState;
    const city = state.weather.cities.find(c => c.id === cityId);
    
    if (!city) {
      throw new Error('City not found');
    }
    
    const response = await fetchCityWeather(city.name);
    return {
      ...response,
      lastUpdated: Date.now(),
    };
  }
);

export const fetchHourlyForecast = createAsyncThunk(
  'weather/fetchHourlyForecast',
  async (cityId: number, { getState }) => {
    const state = getState() as RootState;
    const city = state.weather.cities.find(c => c.id === cityId);
    
    if (!city) {
      throw new Error('City not found');
    }
    
    const response = await fetchCityHourlyForecast(city.name);
    return {
      cityId,
      list: response.list,
    };
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    removeCity: (state, action: PayloadAction<number>) => {
      state.cities = state.cities.filter(city => city.id !== action.payload);
      delete state.hourlyForecasts[action.payload];
      
      // Update localStorage
      localStorage.setItem('weatherCities', JSON.stringify(state.cities));
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchWeatherForCity
      .addCase(fetchWeatherForCity.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWeatherForCity.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Check if city already exists
        const existingCityIndex = state.cities.findIndex(
          city => city.id === action.payload.id
        );
        
        if (existingCityIndex >= 0) {
          // Update existing city
          state.cities[existingCityIndex] = action.payload;
        } else {
          // Add new city
          state.cities.push(action.payload);
        }
        
        // Update localStorage
        localStorage.setItem('weatherCities', JSON.stringify(state.cities));
      })
      .addCase(fetchWeatherForCity.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch weather data';
      })
      
      // updateCityWeather
      .addCase(updateCityWeather.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCityWeather.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.cities.findIndex(city => city.id === action.payload.id);
        if (index !== -1) {
          state.cities[index] = action.payload;
          // Update localStorage
          localStorage.setItem('weatherCities', JSON.stringify(state.cities));
        }
      })
      .addCase(updateCityWeather.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to update weather data';
      })
      
      // fetchHourlyForecast
      .addCase(fetchHourlyForecast.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchHourlyForecast.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.hourlyForecasts[action.payload.cityId] = action.payload;
      })
      .addCase(fetchHourlyForecast.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch hourly forecast';
      });
  },
});

export const { removeCity } = weatherSlice.actions;

// Selectors
export const selectAllCities = (state: RootState) => state.weather.cities;
export const selectCityById = (state: RootState, cityId: number) => 
  state.weather.cities.find(city => city.id === cityId);
export const selectHourlyForecastById = (state: RootState, cityId: number) => 
  state.weather.hourlyForecasts[cityId];
export const selectWeatherStatus = (state: RootState) => state.weather.status;
export const selectWeatherError = (state: RootState) => state.weather.error;

export default weatherSlice.reducer;