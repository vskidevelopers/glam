/* eslint-disable react/prop-types */
import { useToast } from "@/hooks/use-toast";
import { useCategoriesFunctions } from "@/utils/firebase";
import { Trash2 } from "lucide-react";

import { Link } from "react-router-dom"; // Import Link for navigation
import { ToastAction } from "../ui/toast";

function AdminCategoriesCard({ name, image, id, refresh }) {
  const { toast } = useToast();
  const { deleteCategory } = useCategoriesFunctions();

  const handleDelete = async () => {
    try {
      const deleteCategoryResponse = await deleteCategory(id);
      console.log("deleteCategoryResponse >> ", deleteCategoryResponse);
      if (deleteCategoryResponse?.success) {
        toast({
          variant: "success",
          title: "Category Deleted Successfully!",
        });
        refresh();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem trying to delete the category",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      console.log("error >> ", error);
      refresh();
    }
  };

  return (
    <div>
      <div className="group relative block h-64 sm:h-80 lg:h-96">
        <span className="absolute inset-0 border-2 border-dashed border-[#FDB715]"></span>

        {/* Trash2 Icon */}
        <button
          className="absolute top-2 right-2 z-20 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity mr-4 bg-white py-2 px-1 rounded"
          aria-label="Delete"
          onClick={handleDelete}
        >
          <Trash2 size={24} />
        </button>

        {/* Link to the category page */}
        <Link
          to={`/explore/${name}`}
          className="relative block h-full transform items-end border-2 border-black bg-white transition-transform group-hover:-translate-x-2 group-hover:-translate-y-2"
        >
          <div
            className="p-4 !pt-0 transition-opacity group-hover:absolute group-hover:opacity-0 sm:p-6 lg:p-8"
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "100%",
              width: "100%",
            }}
          >
            <div className="absolute inset-0 h-full bg-gray-900/70"></div>
            <div className="absolute z-10 h-[100%] w-auto flex flex-col justify-center">
              <h2 className="mt-4 text-xl font-medium sm:text-2xl text-flame-500 capitalize">
                {name}
              </h2>
            </div>
          </div>

          <div
            className="absolute p-4 opacity-0 transition-opacity group-hover:relative group-hover:opacity-100 sm:p-6 lg:p-8"
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "100%",
              width: "100%",
            }}
          >
            <h3
              className="mt-4 text-xl font-medium sm:text-2xl text-flame-500 capitalize"
              style={{
                WebkitTextStroke: "1px white", // The stroke appears outside the text
                color: "transparent", // Ensures the stroke doesn't mix with the text fill
                WebkitTextFillColor: "flame", // Fills the inner text with color
              }}
            >
              {name}
            </h3>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default AdminCategoriesCard;
