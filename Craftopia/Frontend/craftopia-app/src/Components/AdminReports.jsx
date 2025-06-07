import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/comments?_page=1&_limit=10`);
      const data = await response.json();

      const formattedReports = data.map((item) => ({
        id: item.id,
        title: `Report #${item.id}`,
        description: item.body,
        customerName: item.name,
      }));

      setReports(formattedReports);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="p-6 w-4/5 min-h-screen flex flex-col bg-[#FAF9F6]">
      <h2 className="text-xl font-semibold sticky top-0 bg-[#FAF9F6] z-10 p-4 border-b border-gray-300">
        Customer Reports
      </h2>

      <div className="flex-1 overflow-y-auto scrollbar-hide pr-2 pl-3">
        <div className="grid grid-cols-1 gap-5 mt-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white border rounded-xl p-5 shadow-md hover:shadow-lg"
            >
              <h3 className="text-lg font-bold text-[#4B2E2E]">{report.title}</h3>
              <p className="text-m text-gray-900 mt-2 leading-relaxed">{report.description}</p>
              <div className="flex items-center text-xs text-gray-700 mt-4 gap-1">
                <FaUserCircle className="text-[#8A6F6D]" />
                <span>Reported by: {report.customerName}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="h-12" />
        {loading && <p className="text-center text-gray-500 mt-4">Loading reports...</p>}
      </div>
    </div>
  );
};

export default AdminReports;
