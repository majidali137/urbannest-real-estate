import { Link, NavLink } from "react-router-dom";
import { navLinks } from "../data/data";
import { User, X, Power, Bell } from "lucide-react";
import { UserContext } from "../../context/userContext";
import { useContext } from "react";
import Toggle from "./Toggle";

const Sidebar = ({
  setShowSidebar,
  showSidebar,
  handleLogout,
  requestSelling,
}) => {
  const { user, notifications } = useContext(UserContext);

  return (
    <div>
      <div
        className="absolute left-0 top-0 bottom-0 w-full h-[100vh] bg-black opacity-40 "
        onClick={() => setShowSidebar(!showSidebar)}
      />

      <div
        className={`${
          showSidebar ? "show-sidebar" : "close-sidebar"
        } overflow-y-auto bg-darkgray max-[400px]:w-full`}
      >
        <div
          className="text-white absolute top-0 m-5 cursor-pointer hover:text-orange transition-all duration-200"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          <X width={20} height={20} />
        </div>

        <div className="flex flex-col justify-between h-full">
          <ul className="w-full h-full flex flex-col items-center justify-start">
            {navLinks.map(({ text, url }, index) => (
              <li
                key={index}
                className="w-full flex items-center justify-center border-b-[1px] border-gray-600 py-3 "
                onClick={() => setShowSidebar(!showSidebar)}
              >
                <NavLink
                  to={url}
                  className={({ isActive }) =>
                    `${
                      isActive ? "text-orange" : "text-white"
                    } py-2 hover:text-orange transition-all duration-200 text-lg md:text-xl sm:text-lg`
                  }
                >
                  {text}
                </NavLink>
              </li>
            ))}
          </ul>
          <ul
            className={`${
              user ? "hidden" : "flex"
            } flex-col items-center justify-center gap-5 text-xl`}
          >
            <li
              className="font-bold px-5 py-2 rounded"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `${
                    isActive ? "text-orange" : "text-white"
                  } hover:text-orange transition-all duration-200`
                }
              >
                Log In
              </NavLink>
            </li>
            <li
              className="font-bold text-white bg-lorange w-full flex items-center justify-center py-3 hover:bg-orange cursor-pointer text-xl transition-all duration-300"
              onClick={() => setShowSidebar(!showSidebar)}
            >
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
              user?.seller || !user ? "hidden" : "flex"
            } bg-orange items-center justify-center text-white gap-10 w-full border-y-[1px] border-darkgray py-3`}
          >
            <Link to={"/profile"} className="flex gap-3 items-center">
              <button onClick={requestSelling} className="text-xl font-bold">
                Become a seller
              </button>
            </Link>
          </ul>
          <ul
            className={`${
              user && user?.seller ? "flex" : "hidden"
            } items-center justify-center text-white gap-10 w-full border-y-[1px] border-gray-600 border-t-[1px] border-b-0 py-4`}
          >
            <Link to={"/profile"} className="flex gap-3 items-center">
              <p>{`Switch to ${
                user?.roles?.[0]?.name === "buyer" ? "Buying" : "Selling"
              }`}</p>
              <Toggle />
            </Link>
          </ul>
          <ul
            className={`${
              user ? "flex" : "hidden"
            } items-center justify-center text-white gap-10 w-full border-y-[1px] border-gray-600 py-3`}
          >
            <Link to={"/profile"} className="flex gap-3 items-center">
              <img
                src={user?.avatar}
                className=" w-10 rounded-full object-cover"
              />{" "}
              {user?.username}
            </Link>
            <li className="flex gap-1">
              <Link
                to={"/profile/notifications"}
                onClick={() => setShowSidebar(!showSidebar)}
                className="relative"
              >
                {notifications?.length > 0 && (
                  <div className="absolute bg-orange w-2 h-2 rounded-full right-0" />
                )}
                <Bell width={22} className="pointer" />
              </Link>
              <div
                onClick={() => {
                  handleLogout();
                  setShowSidebar(!showSidebar);
                }}
              >
                <Power width={22} className="text-light-red pointer" />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
// } px-5 py-2 rounded hover:bg-orange cursor-pointer transition-all duration-300

export default Sidebar;
