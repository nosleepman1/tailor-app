import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  it('renders the Vite and React logos', () => {
    render(<App />);
    expect(screen.getByAltText('Vite logo')).toBeInTheDocument();
    expect(screen.getByAltText('React logo')).toBeInTheDocument();
  });

  it('increments count when button is clicked', () => {
    render(<App />);
    const button = screen.getByRole('button', { name: /count is /i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Count is 0');

    fireEvent.click(button);
    expect(button).toHaveTextContent('Count is 1');
  });
});
