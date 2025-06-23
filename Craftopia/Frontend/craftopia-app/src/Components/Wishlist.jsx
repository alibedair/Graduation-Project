import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { Heart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-[black] mb-6">Your Wishlist</h2>

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center bg-[#F6EEEE] text-[#921A40] p-12 rounded-3xl shadow-2xl border border-pink-100">
          <div className="text-7xl mb-4 animate-bounce">💔</div>
          <h3 className="text-3xl font-extrabold mb-3 tracking-tight">
            Your Wishlist is Empty
          </h3>
          <p className="text-gray-600 max-w-md mb-8 leading-relaxed">
            You haven’t added any items yet. Start exploring our beautiful collection and add what you love.
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="bg-[#E07385] hover:bg-[#d85c6f] text-white font-semibold py-3 px-8 rounded-full transition duration-300 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => {
            const mainImage = Array.isArray(product.image)
              ? product.image[0]
              : product.image || "/placeholder.jpg";

            const handleCardClick = () => {
              navigate(`/product/${product.id}`, { state: { product } });
            };

            return (
              <div
                key={product.id}
                onClick={handleCardClick}
                className="group relative bg-white shadow-md hover:shadow-lg transition-all duration-500 hover:-translate-y-1 rounded-2xl cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-t-2xl bg-white">
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-t-2xl">
                    <img
                      src={mainImage}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {!product.inStock && (
                    <div className="absolute top-6 left-6 bg-gray-800 text-white text-xs font-semibold px-2 py-1 rounded shadow">
                      Sold Out
                    </div>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromWishlist(product.id);
                    }}
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2.5 opacity-100 hover:bg-white hover:scale-110 shadow"
                    aria-label="Remove from wishlist"
                  >
                    <Heart className="h-4 w-4 fill-[#E07385] text-[#E07385]" />
                  </button>
                </div>

                <div className="pt-2 pb-5 px-4">
                  <div className="mb-1">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {product.category?.name || "Handmade"}
                    </span>
                  </div>
                  <div className="mb-3">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#E07385] transition-colors duration-200 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      by{" "}
                      <span className="font-medium">
                        {product.artist?.name || "Unknown"}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-[#E07385] text-[#E07385]" />
                      <span className="text-sm font-semibold text-gray-900">
                        {Number(product.averageRating || 0).toFixed(1)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      ({product.totalReviews || 0} reviews)
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-gray-900">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>

                    {product.inStock ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        className="text-sm font-medium rounded-full px-4 py-1 transition text-white"
                        style={{ backgroundColor: "#E07385" }}
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <div className="text-sm bg-gray-300 text-gray-500 px-4 py-1 rounded-full cursor-not-allowed">
                        Sold Out
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
