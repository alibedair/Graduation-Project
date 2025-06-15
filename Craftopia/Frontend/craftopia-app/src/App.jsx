import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";

import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import HeroSection from "./Components/HeroSection";
import PopularProducts from "./Components/PopularProducts";
import BestSellingProducts from "./Components/BestSellingProducts";
import SignIn from "./Components/SignIn";
import AdminAuctionManagement from "./pages/AdminAuctionManagement";
import AdminPage from "./pages/AdminPage";
import LandingPage from "./pages/LandingPage";
import ArtistProfile from "./pages/ArtistProfile";
import CustomerProfile from "./pages/CustomerProfile";
import CartPage from "./pages/CartPage";
import Shop from "./pages/Shop";
import WishlistPage from './pages/WishlistPage';

function AppContent({ isLoggedIn, setIsLoggedIn }) {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith("/admin");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [location.pathname]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role;

  return (
    <>
      {!hideNavbar && <Navbar isLoggedIn={isLoggedIn} />}
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <HeroSection />
              <PopularProducts />
              <BestSellingProducts />
              <Footer />
            </div>
          }
        />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/landing" element={<LandingPage />} />
       <Route path="/artist-profile" element={<ArtistProfile setIsLoggedIn={setIsLoggedIn} />} />
        <Route
          path="/customer-profile"
          element={<CustomerProfile setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              role === "artist" ? (
                <Navigate to="/artist-profile" />
              ) : role === "admin" ? (
                <Navigate to="/admin" />
              ) : (
                <Navigate to="/landing" />
              )
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
