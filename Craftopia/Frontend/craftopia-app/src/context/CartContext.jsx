import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const interval = setInterval(() => {
      const newToken = localStorage.getItem("token");
      if (newToken !== token) {
        setToken(newToken);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchCart(token);
    } else {
      setCartItems([]);
    }
  }, [token]);

  const getAuthHeader = () => {
    if (!token) {
      console.error("No token found.");
      return null;
    }
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchCart = async (authToken) => {
    try {
      const res = await axios.get("http://localhost:3000/mycart", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const items = res.data.cartItems.map((item) => {
        const product = item.product;
        return {
          id: product.productId,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category?.name || "Unknown",
          artist: product.artist?.name || "Unknown",
          description: product.description,
          dimensions: product.dimensions,
          material: product.material,
          cartQuantity: item.quantity,
          stockQuantity: product.quantity,
          inStock: product.quantity > 0,
          averageRating: product.averageRating || 0,
          totalReviews: product.totalReviews || 0,
        };
      });

      setCartItems(items);
      console.log("Fetched cart items:", res.data.cartItems);

    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };

 const addToCart = async (product, navigate) => {
  const token = localStorage.getItem("token");

  if (!token) {
    if (navigate) navigate("/login", { replace: true });
    return;
  }

  const existing = cartItems.find((item) => item.id === product.id);
  const currentCartQty = existing?.cartQuantity || 0;
  const maxQty = existing?.stockQuantity || product.quantity;

  if (currentCartQty >= maxQty) {
    console.warn("Cannot add more, exceeds stock");
    return;
  }

  try {
    const res = await axios.post(`http://localhost:3000/mycart/add/${product.id}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("After add API response:", res.data);

    if (existing) {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === product.id
            ? { ...item, cartQuantity: item.cartQuantity + 1 }
            : item
        )
      );
    } else {
      setCartItems((prev) => [
        ...prev,
        {
          ...product,
          cartQuantity: 1,
          stockQuantity: product.quantity,
        },
      ]);
    }
  } catch (err) {
    console.error("Add to cart failed:", err);
  }
};


 const incrementQuantity = async (product) => {
  const id = product.id;
  const authHeader = getAuthHeader();
  if (!authHeader) return;

  const item = cartItems.find((item) => item.id === id);
  if (!item) return;

  if (item.cartQuantity >= item.stockQuantity) {
    console.warn("Cannot add more, stock limit reached");
    return;
  }

  try {
    await axios.post(`http://localhost:3000/mycart/add/${id}`, {}, authHeader);
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, cartQuantity: item.cartQuantity + 1 }
          : item
      )
    );
  } catch (err) {
    console.error("Increment failed:", err);
  }
};

const decrementQuantity = (product) => {
  const id = product.id;
  const item = cartItems.find((item) => item.id === id);
  if (!item) return;

  const newQty = item.cartQuantity - 1;

  setCartItems((prev) =>
    prev
      .map((item) =>
        item.id === id ? { ...item, cartQuantity: newQty } : item
      )
      .filter((item) => item.cartQuantity > 0)
  );

  if (newQty <= 0) {
    const authHeader = getAuthHeader();
    if (!authHeader) return;

    axios
      .delete(`http://localhost:3000/mycart/remove/${id}`, authHeader)
      .catch((err) =>
        console.error("Failed to fully remove item from cart:", err.response?.data || err.message)
      );
  }
};


  const removeFromCart = async (id) => {
    const authHeader = getAuthHeader();
    if (!authHeader) return;

    try {
      await axios.delete(`http://localhost:3000/mycart/remove/${id}`, authHeader);
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Remove from cart failed:", err);
    }
  };

  const clearCart = async () => {
    const authHeader = getAuthHeader();
    if (!authHeader) return;

    try {
      await axios.delete("http://localhost:3000/mycart/clear", authHeader);
      setCartItems([]);
    } catch (err) {
      console.error("Clear cart failed:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        incrementQuantity,
        decrementQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
