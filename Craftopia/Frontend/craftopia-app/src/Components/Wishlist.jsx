import { useWishlist } from "../context/WishlistContext";
import { FaTrashAlt } from "react-icons/fa";

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-[black] mb-6">Your Wishlist</h2>

      {wishlist.length === 0 ? (
        <div className="bg-[#FFF1F3] text-[#921A40] p-6 rounded-xl shadow-md">
          <p className="text-lg">You haven’t added any items to your wishlist yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 relative"
            >
              <img
                src={Array.isArray(item.image) ? item.image[0] : item.image}
                alt={item.name}
                className="w-full h-48 object-cover"
              />

              <div className="p-4">
                <h3 className="text-xl font-semibold text-[#921A40]">
                  {item.name}
                </h3>
                <p className="text-gray-600 mt-1">{item.price} LE</p>
              </div>
              <button
                onClick={() => removeFromWishlist(item.id)}
                className="absolute top-3 right-3 text-[#E07385] hover:text-[#921A40] transition text-2xl"
                aria-label={`Remove ${item.name} from wishlist`}
              >
                <FaTrashAlt />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
