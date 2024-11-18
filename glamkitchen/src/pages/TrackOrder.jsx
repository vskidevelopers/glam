import React from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function TrackOrder() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Tracking order with data:", data);
    // Implement tracking logic here
    alert("Tracking Order...");
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
              <label htmlFor="email" className="font-medium text-gray-700">
                Customer Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                {...register("email", { required: true })}
              />
              {errors.email && (
                <span className="text-red-500">Email is required</span>
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
    </div>
  );
}
