
import { AiOutlineHeart, AiOutlineShoppingCart } from 'react-icons/ai';
import { FaUser, FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const getProfileLink = () => {
    if (!user) return '/login';
    if (user.role === 'artist') return '/artist-profile';
    if (user.role === 'admin') return '/admin';
    return '/customer-profile';
  };

  return (
    <nav className="flex justify-between items-center px-6 py-3 bg-[#FAF9F6] shadow-md sticky top-0 z-50">
      <Link
        to="/"
        className="text-3xl font-bold text-black"
        style={{ fontFamily: "'Lily Script One', cursive" }}
      >
        Craftopia
      </Link>
      <div className="relative w-1/3">
        <input
          type="text"
          placeholder="Search for artist / products..."
          className="w-full border border-[#E07385] rounded-full px-4 py-2 text-base placeholder-black focus:outline-none"
        />
        <FaSearch className="absolute right-4 top-3 text-black text-lg" />
      </div>
      <div className="flex items-center space-x-6 text-2xl text-black">
        {user && user.role === 'customer' && (
          <>
            <AiOutlineHeart
              className="cursor-pointer"
              onClick={() => navigate('/wishlist')}
            />


            <AiOutlineShoppingCart
              className="cursor-pointer"
              onClick={() => navigate('/cart')}
            />
          </>
        )}

        <div className="flex items-center space-x-2 cursor-pointer">
          <FaUser
            className="text-3xl"
            onClick={() => navigate(getProfileLink())}
          />
          <span
            className="text-lg font-medium hover:underline"
            onClick={() => navigate(getProfileLink())}
          >
            {user ? 'My Account' : 'Sign In'}
          </span>
        </div>
        {user ? (
          <button
            onClick={() => {
              logout();
              navigate('/');
              window.location.href = '/';
            }}
            className="ml-4 px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-[#E07385] hover:text-white transition"
          >
            Logout
          </button>
        ) : (
          <Link to="/register">
            <button className="ml-4 px-4 py-2 bg-[#E07385] text-white rounded-md text-sm hover:bg-[#C05264] transition">
              Sign Up
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
