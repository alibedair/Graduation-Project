import { useState, useEffect } from "react";
import { FiChevronRight } from "react-icons/fi";
import axios from "axios";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import ProductCard from "./ProductCard";

const AvaliableProducts = () => {
  const [products, setProducts] = useState([]);
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  useEffect(() => {
    axios
      .get("http://localhost:3000/product/get")
      .then((res) => {
        setProducts(res.data.products.slice(0, 5));
      })
      .catch((err) => console.error(err));
  }, []);

  const toggleWishlist = (product) => {
    const isWishlisted = wishlist.find(item => item.id === product.productId);
    if (isWishlisted) {
      removeFromWishlist(product.productId);
    } else {
      addToWishlist({
        id: product.productId,
        name: product.name,
        price: product.price,
        image: product.image[0],
        category: product.category?.name || "Uncategorized",
      });
    }
  };

  return (
    <div className="p-6 bg-[#FAF9F6] pl-30">
      <h2 className="text-xl font-bold mb-4">Shop our Available Products</h2>
      <div className="flex items-center space-x-4">
      
        <div className="flex gap-6 overflow-x-auto pr-4 overflow-visible">
          {products.map((product) => {
            const isFavorite = wishlist.some(item => item.id === product.productId);

            return (
              <div
                key={product.productId}
                className="w-[320px] flex-shrink-0 pt-2 pb-2"
              >
                <ProductCard
                  product={{
                    id: product.productId,
                    name: product.name,
                    price: product.price,
                    image: product.image[0],
                    rating: (Math.random() * (5 - 4) + 4).toFixed(1),
                    description: product.description,
                    dimensions: product.dimensions,
                    material: product.material,
                    category: product.category?.name || "Uncategorized",
                    artist: product.artist?.name || "Unknown Artist",
                    inStock: product.quantity > 0,
                  }}
                  isFavorite={isFavorite}
                  onToggleFavorite={() => toggleWishlist(product)}
                  onAddToCart={() =>
                    addToCart({
                      id: product.productId,
                      name: product.name,
                      price: product.price,
                      image: product.image[0],
                      category: product.category?.name || "Uncategorized",
                    })
                  }
                />
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

export default AvaliableProducts;
