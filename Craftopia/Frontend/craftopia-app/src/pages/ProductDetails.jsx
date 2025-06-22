import React, { useState } from "react";
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
 console.log("Product data:", product);
    const [quantity, setQuantity] = useState(1);

    const handleIncrease = () => {
        setQuantity((prev) => prev + 1);
    };

    const handleDecrease = () => {
        setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    };

    if (!product) {
        return (
            <div className="text-center mt-20 text-2xl font-semibold text-red-500">
                Product not found
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
            <main className="flex-grow py-16 px-4 flex items-center justify-center">
                <div className="w-full max-w-6xl bg-white rounded-[2rem] shadow-2xl grid md:grid-cols-2 gap-10 p-10 border border-[#f4d5d5] transition-all duration-300">
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
                    <div className="flex flex-col justify-between">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
                            <h1 className="text-3xl font-extrabold text-[#921A40] tracking-wide leading-tight">
                                {product.name}
                            </h1>

                            <div>
                                <label className="block text-gray-700 font-semibold text-xs mb-1 tracking-wide">
                                    Quantity:
                                </label>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center bg-white border border-[#e07385] rounded-full shadow-md w-fit overflow-hidden">
                                        <button
                                            onClick={handleDecrease}
                                            className="bg-[#fff0f2] hover:bg-[#fcd3d3] text-[#921A40] text-base px-3 py-1.5 font-bold transition-all duration-200 rounded-l-full"
                                        >
                                            −
                                        </button>
                                        <span className="px-4 py-1.5 text-sm font-semibold text-[#444] bg-white">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={handleIncrease}
                                            className="bg-[#fff0f2] hover:bg-[#fcd3d3] text-[#921A40] text-base px-3 py-1.5 font-bold transition-all duration-200 rounded-r-full"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        (Available: <span className="font-semibold">{product.quantity}</span>)
                                    </span>
                                </div>
                            </div>

                        </div>

                        <p className="text-gray-700 text-base mb-6 leading-relaxed font-light">
                            {product.description}
                        </p>
                        <div className="flex flex-wrap gap-3 mb-6">
                            <span className="bg-[#FEE2E2] text-[#B91C1C] text-xs px-4 py-1 rounded-full font-medium shadow-sm">
                                {product.category}
                            </span>
                            <span className="bg-[#D1FAE5] text-[#065F46] text-xs px-4 py-1 rounded-full font-medium shadow-sm">
                                {product.inStock ? "In Stock" : "Sold Out"}
                            </span>
                        </div>


                        <ul className="space-y-4 text-sm text-gray-800">
                            <li className="flex items-center gap-2">
                                <FaTag className="text-black" />
                                <span>
                                    <strong>Category:</strong> {product.category}
                                </span>
                            </li>
                            <li className="flex items-center gap-2">
                                <FaUser className="text-black" />
                                <span>
                                    <strong>Artist:</strong> {product.artist}
                                </span>
                            </li>
                            <li className="flex items-center gap-2">
                                <FaRulerCombined className="text-black" />
                                <span>
                                    <strong>Dimensions:</strong> {product.dimensions}
                                </span>
                            </li>
                            <li className="flex items-center gap-2">
                                <FaShapes className="text-black" />
                                <span>
                                    <strong>Material:</strong> {product.material}
                                </span>
                            </li>
                             <li className="flex items-center gap-2">
                                <FaShapes className="text-black" />
                                <span>
                                    <strong>Avaible:</strong> {product.quantity}
                                </span>
                            </li>
                        </ul>

                        {/* Price, Rating, Add to Cart */}
                        <div className="mt-10">
                            <div className="flex items-center justify-between mb-5">
                                <p className="text-3xl font-bold text-[#E07385]">
                                    {product.price} LE
                                </p>
                                <div className="flex items-center text-sm">
                                    <span className="font-semibold text-gray-800">
                                        {product.rating}
                                    </span>
                                    <FaStar className="text-yellow-500 ml-1" />
                                </div>
                            </div>

                            <button
                                onClick={() => alert(`Added ${quantity} item(s) to cart!`)}
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
