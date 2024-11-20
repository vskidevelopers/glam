import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import HeroSection from "@/sections/HeroSection";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCartFunctions, useProductFunctions } from "@/utils/firebase";
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
  const { getCart } = useCartFunctions();
  const CART_KEY = "cart";
  const { fetchProductDetail } = useProductFunctions();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1); // Default quantity to 1
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = JSON.parse(localStorage.getItem(CART_KEY));
    return storedCart?.items || []; // Initialize cartItems from localStorage
  });
  const [subTotal, setSubTotal] = useState(0);
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
  const handleFetchCart = async () => {
    const getCartResponse = await getCart();
    console.log("getCartResponse >> ", getCartResponse);
    setCartItems(getCartResponse?.items);
    setSubTotal(getCartResponse?.totalPrice);
  };

  useEffect(() => {
    handleFetchCart();
  }, []);

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

  // Function to handle adding item to the cart
  const handleAddItemToCart = (item) => {
    console.log("Item to add to cart >> ", item);

    try {
      // Retrieve the cart from localStorage or create one
      let cart = localStorage.getItem(CART_KEY);
      if (!cart) {
        // If no cart exists, create an initial cart structure
        cart = {
          items: [],
          totalPrice: 0,
          totalQuantity: 0,
        };
      } else {
        cart = JSON.parse(cart);
      }

      // Check if the item already exists in the cart
      const existingItemIndex = cart.items.findIndex(
        (cartItem) => cartItem.productId === item.productId
      );

      if (existingItemIndex !== -1) {
        // Item already exists, no need to update quantity or add again
        console.log("Item already in cart. Opening cart...");
        handleFetchCart();
        setCartItems(cart.items); // Update state with the current cart items
        setSubTotal(cart.totalPrice); // Update the subtotal state
        return; // Exit early to prevent adding again
      }

      // Item does not exist, add it with a quantity of 1
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

      // Update the cart's total quantity and total price
      cart.totalQuantity += 1;
      cart.totalPrice += newItem.subtotal;

      // Save the updated cart to localStorage
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      console.log("Item added to cart:", cart);

      // Update state and open cart
      handleFetchCart();
      setCartItems(cart.items); // Update state with new cart items
      setSubTotal(cart.totalPrice); // Update the subtotal state
    } catch (error) {
      console.error("An error occurred while adding item to cart >> ", error);
    }
  };

  // Function to handle quantity change
  const handleQuantityChange = (e) => {
    const newQuantity = Math.max(1, Number(e.target.value)); // Prevent quantity from going below 1
    setQuantity(newQuantity);
  };

  // Functions for increasing and decreasing quantity
  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1)); // Prevent quantity from going below 1
  };

  // Proceed to checkout page
  const handleSubmit = () => {
    navigate("/products/checkout");
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
                          <ExpressOrderForm CART_KEY={CART_KEY} />
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
            {cartItems?.map((item, i) => (
              <CartItem
                key={i}
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
                    // onClick={handleExpressOrder}
                    className="bg-flame text-white px-6 py-2 rounded-full hover:bg-blue-600"
                  >
                    View Your Cart
                  </DialogTrigger>
                  <DialogContent className="w-[650px] max-w-4xl">
                    <ExpressOrderForm CART_KEY={CART_KEY} />
                  </DialogContent>
                </Dialog>

                <Button className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600">
                  Continue to Checkout
                </Button>
              </div>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default ProductDetails;
