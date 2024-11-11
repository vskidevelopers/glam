import { Button } from './ui/button';
import { ShoppingCart, Info } from 'lucide-react';

const ProductSliderCard = (props) => {
    const { slide, index } = props;
    console.log("slide >> ", slide);
    console.log("index >> ", index);
    console.log("product cards props >> ", props);

    return (
        <div className="relative max-w-sm mx-auto bg-white rounded-lg shadow-lg overflow-hidden group">
            {/* Background Image */}
            <div className="relative h-60 md:h-72 lg:h-96">
                <img
                    className="object-cover w-full h-full"
                    src={slide?.imageUrl}
                    alt={slide?.title}
                />

                {/* Overlay Text */}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center px-6">
                    <h1 className="text-3xl font-bold text-white">{slide?.title}</h1>
                </div>

                {/* Hover Overlay with Buttons */}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="space-y-4">
                        <Button
                            onClick={() => {
                                alert("Product added to cart.");
                            }}
                            className="flex items-center justify-center space-x-2 bg-white text-black px-4 py-2 rounded-full hover:bg-black hover:text-white transition-all"
                            aria-label="Add to cart"
                            role="alert"
                        >
                            <ShoppingCart />
                            <span>Add to Cart</span>
                        </Button>
                        <Button
                            onClick={() => {
                                alert("Viewing product details.");
                            }}
                            className="flex items-center justify-center space-x-2 bg-white text-black px-4 py-2 rounded-full hover:bg-black hover:text-white transition-all"
                            aria-label="View details"
                            role="alert"
                        >
                            <Info />
                            <span>View Details</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Card Content */}
            <div className="p-6">
                <p className="text-gray-600 mb-4 text-lg">
                    {slide?.description}
                </p>
            </div>
        </div>
    );
};

export default ProductSliderCard;
