import { render, screen, fireEvent } from '@testing-library/react';
import Counter from './Counter';
import React from 'react'; 

test('renders Counter component and increments the count', () => {
  render(<Counter />);
  
  // Verifica che il testo del contatore sia inizialmente 0
  expect(screen.getByText(/Counter: 0/i)).toBeInTheDocument();

  // Clicca il bottone per incrementare il contatore
  fireEvent.click(screen.getByText(/Increment/i));

  // Verifica che il contatore sia stato incrementato
  expect(screen.getByText(/Counter: 1/i)).toBeInTheDocument();
});
