// src/Components/AddCategory.jsx
import { useState } from "react";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddCategory = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setMessage("Category name is required.");
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
    } catch (error) {
      setMessage("Server error, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 bg-[#F6EEEE]">
      <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
      {message && (
        <p className={`mb-4 ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}
      <form onSubmit={handleAddCategory} className="space-y-4 max-w-md">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category Name"
          required
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-[#E07385] text-white py-2 px-4 rounded hover:bg-[#7a162e] transition"
        >
          {loading ? "Adding..." : "Add Category"}
        </button>
      </form>
    </div>
  );
};

export default AddCategory;
