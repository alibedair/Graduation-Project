import { useCart } from '../context/CartContext';
import CartItem from '../Components/CartItem';
import CartOverview from '../Components/CartOverview';
import Footer from '../Components/Footer';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const isCartEmpty = cartItems.length === 0;

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F6]">
      <div className="w-[90%] mx-auto flex flex-col lg:flex-row gap-8 py-12">
        {isCartEmpty ? (
          <div className="flex flex-col items-center justify-center py-20 w-full">
            <img
              src="/assets/cart.png"
              alt="Empty Cart"
              className="w-85 h-60 mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-700">Your cart is empty</h2>
            <p className="text-gray-500 mt-1">Looks like you haven't added anything yet.</p>
          </div>
        ) : (
          <>
            <div className="lg:w-[60%]">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Cart Items</h1>
              <div className="space-y-4">
                {cartItems.map(item => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onQuantityChange={updateQuantity}
                    onRemove={removeFromCart}
                  />
                ))}
              </div>
            </div>

            <div className="lg:w-[40%]">
              <CartOverview cartItems={cartItems} />
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CartPage;
