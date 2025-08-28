import { useEffect, useContext, useState } from "react";
import { UserContext } from "../../context/userContext";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import ProfileSidebar from "../components/profile-components/ProfileSidebar";
import ProfileHeader from "../components/profile-components/ProfileHeader";
import { ProfileContext } from "../../context/profileContext";
import toast from "react-hot-toast";
import { Bell, Heart, Home, MapPin, Rows, User } from "lucide-react";

const profileItems = [
  {
    name: "User Info",
    icon: <User width={17} />,
    url: "/profile",
  },
  {
    name: "Dashboard",
    icon: <Rows width={17} />,
    url: "/profile/dashboard",
  },
  {
    name: "Add Property",
    icon: <MapPin width={17} />,
    url: "/profile/add-listing",
  },
  {
    name: "All Properties",
    icon: <Home width={17} />,
    url: "/profile/manage-listings",
  },
  {
    name: "Favourites",
    icon: <Heart width={17} />,
    url: "/profile/favourites",
  },
  {
    name: "Notifications",
    icon: <Bell width={17} />,
    url: "/profile/notifications",
  },
];

const landingPageLinks = [
  {
    name: "Home",
    url: "/",
  },
  {
    name: "About",
    url: "/about",
  },
  {
    name: "Contact",
    url: "/contact",
  },
];

const Profile = () => {
  const [select, setSelect] = useState("User Info");

  const { user, setUser, loading } = useContext(UserContext);
  const { setRequestSellerSession } = useContext(ProfileContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Clear the user context state on logout
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

  const requestSelling = async () => {
    try {
      const { data } = await axios.patch("/become-a-seller");

      if (data.uncomplete) {
        console.log(data);
        setRequestSellerSession(true);
        toast.error(data.uncomplete);
        navigate("/profile");
      } else {
        toast.success(data.success);
        // location.reload(true)
      }
    } catch (error) {
      console.error(error);
      toast.error("Error becoming a seller!");
    }
  };

  return (
    <div
      className={`h-screen grid md:grid-cols-[200px,1fr] sm:grid-cols-[70px,1fr] grid-cols-[1fr] grid-rows-[70px,1fr] overflow-hidden`}
    >
      <ProfileHeader
        requestSelling={requestSelling}
        handleLogout={handleLogout}
        className={`col-start-1 col-end-3 row-start-1 row-end-2`}
      />
      <ProfileSidebar
        select={select}
        setSelect={setSelect}
        profileItems={profileItems}
        handleLogout={handleLogout}
        landingPageLinks={landingPageLinks}
        className={``}
      />
      <Outlet requestSelling={requestSelling} className={``} />
    </div>
  );
};

export default Profile;
