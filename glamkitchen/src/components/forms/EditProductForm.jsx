import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
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
import { CloudUpload, Paperclip } from "lucide-react";
import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import { useProductFunctions } from "@/utils/firebase";

function EditProductForm({ product }) {
  const { updateProduct } = useProductFunctions();

  const {
    control,
    handleSubmit,
    setValue,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tags: product?.tags || [],
    },
  });

  useEffect(() => {
    // Set initial values based on product data
    setValue("description", product.description);
    setValue("status", product.status);
    setValue("price", product.price);
    setValue("tags", product.tags);
    setValue("name", product.name);
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
              placeholder="e.g., Matrix Stainless Hotpots"
              {...register("name", { required: "Product name is required" })}
            />
          </FormControl>
          <FormMessage>{errors.name?.message}</FormMessage>
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
