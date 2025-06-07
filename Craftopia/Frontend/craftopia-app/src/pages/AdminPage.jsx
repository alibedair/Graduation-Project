import { useState } from "react";
import AdminSidebar from "../Components/AdminSidebar";
import AdminSearchbar from "../Components/AdminSearchbar";
import AdminDashboard from "../Components/AdminDashboard";
import AdminReports from "../Components/AdminReports";
import AdminCategory from "../Components/AdminCategory";

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
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-[#FAF9F6] overflow-hidden">
      <AdminSidebar selected={selected} setSelected={setSelected} />
      <div className="flex flex-col items-stretch w-4/5 ml-20 overflow-hidden">
        <AdminSearchbar />
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminPage;
