import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useState } from "react";

 // import WishlistProvider

import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import PopularProducts from "./Components/PopularProducts";
import WelcomeSection from "./Components/WelcomeSection";
import AdminPage from "./pages/AdminPage";
import LandingPage from "./pages/LandingPage";
import SignIn from "./Components/SignIn";
import BestSellingProducts from "./Components/BestSellingProducts";
import ArtistProfile from "./pages/ArtistProfile";
import CustomerProfile from "./pages/CustomerProfile";
import { WishlistProvider } from "./context/WishlistContext";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <WishlistProvider>
      <Router>
        <Navbar isLoggedIn={isLoggedIn} />
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <WelcomeSection />
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
      </Router>
    </WishlistProvider>
  );
}

export default App;
