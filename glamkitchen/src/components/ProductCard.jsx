import { Maximize, Heart } from "lucide-react";
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

function ProductCard({ product, index }) {
  console.log(`product # ${index} >>`, product);
  const { createCart, addItemToCart, getCart, deleteCartItem } =
    useCartFunctions();

  const [cartItems, setCartItems] = useState(() => {
    const CART_KEY = "cart";
    const storedCart = JSON.parse(localStorage.getItem(CART_KEY));
    return storedCart ? storedCart.items : [];
  });

  // Handle quantity changes
  const handleQuantityChange = (productId, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Handle item removal
  const CART_KEY = "cart";
  const handleRemoveItem = (productId) => {
    const updatedCartItems = cartItems.filter(
      (item) => item.productId !== productId
    );

    setCartItems(updatedCartItems);

    // Update local storage
    const storedCart = JSON.parse(localStorage.getItem(CART_KEY));
    if (storedCart) {
      const updatedCart = {
        ...storedCart,
        items: updatedCartItems,
        totalQuantity: updatedCartItems.reduce(
          (acc, item) => acc + item.quantity,
          0
        ),
        totalPrice: updatedCartItems.reduce(
          (acc, item) => acc + item.subtotal,
          0
        ),
      };
      localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
    }
  };
  const [subTotal, setSubTotal] = useState(0);

  const handleFetchCart = async () => {
    const getCartResponse = await getCart();
    console.log("getCartResponse >> ", getCartResponse);
    setCartItems(getCartResponse?.items);
    setSubTotal(getCartResponse?.totalPrice);
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
      // Retrieve the cart from localStorage or create one
      let cart = localStorage.getItem(CART_KEY);
      if (!cart) {
        cart = createCart(); // If no cart, create one
      } else {
        cart = JSON.parse(cart);
      }

      // Check if the item already exists in the cart
      const existingItemIndex = cart.items.findIndex(
        (cartItem) => cartItem.productId === item.productId
      );

      if (existingItemIndex !== -1) {
        // Item exists, open the Sheet to display the cart
        console.log("Item already in cart. Opening cart...");
        handleFetchCart();
        setCartItems(cart.items); // Update the state with the current cart items
        setSubTotal(cart.totalPrice); // Update the subtotal state
        // You can programmatically open the Sheet here if needed
        return;
      }

      // Item does not exist, add it with quantity 1
      const newItem = {
        ...item,
        price:
          typeof item.price === "string"
            ? parseInt(item.price, 10)
            : item.price,
        quantity: 1,
        subtotal:
          typeof item.price === "string"
            ? parseInt(item.price, 10)
            : item.price,
      };
      cart.items.push(newItem);

      // Update the cart's total quantity and price
      cart.totalQuantity += 1;
      cart.totalPrice += newItem.subtotal;

      // Save the updated cart to localStorage
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      console.log("Item added to cart:", cart);

      // Update state and open Sheet
      handleFetchCart();
      setCartItems(cart.items);
      setSubTotal(cart.totalPrice);
    } catch (error) {
      console.log("An error occurred while adding item to cart >> ", error);
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
    let cart = localStorage.getItem(CART_KEY);
    if (cart) {
      cart = JSON.parse(cart); // Parse the cart string into an object
      console.log("Cart to post >>", cart); // Log the cart as an object
    } else {
      console.log("Cart is empty or not found.");
    }
  };

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
                    <SheetTitle>Your Cart</SheetTitle>
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
                        <p className="text-lg font-bold">${subTotal}</p>
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
                            <ExpressOrderForm CART_KEY={CART_KEY} />
                          </DialogContent>
                        </Dialog>

                        <Link
                          to="/home/checkout"
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
