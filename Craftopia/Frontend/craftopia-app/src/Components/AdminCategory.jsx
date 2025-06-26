import { useEffect, useState } from "react";
import { FaChartBar, FaRegSmileBeam } from "react-icons/fa";

const AdminCategory = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:3000/category/getrequest", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch category requests");
        }

        const data = await response.json();
        setRequests(data.requestedCategories);
      } catch (error) {
        console.error("Error fetching category requests:", error.message);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className="bg-[#FAF9F6] w-4/5 ml-6 mt-10">
      <div className="bg-[#F6EEEE] p-6 rounded-2xl border border-black shadow-sm">
        <h2 className="text-2xl font-bold text-[#4B2E2E] mb-6">Requested Categories</h2>

        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center text-[#4B2E2E] py-10">
            <FaRegSmileBeam className="text-4xl mb-3 text-[#E07385]" />
            <p className="text-lg font-semibold">No category requests at the moment!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {requests.map((req, index) => (
              <div
                key={index}
                className="bg-white border rounded-xl shadow-md p-5 transition-transform hover:scale-[1.02] hover:shadow-lg"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[#E07385] text-xl font-bold">#</span>
                  <button
                    className="bg-[#E07385] text-white font-semibold px-4 py-2 rounded-full text-sm"
                    disabled
                  >
                    {req.name}
                  </button>
                </div>

                <div className="flex items-center gap-2 text-gray-700 mt-2">
                  <FaChartBar className="text-[#de929f]" />
                  <span className="text-sm font-medium text-[#4B2E2E]">Number of Requests:</span>
                  <span className="text-black text-sm font-bold">{req.counter}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategory;
