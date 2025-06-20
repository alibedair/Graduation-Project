import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../Components/ProductCard';
import Footer from '../Components/Footer';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 text-center">
          <img
            src="/assets/wishlist.png"
            alt="Empty wishlist"
            className="w-64 h-64 mb-6 object-contain"
          />
          <h1 className="text-2xl font-semibold text-gray-600">
            Your wishlist is currently empty.
          </h1>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#FAF9F6] py-12 px-4 md:px-10 mt-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-[#333] mb-20 text-center">Your Wishlist</h1>
          <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
            {wishlist.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  image: product.images?.[0],
                  category: product.category?.name,
                  artist: product.artist?.username || 'Unknown',
                }}
                isFavorite={true}
                onToggleFavorite={() => removeFromWishlist(product.id)}
              />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default WishlistPage;
