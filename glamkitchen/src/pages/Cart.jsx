import CartTable from "@/components/CartTable";
import OrderSummary from "@/components/OrderSummary";
import HeroSection from "@/sections/HeroSection";
import { useCartFunctions } from "@/utils/firebase";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Cart() {
  const { getCart } = useCartFunctions();
  const [cart, setCart] = useState();
  const [cartItems, setCartItems] = useState(() => {
    const CART_KEY = "cart";
    const storedCart = JSON.parse(localStorage.getItem(CART_KEY));
    return storedCart ? storedCart.items : [];
  });
  const CART_KEY = "cart";
  const handleRemoveItem = (productId) => {
    const updatedCartItems = cartItems.filter(
      (item) => item.productId !== productId
    );

    setCartItems(updatedCartItems);

    // Update local storage
    const storedCart = JSON.parse(localStorage.getItem(CART_KEY));
    if (storedCart) {
      const updatedCart = {
        ...storedCart,
        items: updatedCartItems,
        totalQuantity: updatedCartItems.reduce(
          (acc, item) => acc + item.quantity,
          0
        ),
        totalPrice: updatedCartItems.reduce(
          (acc, item) => acc + item.subtotal,
          0
        ),
      };
      localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
    }
  };
  const [subTotal, setSubTotal] = useState(0);

  const handleFetchCart = async () => {
    const getCartResponse = await getCart();
    console.log("getCartResponse >> ", getCartResponse);
    setCartItems(getCartResponse?.items);
    setCart(getCartResponse);
    setSubTotal(getCartResponse?.totalPrice);
  };

  useEffect(() => {
    handleFetchCart();
  }, []);
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
              <CartTable cart={cartItems} />
            </div>
            <div>
              <OrderSummary subtotal={subTotal} cart={cart} />
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
              to="/home/shop"
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
