import ProductCard from "@/components/ProductCard";
import { useProductFunctions } from "@/utils/firebase";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Categories from "@/components/Categories";

const Explore = () => {
  const { fetchAllProductsByCategory } = useProductFunctions();
  const { category } = useParams(); // Getting category from URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      if (!category) {
        setError("No category specified.");
        setLoading(false);
        return;
      }

      try {
        const result = await fetchAllProductsByCategory(category);
        if (result.success) {
          setProducts(result.data);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError("Failed to fetch products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-6 bg-white border rounded-lg shadow-md max-w-sm">
          <p className="text-lg sm:text-xl font-semibold text-flame-500">
            Loading products...
          </p>
          <Link
            to="/shop"
            className="mt-4 inline-block px-6 py-2 bg-flame-500 text-white rounded-lg hover:bg-flame-600 transition-colors"
          >
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-6 bg-white border rounded-lg shadow-md max-w-sm">
          <p className="text-lg sm:text-xl font-semibold text-red-500">
            {error}
          </p>
          <Link
            to="/categories"
            className="mt-4 inline-block px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 pb container mx-auto">
      <h1 className="text-2xl md:text-5xl font-bold capitalize text-center py-6">
        Products in <span className="text-flame underline">{category}</span>{" "}
        category
      </h1>

      <div className="w-full flex flex-col-reverse md:flex-row px-10">
        <div className="w-full md:w-1/3">
          <Categories />
        </div>
        <div className="w-full md:w-2/3 ml-0 md:ml-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {products?.map((product, i) => (
              <div
                key={i}
                className="border border-gray-300 rounded-lg p-4 shadow hover:shadow-md transition"
              >
                <ProductCard
                  product={product}
                  index={1 + i}
                  loading={loading}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
