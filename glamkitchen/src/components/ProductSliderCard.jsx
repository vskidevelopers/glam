import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

const ProductSliderCard = (props) => {
  const { slide, index } = props;
  console.log("slide >> ", slide);
  console.log("index >> ", index);
  console.log("product cards props >> ", props);

  return (
    <div className="relative max-w-sm mx-auto bg-white rounded-lg shadow-lg overflow-hidden group">
      {/* Background Image */}
      <div className="relative h-60 md:h-72 lg:h-96">
        <div className="w-[200px] h-[150px] sm:w-[300px] sm:h-[225px] md:w-[400px] md:h-[300px] lg:w-[500px] lg:h-[375px] overflow-hidden rounded-lg shadow-md border border-gray-200">
          <img
            className="object-cover w-full h-full"
            src={slide?.productImage || "/placeholder.jpg"}
            alt={slide?.title || "Product Image"}
          />
        </div>

        {/* Overlay Text */}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center px-6">
          <h1 className="text-3xl font-bold text-white">
            {slide?.productName}
          </h1>
        </div>

        {/* Hover Overlay with Buttons */}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="space-y-4">
            <Link
              to={`shop/${slide?.id}`}
              className="flex items-center justify-center space-x-2 bg-white text-black px-4 py-2 rounded-full hover:bg-black hover:text-white transition-all"
              aria-label="Add to cart"
            >
              <ShoppingCart />
              <span>Add to Cart</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        <p className="text-gray-600 mb-4 text-lg">{slide?.description}</p>
      </div>
    </div>
  );
};

export default ProductSliderCard;
