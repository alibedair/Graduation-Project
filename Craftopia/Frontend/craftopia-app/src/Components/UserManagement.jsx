import { useEffect, useState } from "react";
import { FaUser, FaUserSlash } from "react-icons/fa";
import axios from "axios";
import { motion } from "framer-motion";
import {toast} from "react-hot-toast";

const UserManagement = () => {
    const [tab, setTab] = useState("customers");
    const [customers, setCustomers] = useState([]);
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");

                const [customersRes, artistsRes] = await Promise.all([
                    axios.get("http://localhost:3000/customer/all-customers", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get("http://localhost:3000/artist/all", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);
                const sortedCustomers = Array.isArray(customersRes.data.customers)
                    ? customersRes.data.customers
                        .map((cust) => ({
                            ...cust,
                            banned: cust.banned ?? cust.isBanned ?? false,
                            userId: cust.userId ?? cust.user?.userId,
                        }))
                        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                    : [];

                const sortedArtists = Array.isArray(artistsRes.data.artists)
                    ? artistsRes.data.artists
                        .map((artist) => ({
                            ...artist,
                            banned: artist.banned ?? artist.isBanned ?? false,
                            userId: artist.userId ?? artist.user?.userId,
                        }))
                        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                    : [];

                setCustomers(sortedCustomers);
                setArtists(sortedArtists);
            } catch (err) {
                console.error("Error fetching users:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleBanToggle = async (type, id, currentBanned) => {
        const action = currentBanned ? "unban" : "ban";
        const url = `http://localhost:3000/report/${action}/${id}`;

        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(
                url,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const updatedUser = response.data.data;
            console.log("Ban toggle response user:", updatedUser);

            if (type === "customer") {
                setCustomers((prev) =>
                    prev.map((c) =>
                        c.userId === id ? { ...c, banned: updatedUser.isBanned } : c
                    )
                );
            } else {
                setArtists((prev) =>
                    prev.map((a) =>
                        a.userId === id ? { ...a, banned: updatedUser.isBanned } : a
                    )
                );
            }

        } catch (err) {
            console.error("Failed to update ban status:", err);
            toast.error("Failed to update ban status.");
        }
    };

    const users = tab === "customers" ? customers : artists;


    const getProfileImage = (user) => {
        if ((tab === "artists" || tab === "customers") && user.profilePicture) {
            return user.profilePicture;
        }
        return null;
    };

    return (
        <div className="p-6 mt-6">
            <h2 className="text-2xl font-semibold text-black mb-8">User Management</h2>
            <div className="w-[82%] mb-8 relative border-b border-gray-300">
                <div className="grid grid-cols-2 text-center text-m font-medium text-gray-500">
                    <div
                        onClick={() => setTab("customers")}
                        className={`cursor-pointer py-3 ${tab === "customers" ? "text-[#E07385]" : "hover:text-[#E07385]"
                            }`}
                    >
                        Customers
                    </div>
                    <div
                        onClick={() => setTab("artists")}
                        className={`cursor-pointer py-3 ${tab === "artists" ? "text-[#E07385]" : "hover:text-[#E07385]"
                            }`}
                    >
                        Artists
                    </div>
                </div>
                <div
                    className="absolute bottom-0 left-0 h-1 bg-[#E07385] transition-all duration-300"
                    style={{
                        width: "50%",
                        transform: tab === "customers" ? "translateX(0%)" : "translateX(100%)",
                    }}
                />
            </div>
            {loading ? (
                <p className="text-gray-500">Loading...</p>
            ) : (
                <div className="w-[82%] ml-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                        {users.map((user) => (
                            <div
                                key={user.userId}
                                className="w-full border border-[#E07385] rounded-xl p-5 bg-white transition shadow-sm hover:shadow-md"
                            >
                                <div className="flex items-center gap-4">
                                    {getProfileImage(user) ? (
                                        <img
                                            src={getProfileImage(user)}
                                            alt="profile"
                                            className="w-14 h-14 rounded-full object-cover border border-[#E07385]"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 rounded-full bg-[#FCEEEF] flex items-center justify-center text-[#E07385] font-bold text-xl">
                                            {(user.username || user.name)?.[0]?.toUpperCase() ?? "U"}
                                        </div>
                                    )}

                                    <div className="flex-1">
                                        <h4 className="text-lg font-semibold text-gray-800">
                                            {user.username || user.name}
                                        </h4>
                                        <p className="text-sm font-medium text-gray-600">
                                            ID: {user.userId}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Status:{" "}
                                            {user.banned ? (
                                                <span className="text-red-600 font-semibold">Banned</span>
                                            ) : (
                                                <span className="text-green-600 font-semibold">Active</span>
                                            )}
                                        </p>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        className="p-2 bg-[#FDE8EB] hover:bg-[#E07385] text-[#E07385] hover:text-white rounded-full transition relative group"
                                        onClick={() =>
                                            handleBanToggle(
                                                tab === "customers" ? "customer" : "artist",
                                                user.userId,
                                                user.banned
                                            )
                                        }
                                    >
                                        {user.banned ? (
                                            <FaUser className="w-4 h-4" />
                                        ) : (
                                            <FaUserSlash className="w-4 h-4" />
                                        )}
                                        <span className="absolute -top-8 -left-4 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
                                            {user.banned ? "Unban this user" : "Ban this user"}
                                        </span>
                                    </motion.button>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
