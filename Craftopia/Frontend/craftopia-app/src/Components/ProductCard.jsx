import React from "react";
import { Heart, Star, Minus, Plus } from "lucide-react";

const ProductCard = ({
    product,
    isFavorite = false,
    isInCart = false,
    quantity = 0,
    onToggleFavorite,
    onAddToCart,
    onIncrement,
    onDecrement,
}) => {
    return (
        <div className="group relative bg-white shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-1 rounded-2xl w-full max-w-[420px] mx-auto">
            <div className="relative overflow-hidden rounded-t-2xl p-6 pb-0 bg-white-50">
                <div className="w-full h-64 overflow-hidden rounded-xl bg-white">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>

                {!product.inStock && (
                    <div className="absolute top-8 left-8 bg-gray-800 text-white text-xs font-semibold px-2 py-1 rounded shadow">
                        Sold Out
                    </div>
                )}

                <button
                    onClick={() => onToggleFavorite?.(product)}
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 shadow"
                >
                    <Heart
                        className={`h-4 w-4 transition-colors duration-200 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500"}`}
                    />
                </button>
            </div>

            <div className="p-5">
                <div className="mb-2">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {product.category}
                    </span>
                </div>
                <div className="mb-3">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#E07385] transition-colors duration-200 line-clamp-1">
                        {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        by <span className="font-medium">{product.artist}</span>
                    </p>
                </div>
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-[#E07385] text-[#E07385]" />
                        <span className="text-sm font-semibold text-gray-900">{product.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-gray-900">${product.price}</span>
                        {product.originalPrice && (
                            <span className="text-sm text-gray-400 line-through">
                                ${product.originalPrice}
                            </span>
                        )}
                    </div>

                    {product.inStock ? (
                        isInCart ? (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => onDecrement(product)}
                                    className="p-1 rounded-full border border-gray-300 hover:bg-gray-100"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="text-sm font-semibold">{quantity}</span>
                                <button
                                    onClick={() => onIncrement(product)}
                                    className="p-1 rounded-full border border-gray-300 hover:bg-gray-100"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => onAddToCart?.(product)}
                                className="text-sm font-medium rounded-full px-4 py-1 transition text-white"
                                style={{ backgroundColor: "#E07385" }}
                            >
                                Add to Cart
                            </button>
                        )
                    ) : (
                        <div className="text-sm bg-gray-300 text-gray-500 px-4 py-1 rounded-full cursor-not-allowed">
                            Sold Out
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
