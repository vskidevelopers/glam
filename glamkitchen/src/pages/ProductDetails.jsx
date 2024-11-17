import { useNavigate, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Star, ShoppingCart } from "lucide-react";

import "./styles/productDetails.css";
import { Heart } from "lucide-react";
import { useState } from "react";
import HeroSection from "@/sections/HeroSection";
import { Button } from "@/components/ui/button";
import CartItem from "@/components/CartItem";
import ExpressOrderForm from "@/components/forms/ExpressOrderForm";
import { Badge } from "@/components/ui/badge";

function ProductDetails() {
  const navigate = useNavigate();
  const productId = useParams();
  console.log("productId >> ", productId);

  // Kitchenware-specific details
  const materials = ["Stainless Steel", "Ceramic", "Plastic", "Wood"];
  const colors = ["Red", "Blue", "Black", "White"];

  // Replace with kitchenware product details
  const product = {
    image:
      "https://reliefline.net/wp-content/uploads/2019/08/Kitchen-Sets-as-per-IFRC-Type-a.jpg", // Replace with actual image URL
    title: "Elegant Kitchenware Set",
    price: "$29.99",
    description:
      "A versatile and durable set of kitchenware to enhance your cooking experience.",
    type: "kitchenware",
    material: "Stainless Steel",
    quantity: 1,
  };

  const [quantity, setQuantity] = useState(product.quantity || 1);

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleSubmit = () => {
    console.log("submitting order: active:false, fulfilled:false");
    navigate("/products/checkout");

    // Handle order submission, generate orderId, and navigate to checkout
  };

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      image: "https://via.placeholder.com/80",
      name: "Elegant Saucepan",
      price: "$25.99",
      quantity: 1,
    },
    {
      id: 2,
      image: "https://via.placeholder.com/80",
      name: "Classic Ceramic Plate Set",
      price: "$15.99",
      quantity: 2,
    },
  ]);

  const subTotal = cartItems
    .reduce(
      (acc, item) => acc + parseFloat(item.price.slice(1)) * item.quantity,
      0
    )
    .toFixed(2);

  return (
    <div className=" ">
      <Sheet>
        <HeroSection
          tagline="Product Details"
          title="Details"
          image="https://hestanculinary.com/cdn/shop/files/Hestan_Culinary_-_NEW_ARRIVALS_-_Tri-Ply_Clad_Stainless_Steel_19-Piece_Entertainers_Bakeware_Set.webp?v=1729630015&width=2160"
        />
        <div className="container mx-auto flex flex-col md:flex-row w-full  justify-center py-10">
          <div className="w-full md:w-1/3">
            {/* Image Section */}
            <div className="h-[450px] w-full bg-zinc-900 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="w-full md:w-1/2 overflow-hidden h-[450px] p-4">
            {/* Details Section */}
            <div className="h-full w-full bg-green-700/10 py-4 px-6 flex flex-col justify-between overflow-y-scroll no-scrollbar">
              {/* Title and Price */}
              <div className="mb-4">
                <h2 className="text-2xl font-bold mb-2">{product.title}</h2>
                <p className="text-xl font-semibold mb-4">{product.price}</p>

                {/* Discount Price and Savings */}
                {product.discountPrice && (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl font-semibold text-green-600">
                      Now: {product.discountPrice}
                    </span>
                    <Badge className="bg-green-600 text-white px-3 py-1 rounded-full">
                      Save {product.price - product.discountPrice}
                    </Badge>
                  </div>
                )}

                {/* Description */}
                <p className="mb-4">{product.description}</p>
              </div>

              {/* Quantity and Order Button */}
              <div className="flex flex-col gap-3 w-full md:w-3/4 mt-auto">
                <div className="flex flex-col gap-2 md:flex-row w-full justify-between items-center space-x-4">
                  <div
                    className="grid w-full items-center bg-slate-800 text-white rounded-full px-2 py-1"
                    style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
                  >
                    <button
                      onClick={handleDecrease}
                      className="h-8 flex justify-center items-center rounded-full"
                    >
                      -
                    </button>
                    <span className="font-bold text-center">{quantity}</span>
                    <button
                      onClick={handleIncrease}
                      className="h-8 flex justify-center items-center rounded-full"
                    >
                      +
                    </button>
                  </div>

                  <div
                    className="grid w-full gap-2"
                    style={{ gridTemplateColumns: "3fr 1fr" }}
                  >
                    <SheetTrigger>
                      <button className="bg-blue-500 w-full text-white py-2 px-2 md:px-6 rounded-full flex items-center justify-center gap-x-2 whitespace-nowrap min-w-[120px]">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 3h2l.4 2M7 13h10l1.6 8H6.4l1.6-8zM7 13L5.4 5H19l-1.6 8H7zm-1 8h14v2H6v-2z"
                          ></path>
                        </svg>
                        <p>Add to Cart</p>
                      </button>
                    </SheetTrigger>
                    <button className="bg-slate-800 text-white py-2 px-4 rounded-full flex justify-center items-center">
                      <Heart className="h-5 w-auto" />
                    </button>
                  </div>
                </div>

                {/* Express Order Button */}
                <div className="w-full flex justify-center mt-4">
                  <Dialog>
                    <DialogTrigger>
                      <Button className="relative bg-green-500 w-full text-white px-6 py-2 rounded-md hover:bg-green-600">
                        <span className="animate-ping absolute -right-2 -top-2 inline-flex h-4 w-4 rounded-full bg-green-400 opacity-75"></span>
                        <span className="absolute -right-2 -top-2 inline-flex rounded-full h-4 w-4 bg-green-500"></span>
                        <ShoppingCart className="mr-2" />
                        Express Order
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Fill the form to order</DialogTitle>
                        <DialogDescription>
                          <ExpressOrderForm />
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
        </div>

        <SheetContent>
          <SheetHeader>
            <SheetTitle>Your Cart</SheetTitle>
            <SheetDescription>
              Review your selected items and proceed to checkout.
            </SheetDescription>
          </SheetHeader>

          <div className="py-4">
            {cartItems.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          <SheetFooter>
            <div className="absolute bottom-5 flex flex-col items-end mt-6 border-t pt-4 ">
              <div className="flex justify-between w-full mb-4 px-2">
                <p className="text-lg font-semibold">Subtotal:</p>
                <p className="text-lg font-bold">${subTotal}</p>
              </div>
              <div className="flex flex-col gap-4 w-full space-x-4">
                <Button className="bg-flame text-white px-6 py-2 rounded-full hover:bg-blue-600">
                  View Your Cart
                </Button>

                <Button className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600">
                  Continue to Checkout
                </Button>
              </div>
            </div>
          </SheetFooter>
        </SheetContent>

        {/* Product Details Tabs */}
        <div className="mx-20 my-16">
          <Tabs defaultValue="description">
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="additionalInfo">Additional Info</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="description">
              <h1 className=" font-mono"> Description goes Here!</h1>
              <div>
                <h1 className="font-bold"></h1>
              </div>
            </TabsContent>
            <TabsContent value="additionalInfo">
              <h1 className=" font-mono"> Additional Info goes Here!</h1>
            </TabsContent>
            <TabsContent value="reviews">
              <Dialog>
                <div className="p-4 border rounded-lg shadow-md py-6">
                  <div className="flex flex-col items-center md:flex-row md:items-start gap-5 py-10">
                    <h2 className="text-xl font-semibold mb-2">Reviews (0)</h2>
                    <div className="pl-0 md:pl-10">
                      <DialogTrigger>
                        {" "}
                        <Button> Add a rating to this product</Button>
                      </DialogTrigger>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3">
                    <div className="flex gap-2">
                      <div className="flex items-center mb-4">
                        <span className="text-4xl font-bold">0</span>
                        <Star className="w-8 h-8 text-gray-400 ml-2" />
                        <span className="ml-2 text-gray-600">0 Ratings</span>
                      </div>

                      <div className="space-y-1 w-40">
                        {Array.from({ length: 5 }, (_, i) => (
                          <div key={i} className="flex items-center">
                            <Star className="w-4 h-4 text-gray-400" />
                            <div className="w-full h-2 bg-gray-200 ml-2 rounded-full">
                              <div
                                className="h-2 bg-gray-400 rounded-full"
                                style={{ width: "0%" }}
                              ></div>
                            </div>
                            <span className="ml-2 text-gray-600">0</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="md:cols-span-2">
                      <p className="text-gray-600 mt-4">
                        There are no reviews yet.
                      </p>
                    </div>
                  </div>
                </div>

                <h1 className=" font-mono"> Reviews go Here!</h1>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </TabsContent>
          </Tabs>
        </div>
      </Sheet>
    </div>
  );
}

export default ProductDetails;
