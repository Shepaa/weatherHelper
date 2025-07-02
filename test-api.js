const axios = require('axios');

const API_KEY = '4f64d0f4f7109f0df5bdf84e403336ae';
const url = `https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=${API_KEY}`;

axios.get(url)
  .then(response => {
    console.log('API request successful:', response.data);
  })
  .catch(error => {
    console.error('API request failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  });