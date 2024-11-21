import { useCartFunctions } from "@/utils/firebase";
import { Trash } from "lucide-react";
import { useState, useEffect } from "react";

function CartItem({ item, onQuantityChange, onRemove, fetchCart }) {
  const [quantity, setQuantity] = useState(item.quantity);
  const { updateCartItemQuantity } = useCartFunctions();

  // Function to parse price and handle both string and numeric formats
  const parsePrice = (price) => {
    return typeof price === "string"
      ? parseFloat(price.startsWith("$") ? price.slice(1) : price)
      : price;
  };

  const price = parsePrice(item.price);
  const discountPrice = item.discountPrice
    ? parsePrice(item.discountPrice)
    : null;

  // Calculate total price based on quantity
  const getTotalPrice = () => {
    const priceToUse = discountPrice ? discountPrice : price;
    return (priceToUse * quantity).toFixed(2);
  };

  const incrementQuantity = async () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    try {
      const updateResult = await updateCartItemQuantity(
        item.productId,
        newQuantity
      );
      if (updateResult.success) {
        if (onQuantityChange) onQuantityChange(item, newQuantity); // Refresh the cart after updating
      } else {
        console.error("Error updating item quantity:", updateResult.error);
        // Handle error, e.g., display an error message
      }
      fetchCart();
    } catch (error) {
      console.error("Error updating item quantity:", error);
      // Handle error, e.g., display an error message
      fetchCart();
    }
  };

  // Handle decrementing quantity
  const decrementQuantity = async () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      try {
        const updateResult = await updateCartItemQuantity(
          item.productId,
          newQuantity
        );
        if (updateResult.success) {
          if (onQuantityChange) onQuantityChange(item, newQuantity);
          fetchCart(); // Refresh the cart after updating
        } else {
          console.error("Error updating item quantity:", updateResult.error);
          // Handle error, e.g., display an error message
        }
      } catch (error) {
        console.error("Error updating item quantity:", error);
        // Handle error, e.g., display an error message
      }
    }
  };

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
          <div className="flex items-center">
            {discountPrice && (
              <>
                <span className="line-through text-gray-500 mr-2">
                  Ksh {price.toFixed(2)}
                </span>
                <span className="text-green-600">
                  Ksh {discountPrice.toFixed(2)}
                </span>
              </>
            )}
            {!discountPrice && (
              <span className="text-gray-600">Ksh {price.toFixed(2)}</span>
            )}
          </div>
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
            onClick={() => decrementQuantity(item)}
          >
            -
          </button>
          <span className="px-4 font-bold">{quantity}</span>
          <button
            className="w-8 h-8 text-center font-semibold bg-slate-800 text-white rounded-full"
            onClick={() => incrementQuantity(item)}
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
