import React, { useContext, useEffect, useRef } from "react";
import ScrollableFeed from "react-scrollable-feed";
import { UserContext } from "../../../../context/userContext";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
} from "../ChatLogic/chatLogic";

const ScrollableMessages = ({ messages }) => {
  const { user } = useContext(UserContext);
  const { selectedChat } = useContext(UserContext);

  const messageContainerRef = useRef(null);

  const scrollToBottom = () => {
    messageContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const filterOtherUser = (chat) => {
    const sender = chat?.users?.filter((item) => item._id === user?._id);
    return sender;
  };

  if (selectedChat)
    return (
      <div className="flex flex-col gap-1  w-full">
        {messages &&
          messages.length > 0 &&
          messages.map((m, i) => (
            <div
              key={i}
              className={`${
                filterOtherUser(selectedChat)[0]?._id === m.sender._id
                  ? "flex justify-end"
                  : "flex"
              } `}
            >
              {(isSameSender(messages, m, i, user?._id) ||
                isLastMessage(messages, i, user?._id)) && (
                <div className="flex items-center gap-2">
                  <img
                    src={m?.sender?.avatar}
                    alt={"profile"}
                    className="w-8 h-8 object-contain rounded-full"
                  />
                </div>
              )}
              <p
                className={`${
                  m.sender?._id === user?._id
                    ? "bg-gray-600 px-2 py-1 rounded-md"
                    : "bg-orange px-2 py-1 rounded-md bg-opacity-30"
                } max-w-[75%] `}
                style={{
                  marginLeft: isSameSenderMargin(messages, m, i, user?._id),
                  wordWrap: "break-word", // Ensure words break inside the element
                  overflowWrap: "break-word", // Break words to prevent overflow
                  whiteSpace: "pre-wrap", // Handle whitespace correctly and wrap long words
                }}
              >
                {m?.content}
              </p>
            </div>
          ))}
        <div ref={messageContainerRef} />
      </div>
    );
};

export default ScrollableMessages;
