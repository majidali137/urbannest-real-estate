import logo from "../../assets/Images/urbannestNavbar.png";
import logoIcon from "../../assets/Images/urbannestIcon.png";
import { ChevronDown, LogOut, Power } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useContext, useRef, useState } from "react";
import { UserContext } from "../../../context/userContext";
import useClickOutside from "../../hooks/useClickOutside";

const AdminHeader = ({ handleLogout, className }) => {
  const { user } = useContext(UserContext);
  const [dropDown, setDropDown] = useState(false);

  const dropMenu = useRef(null);

  useClickOutside(dropMenu, () => setDropDown(false));

  const stringShortner = (str) => {
    const string = str?.slice(0, 6);
    return string;
  };

  return (
    // <section className="border-b-[1px] border-[#414141]">
    <nav className={`${className} navbar border-b-[1px] border-[#414141]`}>
      <div className="sm:grid grid-cols-3 w-full flex justify-between">
        <div className="col-span-1"></div>
        <div className="col-span-1 flex justify-center">
          <Link to={"/"}>
            <img
              src={logo}
              alt="urbannest-logo"
              className="w-40 md:block hidden"
            />
            <img
              src={logoIcon}
              alt="urbannest-logo"
              className="w-10 md:hidden"
            />
          </Link>
        </div>
        <div className="flex justify-end items-center gap-3 col-span-1">
          <Link to="/">
            <img
              src={user?.avatar}
              alt=""
              className="w-10 h-10 object-contain rounded-full"
            />
          </Link>
          <p className="text-white">{stringShortner(user?.username)}..</p>
          <div ref={dropMenu}>
            <ChevronDown
              className={`${
                dropDown ? "" : "rotate-180"
              } text-white w-5 cursor-pointer transition-all duration-150`}
              onClick={() => setDropDown(!dropDown)}
            />
            <div
              onClick={handleLogout}
              className={`${
                dropDown ? "absolute scale-100" : "absolute scale-0"
              } transition-all duration-150 flex gap-2 bg-white px-5 py-2 right-0 top-10 rounded-lg cursor-pointer`}
            >
              <Power className="text-red w-4" />
              <p className="text-red">Logout</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminHeader;
