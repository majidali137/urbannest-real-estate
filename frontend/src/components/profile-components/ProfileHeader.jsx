import { Bell, ChevronDown, Menu, Power, Shield } from "lucide-react";
import { UserContext } from "../../../context/userContext";
import { useContext, useEffect, useRef, useState } from "react";
import { ProfileContext } from "../../../context/profileContext";
import { Link, NavLink } from "react-router-dom";
import { Link2 } from "lucide-react";
import Toggle from "../Toggle";
import useClickOutside from "../../hooks/useClickOutside";
import Badge from "@mui/material/Badge";

const ProfileHeader = ({ requestSelling, handleLogout, className }) => {
  const { user, notifications, setNotifications, setSelectedChat } =
    useContext(UserContext);
  const { show, setShow } = useContext(ProfileContext);

  const [dropDown, setDropDown] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef();
  const dropDownMenu = useRef();

  const filterLoggedUser = (chat) => {
    const sender = chat?.users?.filter((item) => item._id !== user._id);
    console.log(notifications);
    return sender[0];
  };

  useClickOutside(notifRef, () => setShowNotif(false));
  useClickOutside(dropDownMenu, () => setDropDown(false));

  const notificationsHandler = (notif) => {
    setSelectedChat(notif.chat);
    setNotifications(notifications.filter((n) => n._id !== notif._id));
    localStorage.setItem("notifications", JSON.stringify(notifications));
  };

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, []);

  return (
    <div
      className={`${className} bg-darkgray sticky top-0 z-10 w-full flex justify-between items-center border-b-[1px] border-gray py-5 sm:px-10 px-4`}
    >
      <Menu
        className="text-white cursor-pointer"
        onClick={() => setShow(!show)}
      />
      <Link
        to={"/"}
        className="flex gap-2 text-orange cursor-pointer max-[350px]:hidden"
      >
        <Link2 />
        <p className="max-md:hidden">Go to Urbannest.pk</p>
      </Link>
      <div className="flex items-center gap-2 relative">
        <div>
          <button
            onClick={requestSelling}
            className={`${
              user && user?.roles?.[0]?.name === "buyer" && !user.seller
                ? "block"
                : "hidden"
            } text-white bg-orange rounded-lg px-3 py-2 font-bold`}
          >
            Become a seller
          </button>
          <div
            className={`${
              user && user.seller ? "flex items-center gap-2" : "hidden"
            } text-white max-sm:hidden`}
          >
            <p className="text-sm">{`Switch to ${
              user?.roles?.[0]?.name == "seller" ? "Buying" : "Selling"
            }`}</p>
            <Toggle />
          </div>
        </div>
        <img
          src={user?.avatar}
          className="rounded-full w-8 h-8 object-cover"
          alt="profile"
        />
        <p className="text-white max-sm:hidden">{user?.username}</p>
        <p className="text-white max-sm:block hidden">
          {user?.username?.length > 8
            ? user?.username.slice(0, 5)
            : user?.username}
          ...
        </p>
        <div
          ref={notifRef}
          className="text-white relative "
          onClick={() => setShowNotif(!showNotif)}
        >
          <div
            className={`${
              showNotif
                ? "opacity-1 visible translate-y-0 translate-x-0"
                : "invisible opacity-0 -translate-y-4 translate-x-0"
            } absolute top-8 right-0 text-sm bg-gray-600 px-3 py-1 rounded cursor-pointer w-40 transition-all duration-200`}
          >
            {!notifications?.length && "No new Messages"}
            {notifications.map((notif) => (
              <Link key={notif._id} to="/profile/notifications">
                <div onClick={() => notificationsHandler(notif)}>
                  New message from{" "}
                  <span className="text-orange">
                    {filterLoggedUser(notif?.chat)?.username}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <Badge badgeContent={notifications.length} color="primary">
            <Bell width={20} height={20} className="cursor-pointer" />
          </Badge>
        </div>
        <div ref={dropDownMenu}>
          <ChevronDown
            className={`${
              dropDown ? "" : "rotate-180"
            } text-white w-5 cursor-pointer transition-all duration-150`}
            onClick={() => setDropDown(!dropDown)}
          />
          <div
            className={`${
              dropDown
                ? "visible opacity-1 translate-y-0"
                : "invisible opacity-0 -translate-y-4"
            } absolute transition-all duration-200 flex flex-col items-start gap-2 bg-white px-5 py-2 right-0 top-10 rounded-lg cursor-pointer`}
          >
            <Link
              to={"/admin-dashboard"}
              className={`${
                user?.roles?.[0]?.name === "admin" ? "flex" : "hidden"
              } items-center justify-center gap-2`}
            >
              <Shield className="w-4" />
              <p>Admin Pannel</p>
            </Link>
            <div
              className="flex items-center justify-center gap-2"
              onClick={handleLogout}
            >
              <Power className="text-red w-4" />
              <p className="text-red">Logout</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
