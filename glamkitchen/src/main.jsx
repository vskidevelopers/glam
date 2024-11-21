import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import MaintenancePage from "./pages/MaintenancePage";
import UserUi from "./layouts/UserUi";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import UserDashboard from "./pages/UserDashboard";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import AdminDashboardUi from "./layouts/AdminDashboardUi";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductManagement from "./pages/admin/ProductManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import UserManagement from "./pages/admin/UserManagement";
import Reports from "./pages/admin/Reports";
import PrivateRoutes from "./auth/PrivateRoutes";
import ShopUi from "./layouts/ShopUi";
import Login from "./auth/Login";
import AdminCategories from "./pages/admin/AdminCategories";
import TrackOrder from "./pages/TrackOrder";
import Categories from "./pages/Categories";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<MaintenancePage />} />
      <Route path="/home" element={<UserUi />}>
        {/* Homepage */}
        <Route index element={<Home />} />

        {/* Shop Page */}
        <Route path="shop" element={<ShopUi />}>
          <Route index element={<Shop />} />
        </Route>

        {/* Product Details Page */}
        <Route path="shop/:productId" element={<ProductDetails />} />

        {/* Cart Page */}
        <Route path="cart" element={<Cart />} />

        {/* Categories Page */}
        <Route path="categories" element={<Categories />} />

        {/* Checkout Page */}
        <Route path="checkout" element={<Checkout />} />

        {/* Order Confirmation Page */}
        <Route
          path="order-confirmation/:orderId"
          element={<OrderConfirmation />}
        />
        <Route path="order-tracking" element={<TrackOrder />} />

        {/* User Dashboard */}
        <Route path="user-dashboard" element={<UserDashboard />} />

        {/* About Us Page */}
        <Route path="about" element={<AboutUs />} />

        {/* Contact Us Page */}
        <Route path="contact" element={<ContactUs />} />
      </Route>

      <Route path="login" element={<Login />} />
      {/* Admin Pages */}
      <Route element={<PrivateRoutes />}>
        <Route path="/admin" element={<AdminDashboardUi />}>
          {/* Admin Dashboard Overview */}
          <Route index element={<AdminDashboard />} />

          {/* Product Management */}
          <Route path="products" element={<ProductManagement />} />

          {/* Order Management */}
          <Route path="orders" element={<OrderManagement />} />

          {/* Category Management */}
          <Route path="categories" element={<AdminCategories />} />

          {/* User Management */}
          <Route path="users" element={<UserManagement />} />

          {/* Reports & Analytics */}
          <Route path="reports" element={<Reports />} />
        </Route>
      </Route>
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
