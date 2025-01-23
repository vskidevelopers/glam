import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RefreshCcwDot } from "lucide-react";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import CategoryForm from "@/components/forms/CategoryForm";
import CategoriesCard from "@/components/CategoriesCard";
import { useCategoriesFunctions } from "@/utils/firebase";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const { fetchAllCategories } = useCategoriesFunctions();

  const fetchAllCategoriesInStore = async () => {
    setLoading(true);
    try {
      const fetchAllCategoriesResponse = await fetchAllCategories();
      console.log(
        "fetch_all_categories_response >> ",
        fetchAllCategoriesResponse
      );
      setCategories(fetchAllCategoriesResponse?.data);
      setLoading(false);
    } catch (error) {
      console.error("error_response_fetching_all_categories >> ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("fetching_all_categories_in_store_initialized ...");
    fetchAllCategoriesInStore();
  }, []);

  return (
    <main className="grid pt-20 flex-1 items-start gap-4 p-4 sm:px-6 sm:pt-24 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 sm:col-span-3 ">
        <div className="text-center mb-10 relative">
          <h2 className="text-4xl font-extrabold text-gray-900">
            <span className="relative inline-block">
              <span className="absolute inset-0 bg-flame-800 h-2/3 w-full -skew-y-2"></span>
              <span className="relative"> Our Categories</span>
            </span>
          </h2>
        </div>

        <div>
          {loading ? (
            <p>Loading categories...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 container mx-auto px-5 md:px-20">
              {categories?.length > 0 ? (
                categories?.map((category, i) => (
                  <CategoriesCard
                    key={i}
                    name={category?.categoryName}
                    image={category?.categoryImage}
                  />
                ))
              ) : (
                <p>No categories found</p>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Categories;
