import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider }     from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar from './Components/Navbar';
import HeroSection from './Components/HeroSection';
import PopularProducts     from './Components/PopularProducts';
import BestSellingProducts from './Components/BestSellingProducts';
import Footer              from './Components/Footer';
import Login               from './Components/Login';
import ArtistProfile       from './pages/ArtistProfile';
import CustomerProfile     from './pages/CustomerProfile';
import CartPage            from './pages/CartPage';
import Shop                from './pages/Shop';
import WishlistPage        from './pages/WishlistPage';
import AdminPage           from './pages/AdminPage';
import Register from './Components/Register';
import ProtectedRoute from './Components/ProtectedRoute';
import ProductDetails from './pages/ProductDetails';
import Artists from './pages/Artists';
import ArtistsSection from './Components/ArtistsSection';

function LoginRoute() {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }
  switch (user.role) {
    case 'artist':
      return <Navigate to="/artist-profile" replace />;
    case 'admin':
      return <Navigate to="/admin" replace />;
    default:
      return <Navigate to="/" replace />;
  }
}
function AppContent() {
  const { user }   = useAuth();
  const location   = useLocation();
  const hideNavbar = location.pathname.startsWith('/admin');

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeroSection />
              <PopularProducts />
              <BestSellingProducts />
              <ArtistsSection />
              <Footer />
            </>
          }
        />
                <Route
          path="/admin"
          element={
            <ProtectedRoute
              element={<AdminPage />}
              allowedRoles={['admin']}
            />
          }
        />
        <Route
          path="/artist-profile"
          element={
            <ProtectedRoute
              element={<ArtistProfile />}
              allowedRoles={['artist']}
            />
          }
        />
        <Route
          path="/customer-profile"
          element={
            <ProtectedRoute
              element={<CustomerProfile />}
              allowedRoles={['customer']}
            />
          }
        />
        <Route path="/artists" element={<Artists />}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/cart" element={<CartPage />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/artist/:id" element={<ArtistProfile />} />

      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <Router>
            <AppContent />
          </Router>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
