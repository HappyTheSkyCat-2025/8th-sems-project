import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  matchPath,
} from "react-router-dom";

// Layout components
import Navbar from "./components/Navbar";
import Footer from "./components/footer";
import ScrollToTop from "./components/ScrollToTop";

// Auth pages
import Login from "./Auth/login";
import Profile from "./Auth/profile";

// Home page sections
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
import AboutUs from "./pages/Aboutus";
import AllDestinations from "./pages/AllDestinations";
import DestinationPage from "./pages/DestinationPage";
import DestDescription from "./pages/destdescription";

// Payment pages
import Payment1 from "./payment/payment1";
import Payment2 from "./payment/payment2";
import Payment3 from "./payment/payment3";

function Layout() {
  const location = useLocation();

  // Define routes where Navbar and Footer should be hidden
  const noLayoutRoutes = ["/login", "/payment", "/payment/payment2", "/payment/payment3"];

  // Check if current route matches any of the above
  const hideLayout = noLayoutRoutes.some((path) => matchPath({ path, end: true }, location.pathname));

  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>
        {/* Home Page */}
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

        {/* Destination Pages */}
        <Route path="/alldestinations" element={<AllDestinations />} />
        <Route path="/destinations/:country" element={<DestinationPage />} />
        <Route path="/destinations/:country/deal/:dealId" element={<DestDescription />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />

        {/* Static Pages */}
        <Route path="/about" element={<AboutUs />} />

        {/* Payment Pages */}
        <Route path="/payment" element={<Payment1 />} />
        <Route path="/payment/payment2" element={<Payment2 />} />
        <Route path="/payment/payment3" element={<Payment3 />} />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout />
    </Router>
  );
}

export default App;
