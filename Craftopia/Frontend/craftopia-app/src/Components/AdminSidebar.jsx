import { useState } from "react";
import {
  FaHome,
  FaClipboardList,
  FaAngleDown,
  FaGavel,
  FaThList,
  FaSignOutAlt,
  FaExclamation,
  FaPlus
} from "react-icons/fa";

const AdminSidebar = ({ selected, setSelected }) => {
  const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <div className="w-64 h-screen bg-[#F6EEEE] p-5 flex flex-col shadow-md shadow-gray-400">
      <div className="flex items-center gap-3 mb-20 pl-3">
        <h1 className="text-[24px]" style={{ fontFamily: "'Lily Script One', cursive" }}>Craftopia</h1>
        <h1 className="text-[22px]" style={{ fontFamily: "'Lisu Bosa', sans-serif" }}>Admin</h1>
      </div>

      <div className="flex flex-col rounded-lg p-2 mx-2 gap-2">
        <SidebarButton
          // icon={<FaHome />}
          text="Home"
          selected={selected === "Home"}
          onClick={() => setSelected("Home")}
        />

        <div>
          <button
            onClick={() => setOpenDropdown(!openDropdown)}
            className={`w-full flex justify-between items-center p-2 rounded-lg transition-all ${
              selected === "Requests" ? "bg-[#DEC5C2] shadow-md border-l-4 border-[#8A6F6D]" : "hover:bg-[#E7D8D7]"
            }`}
          >
            <span className="flex items-center gap-2">
              <FaClipboardList /> Requests
            </span>
            <FaAngleDown className={`transition-transform ${openDropdown ? "rotate-180" : "rotate-0"}`} />
          </button>

          <div className={`ml-6 transition-all ${openDropdown ? "max-h-40 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
            <SidebarButton
              icon={<FaGavel />}
              text="Auctions"
              selected={selected === "Auctions"}
              onClick={() => setSelected("Auctions")}
            />
            <SidebarButton
              icon={<FaThList />}
              text="Categories"
              selected={selected === "Categories"}
              onClick={() => setSelected("Categories")}
            />
          </div>
        </div>
        <SidebarButton
          icon={<FaPlus />}
          text="Add Category"
          selected={selected === "Add Category"}
          onClick={() => setSelected("Add Category")}
        />

        <SidebarButton
          icon={<FaExclamation />}
          text="Reports"
          selected={selected === "Reports"}
          onClick={() => setSelected("Reports")}
        />

        <SidebarButton
          icon={<FaExclamation />}
          text="Auction Requests"
          selected={selected === "Auction Requests"}
          onClick={() => setSelected("Auction Requests")}
        />
      </div>
      <div className="mt-auto pl-3">
        <SidebarButton
          icon={<FaSignOutAlt />}
          text="Logout"
          selected={false}
          onClick={() => console.log("Logging out...")}
        />
      </div>
    </div>
  );
};

const SidebarButton = ({ icon, text, selected, onClick }) => {
  return (
    <button
      className={`w-full flex items-center gap-2 p-2 rounded-lg transition-all ${
        selected ? "bg-[#DEC5C2] shadow-md " : "hover:bg-[#E7D8D7] active:bg-[#D1B4B2]"
      }`}
      onClick={onClick}
    >
      {icon} {text}
    </button>
  );
};

export default AdminSidebar;
