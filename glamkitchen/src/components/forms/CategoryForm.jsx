import { useCategoriesFunctions, useUploadImage } from "@/utils/firebase";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

function CategoryForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUploadStatus, setImageUploadStatus] = useState(null);
  const [productPhoto, setProductPhoto] = useState(null);

  const { uploadImage } = useUploadImage();
  const { addCategory } = useCategoriesFunctions();

  // Handle image selection and trigger upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setImageUploadStatus("pending");
        const bucketName = "categories/";
        const uploadResult = await uploadImage(file, bucketName);
        console.log("uploadResult >> ", uploadResult);

        if (uploadResult?.status === "success") {
          setProductPhoto(uploadResult.data);
          setImagePreview(uploadResult?.data);
          setImageUploadStatus("success");
          console.log("successfully uploaded image");
        } else {
          setImageUploadStatus("error");
          console.log("error uploading image");
        }
      } catch (error) {
        setImageUploadStatus("error");
      }
    }
  };

  const currentDate = new Date();
  const options = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short",
  };

  const formattedDate = currentDate.toLocaleString("en-US", options);

  // Handle form submission
  const onSubmit = async (data) => {
    console.log("Form data:", data);
    const formattedData = {
      ...data,
      categoryImage: productPhoto,
      createdAt: formattedDate,
    };
    try {
      if (productPhoto) {
        console.log("category Photo exists!");
        console.log(formattedData);
        const addCategoryResponse = await addCategory(formattedData);
        console.log("add category response >> ", addCategoryResponse);
        reset();
        setLoading(false);
      } else {
        console.log("product photo does not exist");
        console.log(formattedData);
        alert("Please upload a photo or use a different photo");
      }
    } catch (error) {
      console.log("ann errror occured >> ", error);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* Category Image */}
      <div className="flex flex-col">
        <label htmlFor="categoryImage" className="font-medium">
          Category Image
        </label>
        <input
          type="file"
          id="categoryImage"
          accept="image/*"
          onChange={handleImageChange}
          className="border p-2 rounded-md"
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="mt-4 w-32 h-32 object-cover rounded-md border"
          />
        )}
      </div>

      {/* Category Name */}
      <div className="flex flex-col">
        <label htmlFor="categoryName" className="font-medium">
          Category Name
        </label>
        <input
          id="categoryName"
          {...register("categoryName", {
            required: "Category name is required",
            pattern: {
              value: /^[a-zA-Z]+(-[a-zA-Z]+)?$/,
              message: "Only one word or two words with hyphen allowed",
            },
          })}
          className="border p-2 rounded-md"
          placeholder="e.g., cookware, food-storage"
        />
        {errors.categoryName && (
          <span className="text-red-500 text-sm">
            {errors.categoryName.message}
          </span>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded-md mt-4"
      >
        Add Category
      </button>
    </form>
  );
}

export default CategoryForm;
