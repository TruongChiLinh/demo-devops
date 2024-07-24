import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  // expect(1+1).toEqual(2)
  const linkElement = screen.getByText(/User List/i);
  expect(linkElement).toBeInTheDocument();
});
