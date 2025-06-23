import { useState, useEffect, useRef } from "react";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import axios from "axios";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import ProductCard from "./ProductCard";

const AvaliableProducts = () => {
  const [products, setProducts] = useState([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollRef = useRef(null);

  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  useEffect(() => {
    axios
      .get("http://localhost:3000/product/get")
      .then((res) => {
        setProducts(res.data.products);
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

  const updateScrollButtons = () => {
    const container = scrollRef.current;
    if (!container) return;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  };

  const handleScroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;
    const cardWidth = container.firstChild?.offsetWidth || 270;
    const scrollAmount = cardWidth + 24;

    container.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });

    setTimeout(updateScrollButtons, 300);
  };

  useEffect(() => {
    updateScrollButtons();
    const container = scrollRef.current;
    container?.addEventListener("scroll", updateScrollButtons);
    return () => container?.removeEventListener("scroll", updateScrollButtons);
  }, [products]);

  return (
    <section className="bg-[#FAF9F6] py-12">
      <div className="max-w-7xl mx-auto px-4 relative">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Shop our Available Products
        </h2>

        <div className="relative">
        
          {canScrollLeft && (
            <button
              onClick={() => handleScroll("left")}
              className="absolute -left-6 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-200 shadow-md rounded-lg p-2 hover:bg-[#fbe9ed] transition"
            >
              <FiChevronLeft className="text-[#921A40] text-2xl" />
            </button>
          )}

          
          {canScrollRight && (
            <button
              onClick={() => handleScroll("right")}
              className="absolute -right-6 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-200 shadow-md rounded-lg p-2 hover:bg-[#fbe9ed] transition"
            >
              <FiChevronRight className="text-[#921A40] text-2xl" />
            </button>
          )}

          
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-4 pr-1 scrollbar-hide"
            style={{
              scrollBehavior: "smooth",
              paddingBottom: "1.5rem",
              marginBottom: "-1.5rem",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {products.map((product) => {
              const isFavorite = wishlist.some(item => item.id === product.productId);
              return (
                <div
                  key={product.productId}
                  className="w-[270px] flex-shrink-0"
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
        </div>
      </div>
    </section>
  );
};

export default AvaliableProducts;
