import React from 'react';
import { useNavigate } from 'react-router-dom';

const ESCROW_FEE = 2.5;

const CartOverview = ({ cartItems }) => {
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const total = subtotal + ESCROW_FEE;
  const navigate = useNavigate();

const handleContinueShopping = () => {
  navigate('/');
};


  return (
    <div className="w-full p-6 bg-white rounded-xl shadow-md border border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

      <div className="flex justify-between mb-2 text-gray-600">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

      <div className="flex justify-between mb-2 text-gray-600">
        <span>Shipping</span>
        <span className="text-black">Free</span>
      </div>

    
<div className="flex justify-between mb-4 text-gray-600">
  <span>Escrow Service</span>
  <span>${ESCROW_FEE.toFixed(2)}</span>
</div>
      <hr className="mb-4" />

      <div className="flex justify-between mb-4 text-lg font-semibold">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>

      <button className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-800 transition mb-2">
        Proceed to Checkout
      </button>

      <button
  onClick={handleContinueShopping}
  className="w-full border border-gray-300 py-2 rounded-md hover:bg-gray-100 transition"
>
        Continue Shopping
      </button>
    </div>
  );
};

export default CartOverview;
