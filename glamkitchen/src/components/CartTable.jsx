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

const CartTable = ({ cart }) => {
  const handleIncrease = (productId) => {
    // Add increase functionality here
  };

  const handleDecrease = (productId) => {
    // Add decrease functionality here
  };

  const handleDelete = (productId) => {
    // Add delete functionality here
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
        {cart.items.map((item) => (
          <TableRow key={item.productId}>
            <TableCell>
              <img
                src={item.image}
                alt={item.productName}
                className="w-16 h-16 object-cover rounded-md"
              />
            </TableCell>
            <TableCell className="font-medium">{item.productName}</TableCell>
            <TableCell>${item.price.toFixed(2)}</TableCell>
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
            <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
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
