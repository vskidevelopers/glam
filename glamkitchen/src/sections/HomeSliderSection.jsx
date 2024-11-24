import { useEffect, useState } from "react";
import "./section-styles/homeSliders.css";

import HomeSliders from "@/components/HomeSliders";
import { useProductFunctions } from "@/utils/firebase";

export default function HomeSlidersSection({ title }) {
  const OPTIONS = { loop: true };

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  const { fetchAllProductsByAttribute } = useProductFunctions();

  const fetchAllProductsInStore = async () => {
    setLoading(true);
    try {
      const fetchAllProductsResponse = await fetchAllProductsByAttribute(
        "trending"
      );
      console.log(
        "fetch_all_products_response from top trending  >> ",
        fetchAllProductsResponse
      );
      setProducts(fetchAllProductsResponse?.data);
    } catch (error) {
      console.error("error_response_fetching_all_products >> ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("fetching_all_products_in_store_initilized ... ");
    fetchAllProductsInStore();
  }, []);

  const limitedProducts = products?.slice(0, 20);

  return (
    <div className="py-16 bg-gradient-to-b from-gray-50 via-white to-gray-100 relative">
      {/* Section Header */}
      <div className="text-center mb-12 relative">
        <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-wide">
          <span className="relative inline-block">
            <span className="absolute inset-0 bg-flame-800 h-3/4 w-full -skew-y-3"></span>
            <span className="relative z-10 text-black">{title}</span>
          </span>
        </h2>

        {/* Large Background Title */}
        <div className="absolute top-0 left-0 pr-5 h-full w-full flex justify-end items-baseline opacity-10">
          <h1 className="text-7xl md:text-9xl font-bold"> {title}</h1>
        </div>
        <p className="text-xl md:text-2xl text-gray-600 mt-5">
          Explore our exclusive hand-picked selection of premium products.
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="relative flex flex-col items-center justify-center py-32">
          <p className="text-2xl md:text-3xl font-bold text-gray-700 mb-4">
            Loading Products...
          </p>
          <div className="spinner"></div>{" "}
          {/* Add a spinner or loading animation here */}
        </div>
      )}

      {/* Slider or Fallback */}
      {!loading && (
        <>
          {limitedProducts?.length > 0 ? (
            <HomeSliders slides={limitedProducts} options={OPTIONS} />
          ) : (
            <div className="relative flex flex-col items-center justify-center py-32">
              {/* Huge Fallback Text */}
              <div className="absolute top-0 left-0 h-full w-full flex justify-start items-center opacity-10">
                <h1 className="text-[5rem] md:text-[10rem] pl-5 font-black text-gray-900 uppercase">
                  0 Products
                </h1>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-gray-700 mb-4">
                Sorry, No Products Available for this section!
              </p>
              <p className="text-lg md:text-xl text-gray-500">
                Please check back soon for updates on our premium collection.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
