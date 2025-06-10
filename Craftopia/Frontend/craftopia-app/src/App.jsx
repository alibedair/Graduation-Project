import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";

import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import PopularProducts from "./Components/PopularProducts";
import WelcomeSection from "./Components/WelcomeSection";
import AdminPage from "./pages/AdminPage";
import LandingPage from "./pages/LandingPage";
import SignIn from "./Components/SignIn";
import BestSellingProducts from "./Components/BestSellingProducts";
import ArtistProfile from "./pages/ArtistProfile";

import Logout from "./Components/ Logout"; 
import HeroSection from './Components/HeroSection';
import CustomerProfile from "./pages/CustomerProfile";
import CartPage from "./pages/CartPage";

function AppContent({ isLoggedIn, setIsLoggedIn }) {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith("/admin");

  return (
    <>
      {!hideNavbar && <Navbar isLoggedIn={isLoggedIn} />}
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <HeroSection />
              {/* <WelcomeSection /> */}
              <PopularProducts />
              <BestSellingProducts />
              <Footer />
            </div>
          }
        />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/artist-profile" element={<ArtistProfile />} />
        <Route path="/customer-profile" element={<CustomerProfile />} />
        <Route path="/cart" element={<CartPage />} />
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/landing" />
            ) : (
              <SignIn onLoginSuccess={() => setIsLoggedIn(true)} />
            )
          }
        />
      </Routes>
    </>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <WishlistProvider>
      <CartProvider>
        <Router>
          <AppContent isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        </Router>
      </CartProvider>
    </WishlistProvider>
  );
}

export default App;