import { useState } from 'react';
import { FaUser, FaSearch } from 'react-icons/fa';
import { AiOutlineHeart, AiOutlineShoppingCart } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';  
import SignIn from './SignIn';

const Navbar = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();  

  const handleLoginSuccess = () => {
    setLoggedIn(true);
    setShowSignIn(false);
  };

  const handleUserClick = () => {
    if (loggedIn) {
      navigate('/customer-profile'); 
    } else {
      setShowSignIn(true);
    }
  };

  return (
    <>
      <nav className="flex justify-between items-center px-6 py-3 bg-[#FAF9F6] shadow-md">
        <div className="text-3xl font-bold text-black pl-25" style={{ fontFamily: "'Lily Script One', cursive" }}>
          Craftopia
        </div>

        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="Search For artist / Products ......."
            className="w-full border border-[#E07385] rounded-full px-4 py-2 text-m text-black placeholder-black focus:outline-none"
          />
          <FaSearch className="absolute right-4 top-3 text-black text-lg" />
        </div>

        <div className="flex items-center space-x-6 text-3xl text-black pr-20">
          <AiOutlineHeart className="cursor-pointer" onClick={() => navigate('/wishlist')} />
          <AiOutlineShoppingCart className="cursor-pointer" onClick={() => navigate('/cart')} />
          <div
            className="flex items-center space-x-2 text-lg cursor-pointer"
            onClick={handleUserClick}
          >
            <FaUser className="text-black text-3xl" />
            {!loggedIn ? (
              <span className="text-black text-lg hover:underline">Sign in</span>
            ) : (
              <span className="text-black text-lg font-semibold">My Account</span>
            )}
          </div>
        </div>
      </nav>

      {showSignIn && <SignIn onLoginSuccess={handleLoginSuccess} />}
    </>
  );
};

export default Navbar;
