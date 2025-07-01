import React from 'react';
import Navbar from './components/Navbar';
import './index.css';

function App() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <h1>Welcome to Golden Travels</h1>
        <p>Your journey starts here.</p>
      </main>
    </>
  );
}

export default App;
