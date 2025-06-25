import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductInfo from "../Components/ProductInfo";
import ProductReview from "../Components/ProductReview";
import ProductPersonalization from "../Components/ProductPersonalization";
import Footer from "../Components/Footer";

const ProductDetails = () => {
  const options = {
  color: {
    price: 0,
    values: ["Red", "Blue", "Gold"]
  },
  size: {
    price: 5,
    values: ["Small", "Medium", "Large"]
  },
  engraving: {
    price: 7,
    values: []
  }
};


  const { state } = useLocation();
  const [reviewStats, setReviewStats] = useState({
    averageRating: state?.product?.averageRating || 0,
    totalReviews: state?.product?.totalReviews || 0,
  });

  const product = state?.product;
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!product) {
    return (
      <div className="text-center mt-20 text-2xl font-semibold text-red-500">
        Product not found
      </div>
    );
  }

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
        <ProductPersonalization options={options} />

        <ProductReview
          productId={product.id}
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
