import { useEffect, useRef, useState } from 'react';
import { FaUser, FaSearch } from 'react-icons/fa';
import { AiOutlineHeart, AiOutlineShoppingCart } from 'react-icons/ai';
import SignIn from './SignIn';
import Profile from './Profile';

const Navbar = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [showProfile, setShowProfile] = useState(false);

  const handleLoginSuccess = () => {
    setLoggedIn(true);
    setShowSignIn(false);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setShowDropdown(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          <AiOutlineHeart />
          <AiOutlineShoppingCart />
          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center space-x-2 text-lg cursor-pointer"
              onClick={() => {
                if (loggedIn) {
                  setShowDropdown((prev) => !prev);
                } else {
                  setShowSignIn(true);
                }
              }}
            >
              <FaUser className="text-black text-3xl" />
              {!loggedIn ? (
                <span className="text-black text-lg hover:underline">Sign in</span>
              ) : (
                <span className="text-black text-lg font-semibold">My Account</span>
              )}
            </div>

            {showDropdown && loggedIn && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E07385] rounded-xl shadow-lg z-50">
                <ul className="text-sm font-medium text-[#333]">
                  <li
                    className="px-5 py-3 hover:bg-[#FCE8EC] transition-all duration-200 cursor-pointer"
                    onClick={() => {
                      setShowDropdown(false);
                      setShowProfile(true);
                    }}
                  >
                    View My Account
                  </li>
                  <li
                    className="px-5 py-3 hover:bg-[#FCE8EC] text-[#E07385] font-semibold transition-all duration-200 cursor-pointer rounded-b-xl"
                    onClick={handleLogout}
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>

      {showSignIn && <SignIn onLoginSuccess={handleLoginSuccess} />}
      {showProfile && (
        <Profile onClose={() => setShowProfile(false)} />
      )}
    </>
  );
};

export default Navbar;
