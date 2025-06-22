import { useEffect, useState } from "react";
import { Star, CheckCircle, Calendar } from "lucide-react";
import axios from "axios";

const ProductReview = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [newRating, setNewRating] = useState(0);
    const [newReview, setNewReview] = useState("");

    useEffect(() => {
        if (productId) {
            axios
                .get(`http://localhost:3000/review/getreview/${productId}`)
                .then((res) => setReviews(Array.isArray(res.data) ? res.data : []))
                .catch((err) => console.error("Failed to fetch reviews", err));
        }
    }, [productId]);

    const renderStars = (rating) =>
        [...Array(5)].map((_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
            />
        ));

    const handleSubmitReview = async () => {
        const token = localStorage.getItem("token");
        if (!token) return alert("Please login to submit a review.");

        try {
            await axios.post(
                "http://localhost:3000/rating/add",
                { rating: newRating, productId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            await axios.post(
                "http://localhost:3000/review/create",
                { text: newReview, productId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const res = await axios.get(`http://localhost:3000/review/getreview/${productId}`);
            setReviews(Array.isArray(res.data) ? res.data : []);
            setNewReview("");
            setNewRating(0);
        } catch (err) {
            console.error("Failed to submit review", err);
            alert("Error submitting your review.");
        }
    };

    return (
        <div className="space-y-12">
            <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>

            <div className="space-y-6">
                {reviews.map((r) => (
                    <div key={r.id} className="border rounded-xl p-5 bg-white shadow-sm">
                        <div className="flex items-start gap-4 mb-2">
                            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center font-semibold text-[#E07385]">
                                {r.username?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-semibold">{r.username}</h4>
                                    {r.verified && <CheckCircle className="w-4 h-4 text-green-500" />}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(r.date || Date.now()).toLocaleDateString()}
                                </div>
                                <div className="flex mt-1">{renderStars(r.rating)}</div>
                            </div>
                        </div>
                        <p className="text-gray-700 mt-2">{r.text}</p>
                    </div>
                ))}
            </div>

            <div className="border-t pt-10">
                <h3 className="text-xl font-bold mb-4">Leave a Review</h3>
                <div className="space-y-4">
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                onClick={() => setNewRating(star)}
                                className={`w-6 h-6 cursor-pointer ${star <= newRating ? "text-yellow-400 fill-current" : "text-gray-300"
                                    }`}
                            />
                        ))}
                    </div>
                    <textarea
                        className="w-full p-3 border rounded-lg"
                        rows="4"
                        placeholder="Write your review..."
                        value={newReview}
                        onChange={(e) => setNewReview(e.target.value)}
                    />
                    <button
                        onClick={handleSubmitReview}
                        className="bg-[#E07385] text-white font-semibold px-6 py-2 rounded-full shadow hover:opacity-90"
                    >
                        Submit Review
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductReview;
