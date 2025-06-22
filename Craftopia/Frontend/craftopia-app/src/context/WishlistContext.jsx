import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  const fetchWishlist = async () => {
    try {
      const res = await axios.get("http://localhost:3000/wishlist/mywishlist", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const items = res.data.wishlistItems.map((item) => item.product);
      setWishlist(items);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    }
  };

  const addToWishlist = async (product) => {
    try {
      await axios.post(`http://localhost:3000/wishlist/add/${product.id}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setWishlist((prev) => [...prev, product]);
    } catch (error) {
      if (error.response?.data?.message === "Product already in wishlist") {
        console.warn("Already in wishlist.");
      } else {
        console.error("Failed to add to wishlist:", error);
      }
    }
  };

  const removeFromWishlist = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/wishlist/remove/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setWishlist((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
