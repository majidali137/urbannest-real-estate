import { NavLink, Link, useLocation } from "react-router-dom";
import logo from "../assets/Images/urbannestNavbar.png";
import logoIcon from "../assets/Images/urbannestIcon.png";
import { navLinks } from "../data/data";
import { Bell, ChevronDown, LogOut, MenuIcon, User } from "lucide-react";
import { useState, useContext, useEffect } from "react";
import Sidenavbar from "./Sidenavbar";
import axios from "axios";
import toast from "react-hot-toast";
import { UserContext } from "../../context/userContext";
import { ProfileContext } from "../../context/profileContext";
import { useNavigate } from "react-router-dom";
import Toggle from "./Toggle";
import * as React from "react";
import useClickOutside from "../hooks/useClickOutside";

const Header = ({ handleLogout }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const refMenu = React.useRef();

  const { user, notifications } = useContext(UserContext);

  const { setRequestSellerSession } = useContext(ProfileContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setShowProfile(true);
    } else {
      setShowProfile(false);
    }
  }, [user]);

  const requestSelling = async () => {
    try {
      const { data } = await axios.patch("/become-a-seller");

      if (data.uncomplete) {
        toast.error(data.uncomplete);
        console.log(data);
        setRequestSellerSession(true);
        navigate("/profile");
        location.reload(true);
      } else {
        toast.success(data.success);
        location.reload(true);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error becoming a seller!");
    }
  };

  useClickOutside(refMenu, () => setOpenMenu(false));

  const location = useLocation();

  // Check if the current path is '/profile'
  if (location.pathname !== "/profile") {
    return (
      <nav className="navbar">
        <Link to="/" className="hover:scale-110 transition-all duration-300">
          <img
            src={logo}
            alt="urban-nest-logo"
            className="w-40 max-sm:hidden block"
          />
          <img
            src={logoIcon}
            alt="urban-nest-logo"
            className=" w-9 max-sm:block hidden"
          />
        </Link>
        <ul className="lg:flex hidden items-center text-white">
          {navLinks.map(({ text, url }, index) => (
            <li key={index}>
              <NavLink
                to={url}
                className={({ isActive }) =>
                  `${isActive ? "text-orange" : "text-white"} nav-links`
                }
              >
                {text}
              </NavLink>
            </li>
          ))}
        </ul>
        <ul
          className={`${showProfile ? "hidden" : "lg:flex"} text-white  hidden`}
        >
          <li className="font-bold px-5 py-2 rounded cursor-pointer">
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `${isActive ? "text-orange" : "text-white"} nav-links`
              }
            >
              Log In
            </NavLink>
          </li>
          <li className="register-btn">
            <NavLink
              to="/register"
              className={({ isActive }) => `${isActive} : 'text-white' : '' `}
            >
              Register
            </NavLink>
          </li>
        </ul>
        <ul
          className={`${
            showProfile ? "lg:flex hidden" : "hidden"
          } items-center text-white gap-4`}
        >
          <button
            onClick={requestSelling}
            className={`${
              user && user?.roles?.[0]?.name === "buyer" && !user?.seller
                ? "block"
                : "hidden"
            } bg-orange rounded-lg px-3 py-2 font-bold`}
          >
            Become a seller
          </button>
          <div
            className={`${
              user && user.seller ? "flex gap-2 items-center" : "hidden"
            }`}
          >
            <p className="text-sm">
              <span>Switch to</span>
              <br className="w-0 h-0 p-0 m0" />
              {`${user?.roles?.[0]?.name == "seller" ? "Buying" : "Selling"}`}
            </p>
            <Toggle />
          </div>
          <div className="flex items-center gap-2">
            <Link to={"/profile"} className="relative">
              <img
                src={user?.avatar}
                className=" w-10 h-10 object-cover rounded-full"
              />
              {notifications?.length > 0 && (
                <div className="w-[0.6rem] h-[0.6rem] rounded-full bg-orange absolute top-0 right-0" />
              )}
            </Link>
            <div className="relative" ref={refMenu}>
              <ChevronDown
                onClick={() => setOpenMenu(!openMenu)}
                className={`text-white cursor-pointer w-5`}
              />
              <div
                className={`${
                  openMenu
                    ? "opacity-1 visible translate-y-0 translate-x-0"
                    : "invisible opacity-0 -translate-y-4 "
                } transition-all duration-300 ease-in-out absolute top-12 right-2  bg-gray-600 rounded-lg`}
              >
                <div className="flex flex-col gap-2 items-center w-full px-8 py-3 border-b-[1px] border-b-light-gray ">
                  <img
                    src={user?.avatar}
                    alt={"profile"}
                    className="w-14  rounded-full"
                  />
                  <div>
                    <p className="leading-5 text-center mt-2">
                      @{user?.username}
                    </p>
                    <p className="italic text-[#c7c7c7r] text-xs">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <Link
                  to={"/admin-dashboard"}
                  className={`${
                    user?.roles?.[0]?.name === "admin" ? "" : "hidden"
                  }`}
                >
                  <p className="px-4 py-2  border-b-[1px] border-b-light-gray">
                    Admin Pannel
                  </p>
                </Link>
                <Link to={"/profile"}>
                  <div className=" px-4 py-2 border-b-[1px] border-b-light-gray flex items-center gap-2">
                    <User width={18} />
                    Profile
                  </div>
                </Link>
                <Link to={"/profile/notifications"}>
                  <div className="px-4 py-2 border-b-[1px] border-b-light-gray flex items-center gap-2">
                    <div className="relative">
                      <Bell width={18} />
                      {notifications?.length > 0 && (
                        <div className="w-[0.9rem] h-[0.9rem] flex items-center justify-center rounded-full bg-orange absolute -top-1 -right-2 text-xs">
                          {notifications?.length}
                        </div>
                      )}
                    </div>
                    Notifications
                  </div>
                </Link>
                <div
                  onClick={handleLogout}
                  className="cursor-pointer px-4 py-2 flex items-center gap-2"
                >
                  <LogOut width={18} />
                  Logout
                </div>
              </div>
            </div>
          </div>
        </ul>
        <div className="lg:hidden text-white">
          <div
            className="cursor-pointer"
            onClick={() => {
              setShowSidebar(!showSidebar);
            }}
          >
            <MenuIcon width={30} height={30} />
          </div>
          <div className={`${showSidebar ? "block" : "hidden"}`}>
            <Sidenavbar
              setShowSidebar={setShowSidebar}
              showSidebar={showSidebar}
              handleLogout={handleLogout}
              requestSelling={requestSelling}
            />
          </div>
        </div>
      </nav>
    );
  }
};

export default Header;
