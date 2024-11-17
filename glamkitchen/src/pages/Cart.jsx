import CartTable from "@/components/CartTable";
import OrderSummary from "@/components/OrderSummary";
import HeroSection from "@/sections/HeroSection";
import React from "react";

function Cart() {
  const cart = {
    customer: {
      id: "cust_001", // unique identifier for the customer
      name: "Jane Doe", // customer's name
      email: "janedoe@example.com", // customer's email address
    },
    items: [
      {
        productId: "prod_001",
        productName: "Stainless Steel Frying Pan",
        image: "https://example.com/images/frying-pan.jpg",
        price: 25.99,
        quantity: 2,
        subtotal: 51.98,
      },
      {
        productId: "prod_002",
        productName: "Ceramic Coffee Mug",
        image: "https://example.com/images/coffee-mug.jpg",
        price: 9.99,
        quantity: 4,
        subtotal: 39.96,
      },
      {
        productId: "prod_003",
        productName: "Cutting Board Set",
        image: "https://example.com/images/cutting-board.jpg",
        price: 14.99,
        quantity: 1,
        subtotal: 14.99,
      },
    ],
    totalAmount: 106.93, // optional, sum of subtotals in the cart
  };

  return (
    <div>
      <HeroSection
        title={"Your Cart"}
        image={
          "https://media.istockphoto.com/id/1223414833/photo/clean-saucepan-on-a-gas-stove-in-kitchen.jpg?s=612x612&w=0&k=20&c=U1L33o9BH9qXtfexlWleX0Y5qGy4es0ySk1Drgq_oxk="
        }
      />

      <main className="grid flex-1 items-start gap-4 px-4 sm:px-6 sm:py-10 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="col-span-2">
          <h2 className="font-bold text-2xl md:text-5xl">Your Cart</h2>
          <CartTable cart={cart} />
        </div>
        <div>
          <OrderSummary cart={cart} />
        </div>
      </main>
    </div>
  );
}

export default Cart;
