import React from "react";

const OrderSummary = ({ cart }) => {
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const taxVat = subtotal * 0.15; // Assuming a 15% tax rate
  const total = subtotal + taxVat;

  const handleApplyCoupon = () => {
    // Coupon application logic here
  };

  const handleCheckout = () => {
    // Proceed to checkout functionality here
  };

  return (
    <div className="p-6 border rounded-lg shadow-md">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl font-bold">Order Summary</h2>
      </div>

      {/* Body */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax/VAT (15%)</span>
          <span>${taxVat.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        {/* Coupon Code */}
        <div className="mt-4">
          <label htmlFor="couponCode" className="block font-medium mb-2">
            Coupon Code
          </label>
          <input
            type="text"
            id="couponCode"
            className="w-full border rounded px-3 py-2 mb-2"
            placeholder="Enter coupon code"
          />
          <button
            onClick={handleApplyCoupon}
            className="w-full py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Apply Coupon
          </button>
        </div>
      </div>

      {/* Footer */}
      <div>
        <button
          onClick={handleCheckout}
          className="w-full py-3 text-white bg-green-600 rounded-lg font-semibold hover:bg-green-700"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
