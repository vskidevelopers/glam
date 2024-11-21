import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TagsInput } from "@/components/ui/tags-input";
import { useProductFunctions } from "@/utils/firebase";

function EditProductForm({ product }) {
  if (!product) {
    return <div>Loading...</div>; // Show loading or placeholder if product is not available
  }

  console.log("product from edit product form >> ", product);

  const { updateProduct } = useProductFunctions();

  const {
    control,
    handleSubmit,
    setValue,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tags: product?.productTags || [], // Fallback to empty array if productTags is undefined
      description: product?.productDescription || "",
      status: product?.stockStatus || "Available", // Default to "Available" if stockStatus is undefined
      price: product?.price || "", // Default to empty if price is not provided
      name: product?.productName || "", // Default to empty if productName is not provided
    },
  });

  useEffect(() => {
    if (product) {
      setValue("description", product.productDescription);
      setValue("status", product.stockStatus);
      setValue("price", product.price);
      setValue("tags", product.productTags);
      setValue("name", product.productName);
    }
  }, [product, setValue]);

  const onSubmit = async (updatedData) => {
    try {
      await updateProduct(product?.id, { ...product, ...updatedData });
      toast.success("Product updated successfully!");
    } catch (error) {
      console.error("An error occurred while updating the product:", error);
      toast.error("Failed to update the product.");
    }
  };

  return (
    <Form>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl mx-auto py-10"
      >
        {/* Product Name */}
        <FormField>
          <FormLabel>Product Name</FormLabel>
          <FormControl>
            <Input
              type="text"
              placeholder="e.g., Signature Stainless Steel Insulated Hotpots"
              {...register("name", { required: "Product name is required" })}
            />
          </FormControl>
          <FormMessage>{errors?.productName?.message}</FormMessage>
        </FormField>

        {/* Product Description */}
        <FormField>
          <FormLabel>Product Description</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Brief product description"
              {...register("description", {
                required: "Product description is required",
              })}
            />
          </FormControl>
          <FormMessage>{errors.description?.message}</FormMessage>
        </FormField>

        {/* Status */}
        <FormField>
          <FormLabel>Status</FormLabel>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select {...field}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          <FormMessage>{errors.status?.message}</FormMessage>
        </FormField>

        {/* Price */}
        <FormField>
          <FormLabel>Price (in Ksh)</FormLabel>
          <FormControl>
            <Input
              type="number"
              placeholder="Enter price"
              {...register("price", { required: "Price is required", min: 0 })}
            />
          </FormControl>
          <FormMessage>{errors.price?.message}</FormMessage>
        </FormField>

        {/* Tags */}
        <FormField>
          <FormLabel>Tags</FormLabel>
          <FormControl>
            <TagsInput
              placeholder="Add tags (e.g., cookware, kitchenware)"
              {...register("tags")}
            />
          </FormControl>
          <FormMessage>{errors.tags?.message}</FormMessage>
        </FormField>

        {/* Submit Button */}
        <Button
          type="submit"
          className="py-2 px-4 bg-indigo-600 text-white rounded-lg"
        >
          Save Changes
        </Button>
      </form>
    </Form>
  );
}

export default EditProductForm;
