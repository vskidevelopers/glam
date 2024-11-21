import React from "react";
import { Trash } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCartFunctions } from "@/utils/firebase"; // Import the hook

const CartTable = ({ cart, fetchCart }) => {
  console.log("cart from cart table >> ", cart);
  const { updateCartItemQuantity, deleteCartItem } = useCartFunctions(); // Get the functions

  const handleIncrease = async (productId) => {
    try {
      const newQuantity =
        cart.find((item) => item.productId === productId).quantity + 1;
      const updateResult = await updateCartItemQuantity(productId, newQuantity);
      if (updateResult.success) {
        fetchCart(); // Refresh the cart after updating
      } else {
        console.error("Error updating item quantity:", updateResult.error);
        // Handle error, e.g., display an error message
      }
    } catch (error) {
      console.error("Error updating item quantity:", error);
      // Handle error, e.g., display an error message
    }
  };

  const handleDecrease = async (productId) => {
    try {
      const currentItem = cart.find((item) => item.productId === productId);
      if (currentItem.quantity > 1) {
        const newQuantity = currentItem.quantity - 1;
        const updateResult = await updateCartItemQuantity(
          productId,
          newQuantity
        );
        if (updateResult.success) {
          fetchCart(); // Refresh the cart after updating
        } else {
          console.error("Error updating item quantity:", updateResult.error);
          // Handle error, e.g., display an error message
        }
      }
    } catch (error) {
      console.error("Error updating item quantity:", error);
      // Handle error, e.g., display an error message
    }
  };

  const handleDelete = async (productId) => {
    // Show confirmation dialog before proceeding
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this item from your cart?"
    );

    // If the user confirms, proceed with deletion
    if (isConfirmed) {
      try {
        const deleteResult = await deleteCartItem(productId);
        console.log("deleteResult >> ", deleteResult);

        if (deleteResult?.success) {
          fetchCart(); // Refresh the cart after deleting
        } else {
          console.error("Error deleting item from cart:", deleteResult.error);
          // Handle error, e.g., display an error message
        }
      } catch (error) {
        console.error("Error deleting item from cart:", error);
        // Handle error, e.g., display an error message
      }
    } else {
      // Optionally log or handle if the user cancels the deletion
      console.log("Item deletion was cancelled.");
    }
  };

  return (
    <Table>
      <TableCaption>A list of items in your cart.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Image</TableHead>
          <TableHead>Product Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Subtotal</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cart?.map((item) => (
          <TableRow key={item.productId}>
            <TableCell>
              <img
                src={item.productImage}
                alt={item.productName}
                className="w-16 h-16 object-cover rounded-md"
              />
            </TableCell>
            <TableCell className="font-medium">{item.productName}</TableCell>
            <TableCell>
              $
              {(item.discountPrice
                ? parseFloat(item.discountPrice)
                : item.price
              ).toFixed(2)}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDecrease(item.productId)}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => handleIncrease(item.productId)}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  +
                </button>
              </div>
            </TableCell>
            <TableCell>
              $
              {(
                (item.discountPrice
                  ? parseFloat(item.discountPrice)
                  : item.price) * item.quantity
              ).toFixed(2)}
            </TableCell>
            <TableCell className="text-right">
              <button
                onClick={() => handleDelete(item.productId)}
                className="text-red-600"
              >
                <Trash className="w-5 h-5" />
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CartTable;
