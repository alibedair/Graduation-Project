import { useEffect, useRef, useState } from "react";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import axios from "axios";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

const BestSellingProducts = () => {
  const [products, setProducts] = useState([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollRef = useRef(null);

  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { cartItems, addToCart, incrementQuantity, decrementQuantity } = useCart();

  useEffect(() => {
    axios
      .get("http://localhost:3000/product/get", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        const products = res.data.products || [];
        const formatted = products.map((p) => ({
          id: p.productId,
          name: p.name,
          price: p.price,
          image: p.image?.[0],
          category: p.category?.name || "Uncategorized",
          artist: p.artist?.name || "Unknown",
          rating: (Math.random() * (5 - 4) + 4).toFixed(1),
          reviews: Math.floor(Math.random() * 50 + 5),
          inStock: p.quantity > 0,
        }));
        setProducts(formatted);
      })
      .catch((err) => console.error("Failed to fetch products:", err));
  }, []);

  const toggleWishlist = (product) => {
    const exists = wishlist.find((item) => item.id === product.id);
    exists ? removeFromWishlist(product.id) : addToWishlist(product);
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
    container.scrollBy({
      left: direction === "right" ? cardWidth + 24 : -cardWidth - 24,
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
    <section className="py-20 bg-cream overflow-hidden">
      <div className="container mx-auto px-4 relative">
        {/* Animated Header like other sections */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-black/90 mb-4">
            Best Selling Products
          </h2>
          <p className="text-xl text-burgundy/80 max-w-2xl mx-auto">
            Our customers' favorites – handcrafted and high in demand
          </p>
        </motion.div>

        {/* Scroll Arrows */}
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

        {/* Product Scroll Container */}
        <motion.div
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto px-5 py-5 scrollbar-hide snap-x snap-mandatory"
          style={{
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {products.map((product, index) => {
            const isFavorite = wishlist.some((item) => item.id === product.id);
            const inCart = cartItems.find((item) => item.id === product.id);
            const quantity = inCart?.quantity || 0;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                viewport={{ once: true }}
                className="group cursor-pointer snap-center min-w-[270px] max-w-[270px] flex-shrink-0"
              >
                <ProductCard
                  product={product}
                  isFavorite={isFavorite}
                  onToggleFavorite={() => toggleWishlist(product)}
                  isInCart={!!inCart}
                  quantity={quantity}
                  onAddToCart={() => addToCart(product)}
                  onIncrement={() => incrementQuantity(product.id)}
                  onDecrement={() => decrementQuantity(product.id)}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default BestSellingProducts;
