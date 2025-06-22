import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import ProductCard from '../Components/ProductCard';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import Footer from '../Components/Footer';

const Shop = () => {
    const [categories, setCategories] = useState([]);
    const [selected, setSelected] = useState('All');
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    const { cartItems, addToCart, incrementQuantity, decrementQuantity } = useCart();
    const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('http://localhost:3000/product/get');
                const data = await res.json();

                const productsArray = data.products || [];
                const formatted = productsArray.map((p) => ({
                    id: p.productId,
                    name: p.name,
                    price: p.price,
                    image: p.image?.[0] || '',
                    category: p.category?.name || 'Uncategorized',
                    artist: p.artist?.name || 'Unknown',
                    rating: p.rating || 4.5,
                    reviews: p.reviews || 0,
                    inStock: p.quantity > 0,
                }));

                setProducts(formatted);
                const uniqueCategories = Array.from(
                    new Set(formatted.map((p) => p.category))
                ).map((name) => ({ name }));

                setCategories(uniqueCategories);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        if (selected === 'All') {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter(p => p.category === selected));
        }
    }, [selected, products]);

    const toggleWishlist = (product) => {
        const exists = wishlist.find(item => item.id === product.id);
        exists ? removeFromWishlist(product.id) : addToWishlist(product);
    };

    return (
        <>
            <div className="min-h-screen bg-gradient-to-b from-[#FAF9F6] to-[#f5f3ef] py-10 px-4 md:px-12">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-7xl mx-auto"
                >
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                            Discover Unique Artworks
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Explore our curated collection of handcrafted pieces from talented artists worldwide.
                        </p>
                    </div>
                    <div className="flex justify-center mb-12">
                        <div className="inline-flex gap-1 sm:gap-2 bg-white rounded-full shadow-sm px-2 py-1 sm:px-4 sm:py-2 border border-gray-100">
                            {['All', ...categories.map((cat) => cat.name)].map((name) => {
                                const isSelected = selected === name;
                                return (
                                    <button
                                        key={name}
                                        onClick={() => setSelected(name)}
                                        className={`relative z-10 px-4 py-1.5 sm:px-6 sm:py-2 rounded-full text-sm sm:text-base transition-all duration-300 ${
                                            isSelected
                                                ? 'text-white font-medium'
                                                : 'text-gray-600 hover:text-[#E07385]'
                                        }`}
                                    >
                                        {isSelected && (
                                            <motion.div
                                                layoutId="highlight"
                                                className="absolute inset-0 bg-gradient-to-r from-[#E07385] to-[#d45a7a] rounded-full z-[-1]"
                                                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                            />
                                        )}
                                        {name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    {filteredProducts.length > 0 ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ staggerChildren: 0.1 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            {filteredProducts.map((product) => {
                                const inCart = cartItems.find((item) => item.id === product.id);
                                const quantity = inCart?.quantity || 0;

                                return (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <ProductCard
                                            product={product}
                                            isFavorite={wishlist.some((item) => item.id === product.id)}
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
                    ) : (
                        <div className="text-center py-20">
                            <h3 className="text-2xl font-medium text-gray-700 mb-2">No products found</h3>
                            <p className="text-gray-500">Try adjusting your filter criteria</p>
                        </div>
                    )}
                </motion.div>
            </div>
            <Footer />
        </>
    );
};

export default Shop;
