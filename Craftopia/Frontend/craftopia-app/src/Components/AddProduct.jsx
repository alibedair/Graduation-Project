import { useState } from "react";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryName: "",
    quantity: "",
  });
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length < 1) {
      setMessage("Please upload at least one image.");
      return;
    }
    if (images.length > 5) {
      setMessage("You can only upload up to 5 images.");
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) =>
      data.append(key, value)
    );
    images.forEach((image) => data.append("image", image));

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/product/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await res.json();
      if (!res.ok) {
        setMessage(result.message || "Failed to create product.");
      } else {
        setMessage("Product created successfully!");
        setFormData({
          name: "",
          description: "",
          price: "",
          categoryName: "",
          quantity: "",
        });
        setImages([]);
      }
    } catch (error) {
      setMessage("Server error, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 bg-cream">
      <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
      {message && (
        <p
          className={`mb-4 ${
            message.includes("success") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
     <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6 max-w-4xl">
  <div className="flex flex-col gap-4">
    <input
      name="name"
      value={formData.name}
      onChange={handleChange}
      placeholder="Product Name"
      required
      className="w-full p-2 border rounded h-12"
    />
    <textarea
      name="description"
      value={formData.description}
      onChange={handleChange}
      placeholder="Description"
      required
      className="w-full p-2 border rounded resize-none h-32"
    />
    <input
      name="price"
      value={formData.price}
      onChange={handleChange}
      type="number"
      min="0"
      step="0.01"
      placeholder="Price"
      required
      className="w-full p-2 border rounded h-12"
    />
  </div>
  <div className="flex flex-col gap-4">
    <input
      name="categoryName"
      value={formData.categoryName}
      onChange={handleChange}
      placeholder="Category Name"
      required
      className="w-full p-2 border rounded h-12"
    />
    <input
      name="quantity"
      value={formData.quantity}
      onChange={handleChange}
      type="number"
      min="0"
      placeholder="Quantity"
      required
      className="w-full p-2 border rounded h-12"
    />
    <div>
      <label
        htmlFor="file-upload"
        className="cursor-pointer inline-block bg-[#E07385] text-white py-2 px-4 rounded hover:bg-[#7a162e] transition"
      >
        Upload Images
      </label>
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => {
          const selectedFiles = Array.from(e.target.files).slice(0, 5);
          setImages(selectedFiles);
        }}
        className="hidden"
      />

      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {images.map((file, index) => (
            <div key={index} className="relative group">
              <img
                src={URL.createObjectURL(file)}
                alt={`preview-${index}`}
                className="w-full h-32 object-cover rounded border"
              />
              <button
                type="button"
                onClick={() =>
                  setImages((prev) => prev.filter((_, i) => i !== index))
                }
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition"
                title="Remove"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
  <div className="md:col-span-2">
    <button
      type="submit"
      disabled={loading}
      className="bg-[#E07385] text-white py-2 px-4 rounded hover:bg-[#7a162e] transition w-full md:w-auto"
    >
      {loading ? "Uploading..." : "Add Product"}
    </button>
  </div>
</form>
    </div>
  );
};

export default AddProduct;
