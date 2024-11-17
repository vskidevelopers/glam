import { Trash } from "lucide-react";

function CartItem({ item }) {
  return (
    <div className="flex flex-col p-4 bg-gray-100 rounded-lg mb-2 space-y-2">
      {/* Row 1: Image, Name/Price, Total Price */}
      <div className="flex items-center justify-between">
        {/* Image */}
        <div className="flex-shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-20 h-20 object-cover rounded"
          />
        </div>

        {/* Name and Price */}
        <div className="flex-1 ml-4">
          <h3 className="text-lg font-semibold">{item.name}</h3>
          <p className="text-md text-gray-600 mt-1">{item.price}</p>
        </div>

        {/* Total Price */}
        <div className="text-right">
          <p className="text-lg font-bold">
            ${(parseFloat(item.price.slice(1)) * item.quantity).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Row 2: Quantity Controls and Trash Icon */}
      <div className="flex items-center justify-between">
        {/* Quantity Control */}
        <div className="flex items-center space-x-2 border border-gray-300 rounded-lg px-2 py-1 bg-gray-200">
          <button className="w-8 h-8 text-center font-semibold bg-slate-800 text-white rounded-full">
            -
          </button>
          <span className="px-4 font-bold">{item.quantity}</span>
          <button className="w-8 h-8 text-center font-semibold bg-slate-800 text-white rounded-full">
            +
          </button>
        </div>

        {/* Trash Icon */}
        <button className="text-red-500 hover:text-red-700">
          <Trash className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

export default CartItem;
