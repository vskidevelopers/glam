import { RefreshCcwDot, File, MoreHorizontal } from "lucide-react";
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

export default function OrderManagement() {
  const [loading, setLoading] = useState(false);
  const [allOrders, setAllOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [fulfilledOrders, setFulfilledOrders] = useState([]);
  const [rejecteOrders, setRejectedOrders] = useState([]);

  const handleGetOrders = async () => {
    const pendingOrdersData = await getAllOrdersbyStatus("pending");
    const fulfilledOrdersData = await getAllOrdersbyStatus("fulfilled");
    const rejectedOrdersData = await getAllOrdersbyStatus("rejected");
    const allOrdersData = await getAllOrders();

    console.log("setting_orders_to_state ...");

    setAllOrders(allOrdersData?.data);
    setPendingOrders(pendingOrdersData?.data);
    setFulfilledOrders(fulfilledOrdersData?.data);
    setRejectedOrders(rejectedOrdersData?.data);
    console.log("allOrders >> ", allOrdersData?.data);
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
        <TableRow>
          <TableCell>
            <div className="font-medium">{order?.customer_name}</div>
            <div className="hidden text-sm text-muted-foreground md:inline">
              {order?.email}
            </div>
          </TableCell>
          <TableCell className="hidden sm:table-cell">{order?.type}</TableCell>
          <TableCell className="hidden sm:table-cell">
            <OrderStatusBadge status={order?.status} />
          </TableCell>
          <TableCell className="hidden md:table-cell">
            {order?.createdAt}
          </TableCell>
          <TableCell className="text-right">
            {/* Actions section for order */}
          </TableCell>
        </TableRow>
      ));
    }
  };

  const renderPendingOrders = () => {
    const pendingOrders = allOrders?.filter(
      (order) => order?.status === "Pending"
    );
    return renderOrders(pendingOrders, "Fetching Pending Orders");
  };

  const renderFulfilledOrders = () => {
    const fulfilledOrders = allOrders?.filter(
      (order) => order?.status === "Fulfilled"
    );
    return renderOrders(fulfilledOrders, "Fetching Fulfilled Orders");
  };

  const renderRejectedOrders = () => {
    const rejectedOrders = allOrders?.filter(
      (order) => order?.status === "Rejected"
    );
    return renderOrders(rejectedOrders, "Fetching Rejected Orders");
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
        <TableRow>
          <TableCell>
            <div className="font-medium">{order?.customer_name}</div>
            <div className="hidden text-sm text-muted-foreground md:inline">
              {order?.email}
            </div>
          </TableCell>
          <TableCell className="hidden sm:table-cell">{order?.type}</TableCell>
          <TableCell className="hidden sm:table-cell">
            <OrderStatusBadge status={order?.status} />
          </TableCell>
          <TableCell className="hidden md:table-cell">
            {order?.createdAt}
          </TableCell>
          <TableCell className="text-right">
            {/* Actions section for order */}
          </TableCell>
        </TableRow>
      ));
    }
  };

  return (
    <div>
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="fulfilled">Fulfilled</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1"
              //   onClick={handleGetQuotations}
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
            <CardTitle>Orders</CardTitle>
            <CardDescription>
              Recent Order requests from your store.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TabsContent value="all">
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

                <TableBody>{renderAllOrders()}</TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="fulfilled">
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
                <TableBody>{renderFulfilledOrders()}</TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="pending">
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
                <TableBody>{renderPendingOrders()}</TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="rejected">
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
                <TableBody>{renderRejectedOrders()}</TableBody>
              </Table>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
