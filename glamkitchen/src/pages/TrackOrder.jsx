import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useOrdersFunctions } from "@/utils/firebase";

export default function TrackOrder() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { trackOrder } = useOrdersFunctions(); // Get the trackOrder function

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [order, setOrder] = useState();
  const [dialogContent, setDialogContent] = useState({
    title: "",
    description: "",
  });

  const onSubmit = (data) => {
    console.log("Tracking order with data:", data);

    try {
      const orderId = data.orderId;
      const phoneNumber = data.phone;

      trackOrder(orderId, phoneNumber)
        .then((result) => {
          console.log("track order results >>> ", result);

          if (result.success) {
            setDialogContent({
              title: "Order Status",
              description: `Your order status is: ${result.status}`,
            });
            setOrder(result?.order);
          } else {
            setDialogContent({
              title: "Tracking Failed",
              description: result.message,
            });
          }
          setIsDialogOpen(true); // Open dialog after setting content
        })
        .catch((error) => {
          console.error("Error tracking order:", error);
          setDialogContent({
            title: "Error",
            description:
              "An error occurred while tracking the order. Please try again.",
          });
          setIsDialogOpen(true); // Open dialog after setting content
        });
    } catch (error) {
      console.error("Error in onSubmit function:", error);
      setDialogContent({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
      setIsDialogOpen(true); // Open dialog after setting content
    }
  };

  return (
    <div
      className="flex w-screen h-screen justify-center items-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/premium-photo/vibrant-digital-map-with-glowing-pink-location-pins-dark-background-depicting-modern-gps-navigation-technology-visually-striking-way_86390-15356.jpg')", // Update this with the correct image path
      }}
    >
      <Card className="w-full max-w-sm shadow-lg rounded-lg bg-white/90">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="text-2xl text-center font-bold text-flame">
              Track Your Order
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="orderId" className="font-medium text-gray-700">
                Order ID
              </label>
              <Input
                id="orderId"
                type="text"
                placeholder="Enter your Order ID"
                {...register("orderId", { required: true })}
              />
              {errors.orderId && (
                <span className="text-red-500">Order ID is required</span>
              )}
            </div>
            <div className="grid gap-2">
              <label htmlFor="phone" className="font-medium text-gray-700">
                Customer Phone Number
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                {...register("phone", {
                  required: true,
                  pattern: /^[0-9]{10,15}$/, // Optional: Regex to validate phone numbers
                })}
              />
              {errors.phone && (
                <span className="text-red-500">
                  {errors.phone.type === "required"
                    ? "Phone number is required"
                    : "Invalid phone number"}
                </span>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-robin_egg_blue-500 hover:bg-robin_egg_blue-600 text-white"
              type="submit"
            >
              Track Order
            </Button>
          </CardFooter>
        </form>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger />
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-green-600">
              Order Status: {order?.status || "Unknown"}
            </DialogTitle>
            <DialogDescription>
              <p>
                Order ID: <strong>{order?.id}</strong>
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Customer Details */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800">
                Customer Details
              </h3>
              <p>
                <strong>Name:</strong> {order?.customer?.name || "N/A"}
              </p>
              <p>
                <strong>Phone:</strong> {order?.customer?.phone || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {order?.customer?.email || "N/A"}
              </p>
            </section>

            {/* Order Items */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800">
                Order Items
              </h3>
              <div className="max-h-48 overflow-y-auto border rounded-lg p-4 bg-gray-50">
                {order?.cart?.items?.map((item) => (
                  <div
                    key={item?.id}
                    className="border-b py-3 flex gap-4 items-center"
                  >
                    <img
                      src={item?.productImage}
                      alt={item?.productName}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <p className="font-semibold">{item?.productName}</p>
                      <p className="text-gray-600">
                        {item?.productDescription.slice(0, 60)}...
                      </p>
                      <p>
                        <strong>Price:</strong> KES {item?.price} x{" "}
                        {item?.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-2">
                <strong>Total Price:</strong> KES {order?.cart?.totalPrice || 0}
              </p>
            </section>

            {/* Additional Info */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800">
                Order Summary
              </h3>
              <p>
                <strong>Payment Method:</strong> {order?.paymentInfo?.method}
                {order?.paymentInfo?.method === "Mpesa" &&
                  ` (Code: ${order?.paymentInfo?.mpesaCode || "N/A"})`}
              </p>
              <p>
                <strong>Order Date:</strong>{" "}
                {new Date(order?.orderDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Location:</strong> {order?.location || "N/A"}
              </p>
            </section>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
