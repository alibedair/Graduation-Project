import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    FiPackage,
    FiTruck,
    FiCheckCircle,
    FiXCircle,
    FiClock,
    FiStar,
    FiEdit2
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [activeFilter, setActiveFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [currentArtist, setCurrentArtist] = useState(null);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [artistRating, setArtistRating] = useState(0);
    const [artistComment, setArtistComment] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get('http://localhost:3000/order/myOrders', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const sortedOrders = response.data.orders.sort(
                    (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
                );
                setOrders(sortedOrders);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const filteredOrders = orders.filter((order) => {
        if (activeFilter === 'all') return true;
        return order.status.toLowerCase() === activeFilter;
    });

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Shipping': return <FiTruck className="mr-1" />;
            case 'Completed': return <FiCheckCircle className="mr-1" />;
            case 'Cancelled': return <FiXCircle className="mr-1" />;
            case 'Pending': return <FiClock className="mr-1" />;
            default: return <FiClock className="mr-1" />;
        }
    };

    const handleCancelOrder = async (orderId) => {
        try {
            const confirmed = window.confirm("Are you sure you want to cancel this order?");
            if (!confirmed) return;

            await axios.put(`http://localhost:3000/order/cancel/${orderId}`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.orderId === orderId ? { ...order, status: 'Cancelled' } : order
                )
            );
        } catch (error) {
            console.error('Error cancelling order:', error);
            alert("Failed to cancel the order.");
        }
    };

    const handlePayOrder = (orderId) => {
        navigate(`/payment/${orderId}`);
    };

    const openReviewModal = (product, artist) => {
        setCurrentProduct(product);
        setCurrentArtist(artist);
        setShowReviewModal(true);
    };

    const closeReviewModal = () => {
        setShowReviewModal(false);
        setCurrentProduct(null);
        setCurrentArtist(null);
        setRating(0);
        setReview('');
        setArtistRating(0);
        setArtistComment('');
    };

    const submitReview = async () => {
        // Validate inputs
        if (rating === 0) {
            alert('Please select a rating');
            return;
        }

        if (!review || review.trim().length < 20) {
            alert('Please write a review with at least 20 characters');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/review/create', {
                productId: currentProduct.productId || currentProduct.id,
                rating: rating,
                review: review.trim()
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
            });
            if (response.status === 201) {
                alert('Thank you for your review!');
                closeReviewModal();
            } else {
                alert('Something went wrong. Please try again.');
            }

        } catch (error) {
            console.error('Error submitting review:', error);
            alert(error.response?.data?.message || error.message || 'Failed to submit review. Please try again.');
        }
    };


    if (isLoading) {
        return (
            <div className="px-6 py-10 bg-[var(--color-cream)] min-h-screen flex flex-col items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <FiPackage className="text-5xl text-gray-300 mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-64"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-12 bg-[var(--color-cream)] min-h-screen">

            {showReviewModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4  backdrop-blur-sm transition-opacity duration-300">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-300 scale-[0.98] hover:scale-100">
                        <div className="p-6 pb-4 border-b border-gray-100">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">Share Your Experience</h3>
                                    <p className="text-sm text-gray-500 mt-1">Your feedback helps others</p>
                                </div>
                                <button
                                    onClick={closeReviewModal}
                                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="max-h-[65vh] overflow-y-auto p-6">
                            <div className="mb-8">
                                <div className="flex items-start gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                                    <img
                                        src={currentProduct.image?.[0]}
                                        alt={currentProduct.name}
                                        className="w-20 h-20 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                                    />
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{currentProduct.name}</h4>
                                        <p className="text-sm text-gray-500 mb-3">Product</p>

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                                            <div className="flex items-center gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        onClick={() => setRating(star)}
                                                        className="transition-transform hover:scale-110 focus:outline-none"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className={`h-8 w-8 ${star <= rating ? 'text-amber-400' : 'text-gray-300'}`}
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    </button>
                                                ))}
                                                <span className="ml-2 text-sm font-medium text-gray-700">
                                                    {rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : "Not rated"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Review</label>
                                    <textarea
                                        value={review}
                                        onChange={(e) => setReview(e.target.value)}
                                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent transition-all duration-200"
                                        rows="4"
                                        placeholder="What did you like or dislike about this product? Share your experience..."
                                    ></textarea>
                                    <p className="text-xs text-gray-500 mt-1">Minimum 20 characters</p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 flex justify-end gap-3">
                            <button
                                onClick={closeReviewModal}
                                className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitReview}
                                className="px-5 py-2.5 bg-[var(--color-burgundy)] text-white rounded-xl hover:bg-[var(--color-burgundy-dark)] transition-all duration-200 font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                disabled={rating === 0}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Submit Review
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-[var(--color-burgundy)] mb-2">My Orders</h2>
                        <p className="text-gray-600">View and manage your order history</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <button className="bg-[var(--color-coral)] text-white px-6 py-2 rounded-lg hover:bg-[var(--color-burgundy)] transition-all shadow-sm flex items-center">
                            <FiPackage className="mr-2" /> Need Help?
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto mb-8 text-center">
                    <div className="inline-flex gap-3 min-w-max px-2 py-1 rounded-xl bg-white shadow-inner border border-[var(--color-coral)/30]">
                        {[
                            { label: 'All Orders', value: 'all', icon: null },
                            { label: 'Shipping', value: 'shipping', icon: <FiTruck className="mr-1" /> },
                            { label: 'Completed', value: 'completed', icon: <FiCheckCircle className="mr-1" /> },
                            { label: 'Cancelled', value: 'cancelled', icon: <FiXCircle className="mr-1" /> },
                            { label: 'Pending', value: 'pending', icon: <FiClock className="mr-1" /> },
                        ].map(({ label, value, icon }) => (
                            <button
                                key={value}
                                onClick={() => setActiveFilter(value)}
                                className={`whitespace-nowrap px-4 py-2 rounded-full flex items-center transition-all duration-200 text-sm font-medium
                                    ${activeFilter === value
                                        ? 'bg-[var(--color-burgundy)] text-white shadow-md'
                                        : 'text-[var(--color-burgundy)] hover:bg-[var(--color-coral)/10]'}
                                `}
                            >
                                {icon} {label}
                            </button>
                        ))}
                    </div>
                </div>
                {filteredOrders.length === 0 ? (
                    <div className="bg-[#FAF9F6] rounded-xl shadow-sm p-8 text-center">
                        <FiPackage className="mx-auto text-4xl text-gray-400 mb-4" />
                        <h3 className="text-xl font-medium text-gray-700 mb-2">
                            {activeFilter === 'all' ? 'No orders yet' : `No ${activeFilter} orders`}
                        </h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            {activeFilter === 'all'
                                ? "You haven't placed any orders yet. Start shopping to see your orders here!"
                                : `You don't have any ${activeFilter} orders at the moment.`}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredOrders.map((order, index) => (
                            <div
                                key={index}
                                className="bg-[#FAF9F6] p-6 rounded-xl border border-gray-300 hover:shadow-md transition-all"
                            >
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">Order #{order.orderId}</div>
                                        <div className="text-lg font-semibold text-[var(--color-burgundy)]">
                                            {order.products?.length} Item{order.products?.length !== 1 ? 's' : ''}
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:items-end">
                                        <div className="text-sm text-gray-500 mb-1">
                                            {new Date(order.orderDate).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </div>
                                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${order.status === 'Completed'
                                            ? 'bg-[var(--color-burgundy)/10] text-[var(--color-burgundy)]'
                                            : order.status === 'Cancelled'
                                                ? 'bg-red-100 text-red-800'
                                                : order.status === 'Shipping'
                                                    ? 'bg-[var(--color-coral)/20] text-[var(--color-coral)]'
                                                    : order.status === 'Pending'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {getStatusIcon(order.status)} {order.status}
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-4 mb-4">
                                    <div className="flex overflow-x-auto gap-4 pb-2">
                                        {order.products?.map((item, i) => (
                                            <div
                                                key={i}
                                                className="flex-shrink-0 w-52 h-64 bg-white rounded-lg shadow overflow-hidden hover:scale-[1.02] transition-transform relative"
                                            >
                                                {item.image?.[0] && (
                                                    <img
                                                        src={item.image[0]}
                                                        alt={item.name}
                                                        className="w-full h-2/3 object-cover"
                                                    />
                                                )}
                                                <div className="p-2 h-1/3 flex flex-col justify-between">
                                                    <h4 className="text-sm font-semibold text-gray-800 truncate">{item.name}</h4>
                                                    <p className="text-xs text-gray-600 truncate">{item.description}</p>
                                                    <p className="text-xs text-gray-700">
                                                        Price: <span className="font-medium">{parseFloat(item.price).toLocaleString()} LE</span>
                                                    </p>
                                                    <p className="text-xs text-gray-700">
                                                        Qty: <span className="font-medium">{item.productorder?.quantity}</span>
                                                    </p>
                                                </div>
                                                {order.status === 'Completed' && (
                                                    <button
                                                        onClick={() => openReviewModal(item, item.artist)}
                                                        className="absolute bottom-2 right-2 bg-[var(--color-burgundy)] text-white p-1 rounded-full hover:bg-[var(--color-burgundy-dark)] transition-colors"
                                                        title="Rate & Review"
                                                    >
                                                        <FiEdit2 size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Total Amount</p>
                                        <p className="text-xl font-bold text-[var(--color-burgundy)]">
                                            LE {parseFloat(order.totalAmount).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        {(order.status === 'Pending' || order.status === 'Shipping') && (
                                            <div className="flex items-center space-x-3">
                                                <button
                                                    onClick={() => handlePayOrder(order.orderId)}
                                                    className="relative px-4 py-2 rounded-lg group overflow-hidden transition-all duration-300 shadow-md"
                                                >
                                                    <div className="absolute inset-0 bg-green-500/10 backdrop-blur-sm group-hover:bg-green-500/20 transition-all duration-300 border border-green-400/30 rounded-lg"></div>
                                                    <div className="relative flex items-center">
                                                        <svg
                                                            className="w-4 h-4 mr-2 text-green-600 group-hover:text-green-700 transition-colors"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                        </svg>
                                                        <span className="text-sm font-medium text-green-700 group-hover:text-green-800 transition-colors">
                                                            Pay Now
                                                        </span>
                                                    </div>
                                                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-green-400/30 rounded-lg transition-all duration-300 pointer-events-none"></div>
                                                </button>
                                                <button
                                                    onClick={() => handleCancelOrder(order.orderId)}
                                                    className="relative px-4 py-2 rounded-lg group overflow-hidden transition-all duration-300 shadow-md"
                                                >
                                                    <div className="absolute inset-0 bg-red-500/10 backdrop-blur-sm group-hover:bg-red-500/20 transition-all duration-300 border border-red-400/30 rounded-lg"></div>
                                                    <div className="relative flex items-center">
                                                        <svg
                                                            className="w-4 h-4 mr-2 text-red-600 group-hover:text-red-700 transition-colors"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                        </svg>
                                                        <span className="text-sm font-medium text-red-700 group-hover:text-red-800 transition-colors">
                                                            Cancel
                                                        </span>
                                                    </div>
                                                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-red-400/30 rounded-lg transition-all duration-300 pointer-events-none"></div>
                                                </button>
                                            </div>
                                        )}
                                        {(order.status !== 'Pending' && order.status !== 'Shipping') && (
                                            <span className="text-sm text-gray-400 italic">Not actionable</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;

