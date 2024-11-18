import React, { useState } from "react";
import { Star, Plus, Minus } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

const FloatingProductCard = ({ item }) => {
  const {
    productImage,
    productName,
    rating,
    price,
    discountPrice,
    description,
    productTags,
  } = item;
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="bg-white shadow-lg  relative flex flex-col md:flex-row w-[600px]">
      {/* Product Image */}
      <div className="w-full md:w-1/2">
        <img
          src={productImage}
          alt={productName}
          className="object-cover w-full h-full rounded"
        />
      </div>

      {/* Product Details */}
      <div className="w-full md:w-1/2 px-4 flex flex-col">
        {/* Ratings or Default Stars */}
        <div className="flex items-center mb-2">
          {rating
            ? Array.from({ length: rating }).map((_, index) => (
                <Star key={index} className="text-yellow-500  h-4" />
              ))
            : Array.from({ length: 3 }).map((_, index) => (
                <Star key={index} className="text-yellow-600 h-4" />
              ))}
        </div>

        {/* Product Name */}
        <h3 className="text-xl font-bold mb-2">{productName}</h3>

        {/* Product Price */}
        <div className="text-lg font-semibold mb-2">
          {discountPrice ? (
            <>
              <span className="line-through text-gray-500">${price}</span>
              <span className="text-red-500 ml-2">${discountPrice}</span>
            </>
          ) : (
            <span>${price}</span>
          )}
        </div>

        {/* Product Description */}
        <p className="text-gray-700 mb-4">{description}</p>

        {/* Quantity Selector */}
        <div className="flex items-center mb-4">
          <button
            className="bg-gray-200 text-black p-1 rounded-l"
            aria-label="Decrease quantity"
          >
            <Minus />
          </button>
          <input
            type="number"
            value={quantity}
            className="text-center w-12 p-1 border-t border-b border-gray-200"
            readOnly
          />
          <button
            className="bg-gray-200 text-black p-1 rounded-r"
            aria-label="Increase quantity"
          >
            <Plus />
          </button>
          <Button
            className="bg-jonquil-400 text-black hover:text-white ml-4 px-4 py-2 rounded"
            aria-label="Add to cart"
          >
            Add to Cart
          </Button>
        </div>

        {/* Product Tags */}
        <div className="flex flex-wrap gap-2">
          {productTags?.map((tag, index) => (
            <Badge
              key={index}
              className="text-gray-600 bg-gray-200 p-1 rounded"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FloatingProductCard;
