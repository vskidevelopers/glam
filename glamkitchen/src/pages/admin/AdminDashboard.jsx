import { Truck, Copy, CreditCard, ListFilter, File } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { useOrdersFunctions, useProductFunctions } from "@/utils/firebase";
function AdminDashboard() {
  const [loading, setLoading] = useState(false);

  const [allOrders, setAllOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // State to store the selected order

  const {
    getAllOrders,
    getAllOrdersbyStatus,
    updateOrderStatusById,
    deleteOrder,
  } = useOrdersFunctions();

  const [products, setProducts] = useState([]);
  const { fetchAllProducts } = useProductFunctions();
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

  const handleGetOrders = async () => {
    setLoading(true);
    const allExpressOrdersData = await getAllOrders("EXPRESS");
    const allGeneralOrdersData = await getAllOrders();

    // Combine both orders into one array
    const combinedOrders = [
      ...(allExpressOrdersData?.data || []),
      ...(allGeneralOrdersData?.data || []),
    ];

    console.log("setting_orders_to_state ...", combinedOrders);

    // Set the combined orders to state
    setAllOrders(combinedOrders);
    console.log("allOrders >> ", combinedOrders);
    setLoading(false);
  };

  function getStatusClass(status) {
    switch (status) {
      case "pending":
        return "bg-yellow-200 text-yellow-800 border-yellow-500"; // Pending: Yellow
      case "fulfilled":
        return "bg-green-200 text-green-800 border-green-500"; // Fulfilled: Green
      case "rejected":
        return "bg-red-200 text-red-800 border-red-500"; // Rejected: Red
      default:
        return "bg-gray-200 text-gray-800 border-gray-500"; // Default: Gray
    }
  }
  const handleChangeStatus = async (newStatus, order) => {
    // Show confirmation dialog to the user
    const confirmation = confirm(
      `Are you sure you want to change the status of Order ID: ${order?.id} to ${newStatus}?`
    );

    if (!confirmation) {
      console.log("Status change canceled.");
      return;
    }

    try {
      console.log(`Updating status for Order ID: ${order?.id}...`);

      const updateOrderStatusByIdResponse = await updateOrderStatusById(
        order?.id,
        newStatus,
        order?.type
      );
      if (updateOrderStatusByIdResponse?.success) {
        console.log(`Order ID: ${order.id} status updated successfully.`);
        alert(`Order ID: ${order.id} status updated successfully.`);
        handleGetOrders();
        setSelectedOrder(order);
      } else {
        console.error(`Failed to update Order ID: ${order.id}`);
        return;
      }
    } catch (error) {
      console.error(
        `An error occurred while updating the status for Order ID: ${order?.id}:`,
        error
      );
    }
  };

  useEffect(() => {
    handleGetOrders();
    fetchAllProductsInStore();
  }, []);

  const renderAllOrders = () => {
    console.log("all_orders >> ", allOrders);
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="text-center">
            Fetching Orders. Please wait...
          </TableCell>
        </TableRow>
      );
    } else if (!allOrders || allOrders?.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="text-center">
            No orders in store
          </TableCell>
        </TableRow>
      );
    } else {
      return allOrders?.map((order, index) => (
        <TableRow
          key={index}
          onClick={() => setSelectedOrder(order)}
          className="cursor-pointer hover:bg-gray-100"
        >
          <TableCell className="hidden sm:table-cell">{index + 1}</TableCell>
          <TableCell className="hidden sm:table-cell">{order?.id}</TableCell>
          <TableCell>
            <div className="font-medium">{order?.customer?.name}</div>
            <div className="hidden text-sm text-muted-foreground md:inline">
              {order?.customer?.email}
            </div>
          </TableCell>
          <TableCell className="hidden sm:table-cell">
            {order?.type ? order?.type : "EXPRESS"}
          </TableCell>
          <TableCell className="hidden sm:table-cell">
            <Badge variant="outline" className={getStatusClass(order?.status)}>
              {order?.status}
            </Badge>
          </TableCell>
          <TableCell className="hidden md:table-cell">
            {order?.orderDate
              ? new Date(order.orderDate).toLocaleDateString()
              : "N/A"}
          </TableCell>

          <TableCell className="text-right">
            {order?.paymentInfo?.method === "Mpesa" ? (
              <div>
                <span>{order?.paymentInfo?.method}</span>
                {order?.paymentInfo?.mpesaCode && (
                  <div className="text-sm text-gray-500">
                    {order?.paymentInfo?.mpesaCode}
                  </div>
                )}
              </div>
            ) : (
              <span>{order?.paymentInfo?.method}</span>
            )}
          </TableCell>
          <TableCell className="text-center whitespace-nowrap">
            Ksh {order?.cart?.totalPrice}
          </TableCell>
        </TableRow>
      ));
    }
  };

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl ">
                Welcome, to{" "}
                <span className="text-primary font-bold">
                  Glam Your Kitchen
                </span>
              </CardTitle>

              <CardDescription className="max-w-lg text-balance leading-relaxed">
                Seamlessly manage your kitchenware business. Oversee product
                availability, customer orders, and sales insights to ensure a
                smooth and delightful shopping experience for your customers.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link to={`/admin/orders/`}>
                <Button>Manage Orders</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card
            x-chunk="dashboard-05-chunk-1"
            className="border border-flame/50 shadow-lg rounded-lg"
          >
            <CardHeader className="pb-4">
              <CardDescription className="text-sm text-robin_egg_blue">
                Total Orders
              </CardDescription>
              <CardTitle className="text-5xl font-bold text-flame">
                {allOrders?.length}
              </CardTitle>
            </CardHeader>
            <CardContent className="mt-4">
              <div className="text-xs text-muted-foreground">
                <span className="text-jonquil font-semibold">+25%</span> from
                last week
              </div>
            </CardContent>
            <CardFooter className="pt-4 flex justify-end">
              <Link to={`/admin/orders/`}>
                <Button
                  variant="outline"
                  className="text-robin_egg_blue border-robin_egg_blue hover:bg-robin_egg_blue/10"
                >
                  View Details
                </Button>
              </Link>
            </CardFooter>
          </Card>
          <Card
            x-chunk="dashboard-05-chunk-2"
            className="border border-robin_egg_blue/50 shadow-md rounded-lg"
          >
            <CardHeader className="pb-4">
              <CardDescription className="text-sm text-jonquil">
                Total Products
              </CardDescription>
              <CardTitle className="text-5xl font-bold text-robin_egg_blue">
                {products?.length}
              </CardTitle>
            </CardHeader>
            <CardContent className="mt-4">
              <div className="text-xs text-muted-foreground">
                <span className="text-flame font-semibold">+10%</span> from last
                month
              </div>
            </CardContent>
            <CardFooter className="pt-4 flex justify-end">
              <Link to={`/admin/products/`}>
                <Button
                  variant="outline"
                  className="text-flame border-flame hover:bg-flame/10"
                >
                  Manage Products
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
        <div>
          <Card x-chunk="dashboard-05-chunk-3">
            <CardHeader className="px-7">
              <CardTitle>Orders </CardTitle>
              <CardDescription>
                Recent Order requests from your store.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden sm:table-cell">Type</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Status
                    </TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Payment Method
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Total Amount
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>{renderAllOrders()}</TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
      <div>
        <Dialog>
          {selectedOrder ? (
            <Card>
              <CardDescription className="px-10 py-5">
                <div className="grid gap-3">
                  <div className="font-semibold">Order Details</div>
                  <ul className="grid gap-3">
                    {selectedOrder?.cart?.items?.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span className="text-muted-foreground">
                          {item?.productName} x <span>{item?.quantity}</span>
                        </span>
                        <span>Ksh {item?.subtotal}</span>
                      </li>
                    ))}
                  </ul>
                  <Separator className="my-2" />
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>
                        Ksh {selectedOrder?.cart?.totalPrice || "299.00"}
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>Ksh {selectedOrder?.cart?.shipping || "5.00"}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>Ksh {selectedOrder?.cart?.tax || "25.00"}</span>
                    </li>
                    <li className="flex items-center justify-between font-semibold">
                      <span className="text-muted-foreground">Total</span>
                      <span>
                        Ksh {selectedOrder?.cart?.totalPrice || "329.00"}
                      </span>
                    </li>
                  </ul>
                  <Separator className="my-4" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-3">
                      <div className="font-semibold">Shipping Information</div>
                      <address className="grid gap-0.5 not-italic text-muted-foreground">
                        <span>
                          {selectedOrder?.customer?.name || "No name"}
                        </span>
                        <span>{selectedOrder?.location || "No address"}</span>
                      </address>
                    </div>
                    <div className="grid auto-rows-max gap-3">
                      <div className="font-semibold">Billing Information</div>
                      <div className="text-muted-foreground">
                        {selectedOrder?.paymentInfo?.method ===
                        "Pay on Delivery"
                          ? "On Delivery"
                          : "Same as shipping address"}
                      </div>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="grid gap-3">
                    <div className="font-semibold">Customer Information</div>
                    <dl className="grid gap-3">
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Customer</dt>
                        <dd>{selectedOrder?.customer?.name || "No name"}</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Email</dt>
                        <dd>{selectedOrder?.customer?.email || "No email"}</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Phone</dt>
                        <dd>
                          <a href="tel:">
                            {selectedOrder?.customer?.phone ||
                              "No phone number"}
                          </a>
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <Separator className="my-4" />
                  <div className="grid gap-3">
                    <div className="font-semibold">Payment Information</div>
                    <dl className="grid gap-3">
                      <div className="flex items-center justify-between">
                        <dt className="flex items-center gap-1 text-muted-foreground">
                          <CreditCard className="h-4 w-4" />
                          {selectedOrder?.paymentInfo?.method ||
                            "No payment method"}
                        </dt>
                        <dd>
                          {selectedOrder?.paymentInfo?.mpesaCode ||
                            (selectedOrder?.paymentInfo?.method ===
                            "Pay on Delivery"
                              ? "On Delivery"
                              : "No code available")}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                    <div className="text-xs text-muted-foreground">
                      Updated{" "}
                      <time dateTime="2023-11-23">November 23, 2023</time>
                    </div>
                    <DialogTrigger asChild>
                      <Button variant="outline">Change Status</Button>
                    </DialogTrigger>
                  </CardFooter>
                </div>
              </CardDescription>
            </Card>
          ) : (
            <Card>
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground text-lg">
                  No selected order
                </p>
              </div>
            </Card>
          )}
          {selectedOrder && (
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Change Order Status</DialogTitle>
                <DialogDescription>
                  Select the new status for this order. Please confirm your
                  action as this change cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <Alert variant="info">
                  <p>
                    Current Status:{" "}
                    <span className="font-bold">
                      {selectedOrder?.status || "Unknown"}
                    </span>
                  </p>
                </Alert>
                <div className="flex gap-2 justify-center">
                  <StatusButton
                    variant="outline"
                    onClick={() => handleChangeStatus("pending", selectedOrder)}
                  >
                    Mark as Pending
                  </StatusButton>
                  <StatusButton
                    variant="success"
                    onClick={() =>
                      handleChangeStatus("fulfilled", selectedOrder)
                    }
                  >
                    Mark as Fulfilled
                  </StatusButton>
                  <StatusButton
                    variant="destructive"
                    onClick={() =>
                      handleChangeStatus("rejected", selectedOrder)
                    }
                  >
                    Mark as Rejected
                  </StatusButton>
                </div>
              </div>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </main>
  );
}

export default AdminDashboard;

const Alert = ({ variant, children }) => {
  const variants = {
    info: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    destructive: "bg-red-100 text-red-800",
  };

  return (
    <div className={`p-3 rounded-md ${variants[variant]}`}>{children}</div>
  );
};

export const StatusButton = ({ variant, onClick, children }) => {
  const variants = {
    outline: "border border-gray-400 text-gray-700",
    success: "bg-green-500 text-white hover:bg-green-600",
    destructive: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      onClick={onClick}
      className={`py-2 px-4 rounded ${variants[variant]} focus:outline-none`}
    >
      {children}
    </button>
  );
};
