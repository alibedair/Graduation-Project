import { useState } from "react";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddCategory = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setMessage("Category name is required!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/category/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const result = await res.json();
      if (!res.ok) {
        setMessage(result.message || "Failed to add category.");
      } else {
        setMessage("Category added successfully!");
        setName("");
      }
    } catch {
      setMessage("Server error, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 mt-30 flex items-center justify-center mr-50">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg border border-[#e4cfcf]">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New Category</h2>

        {message && (
          <div
            className={`mb-4 px-4 py-3 rounded text-sm transition-all duration-300 ${
              message.includes("success")
                ? "bg-[#f8fff8] text-green-700 border border-green-300"
                : "bg-[#fff7f7] text-red-700 border border-red-300"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleAddCategory} className="space-y-5">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-3">
              Category Name
            </label>
            <input
              id="category"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Pottery"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E07385]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white font-medium rounded-lg transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#E07385] hover:bg-[#c85c6f] shadow-md"
            }`}
          >
            {loading ? "Adding..." : "Add Category"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
