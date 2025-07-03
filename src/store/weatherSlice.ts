import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from './index';
import { fetchCityWeather, fetchCityHourlyForecast } from '../api/weatherApi';
import { HourlyForecast } from '../interfaces/HourlyForecast';
import { WeatherData } from '../interfaces/WeatherData';

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

const savedCities = localStorage.getItem('weatherCities');
if (savedCities) {
  try {
    initialState.cities = JSON.parse(savedCities);
  } catch (e) {
    console.error('Failed to parse saved cities from localStorage', e);
  }
}

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

      localStorage.setItem('weatherCities', JSON.stringify(state.cities));
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchWeatherForCity.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchWeatherForCity.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const existingCityIndex = state.cities.findIndex(city => city.id === action.payload.id);

        if (existingCityIndex >= 0) {
          state.cities[existingCityIndex] = action.payload;
        } else {
          state.cities.push(action.payload);
        }

        localStorage.setItem('weatherCities', JSON.stringify(state.cities));
      })
      .addCase(fetchWeatherForCity.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch weather data';
      })

      .addCase(updateCityWeather.pending, state => {
        state.status = 'loading';
      })
      .addCase(updateCityWeather.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.cities.findIndex(city => city.id === action.payload.id);
        if (index !== -1) {
          state.cities[index] = action.payload;
          localStorage.setItem('weatherCities', JSON.stringify(state.cities));
        }
      })
      .addCase(updateCityWeather.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to update weather data';
      })

      .addCase(fetchHourlyForecast.pending, state => {
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

export const selectAllCities = (state: RootState) => state.weather.cities;
export const selectCityById = (state: RootState, cityId: number) =>
  state.weather.cities.find(city => city.id === cityId);
export const selectHourlyForecastById = (state: RootState, cityId: number) =>
  state.weather.hourlyForecasts[cityId];
export const selectWeatherStatus = (state: RootState) => state.weather.status;
export const selectWeatherError = (state: RootState) => state.weather.error;

export default weatherSlice.reducer;
