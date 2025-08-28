import { Send } from "lucide-react";
import React from "react";
// import Lottie from "react-lottie";
// import animationData from "../typingAnimation/typingAnim.json";

const ChatForm = ({
  className,
  selectedChat,
  msg,
  handleMsgChange,
  sendMessage,
  isTyping,
}) => {
  // const defaultOptions = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: animationData,
  //   rendererSettings: {
  //     preserveAspectRatio: "xMidYMid slice",
  //   },
  // };

  return (
    <div
      className={`${
        !selectedChat ? "hidden" : "absolute bottom-4 w-full"
      } ${className}`}
    >
      <form
        className="flex justify-between items-center sm:w-full w-full"
        onSubmit={sendMessage}
      >
        {isTyping ? (
          // <Lottie
          //   options={defaultOptions}
          //   // height={50}
          //   width={70}
          //   style={{ marginBottom: 15, marginLeft: 0 }}
          // />
          <div>typing...</div>
        ) : (
          <></>
        )}
        <input
          type="text"
          value={msg}
          onChange={handleMsgChange}
          placeholder="Enter message"
          className=" w-full bg-gray-600 text-lg py-1 px-3 rounded-md mx-3"
        />
        <button className="bg-orange p-2 rounded-md" type="submit">
          <Send width={20} height={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatForm;
