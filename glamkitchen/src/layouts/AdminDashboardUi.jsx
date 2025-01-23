import { Outlet } from "react-router-dom";
import SideBar from "@/components/admin/SideBar";
import Header from "@/components/admin/Header";
import { Toaster } from "@/components/ui/toaster";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SideBar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Outlet />
          <Toaster />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
