
import React from 'react';
import Home from './components/Home';
import Navbar from './components/Navbar';
import './styles/global.css';
import Readsection3rd from './components/readsection3rd'
import Journey from './components/journey'

function App() {
  return (
    <>
      <Navbar />
      <Home />
      <Readsection3rd />
      <Journey />
    </>
  );
}

export default App;
