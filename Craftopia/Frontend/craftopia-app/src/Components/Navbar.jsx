import { FaSearch, FaUser } from "react-icons/fa";
import { AiOutlineHeart, AiOutlineShoppingCart } from "react-icons/ai";

const Navbar = () => {
  return (
    <>
      <nav className="flex justify-between items-center px-6 py-3 bg-[#FAF9F6] shadow-md">
        <div
          className="text-3xl font-bold text-black pl-25"
          style={{ fontFamily: "'Lily Script One', cursive" }}
        >
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
          <AiOutlineHeart className="text-black" />
          <AiOutlineShoppingCart className="text-black" />
          <div className="flex items-center space-x-2 text-lg">
            <FaUser className="text-black text-3xl" />
            <a href="#" className="text-black text-lg hover:underline">
              Sign in
            </a>
          </div>
        </div>
      </nav>
      <div className="flex justify-center space-x-15 py-2 bg-[#FAF9F6] text-[#921A40] font-semibold text-lg -mt-2">
        <a
          href="#"
          className="hover:text-[#E07385] transition-colors duration-300"
        >
          Home & Living
        </a>
        <a
          href="#"
          className="hover:text-[#E07385] transition-colors duration-300"
        >
          Jewelry
        </a>
        <a
          href="#"
          className="hover:text-[#E07385] transition-colors duration-300"
        >
          Arts
        </a>
        <a
          href="#"
          className="hover:text-[#E07385] transition-colors duration-300"
        >
          Bath & Beauty
        </a>
        <a
          href="#"
          className="hover:text-[#E07385] transition-colors duration-300"
        >
          More
        </a>
      </div>
    </>
  );
};

export default Navbar;
