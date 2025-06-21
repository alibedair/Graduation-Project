import { useState } from "react";

const RequestCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:3000/category/createrequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: categoryName }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to request category");
      }

      setMessage({ type: "success", text: data.message });
      setCategoryName("");
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  };

  return (
    <div className="max-w-md">
      <h2 className="text-xl font-semibold mb-4 text-[#4B2E2E]">
        Request New Category
      </h2>

      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Enter category name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#E07385] transition"
          />

          <button
            type="submit"
            className="w-full bg-[#E07385] text-white font-medium py-2 rounded-md hover:bg-[#c15f70] transition"
          >
            Submit Request
          </button>

          {message && (
            <p
              className={`text-sm font-medium border-l-4 pl-3 py-2 rounded ${
                message.type === "success"
                  ? "text-green-700 bg-green-50 border-green-400"
                  : "text-[#E07385] bg-[#FFF3F4] border-[#E07385]"
              }`}
            >
              {message.text}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default RequestCategory;
