import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import PopularProducts from "./Components/PopularProducts";
import WelcomeSection from "./Components/WelcomeSection";
import AdminPage from "./Pages/AdminPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <Navbar />
              <WelcomeSection />
              <PopularProducts />
              <Footer />
            </div>
          }
        />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
