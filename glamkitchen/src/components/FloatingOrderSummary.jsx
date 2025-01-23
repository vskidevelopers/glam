import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Copy, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

function FloatingOrderSummary({ cart, orderId }) {
  console.log("cart object in floating order summary >>> ", cart);

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!orderId) return;

    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(orderId)
        .then(() => {
          setCopied(true);
          localStorage.setItem("orderId", orderId);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((err) => console.error("Failed to copy: ", err));
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = orderId;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);

      setCopied(true);
      localStorage.setItem("orderId", orderId);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Check if the cart is empty
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center text-muted-foreground">
          <h2 className="text-xl font-semibold">Your cart is empty</h2>
          <p className="mt-2">
            Start adding items to your cart to see the summary here.
          </p>
        </div>
      </div>
    );
  }

  // Extract fields from the updated cart structure
  const { id, items, totalQuantity, totalPrice, createdAt } = cart;

  return (
    <div>
      <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-lg">
              Order {orderId ? orderId : id}
              <Button
                size="icon"
                variant="outline"
                className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={handleCopy}
              >
                <Copy className="h-3 w-3" />
                <span className="sr-only">Copy Order ID</span>
                {copied && <span className="ml-2 text-green-500">Copied!</span>}
              </Button>
            </CardTitle>
            <CardDescription>
              Date: {new Date(createdAt).toLocaleDateString()}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6 text-sm">
          {/* Order Details */}
          <div className="grid gap-3">
            <div className="font-semibold">Order Details</div>
            <ul className="grid gap-3">
              {items.map((item) => (
                <li key={item.id} className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    {item.productName} x <span>{item.quantity}</span>
                  </span>
                  <span className="whitespace-nowrap">
                    Ksh {item.subtotal.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
            {/* Order Totals */}
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Quantity</span>
                <span>{totalQuantity}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Price</span>
                <span className="whitespace-nowrap">
                  Ksh {totalPrice.toFixed(2)}
                </span>
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
          <div className="text-xs text-muted-foreground">
            Created on{" "}
            <time dateTime={createdAt}>
              {new Date(createdAt).toLocaleDateString()}
            </time>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default FloatingOrderSummary;
