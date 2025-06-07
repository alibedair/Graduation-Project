import { FaSearch, FaBell, FaUser } from "react-icons/fa";

const AdminSearchbar = () => {
  return (
    <div className="w-full flex items-center justify-between mt-5 px-6"> 

      <div className="relative w-4/5"> 
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-1.5 pl-10 border border-[#A36361] rounded-md focus:outline-none focus:ring-1 focus:ring-[#A36361]"
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A36361]" />
      </div>

      <div className="flex items-center gap-6 mr-5">
        <FaBell className="text-[#000000] text-2xl cursor-pointer hover:text-[#D27C7D] transition" />
        <FaUser className="text-[#000000] text-2xl cursor-pointer hover:text-[#D27C7D] transition" />
      </div>
    </div>
  );
};

export default AdminSearchbar;
