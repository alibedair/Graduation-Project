import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEdit, FaSignOutAlt } from "react-icons/fa";
import Profile from "../Components/Profile"; 
import CompleteProfile from "../Components/CompleteProfile";
import Footer from "../Components/Footer";

const CustomerProfile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F6]">
      <div className="flex w-full flex-grow">
        <div className="w-64 bg-white p-4 shadow-md ml-30 mt-20 rounded-2xl h-[60vh]">
          <nav>
            <ul className="space-y-3">
              <li
                onClick={() => setActiveTab("profile")}
                className={`hover:bg-gray-100 p-2 rounded cursor-pointer flex items-center gap-2 ${
                  activeTab === "profile" ? "bg-gray-200 font-semibold" : ""
                }`}
              >
                <FaUser className="text-black" />
                My Profile
              </li>
              <li
                onClick={handleLogout}
                className="hover:bg-gray-100 p-2 rounded cursor-pointer text-red-500 flex items-center gap-2"
              >
                <FaSignOutAlt className="text-black" />
                Logout
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex-1 p-8 mt-20">
          <div className="max-w-6xl mx-auto bg-[#FAF9F6] rounded-lg shadow-md p-6">
            {activeTab === "profile" && (
              <Profile setActiveTab={setActiveTab} />
            )}
            {activeTab === "edit" && <CompleteProfile />}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CustomerProfile;
