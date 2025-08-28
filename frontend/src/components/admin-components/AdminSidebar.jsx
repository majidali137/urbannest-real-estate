import { ChevronFirst, ChevronLast, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";

const AdminSidebar = ({
  profileItems,
  handleLogout,
  className,
  expand,
  setExpand,
}) => {
  return (
    <aside
      className={`${className} border-r-[1px] border-[#414141] py-5 max-h-screen overflow-y-auto`}
    >
      <Sidebar
        profileItems={profileItems}
        handleLogout={handleLogout}
        className={`overflow-y-auto flex w-full h-full justify-between flex-col text-white`}
        expand={expand}
        setExpand={setExpand}
      />
      <Sidebar
        profileItems={profileItems}
        handleLogout={handleLogout}
        className={`${
          expand
            ? "md:hidden fixed top-0 left-0 h-screen w-[200px] z-[100] bg-darkgray py-5"
            : "hidden"
        } overflow-y-auto flex w-[200px] h-full justify-between flex-col text-white`}
        expand={expand}
        setExpand={setExpand}
      />
      <div
        className={`${
          expand
            ? "absolute top-0 left-0 z-40 h-screen w-full md:hidden bg-black opacity-25 transition-all duration-300"
            : "hidden"
        }`}
        onClick={() => setExpand(!expand)}
      />
    </aside>
  );
};

function Sidebar({ profileItems, handleLogout, className, expand, setExpand }) {
  return (
    <div className={`${className}`}>
      <div>
        <div
          className={`flex ${expand ? "justify-end pr-6" : "justify-center"}`}
        >
          <h1
            className={`${
              expand ? "md:flex hidden" : "md:flex hidden"
            }  items-center justify-center font-bold text-lg`}
          >
            Admin Pannel
          </h1>
          <div
            className="text-white md:hidden flex justify-center"
            onClick={() => setExpand(!expand)}
          >
            <ChevronLast
              className={`${expand ? "hidden" : "block md:hidden"}`}
            />
            <ChevronFirst
              className={`${expand ? "block md:hidden" : "hidden"}`}
            />
          </div>
        </div>
        <div className=" mt-10 w-full flex-1">
          {profileItems.map(({ name, icon, url }, index) => (
            <NavLink
              to={url}
              end
              className={({ isActive }) =>
                `${isActive ? "text-orange border-r-2 border-orange" : ""}  ${
                  expand ? "justify-start px-7" : "justify-center"
                } w-full flex py-3 gap-3 md:px-7 md:justify-start`
              }
              key={index}
              onClick={() => setExpand(false)}
            >
              {icon}
              <p
                className={`${expand ? "block" : "hidden md:block"} text-base`}
              >
                {name}
              </p>
            </NavLink>
          ))}
        </div>
      </div>
      <div
        className="flex gap-3 items-center justify-center text-light-red cursor-pointer"
        onClick={handleLogout}
      >
        <LogOut />
        <p className="md:flex hidden">Logout</p>
      </div>
    </div>
  );
}

export default AdminSidebar;
