import { Maximize } from "lucide-react";

function ProductCard({ product }) {
  return (
    <div className="col-lg-4 col-sm-6">
      <div className="product text-center relative group">
        <div className="mb-3 relative">
          {/* Badge (if any) */}
          <div className="absolute top-4 right-4 z-10">
            {product.badge && (
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                {product.badge}
              </span>
            )}
          </div>

          {/* Product Image */}
          <a href={product.link}>
            <img
              src={product.image}
              alt={product.name}
              className="img-fluid w-full group-hover:opacity-30 transition-all duration-300"
            />
          </a>

          {/* Product Overlay */}
          <div className="product-overlay absolute left-0 bottom-0 w-full flex justify-center items-end p-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <ul className="flex space-x-3 mb-0 list-inline">
              <li className="list-inline-item m-0 p-0">
                <button className="btn btn-sm btn-outline-dark">
                  <i className="far fa-heart"></i>
                </button>
              </li>
              <li className="list-inline-item m-0 p-0">
                <button className="btn btn-sm btn-dark">Add to cart</button>
              </li>
              <li className="list-inline-item m-0 p-0">
                <button className="btn btn-sm btn-outline-dark">
                  <Maximize />
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Product Title */}
        <h6>
          <a
            href={product.link}
            className="text-xl font-medium text-gray-800 hover:text-robin_egg_blue-900"
          >
            {product.name}
          </a>
        </h6>

        {/* Product Price */}
        <p className="text-sm text-muted">{product.price}</p>
      </div>
    </div>
  );
}

export default ProductCard;
