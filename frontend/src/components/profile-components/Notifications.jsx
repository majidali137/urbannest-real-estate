import { useContext } from "react";
import AllChats from "../Chat-components/AllChats";
import SingleChat from "../Chat-components/SingleChat";
import { UserContext } from "../../../context/userContext";

const Notifications = () => {
  const { user } = useContext(UserContext);

  const filterLoggedInUser = (chat) => {
    const sender = chat?.users?.filter((item) => item._id !== user?._id);
    return sender;
  };

  return (
    <div className="w-full flex">
      <AllChats filterLoggedInUser={filterLoggedInUser} />
      <SingleChat filterLoggedInUser={filterLoggedInUser} />
    </div>
  );
};

export default Notifications;
