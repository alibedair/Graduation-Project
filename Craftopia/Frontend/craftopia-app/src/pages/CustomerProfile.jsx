import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaSignOutAlt, FaHeart } from "react-icons/fa";
import Profile from "../Components/Profile";
import CompleteProfile from "../Components/CompleteProfile";
import Wishlist from "../Components/Wishlist";
import Footer from "../Components/Footer";
import RequestCustomization from "../Components/RequestCustomization";

const CustomerProfile = ({ setIsLoggedIn }) => {
    const [activeTab, setActiveTab] = useState("profile");
    const navigate = useNavigate();

   const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
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
                                className={`hover:bg-gray-100 p-2 rounded cursor-pointer flex items-center gap-2 ${activeTab === "profile" ? "bg-gray-200 font-semibold" : ""
                                    }`}
                            >
                                <FaUser className="text-black" />
                                My Profile
                            </li>

                            <li
                                onClick={() => setActiveTab("wishlist")}
                                className={`hover:bg-gray-100 p-2 rounded cursor-pointer flex items-center gap-2 ${activeTab === "wishlist" ? "bg-gray-200 font-semibold" : ""
                                    }`}
                            >
                                <FaHeart className="text-black" />
                                Wishlist
                            </li>
                            <li
                                onClick={() => setActiveTab("customization")}
                                className={`hover:bg-gray-100 p-2 rounded cursor-pointer flex items-center gap-2 ${activeTab === "customization" ? "bg-gray-200 font-semibold" : ""
                                    }`}
                            >
                                Request Customization
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
                   <div className="max-w-6xl mx-auto bg-[#FAF9F6] rounded-lg shadow-md p-6 -mt-8">
                        {activeTab === "profile" && <Profile setActiveTab={setActiveTab} />}
                        {activeTab === "edit" && <CompleteProfile />}
                        {activeTab === "wishlist" && <Wishlist />}
                        {activeTab === "customization" && <RequestCustomization />}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CustomerProfile;
