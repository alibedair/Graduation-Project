import { useEffect, useState } from "react";
import { Star, CheckCircle, Calendar, Pencil, Trash2, Save, X } from "lucide-react";
import axios from "axios";

const decodeToken = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const base64Payload = token.split(".")[1];
    const payload = JSON.parse(atob(base64Payload));
    return payload?.id || null;
  } catch {
    return null;
  }
};

const ProductReview = ({ productId, onStatsUpdate }) => {
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(0);
  const [newReview, setNewReview] = useState("");
  const [error, setError] = useState("");
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editText, setEditText] = useState("");
  const userId = decodeToken();

  useEffect(() => {
    if (!productId) return;
    axios
      .get(`http://localhost:3000/review/getreview/${productId}`)
      .then((res) => {
        const { reviews, averageRating, totalReviews } = res.data;
        setReviews(Array.isArray(reviews) ? reviews : []);
        onStatsUpdate?.({ averageRating, totalReviews });
      })
      .catch(() => {});
  }, [productId, onStatsUpdate]);

  const renderStars = (rating) =>
    Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/review/deletereview/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setReviews((prev) => prev.filter((r) => r.reviewId !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleEditSubmit = async (id) => {
    if (editText.trim().length < 10 || editText.trim().length > 500) return;
    try {
      await axios.put(
        `http://localhost:3000/review/updatereview/${id}`,
        { review: editText },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setReviews((prev) =>
        prev.map((r) => (r.reviewId === id ? { ...r, review: editText } : r))
      );
      setEditingReviewId(null);
      setEditText("");
    } catch (err) {
      console.error("Edit failed", err);
    }
  };

  const handleSubmitReview = async () => {
    const token = localStorage.getItem("token");
    setError("");
    if (!token) return alert("Please login to submit a review.");
    if (!newRating) return setError("Please select a rating.");
    if (!newReview.trim()) return setError("Please write a review.");
    if (newReview.length < 10 || newReview.length > 500)
      return setError("Review must be between 10 and 500 characters.");

    try {
      await axios.post(
        "http://localhost:3000/review/create",
        {
          productId,
          rating: Number(newRating),
          review: newReview,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const res = await axios.get(
        `http://localhost:3000/review/getreview/${productId}`
      );
      const { reviews, totalReviews, averageRating } = res.data;
      setReviews(reviews);
      onStatsUpdate?.({ averageRating, totalReviews });
      setNewReview("");
      setNewRating(0);
    } catch (err) {
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
        {reviews.map((r) => {
          const isMine = r.customerId === userId;

          return (
            <div key={r.reviewId} className="border rounded-xl p-5 bg-white shadow-sm relative">
              <div className="flex items-start gap-4 mb-2">
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center font-semibold text-[#E07385]">
                  {r.customer?.username?.[0]?.toUpperCase() ?? "U"}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{r.customer?.username}</h4>
                    {r.verified && <CheckCircle className="w-4 h-4 text-green-500" />}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {new Date(r.createdAt || Date.now()).toLocaleDateString()}
                  </div>
                  <div className="flex mt-1">{renderStars(r.rating)}</div>
                </div>

                {isMine && (
                  <div className="absolute right-3 top-3 flex gap-2 bg-white p-1 rounded-md shadow-sm">
                    {editingReviewId === r.reviewId ? (
                      <>
                        <button
                          onClick={() => handleEditSubmit(r.reviewId)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingReviewId(null);
                            setEditText("");
                          }}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingReviewId(r.reviewId);
                            setEditText(r.review);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(r.reviewId)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {editingReviewId === r.reviewId ? (
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full p-2 border mt-2 rounded-md"
                  rows={3}
                />
              ) : (
                <p className="text-gray-700 mt-2">{r.review}</p>
              )}
            </div>
          );
        })}
      </div>
      <div className="border-t pt-10">
        <h3 className="text-xl font-bold mb-4">Leave a Review</h3>
        <div className="space-y-4">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                onClick={() => setNewRating(star)}
                className={`w-6 h-6 cursor-pointer ${
                  star <= newRating ? "text-yellow-400 fill-current" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <textarea
            className="w-full p-3 border rounded-lg"
            rows={4}
            placeholder="Write your review (10–500 characters)..."
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
          />
          <div className="text-sm text-gray-500 text-right">
            {newReview.length}/500 characters
          </div>
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