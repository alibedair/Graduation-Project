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
                    ...product,
                    id: product.productId,
                    quantity: item.quantity,
                    category: product.category?.name || "Unknown",
                    artist: product.artist?.name || "Unknown",
                    inStock: product.quantity > 0,
                    averageRating: product.averageRating || 0,
                    totalReviews: product.totalReviews || 0,
                };
            });

            setCartItems(items);
        } catch (error) {
            console.error("Failed to fetch cart:", error);
        }
    };

    const addToCart = async (product) => {
        const authHeader = getAuthHeader();
        if (!authHeader) return;

        try {
            await axios.post(`http://localhost:3000/mycart/add/${product.id}`, {}, authHeader);
            const existing = cartItems.find((item) => item.id === product.id);
            if (existing) {
                setCartItems((prev) =>
                    prev.map((item) =>
                        item.id === product.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    )
                );
            } else {
                setCartItems((prev) => [...prev, { ...product, quantity: 1 }]);
            }
        } catch (err) {
            console.error("Add to cart failed:", err);
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


    const incrementQuantity = async (id) => {
        const authHeader = getAuthHeader();
        if (!authHeader) return;

        try {
            await axios.post(`http://localhost:3000/mycart/add/${id}`, {}, authHeader);
            setCartItems((prev) =>
                prev.map((item) =>
                    item.id === id ? { ...item, quantity: item.quantity + 1 } : item
                )
            );
        } catch (err) {
            console.error("Increment failed:", err);
        }
    };

    const decrementQuantity = async (id) => {
        const authHeader = getAuthHeader();
        if (!authHeader) return;

        try {
            await axios.delete(`http://localhost:3000/mycart/remove/${id}`, authHeader);
            setCartItems((prev) =>
                prev
                    .map((item) =>
                        item.id === id
                            ? { ...item, quantity: item.quantity - 1 }
                            : item
                    )
                    .filter((item) => item.quantity > 0)
            );
        } catch (err) {
            console.error("Decrement failed:", err);
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
                clearCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
