import React, { useContext, useEffect, useState } from "react";
import monster from "../../assets/Images/monster.png";
import { UserContext } from "../../../context/userContext";
import axios from "axios";
import Loader from "../Loader";

const AllChats = ({ filterLoggedInUser }) => {
  // const [sender, setSender] = useState(null);

  const {
    loading,
    setLoading,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
  } = useContext(UserContext);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/fetch-chats");
        console.log(data);
        if (data.error) {
          setLoading(false);
          toast.error(data.error);
        }
        setLoading(false);
        setChats(data);
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    };
    fetchChats();
  }, []);

  return (
    <div
      className={`text-white lg:w-2/5 xl:w-1/4 md:w-2/4 w-full py-5 sm:px-7 px-3 ${
        selectedChat ? "hidden md:block" : ""
      }`}
    >
      <h1 className="font-bold text-2xl">Inbox</h1>
      <div className="flex flex-col mt-5 ml-3">
        {loading && (
          <div className="flex justify-center items-center gap-5 mt-5">
            <Loader width={"w-[30px]"} />
            Loading chats
          </div>
        )}
        {chats && chats.length > 0 && !loading ? (
          chats.map((chat, index) => (
            <ChatCard
              className={`${selectedChat === chat ? "bg-gray-600" : ""}`}
              onClick={() => setSelectedChat(chat)}
              image={filterLoggedInUser(chat)[0]?.avatar}
              username={filterLoggedInUser(chat)[0]?.username}
              chat={chat}
              key={index}
            />
          ))
        ) : !loading && chats.length === 0 ? (
          <p>No chats</p>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default AllChats;

const ChatCard = ({ image, username, onClick, className, chat }) => {
  const { notifications } = useContext(UserContext);
  const [unread, setUnread] = useState(null);

  useEffect(() => {
    setUnread(notifications?.filter((notif) => notif?.chat?._id === chat._id));
  }, [notifications]);

  return (
    <div
      className={`${
        unread?.length > 0 ? "bg-orange bg-opacity-10 " : ""
      } flex items-center justify-between border-b-2 border-b-gray py-3 px-3 rounded cursor-pointer ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-5">
        <img src={image} alt="" className="rounded-full w-10 h-10" />
        <h3 className="font-semibold text-lg">{username}</h3>
      </div>
      {unread?.length > 0 && (
        <div className="w-5 h-5 flex justify-center items-center text-xs font-semibold bg-orange bg-opacity-70 rounded-full">
          {unread?.length}
        </div>
      )}
    </div>
  );
};
