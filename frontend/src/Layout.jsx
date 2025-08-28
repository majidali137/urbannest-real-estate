import { Outlet, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import toast, { Toaster } from "react-hot-toast";
import { useContext } from "react";
import { UserContext } from "../context/userContext";
import axios from "axios";

const Layout = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
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
    <div className="relative flex justify-between flex-col">
      {/* {location.pathname === '/contact' && <div className="absolute w-80 h-80 bg-orange filter blur-3xl opacity-20 top-36 left-0 rounded-full"/>} */}
      <Header handleLogout={handleLogout} />
      {/* <Toaster position="top-center" toastOptions={{duration: 3000}}/> */}
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
