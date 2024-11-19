import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Phone, MapPin } from "lucide-react";
import { useOrdersFunctions } from "@/utils/firebase";

const ExpressOrderForm = ({ CART_KEY }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { addOrder } = useOrdersFunctions();

  const [cart, setCart] = useState();

  useEffect(() => {
    handleFetchOrder();
  }, []);

  const handleFetchOrder = () => {
    let cart = localStorage.getItem(CART_KEY);
    if (cart) {
      cart = JSON.parse(cart); // Parse the cart string into an object
      console.log("Cart to post >>", cart); // Log the cart as an object
      setCart(cart);
    } else {
      console.log("Cart is empty or not found.");
    }
  };

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
      location: data.location, // Location from the form
      subscribe: data.subscribe || false, // Subscription preference
      discountCode: data.discountCode || null, // Optional discount code
      cart: cart || [], // Cart items
      customer, // Add dynamically constructed customer object
      paymentMethod: "pay on delivery",
    };

    console.log("Submitting Order:", finalOrder);

    try {
      // Call the addOrder function with type "EXPRESS"
      const response = await addOrder(finalOrder, "EXPRESS");

      if (response.success) {
        console.log("Order added successfully:", response.message);
        // Handle success, such as navigating to a thank-you page
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
        {/* Product Details Table */}
        {cart?.items?.map((item, index) => (
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
            className="w-full bg-blue-600 text-white py-2 rounded-lg"
          >
            BUY IT NOW
          </button>
        </form>
      </ScrollArea>
    </div>
  );
};

export default ExpressOrderForm;
