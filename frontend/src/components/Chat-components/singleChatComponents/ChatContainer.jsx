import React from "react";
import Loader from "../../Loader";
import ScrollableMessages from "./ScrollableMessages";

const ChatContainer = ({ className, loading, selectedChat, messages }) => {
  return (
    <div
      className={`${
        !selectedChat
          ? "hidden"
          : selectedChat && loading
          ? "flex flex-col items-center justify-end gap-4 h-full"
          : ""
      } ${className}`}
    >
      {loading ? (
        <Loader width={"w-[40px]"} />
      ) : (
        <div style={{ scrollbarWidth: "none" }} className="flex p-3">
          {" "}
          <ScrollableMessages messages={messages} />
        </div>
      )}
      <p className={`italic ${!loading ? "hidden" : ""}`}>Loading Chat</p>
    </div>
  );
};

export default ChatContainer;
