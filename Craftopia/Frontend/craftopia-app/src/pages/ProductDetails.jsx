import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductInfo from "../Components/ProductInfo";
import ProductReview from "../Components/ProductReview";
import Footer from "../Components/Footer";
import axios from "axios";

const ProductDetails = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const [product, setProduct] = useState(state?.product || null);
  const [loading, setLoading] = useState(!state?.product);
  const [error, setError] = useState(null);
  const [reviewStats, setReviewStats] = useState({
    averageRating: state?.product?.averageRating || 0,
    totalReviews: state?.product?.totalReviews || 0,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!product && id) {
      // Fetch product only if we don't have it in state
      setLoading(true);
      axios
        .get(`http://localhost:3000/product/get/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          const p = res.data.product;
          setProduct(p);
          setReviewStats({
            averageRating: p.averageRating || 0,
            totalReviews: p.totalReviews || 0,
          });
        })
        .catch(() => setError("Failed to load product."))
        .finally(() => setLoading(false));
    }
  }, [id, product]);

  if (loading) return <div className="text-center mt-20">Loading…</div>;

  if (error || !product)
    return (
      <div className="text-center mt-20 text-2xl font-semibold text-red-500">
        {error || "Product not found"}
      </div>
    );

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        <ProductInfo
          product={{
            ...product,
            rating: reviewStats.averageRating,
            totalReviews: reviewStats.totalReviews,
          }}
        />
        <ProductReview
          productId={product.productId || product.id}
          onStatsUpdate={({ averageRating, totalReviews }) =>
            setReviewStats({ averageRating, totalReviews })
          }
        />
      </div>
      <Footer />
    </>
  );
};

export default ProductDetails;
