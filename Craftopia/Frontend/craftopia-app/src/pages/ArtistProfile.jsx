import { useState } from "react";
import { FaUser, FaEdit, FaSignOutAlt } from "react-icons/fa";
import GetProfile from "../Components/GetProfile";
import EditProfile from "../Components/EditProfile";
import Footer from "../Components/Footer"; 

const ArtistProfile = () => {
  const [activeTab, setActiveTab] = useState("profile");

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
                onClick={() => setActiveTab("edit")}
                className={`hover:bg-gray-100 p-2 rounded cursor-pointer flex items-center gap-2 ${
                  activeTab === "edit" ? "bg-gray-200 font-semibold" : ""
                }`}
              >
                <FaEdit className="text-black" />
                Update
              </li>
              <li className="hover:bg-gray-100 p-2 rounded cursor-pointer text-red-500 flex items-center gap-2">
                <FaSignOutAlt className="text-black" />
                Logout
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex-1 p-8 mt-20">
          <div className="max-w-6xl mx-auto bg-[#FAF9F6] rounded-lg shadow-md p-6">
            {activeTab === "profile" && <GetProfile setActiveTab={setActiveTab} />}
            {activeTab === "edit" && <EditProfile />}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ArtistProfile;
