import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useProductFunctions, useUploadImage } from "@/utils/firebase";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AddProductForm() {
  const [files, setFiles] = useState([]);
  const [imageUploadStatus, setImageUploadStatus] = useState(null);
  const [productPhoto, setProductPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const { uploadImage } = useUploadImage();
  const { addProduct } = useProductFunctions();

  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      productTags: ["test"],
    },
  });

  const [productProperties, setProductProperties] = useState({
    offer: false,
    sale: false,
    new: false,
    blackFriday: false,
  });
  const [tags, setTags] = useState("");

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        setImageUploadStatus("pending");
        const bucketName = "products/";
        const uploadResult = await uploadImage(file, bucketName);
        console.log("uploadResult >> ", uploadResult);

        if (uploadResult?.status === "success") {
          setProductPhoto(uploadResult.data);
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

  const handleSwitchChange = (property) => {
    setProductProperties((prev) => ({ ...prev, [property]: !prev[property] }));
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

  const onSubmit = async (data) => {
    const formattedData = {
      ...data,
      productImage: productPhoto,
      createdAt: formattedDate,
      productTags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      productProperties,
    };
    try {
      if (productPhoto) {
        console.log("productPhoto exists!");
        console.log(formattedData);
        const addProductResponse = await addProduct(formattedData);
        console.log("add product response >> ", addProductResponse);
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
    <ScrollArea className="h-[80vh] rounded-md border p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <label className="block text-sm font-medium">Product Name</label>
            <Input
              placeholder="Matrix Stainless Hotpots, Granite Sufuria Set"
              type="text"
              {...register("productName", {
                required: "Product name is required",
                maxLength: 255,
              })}
            />
            <p className="text-gray-500 text-sm">
              This is what customers will see when browsing your client's
              products.
            </p>
            <p className="text-red-500 text-sm">
              {errors.productName?.message}
            </p>
          </div>

          <div className="col-span-6">
            <label className="block text-sm font-medium">
              Product Category
            </label>
            <select
              className="w-full border rounded p-2"
              {...register("ProductCategory", {
                required: "Please select a product category",
              })}
            >
              <option value="">Select a category</option>
              <option value="Kitchen Essentials">Kitchen Essentials</option>
              <option value="Dinnerware">Dinnerware</option>
              <option value="Storage">Storage</option>
              <option value="Decor">Decor</option>
            </select>
            <p className="text-gray-500 text-sm">
              Helps you organize your products and make it easier for customers
              to find what they're looking for.
            </p>
            <p className="text-red-500 text-sm">
              {errors.ProductCategory?.message}
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">
            Product Description
          </label>
          <Textarea
            placeholder=""
            className="resize-none"
            {...register("productDescription", {
              required: "Product description is required",
            })}
          />
          <p className="text-gray-500 text-sm">
            A brief but descriptive text that highlights the key features and
            benefits of the product.
          </p>
          <p className="text-red-500 text-sm">
            {errors.productDescription?.message}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium">Select File</label>
          <input
            type="file"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
          />
          <p className="text-gray-500 text-sm">
            Select a file to upload. SVG, PNG, JPG, or GIF.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-4">
            <label className="block text-sm font-medium">Price</label>
            <Input
              placeholder="00"
              type="number"
              {...register("price", { required: "Price is required", min: 0 })}
            />
            <p className="text-gray-500 text-sm">
              The price of the product in Kenyan Shillings (ksh).
            </p>
            <p className="text-red-500 text-sm">{errors.price?.message}</p>
          </div>

          <div className="col-span-4">
            <label className="block text-sm font-medium">Discount Price</label>
            <Input
              placeholder="00"
              type="number"
              {...register("discountPrice", { min: 0 })}
            />
            <p className="text-gray-500 text-sm">optional</p>
          </div>

          <div className="col-span-4">
            <label className="block text-sm font-medium">Stock Status</label>
            <select
              className="w-full border rounded p-2"
              {...register("stockStatus", {
                required: "Please select stock status",
              })}
            >
              <option value="">Select status</option>
              <option value="Available">Available</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
            <p className="text-red-500 text-sm">
              {errors.stockStatus?.message}
            </p>
          </div>
        </div>

        <div className="col-span-12 mt-4">
          <label className="block text-sm font-medium">Product Tags</label>
          <Input
            placeholder="Enter tags separated by commas"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full border rounded p-2"
          />
          <p className="text-gray-500 text-sm">
            Tags help improve searchability. Separate tags with commas (e.g.,
            "kitchen, cooking, utensils").
          </p>
        </div>

        {/* Product Properties (Switches) */}
        <div className="col-span-12 mt-6">
          <label className="block text-sm font-medium mb-2">
            Product Properties
          </label>
          <div className="grid grid-cols-2 gap-4">
            {["offer", "sale", "new", "blackFriday"].map((property) => (
              <div key={property} className="flex items-center gap-2">
                <Switch
                  checked={productProperties[property]}
                  onCheckedChange={() => handleSwitchChange(property)}
                />
                <label className="text-sm font-medium capitalize">
                  {property === "blackFriday" ? "Black Friday" : property}
                </label>
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-sm mt-2">
            Toggle product properties to highlight special product
            characteristics.
          </p>
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </ScrollArea>
  );
}
