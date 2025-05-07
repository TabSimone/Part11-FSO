// src/App.js
import React from 'react';
import './App.css';
import Counter from './components/Counter';  // Importa il componente Counter

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to the React Counter App</h1>
        {/* Usa il componente Counter */}
        <Counter />
      </header>
    </div>
  );
}

export default App;
