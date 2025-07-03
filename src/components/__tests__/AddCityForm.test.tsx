import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore, { MockStore } from 'redux-mock-store';
import thunk from 'redux-thunk';

import { RootState } from '../../store';
import AddCityForm from '../AddCityForm';

// Create a mock store
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('AddCityForm Component', () => {
  let store: MockStore<Partial<RootState>>;

  beforeEach(() => {
    // Initialize store with initial state
    store = mockStore({
      weather: {
        status: 'idle',
        error: null,
        cities: [],
      },
    });

    // Mock the dispatch function
    store.dispatch = jest.fn();
  });

  test('renders the form correctly', () => {
    render(
      <Provider store={store}>
        <AddCityForm />
      </Provider>
    );

    // Check if input and button are rendered
    expect(screen.getByPlaceholderText(/Enter city name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add City/i })).toBeInTheDocument();
  });

  test('button is disabled when input is empty', () => {
    render(
      <Provider store={store}>
        <AddCityForm />
      </Provider>
    );

    // Check if button is disabled initially
    expect(screen.getByRole('button', { name: /Add City/i })).toBeDisabled();
  });

  test('button is enabled when input has value', () => {
    render(
      <Provider store={store}>
        <AddCityForm />
      </Provider>
    );

    // Type in the input
    const input = screen.getByPlaceholderText(/Enter city name/i);
    fireEvent.change(input, { target: { value: 'London' } });

    // Check if button is enabled
    expect(screen.getByRole('button', { name: /Add City/i })).not.toBeDisabled();
  });

  test('dispatches action when form is submitted', () => {
    render(
      <Provider store={store}>
        <AddCityForm />
      </Provider>
    );

    // Type in the input
    const input = screen.getByPlaceholderText(/Enter city name/i);
    fireEvent.change(input, { target: { value: 'London' } });

    // Submit the form
    const button = screen.getByRole('button', { name: /Add City/i });
    fireEvent.click(button);

    // Check if dispatch was called
    expect(store.dispatch).toHaveBeenCalled();
  });

  test('input is cleared after form submission', () => {
    render(
      <Provider store={store}>
        <AddCityForm />
      </Provider>
    );

    // Type in the input
    const input = screen.getByPlaceholderText(/Enter city name/i);
    fireEvent.change(input, { target: { value: 'London' } });

    // Submit the form
    const button = screen.getByRole('button', { name: /Add City/i });
    fireEvent.click(button);

    // Check if input is cleared
    expect(input).toHaveValue('');
  });

  test('shows loading state when status is loading', () => {
    // Update store with loading status
    store = mockStore({
      weather: {
        status: 'loading',
        error: null,
        cities: [],
      },
    });

    render(
      <Provider store={store}>
        <AddCityForm />
      </Provider>
    );

    // Check if button shows loading text
    expect(screen.getByRole('button')).toHaveTextContent(/Adding/i);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByPlaceholderText(/Enter city name/i)).toBeDisabled();
  });
});
