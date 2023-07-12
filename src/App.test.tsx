import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import App from './App';
import ReactDOM from 'react-dom';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

declare global{
  interface Window { setImmediate: any }
}

if(typeof Window.prototype.setImmediate !== "function") {
  Window.prototype.setImmediate = function() {
    return false
  };
}
afterEach(cleanup);
describe('App', () => {
  test('renders App component', () => {
    render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

    
    expect(screen.getByText('Channels analyzed')).toBeInTheDocument();
  });
});