/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";


interface ProfileContextType {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  requestSellerSession: boolean;
  setRequestSellerSession: Dispatch<SetStateAction<boolean>>;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(
  undefined
);

interface ProviderProps {
  children: ReactNode;
}

export function ProfileContextProvider({ children }: ProviderProps) {
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
