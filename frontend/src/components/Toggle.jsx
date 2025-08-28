import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../../context/userContext";
import axios from "axios";
import toast from "react-hot-toast";

const Toggle = () => {
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    if (user?.roles?.[0]?.name === "seller") {
      setToggle(true);
    } else {
      setToggle(false);
    }
  }, [user]);

  const [toggle, setToggle] = useState(false);

  const handleToggling = async () => {
    try {
      const { data } = await axios.patch("/toggle-selling");
      const { user } = data;

      if (data.error) {
        toast.error(data.error);
      } else if (data.success) {
        toast.success(data.success);
        setUser(user);
      }
    } catch (error) {
      toast.error(`Error while switching`);
      console.error(error);
    }
  };

  return (
    <div
      onClick={() => {
        setToggle(!toggle);
        handleToggling();
      }}
      className={`${
        toggle ? "bg-orange" : "bg-white"
      } cursor-pointer flex rounded-full w-9 h-[1.3rem] p-[0.1rem] transition-all duration-300`}
    >
      <div
        className={`${
          toggle ? "translate-x-full bg-white" : "translate-x-0 bg-orange"
        } rounded-full h-full w-1/2 transition-all duration-300 `}
      />
    </div>
  );
};

export default Toggle;
