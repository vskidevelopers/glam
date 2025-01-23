import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

export default function UserUi() {
  return (
    <div>
      <Navbar />
      <div>
        <Outlet />
      </div>
      <Toaster />
      <Footer />
    </div>
  );
}
