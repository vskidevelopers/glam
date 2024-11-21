import { Maximize, Heart, RefreshCcwDot } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import FloatingProductCard from "./FloatingProductCard";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { useEffect, useState } from "react";
import CartItem from "./CartItem";
import { useCartFunctions } from "@/utils/firebase";
import ExpressOrderForm from "./forms/ExpressOrderForm";

function ProductCard({ product, index, loading }) {
  console.log(`product # ${index} >>`, product);
  const {
    addItemToCart,
    getCart,
    createCart,
    deleteCartItem,
    updateCartItemQuantity,
  } = useCartFunctions();

  const [cartItems, setCartItems] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [cartId, setCartId] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(false);

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

  const {
    productImage,
    productName,
    price,
    discountPrice,
    productProperties,
    productTags,
    stockStatus,
  } = product;

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

  // Helper function to display badges
  const getBadges = () => {
    const badges = [];
    if (productProperties?.new) badges.push("New");
    if (productProperties?.offer) badges.push("Offer");
    if (productProperties?.blackFriday) badges.push("Black Friday");
    if (productProperties?.sale) badges.push("Sale");
    return badges;
  };
  const handleExpressOrder = () => {
    // No need to use localStorage here, as you're using Firebase
    // You can directly access the cart data from the cartItems state
    console.log("Cart to post >>", cartItems);
  };

  if (loading) {
    return <SkeletonCard />;
  }

  return (
    <div className="col-lg-4 col-sm-6">
      <div className="product text-center relative group">
        <div className="mb-3 relative">
          {/* Dynamic Badges */}
          <div className="absolute top-4 right-4 z-10 space-y-1">
            {getBadges().map((badge, idx) => {
              // Define color classes for each badge dynamically
              const badgeColors = [
                "bg-red-500",
                "bg-blue-500",
                "bg-green-500",
                "bg-yellow-500",
                "bg-purple-500",
              ];
              const colorClass = badgeColors[idx % badgeColors.length]; // Cycle through the colors

              return (
                <Badge
                  key={idx}
                  className={`${colorClass} text-white px-2 py-1 rounded-full text-xs block`}
                >
                  {badge}
                </Badge>
              );
            })}
          </div>

          {/* Product Image */}
          <Link to={product?.id}>
            <img
              src={productImage}
              alt={productName}
              className="img-fluid w-full group-hover:opacity-30 transition-all duration-300"
            />
          </Link>

          {/* Product Overlay */}
          <div className="product-overlay absolute left-0 bottom-0 w-full flex justify-center items-end p-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <ul className="flex space-x-3 mb-0 list-inline items-center">
              {/* Left Icon (Heart) */}
              <li className="list-inline-item m-0 p-0 transform -translate-x-3 group-hover:translate-x-0 transition-transform duration-500 ease-in-out">
                <button className="btn btn-sm border-2 border-flame-500 text-flame-500 hover:bg-flame-500 hover:text-black  p-1 transition-all duration-300">
                  <Heart />
                </button>
              </li>

              <Sheet>
                {/* Middle Button (Add to Cart) */}
                <li className="list-inline-item m-0 p-0">
                  <SheetTrigger
                    onClick={() => handleAddItemToCart(product)}
                    className="btn btn-sm bg-flame-500 text-white hover:bg-flame-600 hover:text-black px-4 py-2 transition-transform duration-300 whitespace-nowrap"
                  >
                    Add to cart
                  </SheetTrigger>
                </li>

                <SheetContent>
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
                </SheetContent>
              </Sheet>
              <Dialog>
                {/* Right Icon (Maximize) */}
                <li className="list-inline-item m-0 p-0 transform translate-x-3 group-hover:translate-x-0 transition-transform duration-500 ease-in-out">
                  <DialogTrigger className="btn btn-sm border-2 border-flame-500 text-flame-500 hover:bg-flame-500 hover:text-black  p-1 transition-all duration-300">
                    <Maximize />
                  </DialogTrigger>
                </li>
                <DialogContent className="w-[650px] max-w-4xl">
                  <FloatingProductCard item={product} />
                </DialogContent>
              </Dialog>
            </ul>
          </div>
        </div>

        {/* Product Title */}
        <h6>
          <a
            href="#"
            className="text-xl font-medium text-gray-800 hover:text-robin_egg_blue-900"
          >
            {productName}
          </a>
        </h6>

        {/* Product Price */}
        <p className="text-sm text-muted">
          <p className="text-sm text-flame">
            {discountPrice && parseFloat(discountPrice) > 0 ? (
              <>
                <span className="line-through text-gray-500 mr-2">
                  Ksh {price}
                </span>
                <span className="text-green-600">Ksh {discountPrice}</span>
              </>
            ) : (
              <span>Ksh {price}</span>
            )}
          </p>
        </p>

        {/* Stock Status */}
        <p
          className={`text-sm font-medium ${
            stockStatus === "Available" ? "text-green-500" : "text-red-500"
          }`}
        >
          {stockStatus}
        </p>
      </div>
    </div>
  );
}

export default ProductCard;

import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}
