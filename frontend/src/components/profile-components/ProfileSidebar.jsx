import { LogOut, User } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { ProfileContext } from "../../../context/profileContext";
import { Link, NavLink } from "react-router-dom";
import Toggle from "../Toggle";
import { UserContext } from "../../../context/userContext";
import useClickOutside from "../../hooks/useClickOutside";

const ProfileSidebar = ({
  select,
  setSelect,
  profileItems,
  handleLogout,
  className,
  landingPageLinks,
}) => {
  const { show, setShow } = useContext(ProfileContext);

  return (
    <div
      className={`${
        show ? "sticky top-0 left-0" : "hidden sm:block"
      } transition-all duration-300 z-50 max-h-screen `}
    >
      <div
        className={`${
          show
            ? "fixed top-0 bottom-0 right-0 left-0 bg-black z-40 opacity-50"
            : "hidden"
        }`}
        onClick={() => setShow(!show)}
      />
      <aside
        className={`${
          show
            ? "fixed top-0 left-0 bottom-0 z-50 bg-darkgray h-screen"
            : "sm:block hidden"
        } border-r-[1px] border-gray flex justify-between items-center flex-col m-0 h-[90vh] md:py-10 pb-10`}
      >
        <Sidebar
          profileItems={profileItems}
          select={select}
          setSelect={setSelect}
          handleLogout={handleLogout}
          landingPageLinks={landingPageLinks}
        />
      </aside>
    </div>
  );
};

function Sidebar({ profileItems, handleLogout, landingPageLinks }) {
  const { user } = useContext(UserContext);
  const { show, setShow } = useContext(ProfileContext);

  return (
    <div className=" overflow-y-auto overflow-x-hidden flex w-full h-full justify-between flex-col text-white">
      <div>
        <h1 className="md:flex hidden items-center justify-center font-bold text-xl">
          User Profile
        </h1>
        <div className=" mt-10 w-full">
          {profileItems.map(({ name, icon, url }, index) => (
            <NavLink
              to={url}
              end
              className={({ isActive }) =>
                `${isActive ? "text-orange border-r-2 border-orange" : ""} ${
                  show ? "px-7 justify-start" : "justify-center"
                } w-full flex md:justify-start  py-3 gap-3 md:px-7 relative`
              }
              key={index}
            >
              {icon}
              <p className={`${show ? "block" : "md:block hidden"} text-base`}>
                {name}
              </p>
            </NavLink>
          ))}
        </div>
      </div>
      <div className="flex flex-col justify-center items-center">
        {landingPageLinks.map(({ name, url }, index) => (
          <NavLink
            key={index}
            to={url}
            className={`${show ? "block" : "hidden"} flex-1`}
          >
            {name}
          </NavLink>
        ))}
      </div>
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="sm:hidden flex items-center gap-2 ">
          <Toggle />
          <p className="text-xs ">
            Switch to <br />
            <span>{user?.roles?.name === "seller" ? "Buying" : "Selling"}</span>
          </p>
        </div>
        <div
          onClick={handleLogout}
          className="flex gap-3 items-center justify-center text-light-red cursor-pointer"
        >
          <LogOut />
          <p className="md:flex hidden">Logout</p>
        </div>
      </div>
    </div>
  );
}

export default ProfileSidebar;
