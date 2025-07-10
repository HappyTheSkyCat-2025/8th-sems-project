import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Main layout
import Navbar from "./components/Navbar";
import Footer from "./components/footer";

// Home page components
import Home from "./components/Home";
import Readsection3rd from "./components/readsection3rd";
import Journey from "./components/journey";
import Whygolden from "./components/Whygolden";
import Stories from "./components/stories";
import Trending from "./components/trending";
import Roof from "./components/roof";
import Trip from "./components/trip";
import Journal from "./components/journal";

// Pages
import DestinationPage from "./pages/DestinationPage";
import DestDescription from "./pages/destdescription";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Home />
              <Readsection3rd />
              <Journey />
              <Whygolden />
              <Stories />
              <Trending />
              <Roof />
              <Trip />
              <Journal />
            </>
          }
        />
        <Route path="/destinations/:country" element={<DestinationPage />} />
        <Route
          path="/destinations/:country/deal/:dealId"
          element={<DestDescription />}
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
