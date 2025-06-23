import { useState } from "react";
import AdminSidebar from "../Components/AdminSidebar";
import AdminSearchbar from "../Components/AdminSearchbar";
import AdminDashboard from "../Components/AdminDashboard";
import AdminReports from "../Components/AdminReports";
import AdminCategory from "../Components/AdminCategory";
import AddCategory from "../Components/AddCategory";
import AdminAuctionManagement from "./AdminAuctionManagement";

const AdminPage = () => {
  const [selected, setSelected] = useState("Home");

  const renderContent = () => {
    switch (selected) {
      case "Home":
        return <AdminDashboard />;
      case "Reports":
        return <AdminReports />;
      case "Categories":
        return <AdminCategory />;
      case "Add Category":
        return <AddCategory />;
      case "Auctions":
        return <AdminAuctionManagement />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FAF9F6] overflow-hidden">
      <AdminSidebar selected={selected} setSelected={setSelected} />
      <div className="flex flex-col items-stretch w-full ml-20 pr-10 overflow-auto h-screen">
        <AdminSearchbar />
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminPage;
