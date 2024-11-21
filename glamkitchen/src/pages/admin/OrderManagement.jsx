import { RefreshCcwDot, File, Trash2 } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useOrdersFunctions } from "@/utils/firebase";

export default function OrderManagement() {
  const [loading, setLoading] = useState(false);

  const [allOrders, setAllOrders] = useState([]);

  const {
    getAllOrders,
    getAllOrdersbyStatus,
    updateOrderStatusById,
    deleteOrder,
  } = useOrdersFunctions();

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

  const handleDeleteOrder = async (order) => {
    // Show confirmation dialog to the user
    const confirmation = confirm(
      `Are you sure you want to delete Order ID: ${order?.id}`
    );
    if (!confirmation) {
      console.log("Deletion canceled.");
      return;
    }
    try {
      console.log(`Deleting Order ID: ${order?.id}...`);
      const deleteOrderResponse = await deleteOrder(order?.id, order?.type);
      if (deleteOrderResponse?.success) {
        console.log(`Order ID: ${order.id} deleted successfully.`);
        alert(`Order ID: ${order.id} deleted successfully.`);
        handleGetOrders();
      } else {
        console.error(`Failed to delete Order ID: ${order.id}`);
        return;
      }
    } catch (error) {
      console.error(
        `An error occurred while deleting Order ID: ${order.id}:`,
        error
      );
    }
  };

  useEffect(() => {
    handleGetOrders();
  }, []);
  // Order Table Renders

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
        <Dialog>
          <TableRow>
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
              <DialogTrigger>
                <Badge
                  variant="outline"
                  className={getStatusClass(order?.status)}
                >
                  {order?.status}
                </Badge>
              </DialogTrigger>
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
            <TableCell className="text-right">
              {order?.cart?.totalPrice}
            </TableCell>
            <TableCell className="text-center">
              <button
                className=" px-6"
                onClick={() => handleDeleteOrder(order)}
              >
                <Trash2 color="#ff0000" />
              </button>
            </TableCell>
          </TableRow>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Order Status</DialogTitle>
              <DialogDescription>
                Select the new status for this order. Please confirm your action
                as this change cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <Alert variant="info">
                <p>
                  Current Status:{" "}
                  <span className="font-bold">
                    {order?.status || "Unknown"}
                  </span>
                </p>
              </Alert>

              {/* Status Change Actions */}
              <div className="flex gap-2 justify-center">
                <StatusButton
                  variant="outline"
                  onClick={() => handleChangeStatus("pending", order)}
                >
                  Mark as Pending
                </StatusButton>
                <StatusButton
                  variant="success"
                  onClick={() => handleChangeStatus("fulfilled", order)}
                >
                  Mark as Fulfilled
                </StatusButton>
                <StatusButton
                  variant="destructive"
                  onClick={() => handleChangeStatus("rejected", order)}
                >
                  Mark as Rejected
                </StatusButton>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ));
    }
  };

  const renderExpressOrders = () => {
    const expressOrders = allOrders?.filter(
      (order) => order?.type === "EXPRESS" || order?.type != "GENERAL"
    );
    return renderOrders(expressOrders, "Fetching Express Orders");
  };

  const renderGeneralOrders = () => {
    const generalOrders = allOrders?.filter(
      (order) => order?.type === "GENERAL"
    );
    return renderOrders(generalOrders, "Fetching General Orders");
  };

  const renderOrders = (orders, loadingMessage) => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="text-center">
            {loadingMessage}. Please wait...
          </TableCell>
        </TableRow>
      );
    } else if (!orders || orders?.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="text-center">
            No orders in store
          </TableCell>
        </TableRow>
      );
    } else {
      return orders.map((order, index) => (
        <Dialog>
          <TableRow>
            <TableCell className="hidden sm:table-cell">{index + 1}</TableCell>
            <TableCell className="hidden sm:table-cell">{order?.id}</TableCell>
            <TableCell>
              <div className="font-medium">{order?.customer?.name}</div>
              <div className="hidden text-sm text-muted-foreground md:inline">
                {order?.customer?.email || order?.customer?.phone}
              </div>
            </TableCell>
            <TableCell className="hidden sm:table-cell">
              {order?.type ? order?.type : "EXPRESS"}
            </TableCell>
            <TableCell className="hidden sm:table-cell">
              <DialogTrigger>
                <Badge
                  variant="outline"
                  className={getStatusClass(order?.status)}
                >
                  {order?.status}
                </Badge>
              </DialogTrigger>
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
                <span>
                  {order?.paymentInfo?.method || order?.paymentMethod}
                </span>
              )}
            </TableCell>
            <TableCell className="text-right">
              {order?.cart?.totalPrice}
            </TableCell>

            <TableCell className="text-center">
              <button
                className=" px-6"
                onClick={() => handleDeleteOrder(order)}
              >
                <Trash2 color="#ff0000" />
              </button>
            </TableCell>
          </TableRow>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Order Status</DialogTitle>
              <DialogDescription>
                Select the new status for this order. Please confirm your action
                as this change cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <Alert variant="info">
                <p>
                  Current Status:{" "}
                  <span className="font-bold">
                    {order?.status || "Unknown"}
                  </span>
                </p>
              </Alert>

              {/* Status Change Actions */}
              <div className="flex gap-2 justify-center">
                <StatusButton
                  variant="outline"
                  onClick={() => handleChangeStatus("pending", order)}
                >
                  Mark as Pending
                </StatusButton>
                <StatusButton
                  variant="success"
                  onClick={() => handleChangeStatus("fulfilled", order)}
                >
                  Mark as Fulfilled
                </StatusButton>
                <StatusButton
                  variant="destructive"
                  onClick={() => handleChangeStatus("rejected", order)}
                >
                  Mark as Rejected
                </StatusButton>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ));
    }
  };

  return (
    <div>
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="express">Express</TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1"
              onClick={handleGetOrders}
            >
              <RefreshCcwDot className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Refresh
              </span>
            </Button>
            <Button size="sm" variant="outline" className="h-7 gap-1 text-sm">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only">Export</span>
            </Button>
          </div>
        </div>
        <Card x-chunk="dashboard-05-chunk-3">
          <CardHeader className="px-7">
            <CardTitle>Orders </CardTitle>
            <CardDescription>
              Recent Order requests from your store.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TabsContent value="all">
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

                    <TableHead className="sr-only">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>{renderAllOrders()}</TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="general">
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

                    <TableHead className="sr-only">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>{renderGeneralOrders()}</TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="express">
              <Table>
                <TableHeader>
                  <TableRow>
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
                    <TableHead className="hidden lg:table-cell">
                      Delivery Date
                    </TableHead>
                    <TableHead className="sr-only">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>{renderExpressOrders()}</TableBody>
              </Table>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}

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

const StatusButton = ({ variant, onClick, children }) => {
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
