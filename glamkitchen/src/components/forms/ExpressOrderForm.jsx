import React from "react";
import { useForm } from "react-hook-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Phone, MapPin } from "lucide-react";

const ExpressOrderForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Mock product data
  const product = {
    image:
      "https://ke.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/15/1281531/1.jpg?2838",
    title: "Elegant Kitchen Set",
    price: 1500,
  };

  const subtotal = product.price;
  const tax = 0;
  const total = subtotal + tax;

  // Form submission handler
  const onSubmit = (data) => {
    console.log("Order Submitted:", data);
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 h-[80vh] ">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Express Order Form
      </h2>

      {/* Scrollable Area for Form Content */}
      <ScrollArea className="h-[90%] ">
        {/* Product Details Table */}
        <div className="w-full  rounded-lg mb-4">
          <div className="grid grid-cols-3  p-4 ">
            <div className="col-span-1 flex justify-center">
              <img
                src={product.image}
                alt={product.title}
                className="w-20 h-20 object-cover rounded"
              />
            </div>
            <div className="col-span-1 flex flex-col justify-center items-start">
              <h3 className="font-semibold text-gray-800">{product.title}</h3>
              <p className="text-gray-500">Price: Ksh {product.price}</p>
            </div>
            <div className="col-span-1 flex items-center justify-end">
              <p className="text-gray-800 font-semibold">Ksh {product.price}</p>
            </div>
          </div>

          {/* Subtotal, Tax, and Total Row */}
          <div className="bg-gray-100 border border-gray-300 p-4 border-t border-gray-300">
            <div className="grid grid-cols-3 mb-2">
              <p className="text-gray-600 col-span-2">Subtotal</p>
              <p className="text-gray-800 font-semibold text-right">
                Ksh {subtotal}
              </p>
            </div>
            <div className="grid grid-cols-3 mb-2">
              <p className="text-gray-600 col-span-2">Tax</p>
              <p className="text-gray-800 font-semibold text-right">
                Ksh {tax}
              </p>
            </div>
            <div className="grid grid-cols-3 font-bold">
              <p className="text-gray-600 col-span-2">Total</p>
              <p className="text-gray-800 text-right">Ksh {total}</p>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700">Name*</label>
            <div className="flex items-center border rounded-lg p-2">
              <User className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Name"
                {...register("name", { required: "Name is required" })}
                className="flex-grow outline-none"
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Phone*</label>
            <div className="flex items-center border rounded-lg p-2">
              <Phone className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Phone"
                {...register("phone", { required: "Phone is required" })}
                className="flex-grow outline-none"
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
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
