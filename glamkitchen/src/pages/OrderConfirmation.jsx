import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"; // Adjust import path if needed
import FloatingOrderSummary from "@/components/FloatingOrderSummary"; // Import the order summary component

function OrderConfirmation() {
  const navigate = useNavigate();
  const cart = {
    orderId: "GYK12345",
    orderDate: "2024-11-14",
    items: [
      { name: "Non-stick Pan", quantity: 2, price: 25.99 },
      { name: "Knife Set", quantity: 1, price: 45.0 },
    ],
    subtotal: 96.98,
    shipping: 10.0,
    tax: 5.0,
    total: 111.98,
    shippingInfo: {
      name: "John Doe",
      address: "123 Kitchen Lane",
      city: "Flavor Town",
      state: "CA",
      zip: "90210",
    },
    billingInfo: {
      sameAsShipping: true,
    },
    customerInfo: {
      name: "John Doe",
      email: "johndoe@example.com",
      phone: "555-1234",
    },
    paymentInfo: {
      cardType: "Visa",
      lastFour: "1234",
    },
    lastUpdated: "2024-11-14T10:00:00",
  };

  return (
    <div className="flex justify-center items-center h-full bg-gray-100 pt-20 mb-16">
      <div className="max-w-2xl w-full p-8 bg-white rounded-lg shadow-lg ">
        <h1 className="text-3xl font-semibold text-teal-600 mb-4 text-center">
          Order Confirmed
        </h1>
        <p className="text-gray-700 mb-4 text-center">
          Thank you for shopping with **Glam Your Kitchen**! Your order has been
          successfully placed.
        </p>
        <p className="text-gray-700 mb-4 text-center">
          You’ll receive a confirmation email shortly with your order details.
          Once your order is shipped, you'll receive another email with tracking
          information.
        </p>
        <p className="text-gray-700 text-center mb-6">
          For any questions or assistance, feel free to reach out to our support
          team.
        </p>

        {/* Order Summary Section */}
        <div className="mb-6">
          <FloatingOrderSummary cart={cart} />
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-between items-center mt-6">
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white"
            onClick={() => navigate("/")}
          >
            Back to Home
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => navigate("/order-tracking")}
          >
            Track Your Order
          </Button>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;
