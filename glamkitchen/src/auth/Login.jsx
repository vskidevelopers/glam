import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { useAuthenticationFunctions } from "@/utils/firebase";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { login } = useAuthenticationFunctions();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    console.log(data); // Handle form submission logic here
    try {
      const loginResponse = await login(data?.email, data?.password);
      console.log("loginResponse >> ", loginResponse);
      if (loginResponse?.success) {
        setLoading(false);
        alert("Login successful");
        navigate("/admin"); // Redirect to the admin dashboard
      } else {
        console.error("loginResponse >> ", loginResponse);
        alert("Error trying to log in");
        setLoading(false);
      }
    } catch (error) {
      console.log(`Error in submit handler: ${error}`);
      setLoading(false);
    }
  };

  return (
    <div className="flex w-screen h-screen justify-center items-center bg-flame-50">
      <Card className="w-full max-w-sm shadow-lg rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="text-2xl text-center font-bold text-robin_egg_blue-900">
              Admin Login
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Please enter your credentials to manage your kitchenware store.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="email" className="font-medium text-gray-700">
                Admin Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="admin@glamyourkitchen.com"
                {...register("email", { required: true })}
              />
              {errors.email && (
                <span className="text-red-500">Email is required</span>
              )}
            </div>
            <div className="grid gap-2">
              <label htmlFor="password" className="font-medium text-gray-700">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password", { required: true })}
              />
              {errors.password && (
                <span className="text-red-500">Password is required</span>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-robin_egg_blue-500 hover:bg-robin_egg_blue-600 text-white"
              type="submit"
            >
              {loading ? "Logging in..." : "Log in"}
            </Button>
            <p className="text-center mt-4 text-gray-600">
              Don't have an account?{" "}
              <a href="/signup" className="text-flame-500 hover:underline">
                Sign up here
              </a>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
