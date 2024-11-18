import { Trash } from "lucide-react";
import { useState, useEffect } from "react";

function CartItem({ item, onQuantityChange, onRemove, fetchCart }) {
  const [quantity, setQuantity] = useState(item.quantity);

  // Function to parse price and handle both string and numeric formats
  const parsePrice = (price) => {
    return typeof price === "string"
      ? parseFloat(price.startsWith("$") ? price.slice(1) : price)
      : price;
  };

  const price = parsePrice(item.price);

  // Calculate total price based on quantity
  const getTotalPrice = () => (price * quantity).toFixed(2);

  // Update local storage with updated cart
  const updateCartInLocalStorage = (updatedQuantity) => {
    const CART_KEY = "cart"; // Adjust key if needed
    const cart = JSON.parse(localStorage.getItem(CART_KEY));

    if (cart) {
      const updatedCartItems = cart.items.map((cartItem) =>
        cartItem.productId === item.productId
          ? {
              ...cartItem,
              quantity: updatedQuantity,
              subtotal: updatedQuantity * price,
            }
          : cartItem
      );

      // Update total price and total quantity in the cart
      const totalPrice = updatedCartItems.reduce(
        (acc, cartItem) => acc + cartItem.subtotal,
        0
      );
      const totalQuantity = updatedCartItems.reduce(
        (acc, cartItem) => acc + cartItem.quantity,
        0
      );

      const updatedCart = {
        ...cart,
        items: updatedCartItems,
        totalPrice,
        totalQuantity,
      };

      // Save the updated cart in local storage
      localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
      fetchCart();
    }
  };

  // Handle incrementing quantity
  const incrementQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    updateCartInLocalStorage(newQuantity);
    if (onQuantityChange) onQuantityChange(item.productId, newQuantity);
  };

  // Handle decrementing quantity
  const decrementQuantity = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      updateCartInLocalStorage(newQuantity);
      if (onQuantityChange) onQuantityChange(item.productId, newQuantity);
    }
  };

  // Ensure local storage stays in sync with state changes
  useEffect(() => {
    updateCartInLocalStorage(quantity);
  }, [quantity]);

  return (
    <div className="flex flex-col p-4 bg-gray-100 rounded-lg mb-2 space-y-2">
      {/* Row 1: Image, Name/Price, Total Price */}
      <div className="flex items-center justify-between">
        {/* Image */}
        <div className="flex-shrink-0">
          <img
            src={item.productImage}
            alt={item.productName}
            className="w-20 h-20 object-cover rounded"
          />
        </div>

        {/* Name and Price */}
        <div className="flex-1 ml-4">
          <h3 className="text-md font-semibold">{item.productName}</h3>
          <p className="text-md text-gray-600 mt-1">{item.price}</p>
        </div>

        {/* Total Price */}
        <div className="text-right">
          <p className="text-md font-bold">Ksh {getTotalPrice()}</p>
        </div>
      </div>

      {/* Row 2: Quantity Controls and Trash Icon */}
      <div className="flex items-center justify-between">
        {/* Quantity Control */}
        <div className="flex items-center space-x-2 border border-gray-300 rounded-lg px-2 py-1 bg-gray-200">
          <button
            className="w-8 h-8 text-center font-semibold bg-slate-800 text-white rounded-full"
            onClick={decrementQuantity}
          >
            -
          </button>
          <span className="px-4 font-bold">{quantity}</span>
          <button
            className="w-8 h-8 text-center font-semibold bg-slate-800 text-white rounded-full"
            onClick={incrementQuantity}
          >
            +
          </button>
        </div>

        {/* Trash Icon */}
        <button
          className="text-red-500 hover:text-red-700"
          onClick={() => onRemove && onRemove(item.productId)}
        >
          <Trash className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

export default CartItem;
