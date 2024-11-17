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

export default function AdminCategories() {
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

  const cats = [
    {
      name: "Cookware",
      image:
        "https://media.istockphoto.com/id/478769830/photo/kitchen-cookware-set.jpg?s=612x612&w=0&k=20&c=47NXX65DxdTeUc_QZsTyv8hf-va2wOKI8ujWcNdiYp8=",
    },
    {
      name: "Bakeware",
      image:
        "https://t3.ftcdn.net/jpg/00/20/23/76/360_F_20237687_kJ6De6jxOSQtDHj79UH9XYVsqQPZUtK5.jpg",
    },
    {
      name: "Storage",
      image:
        "https://media.istockphoto.com/id/1307509547/photo/organised-pantry-items-with-variety-of-nonperishable-food-staples-and-preserved-foods-in-jars.jpg?s=612x612&w=0&k=20&c=46Thbh0iPlvd0cxv7vhCpDhDpMxuSm2nBd8XO1wpTYc=",
    },
    {
      name: "Utensils",
      image:
        "https://media.istockphoto.com/id/586162072/photo/various-kitchen-utensils.jpg?s=612x612&w=0&k=20&c=auwz9ZHqkG_UlKw5y-8UqvMLznA2PySQ_Jt3ameL1aU=",
    },
  ];

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-3">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ">
          <Dialog>
            <Card
              className="flex items-center justify-center h-full"
              x-chunk="dashboard-05-chunk-0"
            >
              <div className="w-full flex flex-col gap-4">
                <CardHeader className="pb-3">
                  <CardTitle>Product Category Management</CardTitle>
                  <CardDescription className="max-w-lg text-balance leading-relaxed">
                    Manage your product categories effectively. Update product
                    classifications, enhance your online store, and ensure your
                    offerings attract the right customers. Streamline your
                    product management with easy access to all category
                    settings.
                  </CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto">
                  {/* Dialog trigger button to add category */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Add Category</Button>
                    </DialogTrigger>

                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1 ml-5"
                      onClick={fetchAllCategoriesInStore}
                    >
                      <RefreshCcwDot className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Refresh
                      </span>
                    </Button>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="text-center py-9">
                          Add New Category
                        </DialogTitle>
                      </DialogHeader>
                      {/* Here you can add your form for category creation */}
                      <CategoryForm />
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </div>
            </Card>
          </Dialog>
        </div>
      </div>

      <div className="grid auto-rows-max items-start gap-4 md:gap-8 sm:col-span-3 ">
        <div className="text-center mb-10 relative">
          <h2 className="text-4xl font-extrabold text-gray-900">
            <span className="relative inline-block">
              <span className="absolute inset-0 bg-flame-800 h-2/3 w-full -skew-y-2"></span>
              <span className="relative"> Your Categories</span>
            </span>
          </h2>
        </div>

        <div>
          {loading ? (
            <p>Loading categories...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 container mx-auto px-5 md:px-20">
              {cats?.length > 0 ? (
                cats?.map((category, i) => (
                  <CategoriesCard
                    key={i}
                    name={category?.name}
                    image={category?.image}
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
