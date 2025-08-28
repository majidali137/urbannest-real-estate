import React, { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/userContext";
import useFetch from "../../useFetch";
import { AiFillDelete } from "react-icons/ai";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../Loader";
import { useNavigate } from "react-router-dom";

const ManageUsers = () => {
  // const { data, loading, error } = useFetch(`/get-all-users`);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [allUsers, setAllUsers] = useState();
  const [dialog, setDialog] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [deleteUserFlag, setDeleteUserFlag] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async (searchTerm) => {
    setLoading(true);
    try {
      // const searchQuery = urlParams.toString();
      const { data } = await axios.get(`/get-all-users`);
      const result = data.filter((user) => {
        if (!searchTerm) {
          return user;
        }
        return (
          user &&
          user.username &&
          user.username.toLowerCase().includes(searchTerm)
        );
      });
      setAllUsers(result);
    } catch (error) {
      console.log(error);
      toast.error("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(searchTerm);
  }, [deleteUserFlag]);

  function changeHandler(e) {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);

    fetchUsers(newSearchTerm);
  }

  async function deleteUser(id) {
    console.log(id);
    try {
      const { data } = await axios.delete(`/delete-user/${id}`);
      if (data.error) {
        toast.error(data.error);
      }
      setDeleteUserFlag(!deleteUserFlag);
      toast.success(data.success);
    } catch (error) {
      toast.error("Error deleting user");
    }
  }

  return (
    <div className="px-8 py-4 w-full relative">
      <div className="bg-darkgray sticky top-11 pb-4">
        <h1 className="text-white font-bold text-2xl">Users</h1>
        <div className="flex justify-end">
          <SearchUserInput
            searchTerm={searchTerm}
            changeHandler={changeHandler}
          />
        </div>
        <div className="grid grid-cols-5 text-white bg-gray py-3 mt-4 px-8">
          <p className="text-white font-bold">Profile</p>
          <p className="text-white font-bold col-span-3">User</p>
        </div>
      </div>
      {loading && (
        <div className="flex items-center justify-center w-full gap-2 mt-4">
          <Loader width={"w-[30px]"} />
          <p className="text-white">Fetching Users</p>
        </div>
      )}
      <UsersList
        data={allUsers}
        deleteUser={deleteUser}
        dialog={dialog}
        setDialog={setDialog}
        setDeleteId={setDeleteId}
        deleteId={deleteId}
        loading={loading}
        searchTerm={searchTerm}
      />
    </div>
  );
};

const UsersList = ({
  data,
  deleteUser,
  dialog,
  setDialog,
  setDeleteId,
  deleteId,
  loading,
  searchTerm,
}) => {
  console.log(data?.[0]);
  return (
    <div className="flex flex-col mt-7 max-h-[444.4px] overflow-y-scroll">
      {!loading &&
        data &&
        data.length !== 0 &&
        data
          .filter((user) => {
            return searchTerm.toLowerCase() === ""
              ? user
              : user.username.toLowerCase().includes(searchTerm);
          })
          .map((user) => (
            <div
              className="grid grid-cols-5 text-white border-b border-gray py-4 px-8"
              key={user._id}
            >
              <div>
                <img
                  src={user?.avatar}
                  alt=""
                  className="rounded-full w-12 h-12 object-contain"
                />
              </div>
              <p className="flex flex-col justify-start h-full col-span-3">
                <span>{user?.username}</span>
                <span className="text-neutral-600">{user?.email}</span>
              </p>
              <button
                className="flex items-center gap-2"
                onClick={() => {
                  setDialog(true);
                  setDeleteId(user._id);
                }}
              >
                <AiFillDelete className="text-orange text-lg" />
                <span className="hidden lg:block">Delete</span>
              </button>
            </div>
          ))}
      <div
        className={`${
          dialog ? "" : "hidden"
        } absolute left-0 top-0 w-full h-[100vh] bg-black opacity-20`}
        onClick={() => {
          setDialog(!dialog);
        }}
      />
      <div
        className={`${
          dialog ? "" : "hidden"
        } absolute left-0 top-0 w-full h-[100vh] flex justify-center items-center`}
      >
        <div
          className={`bg-gray p-4 flex flex-col justify-center items-center text-white gap-4 px-8 py-6 rounded-md`}
        >
          <p>Are you sure you want to delete the user</p>
          <div className=" w-full flex justify-between gap-3">
            <button
              className="text-white bg-white bg-opacity-20 w-1/2 rounded-md py-2"
              onClick={() => {
                setDialog(false);
              }}
            >
              Cancel
            </button>
            <button
              className="bg-light-red text-white w-1/2 rounded-md"
              onClick={() => {
                setDialog(false);
                deleteUser(deleteId);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SearchUserInput = ({ searchTerm, changeHandler }) => {
  return (
    <div class="flex items-center justify-center">
      <div class="relative">
        <input
          id="user"
          name="searchTerm"
          type="text"
          value={searchTerm}
          onChange={changeHandler}
          class="w-64 border-b border-[#818181] py-1 focus:border-b-2 focus:border-orange transition-colors focus:outline-none peer bg-inherit bg-transparent text-white"
        />
        <label
          for="user"
          class={`absolute left-0 top-1 cursor-text ${
            searchTerm ? "text-xs -top-4" : ""
          } transition-all peer-focus:text-xs peer-focus:-top-4 peer-focus:text-orange text-[#818181]`}
        >
          Search Users
        </label>
      </div>
    </div>
  );
};

export default ManageUsers;
