import { useState, useEffect } from "react";
import { FaStar, FaHeart } from "react-icons/fa";
import { FiChevronRight } from "react-icons/fi";
import axios from "axios";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

const PopularProducts = () => {
  const [products, setProducts] = useState([]);
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();


  useEffect(() => {
    axios
      .get("https://fakestoreapi.com/products?limit=5")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  const toggleWishlist = (product) => {
    if (wishlist.find((item) => item.id === product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="p-6 bg-[#FAF9F6] pl-30">
      <h2 className="text-xl font-bold mb-4">Shop our most popular Products</h2>
      <div className="flex items-center space-x-4">
        <div className="flex space-x-4 overflow-x-auto">
          {products.map((product) => {
            const isWishlisted = wishlist.find((item) => item.id === product.id);
            return (
              <div
                key={product.id}
                className="bg-[#F6EEEE] rounded-lg shadow-lg p-3 w-60 flex flex-col justify-between"
              >
                <div className="relative group">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="rounded-md w-full h-40 object-cover"
                  />
                  <FaHeart
                    onClick={() => toggleWishlist(product)}
                    className={`absolute top-2 left-2 text-3xl rounded-full p-1 cursor-pointer transition-colors ${isWishlisted ? "text-red-600" : "text-[#921A40]"
                      }`}
                  />
                  <button
                    onClick={() =>
                      addToCart({
                        id: product.id,
                        name: product.title,
                        price: product.price,
                        image: product.image,
                        category: product.category,
                      })
                    }

                    className="absolute bottom-0 left-0 w-full bg-[#E07385] text-white text-sm font-bold py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    Add to cart
                  </button>
                </div>

                <h3 className="font-bold mt-2 text-sm h-8 truncate">{product.title}</h3>
                <div className="flex justify-between items-center">
                  <p className="text-gray-700 text-sm">{product.price} LE</p>
                  <div className="flex items-center">
                    <span className="text-sm font-bold">{(Math.random() * (5 - 4) + 4).toFixed(1)}</span>
                    <FaStar className="text-yellow-500 ml-1 text-sm" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <button className="border-2 border-[#E07385] p-3 rounded-lg">
          <FiChevronRight className="text-[#921A40] text-xl" />
        </button>
      </div>
    </div>
  );
};

export default PopularProducts;
