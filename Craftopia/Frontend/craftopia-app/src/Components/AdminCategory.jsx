import { useEffect, useState } from "react";
import { FaUser, FaTag } from "react-icons/fa";

const AdminCategory = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const dummyData = [
            {
                username: "artist_jane",
                category: "Pottery",
                reason: "I specialize in handmade pottery and would love to list under a relevant category.",
            },
            {
                username: "crafts_by_John",
                category: "Recycled Art",
                reason: "My art uses recycled materials and doesn't fit in any existing category.",
            },
        ];

        setRequests(dummyData);
    }, []);

    return (
        <div className="bg-[#FAF9F6] w-4/5 ml-6 mt-10">
            <div className="bg-[#F6EEEE] p-6 rounded-2xl border border-black">
                <h2 className="text-xl font-semibold mb-6">Category Requests</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {requests.map((req, index) => (
                        <div
                            key={index}
                            className="bg-white border rounded-xl shadow-md p-5 transition-transform hover:scale-[1.02] hover:shadow-lg"
                        >
                            <div className="flex items-center gap-2 text-[#4B2E2E] mb-2">
                                <FaUser className="text-[#de929f]" />
                                <h3 className="font-semibold text-lg">@{req.username}</h3>
                            </div>

                            <div className="flex items-center gap-2 mb-2">
                                <FaTag className="text-[#de929f]" />
                                <span className="bg-[#E07385] text-xs text-[#f5f1f1] px-2 py-1 rounded-full font-semibold">
                                    {req.category}
                                </span>
                            </div>

                            <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                                <span className="font-medium text-[#4B2E2E]">Reason:</span> {req.reason}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminCategory;
