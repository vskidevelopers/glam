import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Phone, MapPin } from "lucide-react";
import { useOrdersFunctions, useCartFunctions } from "@/utils/firebase";
import { useNavigate } from "react-router-dom";

const ExpressOrderForm = ({ cartId }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { addOrder } = useOrdersFunctions();
  const { getCart } = useCartFunctions(); // Import getCart from useCartFunctions

  const [cart, setCart] = useState(null); // Initialize cart to null

  useEffect(() => {
    handleFetchCart();
  }, []);

  const navigate = useNavigate();

  const handleFetchCart = async () => {
    try {
      const getCartResponse = await getCart();
      console.log("getCartResponse >> ", getCartResponse);
      if (getCartResponse?.success) {
        setCart(getCartResponse.data); // Store the entire cart data
      } else {
        console.log(
          "decide on what to do if cart response has a success value of false"
        );
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      alert("An error occurred while fetching the cart. Please try again.");
    }
  };

  const currentDate = new Date();
  const options = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short",
  };

  const formattedDate = currentDate.toLocaleString("en-US", options);

  // Form submission handler
  const onSubmit = async (data) => {
    // Determine if a user exists (e.g., via Firebase Auth or Context)
    const user = false;

    // Dynamically construct the customer object
    const customer = user
      ? {
          name: user.name || "Anonymous",
          email: user.email || "no-email@example.com",
          phone: data.customer.phone, // Use phone from the form data
        }
      : {
          name: data.customer.name, // Use name from the form data
          phone: data.customer.phone, // Use phone from the form data
        };

    // Prepare the final order object
    const finalOrder = {
      orderDate: formattedDate,
      location: data.location, // Location from the form
      subscribe: data.subscribe || false, // Subscription preference
      discountCode: data.discountCode || null, // Optional discount code
      cart: cart || [], // Cart items
      customer, // Add dynamically constructed customer object
      paymentInfo: {
        method: "Pay on Delivery",
        mpesaCode: null, // No Mpesa code for Pay on Delivery
      },
      status: "pending",
      type: "EXPRESS",
    };

    console.log("Submitting Order:", finalOrder);

    try {
      // Call the addOrder function with type "EXPRESS"
      const response = await addOrder(finalOrder, "EXPRESS");

      if (response.success) {
        console.log("Order added successfully:", response.message);
        const newOrderId = response.orderId;
        reset();
        alert("Your order as been recived successfully");
        // Handle success, such as navigating to a thank-you page
        localStorage.clear();
        navigate(`/home/order-confirmation/${newOrderId}`);
      } else {
        console.error("Failed to add order:", response.message);
        // Optionally show an error notification
      }
    } catch (error) {
      console.error("An error occurred while submitting the order:", error);
      // Optionally handle errors like showing a toast
    }
  };

  // Calculate the total from cart items
  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + item.subtotal, 0);
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 h-[80vh]">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Express Order Form
      </h2>

      {/* Scrollable Area for Form Content */}
      <ScrollArea className="h-[90%]">
        {/* Check if cart is empty */}
        {cart?.items?.length === 0 || !cart ? (
          <div className="text-center text-gray-600 mt-8">
            <p>Your cart is empty.</p>
            <p>Add items to your cart to proceed with the order.</p>
          </div>
        ) : (
          <>
            {/* Product Details Table */}
            {cart?.items.map((item, index) => (
              <div key={index} className="w-full rounded-lg mb-4">
                <div className="grid grid-cols-3 p-4">
                  <div className="col-span-1 flex justify-center">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-20 h-20 object-cover rounded"
                    />
                  </div>
                  <div className="col-span-1 flex flex-col justify-center items-start">
                    <h3 className="font-semibold text-gray-800">
                      {item.productName}
                    </h3>
                    <p className="text-gray-500">Price: Ksh {item.price}</p>
                    <p className="text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <div className="col-span-1 flex items-center justify-end">
                    <p className="text-gray-800 font-semibold">
                      Ksh {item.subtotal}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Subtotal, Tax, and Total Row */}
            <div className="bg-gray-100 border border-gray-300 p-4 border-t border-gray-300">
              <div className="grid grid-cols-3 mb-2">
                <p className="text-gray-600 col-span-2">Subtotal</p>
                <p className="text-gray-800 font-semibold text-right">
                  Ksh {calculateTotal(cart?.items || [])}
                </p>
              </div>
              <div className="grid grid-cols-3 mb-2">
                <p className="text-gray-600 col-span-2">Tax</p>
                <p className="text-gray-800 font-semibold text-right">Ksh 0</p>
              </div>
              <div className="grid grid-cols-3 font-bold">
                <p className="text-gray-600 col-span-2">Total</p>
                <p className="text-gray-800 text-right">
                  Ksh {calculateTotal(cart?.items || [])}
                </p>
              </div>
            </div>
          </>
        )}

        {/* Customer Form Fields */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700">Name*</label>
            <div className="flex items-center border rounded-lg p-2">
              <User className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Name"
                {...register("customer.name", { required: "Name is required" })}
                className="flex-grow outline-none"
              />
            </div>
            {errors.customer?.name && (
              <p className="text-red-500 text-sm">
                {errors.customer.name.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Phone*</label>
            <div className="flex items-center border rounded-lg p-2">
              <Phone className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Phone"
                {...register("customer.phone", {
                  required: "Phone is required",
                })}
                className="flex-grow outline-none"
              />
            </div>
            {errors.customer?.phone && (
              <p className="text-red-500 text-sm">
                {errors.customer.phone.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Location*</label>
            <div className="flex items-center border rounded-lg p-2">
              <MapPin className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="i.e Lavington Nairobi"
                {...register("location", { required: "Location is required" })}
                className="flex-grow outline-none"
              />
            </div>
            {errors.location && (
              <p className="text-red-500 text-sm">{errors.location.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register("subscribe")}
                className="mr-2"
              />
              Subscribe to stay updated with new products and offers!
            </label>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Discount Code</label>
            <div className="flex">
              <input
                type="text"
                placeholder="Discount Code"
                {...register("discountCode")}
                className="flex-grow border rounded-l-lg p-2 outline-none"
              />
              <button
                type="button"
                className="bg-gray-800 text-white rounded-r-lg px-4"
              >
                Apply
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-2 rounded-lg ${
              cart?.items?.length > 0
                ? "bg-blue-600 text-white cursor-pointer"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
            disabled={!cart || cart?.items?.length === 0}
          >
            BUY IT NOW
          </button>
        </form>
      </ScrollArea>
    </div>
  );
};

export default ExpressOrderForm;
