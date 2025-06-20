import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import ProductCard from '../Components/ProductCard';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import Footer from '../Components/Footer';

const dummyCategories = [
    { name: 'Ceramics' },
    { name: 'Baskets' },
    { name: 'Sculptures' }
];

const dummyProducts = [
    {
        id: 1,
        name: 'Handmade Ceramic Vase',
        price: 45.99,
        originalPrice: 59.99,
        image: "/assets/cart.png",
        category: { name: 'Ceramics' },
        artist: { username: 'Emma Rose' },
        rating: 4.7,
        reviews: 18,
        inStock: true,
    },
    {
        id: 2,
        name: 'Woven Basket',
        price: 32.00,
        image: '/assets/contemporary-cermic-vases.jpg',
        category: { name: 'Baskets' },
        artist: { username: 'John Doe' },
        rating: 4.3,
        reviews: 10,
        inStock: false,
    },
    {
        id: 3,
        name: 'Wooden Sculpture',
        price: 89.50,
        originalPrice: 110.00,
        image: 'https://images.unsplash.com/photo-1543599538-3f7d44eb7d4d',
        category: { name: 'Sculptures' },
        artist: { username: 'Maya Lin' },
        rating: 4.9,
        reviews: 22,
        inStock: true,
    }
];

const Shop = () => {
    const [categories, setCategories] = useState([]);
    const [selected, setSelected] = useState('All');
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    const { cartItems, addToCart, incrementQuantity, decrementQuantity } = useCart();
    const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

    useEffect(() => {
        setCategories(dummyCategories);
    }, []);

    useEffect(() => {
        setProducts(dummyProducts);
    }, []);

    useEffect(() => {
        if (selected === 'All') {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter(p => p.category?.name === selected));
        }
    }, [selected, products]);

    const toggleWishlist = (product) => {
        const exists = wishlist.find(item => item.id === product.id);
        exists ? removeFromWishlist(product.id) : addToWishlist(product);
    };

    return (
        <>
            <div className="min-h-screen bg-[#FAF9F6] py-10 px-4 md:px-12">
                <h1 className="text-3xl font-bold text-center mb-8 text-[#333] mt-7">Shop All Products</h1>

                <div className="relative mb-18">
                    <div className="flex justify-center">
                        <div className="inline-flex gap-3 sm:gap-4 md:gap-6 bg-white rounded-4xl shadow-sm px-4 py-3 sm:py-4">
                            {['All', ...categories.map((cat) => cat.name)].map((name) => {
                                const isSelected = selected === name;
                                return (
                                    <button
                                        key={name}
                                        onClick={() => setSelected(name)}
                                        className={`relative z-10 px-6 py-2 rounded-full font-semibold text-base transition-all duration-300 ${isSelected
                                                ? 'text-white'
                                                : 'text-gray-700 hover:text-[#E07385]'
                                            }`}
                                    >
                                        {isSelected && (
                                            <motion.div
                                                layoutId="highlight"
                                                className="absolute inset-0 bg-[#E07385] rounded-full z-[-1]"
                                                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                            />
                                        )}
                                        {name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
                    {filteredProducts.map((product) => {
                        const normalizedProduct = {
                            ...product,
                            image: product.image,
                            category: product.category?.name,
                            artist: product.artist?.username || "Unknown",
                        };

                        const inCart = cartItems.find((item) => item.id === product.id);
                        const quantity = inCart?.quantity || 0;

                        return (
                            <ProductCard
                                key={normalizedProduct.id}
                                product={normalizedProduct}
                                isFavorite={wishlist.some((item) => item.id === normalizedProduct.id)}
                                onToggleFavorite={() => toggleWishlist(normalizedProduct)}
                                isInCart={!!inCart}
                                quantity={quantity}
                                onAddToCart={() => addToCart(normalizedProduct)}
                                onIncrement={() => incrementQuantity(normalizedProduct.id)}
                                onDecrement={() => decrementQuantity(normalizedProduct.id)}
                            />
                        );
                    })}
                </div>
            </div>

            <Footer />
        </>
    );
};

export default Shop;
