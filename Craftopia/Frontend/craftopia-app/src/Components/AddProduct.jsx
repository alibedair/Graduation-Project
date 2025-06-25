import { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import AllProducts from "../Components/AllProducts";
import { motion, AnimatePresence } from "framer-motion";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryName: "",
    quantity: "",
    material: "",
    dimension: "",
    images: [],
  });

  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categoriesError, setCategoriesError] = useState(null);
  const [showAllProducts, setShowAllProducts] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    // Merge standard + other attributes
    const otherObject = otherAttributes.reduce((acc, attr) => {
      if (attr.name && attr.values) {
        acc[attr.name] = attr.values.split(",").map((v) => v.trim());
      }
      return acc;
    }, {});

    const filteredCustom = Object.fromEntries(
      Object.entries(customAttributes).filter(([key]) =>
        selectedAttributes.includes(key)
      )
    );

    const finalCustomAttributes = {
      ...filteredCustom,
      ...otherObject,
    };

    data.append("isCustomizable", isCustomizable);
    data.append("customAttributes", JSON.stringify(finalCustomAttributes));

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
          material: "",
          dimension: "",
        });
        setImages([]);
      }
    } catch (error) {
      setMessage("Server error, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      setCategoriesError(null);
      try {
        const response = await fetch("http://localhost:3000/category/all");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch categories.");
        }
        const data = await response.json();
        setCategoriesList(data.categories || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategoriesError(err.message || "Failed to load categories.");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);
  const [isCustomizable, setIsCustomizable] = useState(false);
  const [customAttributes, setCustomAttributes] = useState({
    color: [],
    material: [],
    size: [],
    engraving: [],
  });
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [otherAttributes, setOtherAttributes] = useState([]);
const [otherInput, setOtherInput] = useState({});


  const [customInput, setCustomInput] = useState({
    color: "",
    material: "",
    size: "",
  });

  const addCustomValue = (key) => {
    if (customInput[key] && !customAttributes[key].includes(customInput[key])) {
      setCustomAttributes((prev) => ({
        ...prev,
        [key]: [...prev[key], customInput[key]],
      }));
      setCustomInput((prev) => ({ ...prev, [key]: "" }));
    }
  };


  return (
    <div className="p-2 sm:p-6 md:p-10 bg-cream min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-[black]">
          {showAllProducts ? "My Products" : "Add New Product"}
        </h2>
        <button
          onClick={() => setShowAllProducts(!showAllProducts)}
          className="bg-[#7a162e] text-white py-2 px-6 rounded-lg font-medium hover:bg-[#E07385] transition"
        >
          {showAllProducts ? "Add New Product" : "My Products"}
        </button>
      </div>

      {showAllProducts ? (
        <AllProducts />
      ) : (
        <>
          {message && (
            <p
              className={`mb-6 text-center text-lg font-semibold ${message.includes("success") ? "text-green-600" : "text-red-600"
                }`}
            >
              {message}
            </p>
          )}
          <form
            onSubmit={handleSubmit}
            className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-[#f9d2d9]"
          >
            <div className="flex flex-col gap-6">
              <div>
                <label className="block font-semibold text-sm text-[#7a162e] mb-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                  className="w-full px-4 py-3 border border-[#f3c7ce] rounded-lg text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E07385]"
                />
              </div>
              <div>
                <label className="block font-semibold text-sm text-[#7a162e] mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter product description"
                  required
                  className="w-full px-4 py-3 border border-[#f3c7ce] rounded-lg text-gray-700 placeholder-gray-400 shadow-sm resize-none h-32 focus:outline-none focus:ring-2 focus:ring-[#E07385]"
                />
              </div>
              <div>
                <label className="block font-semibold text-sm text-[#7a162e] mb-2">
                  Price <span className="text-red-500">*</span>
                </label>
                <input
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Enter product price"
                  required
                  className="w-full px-4 py-3 border border-[#f3c7ce] rounded-lg text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E07385]"
                />
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div>
                <label className="block font-semibold text-sm text-[#7a162e] mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="categoryName"
                    value={formData.categoryName}
                    onChange={handleChange}
                    required
                    className={`appearance-none w-full px-4 py-3 border border-[#f3c7ce] rounded-lg bg-white placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E07385] 
      ${formData.categoryName === "" ? "text-gray-400" : "text-gray-700"}`}
                  >
                    <option value="" disabled>
                      {loadingCategories
                        ? "Loading categories..."
                        : categoriesError
                          ? "Failed to load categories"
                          : "Select a category"}
                    </option>
                    {!loadingCategories &&
                      !categoriesError &&
                      categoriesList.map((cat) => (
                        <option key={cat._id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                  </select>

                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#7a162e]">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.08 1.04l-4.25 4.65a.75.75 0 01-1.08 0l-4.25-4.65a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>

                {categoriesError && (
                  <p className="text-sm text-red-500 mt-1">{categoriesError}</p>
                )}
              </div>
              <div>
                <label className="block font-semibold text-sm text-[#7a162e] mb-2">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  type="number"
                  min="0"
                  placeholder="Enter quantity"
                  required
                  className="w-full px-4 py-3 border border-[#f3c7ce] rounded-lg text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E07385]"
                />
              </div>
              <div>
                <label className="block font-semibold text-sm text-[#7a162e] mb-2">
                  Material <span className="text-red-500">*</span>
                </label>
                <input
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                  placeholder="Enter material"
                  required
                  className="w-full px-4 py-3 border border-[#f3c7ce] rounded-lg text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E07385]"
                />
              </div>
              <div>
                <label className="block font-semibold text-sm text-[#7a162e] mb-2">
                  Dimensions <span className="text-red-500">*</span>
                </label>
                <input
                  name="dimension"
                  value={formData.dimension}
                  onChange={handleChange}
                  placeholder="eg. 10 x 10 x 10 inches"
                  required
                  className="w-full px-4 py-3 border border-[#f3c7ce] rounded-lg text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E07385]"
                />
              </div>
            </div>
            <div className="md:col-span-2 flex flex-col gap-4">
              <label className="font-semibold text-sm text-[#7a162e]">
                Upload Product Images <span className="text-red-500">*</span>
              </label>

              <div className="relative border-4 border-dashed border-[#E07385] rounded-xl p-6 text-center bg-[#fff0f3] hover:bg-[#ffe6eb] transition cursor-pointer">
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const selectedFiles = Array.from(e.target.files).slice(0, 5);
                    setImages(selectedFiles);
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="relative z-0 flex flex-col items-center justify-center pointer-events-none">
                  <Upload className="h-8 w-8 text-burgundy/60 mb-2" />
                  <p className="text-[#7a162e] font-medium">
                    Click or drag to upload images
                  </p>
                  <p className="text-sm text-gray-500">Up to 5 images</p>
                </div>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                  {images.map((file, index) => (
                    <div
                      key={index}
                      className="relative group overflow-hidden rounded-xl shadow-md border-2 border-[#E07385] bg-white hover:scale-105 transition transform"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`preview-${index}`}
                        className="w-full h-32 object-contain"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setImages((prev) => prev.filter((_, i) => i !== index))
                        }
                        className="absolute top-2 right-2 bg-white text-[#E07385] border border-[#E07385] rounded-full px-2 py-0.5 text-xs font-bold hover:bg-[#E07385] hover:text-white transition"
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="md:col-span-2 mt-4">
  <div className="flex items-center justify-start gap-3 mb-5">
    <label className="text-[#7a162e] font-semibold">Allow Personalization</label>
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={isCustomizable}
        onChange={(e) => {
          setIsCustomizable(e.target.checked);
          if (!e.target.checked) {
            setSelectedAttributes([]);
            setCustomAttributes({ color: [], material: [], size: [], engraving: [] });
          }
        }}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#E07385] rounded-full peer dark:bg-gray-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#E07385] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E07385]"></div>
    </label>
  </div>

  <AnimatePresence>
    {isCustomizable && (
      <motion.div
        key="personalization"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="bg-[#fff6f7] border border-[#fbd5db] p-6 rounded-xl shadow-inner space-y-6"
      >
        <h3 className="text-xl font-semibold text-[#7a162e] mb-6">
          Select Personalization Options
        </h3>

        <div className="flex flex-wrap gap-4 sm:gap-6">
          {["color", "material", "size", "engraving", "other"].map((attr) => (
            <label
              key={attr}
              className={`cursor-pointer border rounded-full px-6 py-1 text-sm font-medium transition-all ${
                selectedAttributes.includes(attr)
                  ? "bg-[#E07385] text-white border-[#E07385]"
                  : "bg-white border-[#f3c7ce] text-[#7a162e] hover:bg-[#ffe6eb]"
              }`}
            >
              <input
                type="checkbox"
                className="hidden"
                checked={selectedAttributes.includes(attr)}
                onChange={(e) => {
                  const newSelected = e.target.checked
                    ? [...selectedAttributes, attr]
                    : selectedAttributes.filter((a) => a !== attr);

                  setSelectedAttributes(newSelected);
                  if (attr === "other" && !e.target.checked) setOtherAttributes([]);
                }}
              />
              {attr === "other"
                ? "Other"
                : attr.charAt(0).toUpperCase() + attr.slice(1)}
            </label>
          ))}
        </div>

        {/* Main personalization input loop */}
        <div className="space-y-6">
          {selectedAttributes
            .filter((attr) => attr !== "other")
            .map((attr) => (
              <motion.div
                key={attr}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <label className="block font-semibold text-sm text-[#7a162e] mb-2">
                  {attr.charAt(0).toUpperCase() + attr.slice(1)} Options
                </label>

                <div className="flex flex-wrap gap-2 mb-2">
                  {customAttributes[attr]?.map((value, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-2 bg-[#E07385] text-white px-3 py-1 rounded-full text-sm"
                    >
                      {value}
                      <button
                        type="button"
                        onClick={() =>
                          setCustomAttributes((prev) => ({
                            ...prev,
                            [attr]: prev[attr].filter((_, i) => i !== index),
                          }))
                        }
                        className="hover:text-gray-200"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>

                <div className="grid sm:grid-cols-[1fr_auto] gap-2">
                  <input
                    type="text"
                    value={customInput[attr] || ""}
                    onChange={(e) =>
                      setCustomInput((prev) => ({
                        ...prev,
                        [attr]: e.target.value,
                      }))
                    }
                    placeholder={`Add new ${attr}`}
                    className="px-4 py-2 border border-[#f3c7ce] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E07385] bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => addCustomValue(attr)}
                    className="bg-[#E07385] text-white px-4 py-2 rounded-lg hover:bg-[#7a162e] transition text-sm"
                  >
                    Add
                  </button>
                </div>
              </motion.div>
            ))}
        </div>
        {selectedAttributes.includes("other") && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <label className="block font-semibold text-sm text-[#7a162e] mb-1">
              Other Options
            </label>

            {otherAttributes.map((attr, index) => (
              <div
                key={index}
                className="space-y-2 border border-[#f9d2d9] p-4 rounded-lg bg-white"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                  <input
                    type="text"
                    placeholder="Attribute name"
                    value={attr.name}
                    onChange={(e) => {
                      const updated = [...otherAttributes];
                      updated[index].name = e.target.value;
                      setOtherAttributes(updated);
                    }}
                    className="flex-grow px-4 py-2 border border-[#f3c7ce] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E07385] bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...otherAttributes];
                      updated.splice(index, 1);
                      setOtherAttributes(updated);
                    }}
                    className="text-sm text-red-600 hover:underline mt-2 sm:mt-0"
                  >
                    Remove
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {attr.values.map((val, valIdx) => (
                    <span
                      key={valIdx}
                      className="flex items-center gap-2 bg-[#E07385] text-white px-3 py-1 rounded-full text-sm"
                    >
                      {val}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...otherAttributes];
                          updated[index].values = updated[index].values.filter(
                            (_, i) => i !== valIdx
                          );
                          setOtherAttributes(updated);
                        }}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>

                <div className="grid sm:grid-cols-[1fr_auto] gap-2">
                  <input
                    type="text"
                    placeholder="Add value"
                    value={otherInput[index] || ""}
                    onChange={(e) =>
                      setOtherInput({ ...otherInput, [index]: e.target.value })
                    }
                    className="px-4 py-2 border border-[#f3c7ce] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E07385] bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const val = (otherInput[index] || "").trim();
                      if (val) {
                        const updated = [...otherAttributes];
                        if (!updated[index].values.includes(val)) {
                          updated[index].values.push(val);
                          setOtherAttributes(updated);
                        }
                        setOtherInput({ ...otherInput, [index]: "" });
                      }
                    }}
                    className="bg-[#E07385] text-white px-4 py-2 rounded-lg hover:bg-[#7a162e] transition text-sm"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                setOtherAttributes([...otherAttributes, { name: "", values: [] }])
              }
              className="text-sm text-[#E07385] hover:underline"
            >
              + Add another custom attribute
            </button>
          </motion.div>
        )}
      </motion.div>
    )}
  </AnimatePresence>
</div>

            </div>
            <div className="md:col-span-2  mt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#E07385] text-white py-3 px-8 rounded-lg font-semibold hover:bg-[#7a162e] transition"
              >
                {loading ? "Uploading..." : "Add Product"}
              </button>
            </div>
          </form>
        </>
      )}
    </div>

  );
};

export default AddProduct;
