import axios from "axios";
import { createContext, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

export const UserContext = createContext({});

const ENDPOINT = "http://localhost:8000";

export function UserContextProvider({ children }) {
  const socket = useRef(null);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("/profile");
        if (data) {
          setUser(data);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    // Fetch user only when data changes
    if (!user) {
      fetchUser();
    }
  }, [user]);

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const { data } = await axios.get("/get-notification");
        setNotifications(data);
      } catch (error) {
        console.error("Error getting notifications", error);
      }
    };

    if (!socket.current) {
      socket.current = io(ENDPOINT);
    }

    if (user) {
      socket.current.emit("setup", user);
      socket.current.on("connected");
    }

    getNotifications();

    if (socket.current) {
      socket.current.on("message recieved", (newMessageRecieved) => {
        if (!selectedChat || selectedChat._id !== newMessageRecieved.chat._id) {
          const found = notifications.some(
            (notif) => notif.message._id === newMessageRecieved._id
          );
          if (!found) {
            getNotifications();
          }
        }
      });
    }
    return () => {
      if (socket.current) {
        socket.current.disconnect();
        socket.current = null;
      }
    };
  }, [user]);

  useEffect(() => {
    const leaveAllChats = async () => {
      try {
        const { data } = await axios.put("/leave-all-chats");
      } catch (error) {
        console.error(error);
      }
    };
    leaveAllChats();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = async () => {
      try {
        await axios.put("/leave-all-chats");
      } catch (error) {
        console.error(error);
      }
    };

    if (user) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [user]);

  console.log(user?.roles);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
