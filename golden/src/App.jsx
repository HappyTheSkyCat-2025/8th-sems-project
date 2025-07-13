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
import Register from "./Auth/Register";
import VerifyOTP from "./Auth/VerifyOTP";
import ForgotPassword from "./Auth/ForgotPassword";
import ResetPassword from "./Auth/ResetPassword";
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

  // Add forgot/reset password to routes without layout
  const noLayoutRoutes = [
    "/login",
    "/register",
    "/verify-otp",
    "/forgot-password",
    "/reset-password",
    "/payment",
    "/payment/payment2",
    "/payment/payment3",
  ];

  const hideLayout = noLayoutRoutes.some((path) =>
    matchPath({ path, end: true }, location.pathname)
  );

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
        <Route
          path="/destinations/:country/deal/:dealId"
          element={<DestDescription />}
        />

        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
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
