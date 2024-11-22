import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import HeroSection from "@/sections/HeroSection";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, RefreshCcwDot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useProductFunctions, useCartFunctions } from "@/utils/firebase";
import CartItem from "@/components/CartItem";
import ExpressOrderForm from "@/components/forms/ExpressOrderForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";

import "./styles/productDetails.css";

function ProductDetails() {
  const navigate = useNavigate();
  const { productId } = useParams(); // Get productId from URL params
  const { fetchProductDetail } = useProductFunctions();
  const {
    addItemToCart,
    getCart,
    createCart,
    deleteCartItem,
    updateCartItemQuantity,
  } = useCartFunctions(); // Import cart functions
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1); // Default quantity to 1
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [cartId, setCartId] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(false);

  // Function to handle removing an item from the cart

  // Function to fetch product details
  const getProductDetails = async () => {
    try {
      const response = await fetchProductDetail(productId);
      if (response?.success) {
        setProduct(response.data);
      } else {
        console.error("Failed to fetch product details.");
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProductDetails();
  }, [productId]);

  // Function to handle adding an item to the cart
  const handleAddItemToCart = async (item) => {
    console.log("Item to add to cart >> ", item);

    try {
      // 1. Check for existing cart ID in localStorage
      let cartId = localStorage.getItem("currentCartId");

      // 2. If no cart exists, create one
      if (!cartId) {
        const newCartResult = await createCart(); // Call your createCart function
        if (newCartResult.success) {
          cartId = newCartResult.data;
          localStorage.setItem("currentCartId", cartId);
        } else {
          console.error("Error creating cart:", newCartResult.error);
          alert("An error occurred while creating a cart. Please try again.");
          return; // Stop execution if cart creation fails
        }
      }

      // 3. Add the item to the cart
      const addItemResult = await addItemToCart(item, cartId); // Pass cartId to addItemToCart
      console.log("addItemResult >> ", addItemResult);

      if (addItemResult.success) {
        // Update cart state using the setState function
        setCartItems(addItemResult.data.items); // Update items
        handleFetchCart();
        setCartId(addItemResult.data.cartId); // Update cartId
        // ... other state updates as needed

        // Optionally, display a success message to the user
        alert("Item added to cart successfully!");
        console.log("cart state >> ", cartItems);
      } else {
        // Handle errors
        console.error("Error adding item to cart:", addItemResult.error);
        alert(
          "An error occurred while adding the item to your cart. Please try again."
        );
      }
    } catch (error) {
      console.error("An error occurred while adding item to cart >> ", error);
      alert(
        "An error occurred while adding the item to your cart. Please try again."
      );
    }
  };

  // Handle quantity changes
  const handleQuantityChange = async (product, newQuantity) => {
    try {
      const updateResult = await updateCartItemQuantity(
        product.productId,
        newQuantity
      );
      if (updateResult.success) {
        setCartItems(updateResult.data.items); // Update cartItems state
        setSubTotal(updateResult.data.totalPrice); // Update subtotal
        // ... other state updates as needed
      } else {
        console.error("Error updating item quantity:", updateResult.error);
        // Handle error, e.g., display an error message
      }
      handleFetchCart();
    } catch (error) {
      console.error("Error updating item quantity:", error);
      // Handle error, e.g., display an error message
      handleFetchCart();
    }
  };

  // Handle item removal
  const handleRemoveItem = async (productId) => {
    try {
      const deleteResult = await deleteCartItem(productId);
      if (deleteResult.success) {
        setCartItems(deleteResult.data.items);
        setSubTotal(deleteResult.data.totalPrice);
      } else {
        console.error("Error deleting item from cart:", deleteResult.error);
        alert("An error occurred while deleting the item. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting item from cart:", error);
      alert("An error occurred while deleting the item. Please try again.");
    }
  };

  const handleFetchCart = async () => {
    setFetchLoading(true);
    try {
      const getCartResponse = await getCart();
      console.log("getCartResponse >> ", getCartResponse);
      if (getCartResponse?.success) {
        setCartItems(getCartResponse.data.items);
        setSubTotal(getCartResponse.data.totalPrice);
        setCartId(getCartResponse.data.cartId); // Store the cartId
        setFetchLoading(false);
      } else {
        console.log(
          "decide on what to do if cart response has a success value of false"
        );
        setFetchLoading(false);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      alert("An error occurred while fetching the cart. Please try again.");
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    handleFetchCart();
  }, []);

  const handleExpressOrder = () => {
    // No need to use localStorage here, as you're using Firebase
    // You can directly access the cart data from the cartItems state
    console.log("Cart to post >>", cartItems);
  };

  // Show loading state while fetching product data
  if (loading) return <div>Loading...</div>;

  // Show error if product data is not found
  if (!product) return <div>Product not found!</div>;

  return (
    <div>
      <Sheet>
        <HeroSection
          tagline="Product Details"
          title="Details"
          image={product.productImage || "fallback-image-url"}
        />
        <div className="container mx-auto flex flex-col md:flex-row w-full justify-center py-10">
          <div className="w-full md:w-1/3">
            <div className="h-[450px] w-full bg-zinc-900 flex items-center justify-center">
              <img
                src={product.productImage}
                alt={product.productName}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="w-full md:w-1/2 overflow-hidden h-[450px] p-4">
            <div className="h-full w-full bg-green-700/10 py-4 px-6 flex flex-col justify-between overflow-y-scroll no-scrollbar">
              <div className="mb-4">
                <h2 className="text-2xl font-bold mb-2">
                  {product.productName}
                </h2>
                <p className="text-xl font-semibold mb-4">${product.price}</p>
                {product.discountPrice && (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl font-semibold text-green-600">
                      Now: ${product.discountPrice}
                    </span>
                    <Badge className="bg-green-600 text-white px-3 py-1 rounded-full">
                      Save ${product.price - product.discountPrice}
                    </Badge>
                  </div>
                )}
                <p className="mb-4">{product.productDescription}</p>
              </div>

              <div className="flex flex-col gap-3 w-full md:w-3/4 mt-auto">
                <div className="flex flex-col gap-2 md:flex-row w-full justify-between items-center space-x-4">
                  <div
                    className="grid w-full items-center bg-slate-800 text-white rounded-full px-2 py-1"
                    style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
                  >
                    <button
                      // onClick={handleDecrease}
                      className="h-8 flex justify-center items-center rounded-full"
                    >
                      -
                    </button>
                    <span className="font-bold text-center">{quantity}</span>
                    <button
                      // onClick={handleIncrease}
                      className="h-8 flex justify-center items-center rounded-full"
                    >
                      +
                    </button>
                  </div>

                  <div
                    className="grid w-full gap-2"
                    style={{ gridTemplateColumns: "3fr 1fr" }}
                  >
                    <SheetTrigger onClick={() => handleAddItemToCart(product)}>
                      <button className="bg-blue-500 w-full text-white py-2 px-2 md:px-6 rounded-full flex items-center justify-center gap-x-2 whitespace-nowrap min-w-[120px]">
                        <ShoppingCart />
                        Add to Cart
                      </button>
                    </SheetTrigger>
                    <button className="bg-slate-800 text-white py-2 px-4 rounded-full flex justify-center items-center">
                      <Heart className="h-5 w-auto" />
                    </button>
                  </div>
                </div>

                <div className="w-full flex justify-center mt-4">
                  <Dialog>
                    <DialogTrigger>
                      <Button className="relative bg-green-500 w-full text-white px-6 py-2 rounded-md hover:bg-green-600">
                        <span className="animate-ping absolute -right-2 -top-2 inline-flex h-4 w-4 rounded-full bg-green-400 opacity-75"></span>
                        <span className="absolute -right-2 -top-2 inline-flex h-4 w-4 rounded-full bg-green-400 opacity-100"></span>
                        Express Order
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Fill the form to order</DialogTitle>
                        <DialogDescription>
                          <ExpressOrderForm cartId={cartId} />
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
          <ScrollArea className="h-[90%]">
            <SheetHeader>
              <SheetTitle>
                Your Cart{" "}
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1"
                  onClick={handleFetchCart}
                >
                  <RefreshCcwDot
                    className={`h-3.5 w-3.5 ${
                      fetchLoading ? "animate-spin" : ""
                    }`}
                  />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Refresh
                  </span>
                </Button>
              </SheetTitle>
              <SheetDescription>
                Review your selected items and proceed to checkout.
              </SheetDescription>
            </SheetHeader>

            <div className="py-4">
              {cartItems?.map((item) => (
                <CartItem
                  key={item.productId}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemoveItem}
                  fetchCart={handleFetchCart}
                />
              ))}
            </div>

            <SheetFooter>
              <div className="absolute bottom-5 flex flex-col items-end mt-6 border-t pt-4 ">
                <div className="flex justify-between w-full mb-4 px-2">
                  <p className="text-lg font-semibold">Subtotal:</p>
                  <p className="text-lg font-bold">Ksh {subTotal}</p>
                </div>
                <div className="flex flex-col gap-4 w-full space-x-4">
                  <Dialog>
                    <DialogTrigger
                      onClick={handleExpressOrder}
                      className="bg-flame text-white px-6 py-2 rounded-full hover:bg-blue-600"
                    >
                      Order Now
                    </DialogTrigger>
                    <DialogContent className="w-[650px] max-w-4xl">
                      <ExpressOrderForm cartId={cartId} />
                    </DialogContent>
                  </Dialog>

                  <Link
                    to={`/home/checkout?cartId=${cartId}`} // Pass cartId to checkout
                    className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600"
                  >
                    Continue to Checkout
                  </Link>
                </div>
              </div>
            </SheetFooter>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default ProductDetails;
