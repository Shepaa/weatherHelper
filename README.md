# Weather Helper

A Single Page Application (SPA) that displays weather information for selected cities. Built with React, TypeScript, Redux Toolkit, and React Router.

## Features

- View weather information for multiple cities
- Add and remove cities from your list
- Update weather data for specific cities
- View detailed weather information and hourly forecast for a city
- Responsive design for mobile and desktop
- Data persistence using LocalStorage

## Technologies Used

- React with TypeScript
- Redux Toolkit for state management
- React Router for navigation
- SCSS for styling
- Jest and React Testing Library for testing
- OpenWeatherMap API for weather data

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- OpenWeatherMap API key (get one at [https://openweathermap.org/api](https://openweathermap.org/api))

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd weather-helper
   ```

2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

3. **IMPORTANT: Add your OpenWeatherMap API key**:
   - Sign up for a free API key at [OpenWeatherMap](https://home.openweathermap.org/users/sign_up) if you don't have one
   - Open `src/api/weatherApi.ts` and replace `YOUR_API_KEY` with your actual API key:
   ```typescript
   const API_KEY = 'your-api-key-here'; // Replace with your actual API key from OpenWeatherMap
   ```
   - **Note**: The application will not work without a valid API key. If you see 401 errors, it means your API key is invalid or has not been activated yet (it may take a few hours after registration for a new API key to become active).

4. Start the development server:
   ```
   npm start
   ```
   or
   ```
   yarn start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## Usage

### Adding a City

1. Enter a city name in the input field at the top of the home page
2. Click "Add City" or press Enter
3. The city will be added to your list with current weather information

### Updating Weather Data

- Click the "Update" button on a city card to refresh its weather data

### Removing a City

- Click the "Remove" button on a city card to remove it from your list

### Viewing Detailed Weather Information

- Click on a city card to view detailed weather information and hourly forecast

## Running Tests

```
npm test
```
or
```
yarn test
```

## Building for Production

```
npm run build
```
or
```
yarn build
```

This creates an optimized production build in the `build` folder.

## Project Structure

```
weather-helper/
├── public/                 # Static files
├── src/                    # Source code
│   ├── api/                # API integration
│   ├── components/         # Reusable components
│   │   └── __tests__/      # Component tests
│   ├── hooks/              # Custom hooks
│   ├── pages/              # Page components
│   ├── store/              # Redux store and slices
│   ├── styles/             # SCSS styles
│   ├── App.tsx             # Main App component
│   └── index.tsx           # Entry point
├── package.json            # Dependencies and scripts
└── tsconfig.json           # TypeScript configuration
```

## License

This project is licensed under the MIT License.
