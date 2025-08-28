import { ArrowLeft } from "lucide-react";
import React from "react";

const ChatHeader = ({
  filterLoggedInUser,
  className,
  selectedChat,
  setSelectedChat,
  leaveChat,
}) => {
  return (
    <div
      className={`${
        !selectedChat ? "hidden" : "flex"
      } ${className} gap-3 items-center w-full px-4 py-2 border-b border-gray-600`}
    >
      <ArrowLeft
        onClick={() => {
          leaveChat();
          setSelectedChat(null);
        }}
        className="cursor-pointer"
        width={22}
      />
      <p className={`font-semibold text-lg`}>
        {selectedChat ? (
          <div className="flex items-center gap-2">
            <img
              src={filterLoggedInUser(selectedChat)[0]?.avatar}
              className="w-8 h-8 rounded-full "
              alt=""
            />
            <p>{filterLoggedInUser(selectedChat)[0]?.username}</p>
          </div>
        ) : (
          "Single Chat"
        )}
      </p>
    </div>
  );
};

export default ChatHeader;
