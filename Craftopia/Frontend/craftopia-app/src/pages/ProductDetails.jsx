import { useLocation } from "react-router-dom";
import ProductInfo from "../Components/ProductInfo";
import ProductReview from "../Components/ProductReview";

const ProductDetails = () => {
  const { state } = useLocation();
  const product = state?.product;

  if (!product) {
    return (
      <div className="text-center mt-20 text-2xl font-semibold text-red-500">
        Product not found
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">
      <ProductInfo product={{ ...product, totalReviews: product.totalReviews ?? 0 }} />
      <ProductReview productId={product.id} />
    </div>
  );
};

export default ProductDetails;
