import { useEffect, useState } from "react";
import "./section-styles/homeSliders.css";
import HomeSliders from "@/components/HomeSliders";
import { useProductFunctions } from "@/utils/firebase";

export default function MonthlyOfferSection() {
  const [currentMonth, setCurrentMonth] = useState("");
  const OPTIONS = { loop: true };

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  const { fetchAllProductsByAttribute } = useProductFunctions();

  // Function to get the current month as a string
  const getCurrentMonthName = () => {
    const date = new Date();
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[date?.getMonth()];
  };

  const fetchAllProductsInStore = async () => {
    setLoading(true);
    try {
      const fetchAllProductsByAttributeResponse =
        await fetchAllProductsByAttribute("monthlyOffer");
      console.log(
        "fetch_all_products_response from top monthly deals >> ",
        fetchAllProductsByAttributeResponse
      );
      setProducts(fetchAllProductsByAttributeResponse?.data);
    } catch (error) {
      console.error("error_response_fetching_all_products >> ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("fetching_all_products_in_store_initialized...");
    fetchAllProductsInStore();

    // Set the current month
    setCurrentMonth(getCurrentMonthName());
  }, []);

  const limitedProducts = products?.slice(0, 20);

  return (
    <div className="py-12">
      <div className="text-center mb-10 relative">
        {/* Monthly Offer Title */}
        <h2 className="text-4xl font-extrabold text-gray-900">
          <span className="relative inline-block">
            <span className="absolute inset-0 bg-flame-800 h-2/3 w-full -skew-y-2"></span>
            <span className="relative">{currentMonth} Offers</span>
          </span>
        </h2>

        {/* Background text showing current month */}
        <div className="absolute top-0 left-0 h-full w-full flex justify-end items-baseline opacity-10">
          <h1 className="text-7xl md:text-9xl font-bold">{currentMonth}</h1>
        </div>
        <p className="text-lg text-gray-500 mt-3">
          Discover exclusive deals and offers this {currentMonth}, hand-picked
          just for you!
        </p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="relative flex flex-col items-center justify-center py-32">
          <p className="text-2xl md:text-3xl font-bold text-gray-700 mb-4">
            Loading Monthly Offers...
          </p>
          <div className="spinner"></div> {/* Add spinner/animation here */}
        </div>
      ) : (
        <>
          {/* Slider or Fallback */}
          {limitedProducts?.length > 0 ? (
            <HomeSliders slides={limitedProducts} options={OPTIONS} />
          ) : (
            <div className="relative flex flex-col items-center justify-center py-32">
              {/* Huge Fallback Text */}
              <div className="absolute top-0 left-0 h-full w-full flex justify-start items-center opacity-10">
                <h1 className="text-[5rem] md:text-[8rem] pl-5 font-black text-gray-900 uppercase">
                  0 Products
                </h1>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-gray-700 mb-4">
                Sorry, No Products Available for this Month!
              </p>
              <p className="text-lg md:text-xl text-gray-500">
                Please check back soon for new offers.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
