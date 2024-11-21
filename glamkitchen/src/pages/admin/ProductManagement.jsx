import { Link } from "react-router-dom";
import {
  File,
  RefreshCcwDot,
  MoreHorizontal,
  PlusCircle,
  Trash2,
  Pencil,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pagination from "../../components/Pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useEffect, useState } from "react";

import EditProductForm from "@/components/forms/EditProductForm";
import AddProductForm from "@/components/forms/AddProductForm";
import { useProductFunctions } from "@/utils/firebase";

export default function ProductManagement() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const { fetchAllProducts, deleteProduct } = useProductFunctions();
  const fetchAllProductsInStore = async () => {
    setLoading(true);
    try {
      const fetchAllProductsResponse = await fetchAllProducts();
      console.log("fetch_all_products_response >> ", fetchAllProductsResponse);
      setProducts(fetchAllProductsResponse?.data);
      setLoading(false);
    } catch (error) {
      console.error("error_response_fetching_all_products >> ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("fetching_all_products_in_store_initilized ... ");
    fetchAllProductsInStore();
  }, []);

  // pagination
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [currentItems, setCurrentItems] = useState([]);
  const itemsPerPage = 10;
  const lastCount = itemOffset + itemsPerPage;

  useEffect(() => {
    try {
      const endOffset = itemOffset + itemsPerPage;
      console.log(`Loading items from ${itemOffset} to ${endOffset}`);
      setCurrentItems(products.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(products.length / itemsPerPage));
    } catch (error) {
      console.log("an error occured at /products >> ", error);
    }
  }, [itemOffset, itemsPerPage, products]);

  const handleDeleteProduct = async (id) => {
    console.log("ready to edit product #", id);
    const isConfirmed = window.confirm("Are you sure you want to delete?");

    if (isConfirmed) {
      // Proceed with delete operation
      // Your delete logic here
      console.log("Deleting...");
      const deleteProductResponse = await deleteProduct(id);
      console.log("delete_product_response >> ", deleteProductResponse);
    } else {
      // Cancel delete operation
      console.log("Delete operation canceled.");
    }
  };

  const renderProducts = () => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="text-center">
            Fetching products. Please wait...
          </TableCell>
        </TableRow>
      );
    } else if (!products || products.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="text-center">
            No products in store
          </TableCell>
        </TableRow>
      );
    } else {
      return currentItems.map((product, index) => (
        <TableRow key={index}>
          {/* Product Image */}
          <TableCell className="hidden sm:table-cell">
            <img
              alt="Product image"
              className="aspect-square rounded-md object-cover"
              height="64"
              src={product.productImage || "/placeholder.svg"}
              width="64"
            />
          </TableCell>

          {/* Product Name */}
          <TableCell className="font-medium">{product.productName}</TableCell>

          {/* Product Category */}
          <TableCell className="hidden md:table-cell">
            {product.ProductCategory}
          </TableCell>

          {/* Product Tags */}
          <TableCell className="hidden md:table-cell">
            <div className="flex flex-wrap gap-2">
              {product.productTags.map((tag, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </TableCell>

          {/* Product Price */}
          <TableCell className="hidden md:table-cell">
            ${product.price}
          </TableCell>

          {/* Stock Status */}
          <TableCell>
            <Badge
              variant={
                product.stockStatus === "Available" ? "outline" : "secondary"
              }
            >
              {product.stockStatus}
            </Badge>
          </TableCell>

          {/* Product Properties (sale, blackFriday, etc.) */}
          <TableCell className="hidden md:table-cell">
            <div className="flex flex-col gap-1">
              {Object.entries(product.productProperties).map(
                ([property, value]) =>
                  value && (
                    <Badge
                      key={property}
                      variant="secondary"
                      className="text-xs capitalize"
                    >
                      {property === "blackFriday" ? "Black Friday" : property}
                    </Badge>
                  )
              )}
            </div>
          </TableCell>

          {/* Creation Date */}
          <TableCell className="hidden md:table-cell">
            {product.createdAt}
          </TableCell>

          {/* Actions */}
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button aria-haspopup="true" size="icon" variant="ghost">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>

                <DropdownMenuItem
                  onClick={() => handleDeleteProduct(product?.id)}
                >
                  <Trash2 className="text-red-700 mr-1 w-5" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      ));
    }
  };

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="sale">Sale</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
            <TabsTrigger value="out-of-stock" className="hidden sm:flex">
              Out Of Stock
            </TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1"
              onClick={fetchAllProductsInStore}
            >
              <RefreshCcwDot className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Refresh
              </span>
            </Button>

            <Button size="sm" variant="outline" className="h-8 gap-1">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Export
              </span>
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="h-8 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Product
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add a New Product</DialogTitle>

                  <AddProductForm />
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <TabsContent value="all">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>
                Manage your products and view their sales performance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden w-[100px] sm:table-cell">
                      <span className="sr-only">Image</span>
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Category
                    </TableHead>
                    <TableHead className="hidden md:table-cell">Tags</TableHead>
                    <TableHead>Stock Status</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Price
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Product Properties
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Created at
                    </TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>{renderProducts()}</TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className="flex justify-between items-baseline w-full">
                <div className="text-xs text-muted-foreground">
                  Showing{" "}
                  <strong>
                    {itemOffset + 1}–
                    {lastCount > products?.length ? products.length : lastCount}
                  </strong>{" "}
                  of <strong>{products?.length}</strong> products
                </div>
                <div className=" flex justify-end my-4">
                  <Pagination
                    items={products}
                    pageCount={pageCount}
                    setItemOffset={setItemOffset}
                    itemsPerPage={itemsPerPage}
                  />
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
