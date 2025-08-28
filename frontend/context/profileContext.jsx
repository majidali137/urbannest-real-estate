import { createContext, useState } from "react";

export const ProfileContext = createContext({});

export function ProfileContextProvider({ children }) {
  const [show, setShow] = useState(false);

  const [requestSellerSession, setRequestSellerSession] = useState(false);

  return (
    <ProfileContext.Provider
      value={{ show, setShow, requestSellerSession, setRequestSellerSession }}
    >
      {children}
    </ProfileContext.Provider>
  );
}
