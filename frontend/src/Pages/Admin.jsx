import React, { useContext, useState } from "react";
import AdminHeader from "../components/admin-components/AdminHeader";
import AdminFooter from "../components/admin-components/AdminFooter";
import AdminSidebar from "../components/admin-components/AdminSidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { LandPlot, LayoutDashboardIcon, Rows, User, User2 } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { UserContext } from "../../context/userContext";

const Admin = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [expand, setExpand] = useState(false);

  const profileItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboardIcon width={17} />,
      url: "/admin-dashboard",
    },
    {
      name: "Properties",
      icon: <LandPlot width={17} />,
      url: "/admin-dashboard/listing",
    },
    {
      name: "Users",
      icon: <User2 width={17} />,
      url: "/admin-dashboard/users",
    },
  ];

  const handleLogout = async () => {
    try {
      const { data } = await axios.get("/logout");
      if (data.message) {
        toast.success(data.message);
        setUser(null);
        navigate("/login");
      } else {
        toast.error("Logging out failed");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div
      className={`h-screen grid md:grid-cols-[200px,1fr] grid-cols-[60px,1fr] grid-rows-[70px,1fr]`}
    >
      <AdminHeader
        handleLogout={handleLogout}
        className={`col-start-2 col-end-3 row-start-1 row-end-2`}
      />
      <AdminSidebar
        expand={expand}
        setExpand={setExpand}
        profileItems={profileItems}
        handleLogout={handleLogout}
        className={`col-start-1 col-end-2 row-start-1 row-end-3`}
      />
      <Outlet />
    </div>
  );
};

export default Admin;
