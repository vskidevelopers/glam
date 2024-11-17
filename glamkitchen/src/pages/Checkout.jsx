import { Link } from "react-router-dom";
import Typewriter from "typewriter-effect";
import { useForm } from "react-hook-form";
import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FloatingOrderSummary from "@/components/FloatingOrderSummary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CheckoutForm from "@/components/forms/CheckoutForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function Checkout() {
  const user = false;
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [paymentMethod, setPaymentMethod] = useState("Pay on Delivery");

  const onSubmit = (data) => {
    console.log("Form Submitted:", data);
    // handle the form submission (send to backend or db)
  };

  const title = "Shop | Checkout";
  const image =
    "https://media.istockphoto.com/id/1223414833/photo/clean-saucepan-on-a-gas-stove-in-kitchen.jpg?s=612x612&w=0&k=20&c=U1L33o9BH9qXtfexlWleX0Y5qGy4es0ySk1Drgq_oxk=";
  return (
    <div className="">
      {/* CheckOutHeroSection */}
      <div className="relative h-72 ">
        {/* Background Image */}
        <div
          className="absolute inset-0 h-full w-full bg-cover bg-bottom"
          style={{
            backgroundImage: `url(${image})`,
          }}
        >
          {/* Black Shade Overlay */}
          {/* <div className="absolute inset-0 h-full w-full bg-[#181b1c]/75"></div> */}
          <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-black via-[#181b1c]/75 to-transparent"></div>
        </div>
        {/* Heading Tag */}
        <div className="absolute inset-0 flex pl-10 flex-col justify-center items-start text-white">
          <Typewriter
            options={{
              wrapperClassName:
                "text-5xl md:text-6xl font-bold font-serif capitalize",
              cursorClassName: "text-5xl md:text-6xl font-bold font-serif",
              strings: title,
              autoStart: true,
              loop: false,
            }}
          />
          {/* Breadcrumb */}
          <div className="py-2 text-[#FDB715] ">
            <Link to="/" className="text-white">
              Home
            </Link>{" "}
            | {title}
          </div>
        </div>
      </div>

      <main className="grid flex-1 items-start gap-4 px-4 sm:px-6 sm:py-10 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2"
        >
          <div className="grid gap-4 sm:grid-cols-1">
            <Tabs defaultValue="checkOutDetailForm">
              {/* Checkout Details Tab */}
              <TabsContent value="checkOutDetailForm">
                <Card className="sm:col-span-2">
                  <CardHeader className="pb-3">
                    <CardTitle>Checkout Details Form</CardTitle>
                    <CardDescription className="max-w-lg text-balance leading-relaxed">
                      {user
                        ? "Provide your delivery information"
                        : "Enter Your Details in the form below"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-3">
                    {/* Customer Details */}
                    {!user && (
                      <div className="mb-4">
                        <label className="block mb-2 font-medium">Name</label>
                        <input
                          type="text"
                          {...register("name", { required: true })}
                          className="w-full border rounded px-3 py-2"
                        />
                        {errors.name && (
                          <p className="text-red-600">Name is required.</p>
                        )}
                      </div>
                    )}
                    <div className="mb-4">
                      <label className="block mb-2 font-medium">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        {...register("phone", { required: true })}
                        className="w-full border rounded px-3 py-2"
                      />
                      {errors.phone && (
                        <p className="text-red-600">
                          Phone number is required.
                        </p>
                      )}
                    </div>
                    {!user && (
                      <div className="mb-4">
                        <label className="block mb-2 font-medium">Email</label>
                        <input
                          type="email"
                          {...register("email", { required: true })}
                          className="w-full border rounded px-3 py-2"
                        />
                        {errors.email && (
                          <p className="text-red-600">Email is required.</p>
                        )}
                      </div>
                    )}
                    <div className="mb-4">
                      <label className="block mb-2 font-medium">
                        Location / Address
                      </label>
                      <input
                        type="text"
                        {...register("location", { required: true })}
                        className="w-full border rounded px-3 py-2"
                      />
                      {errors.location && (
                        <p className="text-red-600">Location is required.</p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <TabsList>
                      <TabsTrigger value="paymentMethodForm">
                        Continue to Payment Method
                      </TabsTrigger>
                    </TabsList>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Payment Method Tab */}
              <TabsContent value="paymentMethodForm">
                <Card className="sm:col-span-2">
                  <CardHeader className="pb-3">
                    <CardTitle>Payment Method</CardTitle>
                    <CardDescription className="max-w-lg text-balance leading-relaxed">
                      Select your preferred payment method
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 mb-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          value="Mpesa"
                          checked={paymentMethod === "Mpesa"}
                          onChange={() => setPaymentMethod("Mpesa")}
                          className="form-radio"
                        />
                        Mpesa
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          value="Pay on Delivery"
                          checked={paymentMethod === "Pay on Delivery"}
                          onChange={() => setPaymentMethod("Pay on Delivery")}
                          className="form-radio"
                        />
                        Pay on Delivery{" "}
                        <Badge className="bg-emerald-500">Popular</Badge>
                      </label>
                    </div>
                    {paymentMethod === "Mpesa" && (
                      <div className="mb-4">
                        <label className="block mb-2 font-medium">
                          Lipa Na Mpesa
                        </label>

                        {/* Instructions for Mpesa Payment */}
                        <p className="text-gray-600 mb-3">
                          For Lipa Na Mpesa, use the following details:
                          <br />
                          <strong>Paybill:</strong> xxxxxx
                          <br />
                          <strong>Account Number:</strong> xxxxxx
                          <br />
                          After making the payment, paste the Mpesa code below
                          for verification before placing your order.
                        </p>

                        {/* Mpesa Code Input */}
                        <label className="block mb-2 font-medium">
                          Mpesa Code
                        </label>
                        <input
                          type="text"
                          {...register("mpesaCode", {
                            required: paymentMethod === "Mpesa",
                          })}
                          placeholder="Enter Mpesa code"
                          className="w-full border rounded px-3 py-2"
                        />

                        {errors.mpesaCode && (
                          <p className="text-red-600">
                            Mpesa code is required.
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="submit"
                      className="bg-green-600 text-white py-2 px-6 rounded-md"
                    >
                      Place Order
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </form>
        <FloatingOrderSummary />
      </main>
    </div>
  );
}

export default Checkout;
