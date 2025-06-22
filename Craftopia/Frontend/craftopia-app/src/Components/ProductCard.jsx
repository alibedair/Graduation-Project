import { Heart, Star, Minus, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 rounded-md w-full max-w-[380px] mx-auto text-[15px] cursor-pointer"
    >
      {/* Rest of the card content */}
      <div className="relative overflow-hidden rounded-t-md bg-white">
        <div className="w-full h-60 overflow-hidden rounded-t-md">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        {!product.inStock && (
          <div className="absolute top-4 left-4 bg-gray-800 text-white text-xs font-semibold px-2 py-1 rounded shadow">
            Sold Out
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(product);
          }}
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow"
        >
          <Heart
            className={`h-4 w-4 transition-colors duration-200 ${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500"
            }`}
          />
        </button>
      </div>
      <div className="p-4">
        <span className="text-xs text-gray-500 uppercase tracking-wider block mb-1">
          {product.category}
        </span>
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-semibold text-base text-gray-900 truncate max-w-[60%]">{product.name}</h3>
          <span className="text-sm text-gray-500 truncate max-w-[40%] text-right">by {product.artist}</span>
        </div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-[#E07385] text-[#E07385]" />
            <span className="text-sm font-medium">{product.rating}</span>
          </div>
          <span className="text-xs text-gray-500">({product.reviews} reviews)</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">{product.price} LE</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">{product.originalPrice} LE</span>
            )}
          </div>
          {product.inStock ? (
            isInCart ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onDecrement?.(product)}
                  className="p-1.5 rounded-full border border-gray-300 hover:bg-gray-100"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-semibold">{quantity}</span>
                <button
                  onClick={() => onIncrement?.(product)}
                  className="p-1.5 rounded-full border border-gray-300 hover:bg-gray-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onAddToCart?.(product)}
                className="text-sm font-medium rounded-full px-4 py-1 text-white bg-[#E07385] hover:bg-[#d45a6f] transition"
              >
                Add to Cart
              </button>
            )
          ) : (
            <div className="text-sm bg-gray-300 text-gray-500 px-3 py-1 rounded-full">
              Sold Out
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
