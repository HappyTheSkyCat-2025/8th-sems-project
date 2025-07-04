
import React from 'react';
import Home from './components/Home';
import Navbar from './components/Navbar';
import './styles/global.css';
import Readsection3rd from './components/readsection3rd'
import Journey from './components/journey'
import Whygolden from './components/Whygolden'
import Stories from './components/stories'
import Trending from './components/trending'
import Roof from './components/roof'
import Trip from './components/trip'
import Journal from './components/journal'
import Footer from './components/footer'

function App() {
  return (
    <>
      <Navbar />
      <Home />
      <Readsection3rd />
      <Journey />
      <Whygolden />
      <Stories />
      <Trending />
      <Roof />
      <Trip />
      <Journal />
      <Footer />
    </>
  );
}

export default App;
