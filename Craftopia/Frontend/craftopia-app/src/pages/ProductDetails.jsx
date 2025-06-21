import React from "react";
import { useLocation } from "react-router-dom";
import {
  FaStar,
  FaUser,
  FaRulerCombined,
  FaShapes,
  FaTag,
  FaCartPlus,
} from "react-icons/fa";
import Footer from "../Components/Footer";

const ProductDetails = () => {
  const { state } = useLocation();
  const product = state?.product;

  if (!product) {
    return (
      <div className="text-center mt-20 text-2xl font-semibold text-red-500">
        Product not found
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      {/* Main Content */}
      <main className="flex-grow py-16 px-4 flex items-center justify-center">
        <div className="w-full max-w-6xl bg-white rounded-[2rem] shadow-2xl grid md:grid-cols-2 gap-10 p-10 border border-[#f4d5d5] transition-all duration-300">
          {/* Image Section */}
          <div className="relative w-full">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-[420px] object-cover rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300"
            />
            <span className="absolute top-4 right-4 bg-white/80 px-3 py-1 text-sm rounded-full font-medium shadow-md">
              {product.inStock ? "🟢 Available" : "🔴 Out of Stock"}
            </span>
          </div>

          {/* Info Section */}
          <div className="flex flex-col justify-between">
            {/* Title and Description */}
            <div>
              <h1 className="text-3xl font-extrabold text-[#921A40] tracking-wide mb-4 leading-tight">
                {product.name}
              </h1>
              <p className="text-gray-700 text-base mb-6 leading-relaxed font-light">
                {product.description}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="bg-[#FEE2E2] text-[#B91C1C] text-xs px-4 py-1 rounded-full font-medium shadow-sm">
                  {product.category}
                </span>
                <span className="bg-[#D1FAE5] text-[#065F46] text-xs px-4 py-1 rounded-full font-medium shadow-sm">
                  {product.inStock ? "In Stock" : "Sold Out"}
                </span>
              </div>

              {/* Details List */}
              <ul className="space-y-4 text-sm text-gray-800">
                <li className="flex items-center gap-2">
                  <FaTag className="text-black" />
                  <span><strong>Category:</strong> {product.category}</span>
                </li>
                <li className="flex items-center gap-2">
                  <FaUser className="text-black" />
                  <span><strong>Artist:</strong> {product.artist}</span>
                </li>
                <li className="flex items-center gap-2">
                  <FaRulerCombined className="text-black" />
                  <span><strong>Dimensions:</strong> {product.dimensions}</span>
                </li>
                <li className="flex items-center gap-2">
                  <FaShapes className="text-black" />
                  <span><strong>Material:</strong> {product.material}</span>
                </li>
              </ul>
            </div>

            {/* Price, Rating, Add to Cart */}
            <div className="mt-10">
              <div className="flex items-center justify-between mb-5">
                <p className="text-3xl font-bold text-[#E07385]">{product.price} LE</p>
                <div className="flex items-center text-sm">
                  <span className="font-semibold text-gray-800">{product.rating}</span>
                  <FaStar className="text-yellow-500 ml-1" />
                </div>
              </div>

              <button
                onClick={() => alert("Added to cart!")}
                className="w-full bg-[#e07385] hover:opacity-90 text-white font-semibold py-3 rounded-2xl shadow-lg flex items-center justify-center gap-3 text-lg transition-all duration-300"
              >
                <FaCartPlus /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProductDetails;
