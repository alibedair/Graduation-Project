import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import PopularProducts from "./Components/PopularProducts";
import WelcomeSection from "./Components/WelcomeSection";
import AdminPage from "./pages/AdminPage";
import LandingPage from "./pages/LandingPage";
import SignIn from "./Components/SignIn";
import { useState } from "react";
import BestSellingProducts from "./Components/BestSellingProducts";
import ArtistProfile from "./pages/ArtistProfile";
import Logout from "./Components/ Logout"; 
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
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
        <Route
          path="/landing"
          element={<LandingPage />}
        />
        <Route path="/artist-profile" element={<ArtistProfile />} />
        <Route path="/logout" element={<Logout />} />
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/landing" /> : <SignIn onLoginSuccess={() => setIsLoggedIn(true)} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
