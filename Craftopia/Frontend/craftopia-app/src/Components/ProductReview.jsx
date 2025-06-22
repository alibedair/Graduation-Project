import { useEffect, useState } from "react";
import { Star, CheckCircle, Calendar } from "lucide-react";
import axios from "axios";

const ProductReview = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(0);
  const [newReview, setNewReview] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!productId) return;

    axios
      .get(`http://localhost:3000/review/getreview/${productId}`)
      .then(res => setReviews(Array.isArray(res.data.reviews) ? res.data.reviews : []))
      .catch(err => console.error("Failed to fetch reviews", err));
  }, [productId]);

  const renderStars = rating =>
    Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ));

  const handleSubmitReview = async () => {
    const token = localStorage.getItem("token");
    setError("");

    if (!token) return alert("Please login to submit a review.");
    if (!newRating) return setError("Please select a rating.");
    if (!newReview.trim()) return setError("Please write a review.");
    if (newReview.length < 10 || newReview.length > 500)
      return setError("Review must be between 10 and 500 characters.");

    const payload = { productId, rating: Number(newRating), review: newReview };
    console.log("Submitting review with payload:", payload);

    try {
      await axios.post("http://localhost:3000/review/create", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const res = await axios.get(`http://localhost:3000/review/getreview/${productId}`);
      setReviews(Array.isArray(res.data.reviews) ? res.data.reviews : []);
      setNewReview("");
      setNewRating(0);
    } catch (err) {
      console.error("Failed to submit review", err);
      const message = err?.response?.data?.message;
      if (message === "You have already reviewed this product") {
        setError("You have already submitted a review for this product.");
      } else {
        setError("Failed to submit. Please check your review and try again.");
      }
    }
  };

  return (
    <div className="space-y-12">
      <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>

      <div className="space-y-6">
        {reviews.map((r, idx) => (
          <div key={r.id ?? idx} className="border rounded-xl p-5 bg-white shadow-sm">
            <div className="flex items-start gap-4 mb-2">
              <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center font-semibold text-[#E07385]">
                {r.username?.[0]?.toUpperCase() ?? "U"}
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
            <p className="text-gray-700 mt-2">{r.review}</p>
          </div>
        ))}
      </div>

      <div className="border-t pt-10">
        <h3 className="text-xl font-bold mb-4">Leave a Review</h3>
        <div className="space-y-4">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <Star
                key={star}
                onClick={() => setNewRating(star)}
                className={`w-6 h-6 cursor-pointer ${star <= newRating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
              />
            ))}
          </div>
          <textarea
            className="w-full p-3 border rounded-lg"
            rows={4}
            placeholder="Write your review (10–500 characters)..."
            value={newReview}
            onChange={e => setNewReview(e.target.value)}
          />
          <div className="text-sm text-gray-500 text-right">{newReview.length}/500 characters</div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
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
