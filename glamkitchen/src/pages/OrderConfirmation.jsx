import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button"; // Adjust import path if needed
import FloatingOrderSummary from "@/components/FloatingOrderSummary"; // Import the order summary component
import { useOrdersFunctions } from "@/utils/firebase"; // Import order functions

function OrderConfirmation() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { orderId } = useParams(); // Get the order ID from the URL
  const { fetchOrderById } = useOrdersFunctions(); // Import the fetchOrderById function

  useEffect(() => {
    handleFetchOrder();
  }, [orderId]);

  const handleFetchOrder = async () => {
    setLoading(true);
    try {
      const fetchResult = await fetchOrderById(orderId); // Fetch order by ID
      if (fetchResult.success) {
        console.log("fetch results >> ", fetchResult);

        setOrder(fetchResult?.data);
        setLoading(false);
      } else {
        console.error("Error fetching order:", fetchResult);
        alert("An error occurred while fetching your order. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      alert("An error occurred while fetching your order. Please try again.");
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center h-full bg-gray-100 pt-20 mb-16">
        <div className="max-w-2xl w-full p-8 bg-white rounded-lg shadow-lg ">
          <h1 className="text-3xl font-semibold text-teal-600 mb-4 text-center">
            Order Not Found
          </h1>
          <p className="text-gray-700 mb-4 text-center">
            The order you are trying to access could not be found. Please check
            your order ID and try again.
          </p>
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white"
            onClick={() => navigate("/")}
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

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
          <FloatingOrderSummary orderId={order?.id} cart={order?.cart} />{" "}
          {/* Pass the order's cart */}
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
            onClick={() => navigate("/home/order-tracking")}
          >
            Track Your Order
          </Button>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;
