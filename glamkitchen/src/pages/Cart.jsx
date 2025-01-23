import CartTable from "@/components/CartTable";
import OrderSummary from "@/components/OrderSummary";
import HeroSection from "@/sections/HeroSection";
import { useCartFunctions } from "@/utils/firebase";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Cart() {
  const { getCart } = useCartFunctions();
  const [cart, setCart] = useState(null); // Initialize cart to null

  // No need for local storage anymore, as we'll use Firebase
  // const CART_KEY = "cart";
  // const storedCart = JSON.parse(localStorage.getItem(CART_KEY));
  // const [cartItems, setCartItems] = useState(() => storedCart ? storedCart.items : []);

  const [cartItems, setCartItems] = useState([]); // Initialize cartItems to an empty array
  const [subTotal, setSubTotal] = useState(0);

  const handleFetchCart = async () => {
    const getCartResponse = await getCart();
    console.log("getCartResponse >> ", getCartResponse);
    if (getCartResponse?.success) {
      setCartItems(getCartResponse.data.items);
      setCart(getCartResponse.data); // Store the entire cart data
      setSubTotal(getCartResponse.data.totalPrice);
    } else {
      console.log(
        "decide on what to do if cart response has a success value of false"
      );
    }
  };

  useEffect(() => {
    handleFetchCart();
  }, []);

  // Remove the handleRemoveItem function, as it's now handled by Firebase
  // const handleRemoveItem = (productId) => {
  //   // ... (previous logic)
  // };

  return (
    <div>
      <HeroSection
        title={"Your Cart"}
        image={
          "https://media.istockphoto.com/id/1223414833/photo/clean-saucepan-on-a-gas-stove-in-kitchen.jpg?s=612x612&w=0&k=20&c=U1L33o9BH9qXtfexlWleX0Y5qGy4es0ySk1Drgq_oxk="
        }
      />

      <main className="grid flex-1 md:px-16 items-start gap-4 px-4 sm:px-6 sm:py-10 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        {cartItems?.length > 0 ? (
          <>
            <div className="col-span-2">
              <h2 className="font-bold text-2xl md:text-5xl">Your Cart</h2>
              <CartTable cart={cartItems} fetchCart={handleFetchCart} />{" "}
              {/* Pass cartItems to CartTable */}
            </div>
            <div>
              <OrderSummary subtotal={subTotal} cart={cart} />{" "}
              {/* Pass cart to OrderSummary */}
            </div>
          </>
        ) : (
          <div className="col-span-3 flex flex-col items-center justify-center h-full text-gray-600">
            <h2 className="font-bold text-2xl md:text-5xl mb-4">
              Your Cart is Empty
            </h2>
            <p className="text-lg text-gray-500 mb-6">
              Add some items to see them here.
            </p>
            <Link
              className="bg-blue-600 text-white px-6 py-2 rounded-lg"
              to="/shop"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default Cart;
