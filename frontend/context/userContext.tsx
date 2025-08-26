/* eslint-disable react-refresh/only-export-components */
import axios from "axios";
import {
  createContext,
  useState,
  useEffect,
  useRef,
  type Dispatch,
  type SetStateAction,
  type ReactNode,
} from "react";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:8000";

export interface Chat {
  _id: string;
  name?: string;
  users?: User[];
}

export interface Notification {
  message: { _id: string; text?: string };
  chatId?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  roles?: string[];
}

interface Message {
  _id: string;
  chat: Chat;
  text?: string;
  sender?: User;
}

interface UserContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  selectedChat: Chat | undefined;
  setSelectedChat: Dispatch<SetStateAction<Chat | undefined>>;
  chats: Chat[];
  setChats: Dispatch<SetStateAction<Chat[]>>;
  notifications: Notification[];
  setNotifications: Dispatch<SetStateAction<Notification[]>>;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

interface ProviderProps {
  children: ReactNode;
}

type SocketInstance = ReturnType<typeof io>;

export function UserContextProvider({ children }: ProviderProps) {
  const socket = useRef<SocketInstance | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const [selectedChat, setSelectedChat] = useState<Chat | undefined>();
  const [chats, setChats] = useState<Chat[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get<User>("/profile");
        if (data) setUser(data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    if (!user) fetchUser();
  }, [user]);

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const { data } = await axios.get<Notification[]>("/get-notification");
        setNotifications(data);
      } catch (error) {
        console.error("Error getting notifications", error);
      }
    };
    if (!socket.current) {
      socket.current = io(ENDPOINT);
    }

    if (user && socket.current) {
      socket.current.emit("setup", user);
      socket.current.on("connected", () => {
        console.log("Socket connected");
      });
    }

    getNotifications();

    const handleMessageReceived = (newMessageRecieved: Message) => {
      if (!selectedChat || selectedChat._id !== newMessageRecieved.chat._id) {
        const found = notifications.some(
          (notif) => notif.message._id === newMessageRecieved._id
        );
        if (!found) {
          getNotifications();
        }
      }
    };

    if (socket.current) {
      socket.current.off?.("message recieved", handleMessageReceived);
      socket.current.on("message recieved", handleMessageReceived);
    }

    return () => {
      if (socket.current) {
        socket.current.off?.("message recieved", handleMessageReceived);
      }
    };
  }, [user, selectedChat, notifications]);

  // Leave all chats on mount
  useEffect(() => {
    const leaveAllChats = async () => {
      try {
        await axios.put("/leave-all-chats");
      } catch (error) {
        console.error(error);
      }
    };
    leaveAllChats();
  }, []);

  // Leave all chats on window unload
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
