import React from "react";
import { FaHeart, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

const ProductCard = ({ product, isFavorite, onToggleFavorite, onAddToCart }) => {
  return (
    <div className="bg-[#F6EEEE] rounded-lg shadow-lg p-3 w-60 flex flex-col justify-between group relative">
      <div className="relative group">
        <Link to={`/product/${product.id}`} state={{ product }}>
          <img
            src={product.image}
            alt={product.name}
            className="rounded-md w-full h-40 object-cover cursor-pointer"
          />
        </Link>
        <FaHeart
          onClick={() => onToggleFavorite?.(product)}
          className={`absolute top-2 left-2 text-3xl rounded-full p-1 cursor-pointer transition-colors ${
            isFavorite ? "text-red-600" : "text-[#921A40]"
          }`}
        />
        {product.inStock ? (
          <button
            onClick={() => onAddToCart?.(product)}
            className="absolute bottom-0 left-0 w-full bg-[#E07385] text-white text-sm font-bold py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            Add to cart
          </button>
        ) : (
          <div className="absolute bottom-0 left-0 w-full bg-gray-400 text-white text-sm font-bold py-2 text-center opacity-90">
            Sold Out
          </div>
        )}
      </div>

      
      <div className="flex justify-between items-center mt-2">
        <p className="text-gray-700 text-sm">{product.price} LE</p>
        <div className="flex items-center">
          <span className="text-sm font-bold">{product.rating}</span>
          <FaStar className="text-yellow-500 ml-1 text-sm" />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
