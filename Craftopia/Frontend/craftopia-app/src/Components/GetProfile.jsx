import { useState, useEffect } from "react";

const GetProfile = ({ setActiveTab }) => {
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState("");
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState("");
  const [activeSection, setActiveSection] = useState("gallery");

  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const response = await fetch("http://localhost:3000/artist/myprofile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch profile");

      const data = await response.json();
      setProfile(data.ArtistProfile);
    } catch (err) {
      console.error(err);
      setMessage("Please complete your profile.");
    }
  };

  fetchProfile();
}, []);
  useEffect(() => {
    if (!profile) return;

    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const response = await fetch("http://localhost:3000/product/get", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();
        setProducts(data.products || []);
        setProductsError("");
      } catch (err) {
        setProductsError("Failed to load gallery products.");
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [profile]);

  if (message) {
    return (
      <div className="text-red-600">
        <p>{message}</p>
        <button
          onClick={() => setActiveTab("edit")}
          className="mt-4 px-4 py-2 bg-[#E07385] text-white rounded hover:bg-[#921A40] transition"
        >
          Complete Your Profile
        </button>
      </div>
    );
  }

  if (!profile) return <p className="text-gray-600">Loading profile...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6 mb-6 items-start">
        <div className="flex-1">
          <div className="flex items-start gap-4 mb-4">
            <img
              src={profile.profilePicture || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-[#E07385] shadow-md"
            />
            <div className="mt-3">
              <h1 className="text-2xl font-semibold text-gray-900">{profile.name || "Artist Name"}</h1>
              <p className="text-base text-[#921A40]">@{profile.username || "username"}</p>
              <p className="text-sm text-gray-500 mt-1">{profile.visitors || 0} visitors during this week</p>
            </div>
          </div>

          <p className="text-black bg-[#F6EEEE] p-6 rounded-lg shadow-md text-xl leading-relaxed mt-10">
            {profile.biography ||
              "Add your biography here. This is a placeholder text to give you an idea of how the biography section will look."}
          </p>
        </div>
        {profile.profileVideo && (
          <div className="w-full md:w-1/3 p-2">
            <video
              src={profile.profileVideo}
              controls
              className="w-full h-64 md:h-80 rounded-xl shadow-lg border-4 border-[#E07385] hover:scale-105 transition-transform duration-300 ease-in-out"
            />
          </div>
        )}
      </div>

      <div className="mt-15">
        <div className="flex justify-start gap-30 mb-8 mr-50">
          <button
            onClick={() => setActiveSection("gallery")}
            className={`px-6 py-2 rounded-full font-semibold transition duration-200 ${activeSection === "gallery"
              ? "bg-[#E07385] text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            Gallery Products
          </button>
          <button
            onClick={() => setActiveSection("auction")}
            className={`px-6 py-2 rounded-full font-semibold transition duration-200 ${activeSection === "auction"
              ? "bg-[#E07385] text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            Auction Products
          </button>
        </div>

        {activeSection === "gallery" && (
          <div>
            {loadingProducts && <p className="text-center py-8">Loading products...</p>}
            {productsError && <p className="text-red-500 text-center py-4">{productsError}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.length === 0 && !loadingProducts && (
                <p className="col-span-full  text-gray-500 py-8">
                  No products found in your gallery.
                </p>
              )}
              {products.map((product) => (
                <div
                  key={product.productId}
                  className="relative group overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative overflow-hidden h-48 sm:h-56 md:h-60 lg:h-64 rounded-t-xl bg-white flex items-center justify-center">
                    <img
                      src={product.image?.[0] || "https://via.placeholder.com/300"}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain transition-all duration-500 group-hover:scale-105 group-hover:opacity-75"
                    />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-xl font-bold text-[#921A40]">{product.name}</h3>
                      <div className="mt-2 text-white/90 text-sm">
                        <p className="line-clamp-2">{product.description}</p>
                        <div className="flex justify-between mt-2">
                          <span className="font-medium">Qty: {product.quantity}</span>
                          {product.dimensions && (
                            <span>{product.dimensions}</span>
                          )}
                        </div>
                        {product.material && (
                          <p className="mt-1"><span className="font-medium">Material:</span> {product.material}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "auction" && (
          <div>
            {loadingProducts && <p className="text-center py-8">Loading auction products...</p>}
            {productsError && <p className="text-red-500 text-center py-4">{productsError}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.length === 0 && !loadingProducts && (
                <p className="col-span-full text-gray-500 py-8">
                  No auction products found.
                </p>
              )}
              {products.map((product) => (
                <div
                  key={product._id || product.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={product.image || "https://via.placeholder.com/500"}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 bg-[#E07385]/90 text-white text-xs font-bold px-2 py-1 rounded-full">
                      AUCTION
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GetProfile;